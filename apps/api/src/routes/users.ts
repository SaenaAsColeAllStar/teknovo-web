import { Hono } from "hono";
import { createClerkClient } from "@clerk/backend";
import type { User } from "@clerk/backend";
import {
  cmsUserCreateSchema,
  cmsUserPatchSchema,
  CMS_INVITE_EXPIRY_DEFAULT,
  deriveClerkUsername,
  parseCmsRole,
  cmsRoleCanAssignRole,
  withClerkUsernameSuffix,
  type CmsInvitationListItem,
  type CmsInvitationStatus,
  type CmsRole,
  type CmsUserListItem,
} from "@teknovo/shared";
import type { Invitation } from "@clerk/backend";
import { requireCmsUserManager, CmsAuthError } from "../auth/cms-auth";
import {
  errJson,
  handleApiError,
  okJson,
  okListJson,
  type AppEnv,
} from "../lib/http";
import type { ContentfulStatusCode } from "hono/utils/http-status";

function requireClerk(env: Env) {
  if (!env.CLERK_SECRET_KEY || env.CLERK_SECRET_KEY.startsWith("GANTI_")) {
    return null;
  }
  return createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
}

type ClerkClient = NonNullable<ReturnType<typeof requireClerk>>;

type ClerkApiErrorItem = {
  code?: string;
  longMessage?: string;
  message?: string;
  meta?: { paramName?: string; name?: string; names?: string | string[] };
};

function clerkErrors(err: unknown): ClerkApiErrorItem[] {
  if (
    err &&
    typeof err === "object" &&
    "errors" in err &&
    Array.isArray((err as { errors: unknown }).errors)
  ) {
    return (err as { errors: ClerkApiErrorItem[] }).errors;
  }
  return [];
}

function clerkErrorMessage(err: unknown): string {
  const first = clerkErrors(err)[0];
  if (first) return first.longMessage || first.message || "Permintaan Clerk gagal.";
  if (err instanceof Error) return err.message;
  return "Permintaan Clerk gagal.";
}

function clerkErrorBlob(err: unknown): string {
  const parts = clerkErrors(err).flatMap((e) => [
    e.code ?? "",
    e.longMessage ?? "",
    e.message ?? "",
    e.meta?.paramName ?? "",
    e.meta?.name ?? "",
    Array.isArray(e.meta?.names) ? e.meta.names.join(" ") : (e.meta?.names ?? ""),
  ]);
  return `${parts.join(" ")} ${clerkErrorMessage(err)}`.toLowerCase();
}

/** Map Clerk Backend errors to actionable Indonesian admin messages. */
function mapClerkCreateUserError(err: unknown): {
  code: string;
  message: string;
  status: ContentfulStatusCode;
} {
  const blob = clerkErrorBlob(err);
  const items = clerkErrors(err);
  const parts: string[] = [];
  let code = "CLERK";
  let status: ContentfulStatusCode = 502;

  const passwordBreached =
    items.some((e) => e.code === "form_password_pwned") ||
    blob.includes("data breach") ||
    blob.includes("pwned") ||
    blob.includes("compromised");

  if (passwordBreached) {
    code = "PASSWORD_BREACHED";
    status = 400;
    parts.push(
      "Password login akun baru pernah ditemukan di kebocoran data online (Have I Been Pwned). Ini bukan password database/D1 — pakai password unik yang lebih kuat, atau kosongkan field agar Clerk mengirim undangan email.",
    );
  }

  const usernameIssue =
    items.some(
      (e) =>
        e.code === "form_data_missing" ||
        e.code?.includes("username") ||
        e.meta?.paramName === "username" ||
        e.meta?.name === "username" ||
        (typeof e.longMessage === "string" &&
          e.longMessage.toLowerCase().includes("username")),
    ) || /\["username"\]/.test(blob);

  if (usernameIssue && !passwordBreached) {
    // Prefer password message when both fire; username is auto-derived now.
    code = parts.length ? code : "USERNAME_INVALID";
    status = 400;
    parts.push(
      "Username tidak memenuhi aturan Clerk (instance mewajibkan username: 4–64 karakter, huruf/angka/underscore). CMS menurunkan username dari email otomatis.",
    );
  } else if (usernameIssue && passwordBreached) {
    parts.push(
      "Selain itu, pastikan Username diaktifkan di Clerk Dashboard (User & authentication).",
    );
  }

  if (
    !passwordBreached &&
    (items.some((e) => e.code === "form_password_validation_failed") ||
      (blob.includes("password") && blob.includes("length")))
  ) {
    code = "PASSWORD_WEAK";
    status = 400;
    parts.push(
      "Password tidak memenuhi aturan Clerk (minimal 8 karakter, bukan password umum).",
    );
  }

  if (parts.length === 0 && isClerkConflict(err)) {
    return {
      code: "CONFLICT",
      message: "Email atau username sudah terdaftar di Clerk.",
      status: 409,
    };
  }

  if (parts.length > 0) {
    return { code, message: parts.join(" "), status };
  }

  return {
    code: "CLERK",
    message: clerkErrorMessage(err),
    status: 502,
  };
}

function isClerkConflict(err: unknown): boolean {
  const blob = clerkErrorBlob(err);
  return (
    blob.includes("already exists") ||
    blob.includes("taken") ||
    blob.includes("duplicate") ||
    blob.includes("identifier_exists") ||
    blob.includes("form_identifier_exists")
  );
}

function isUsernameConflict(err: unknown): boolean {
  const blob = clerkErrorBlob(err);
  return (
    blob.includes("username") &&
    (blob.includes("taken") ||
      blob.includes("exists") ||
      blob.includes("duplicate") ||
      blob.includes("identifier"))
  );
}

/** Username disabled on the Clerk instance — retry create without it. */
function isUsernameFeatureDisabled(err: unknown): boolean {
  const blob = clerkErrorBlob(err);
  return (
    (blob.includes("disabled") && blob.includes("username")) ||
    blob.includes("form_param_unknown") ||
    blob.includes("form_unknown_parameter")
  );
}

function splitNama(nama: string | undefined | null): {
  firstName?: string;
  lastName?: string;
} {
  const trimmed = (nama ?? "").trim();
  if (!trimmed) return {};
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function toListItem(user: User): CmsUserListItem {
  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    name: user.fullName,
    role: parseCmsRole(user.publicMetadata),
    createdAt: new Date(user.createdAt).toISOString(),
  };
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function readInviteExpiresInDays(meta: unknown): number | null {
  if (!meta || typeof meta !== "object") return null;
  const raw = (meta as { expiresInDays?: unknown }).expiresInDays;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 1 && raw <= 30) {
    return Math.floor(raw);
  }
  return null;
}

function invitationExpiresAt(
  createdAtMs: number,
  expiresInDays: number | null,
): string | null {
  if (expiresInDays == null) return null;
  return new Date(createdAtMs + expiresInDays * MS_PER_DAY).toISOString();
}

function toInvitationListItem(invitation: Invitation): CmsInvitationListItem {
  const role = parseCmsRole(invitation.publicMetadata);
  const expiresInDays = readInviteExpiresInDays(invitation.publicMetadata);
  const status = (invitation.status ?? "pending") as CmsInvitationStatus;
  return {
    id: invitation.id,
    email: invitation.emailAddress,
    role,
    status,
    createdAt: new Date(invitation.createdAt).toISOString(),
    expiresAt: invitationExpiresAt(invitation.createdAt, expiresInDays),
    expiresInDays,
    url: invitation.url ?? null,
    revoked: invitation.revoked === true || status === "revoked",
  };
}

/** Editors only see siswa invitations; Super Admin sees all. */
function filterInvitationsForActor(
  actorRole: CmsRole,
  items: CmsInvitationListItem[],
): CmsInvitationListItem[] {
  if (actorRole === "editor") {
    return items.filter((item) => item.role === "siswa");
  }
  return items;
}

function assertCanAssign(actorRole: CmsRole, targetRole: CmsRole): void {
  if (!cmsRoleCanAssignRole(actorRole, targetRole)) {
    if (actorRole === "editor") {
      throw new CmsAuthError(
        "Admin hanya dapat mengundang/membuat akun dengan peran Siswa.",
        403,
      );
    }
    if (targetRole === "admin") {
      throw new CmsAuthError(
        "Hanya Super Admin yang dapat menetapkan peran Super Admin.",
        403,
      );
    }
    throw new CmsAuthError("Anda tidak dapat menetapkan peran tersebut.", 403);
  }
}

/** Editors may only mutate siswa accounts; never themselves or staff. */
function assertEditorMayTouchTarget(
  actorRole: CmsRole,
  actorUserId: string,
  targetUserId: string,
  targetRole: CmsRole,
): void {
  if (actorRole !== "editor") return;
  if (targetUserId === actorUserId) {
    throw new CmsAuthError(
      "Tidak dapat mengubah peran atau akun Anda sendiri.",
      403,
    );
  }
  if (targetRole !== "siswa") {
    throw new CmsAuthError(
      "Admin hanya dapat mengelola akun Siswa.",
      403,
    );
  }
}

/** Count Super Admins (`role=admin`) across Clerk users (paginated). */
async function countSuperAdmins(clerk: ClerkClient): Promise<number> {
  let offset = 0;
  const limit = 100;
  let total = 0;
  for (;;) {
    const page = await clerk.users.getUserList({
      limit,
      offset,
      orderBy: "-created_at",
    });
    for (const user of page.data) {
      if (parseCmsRole(user.publicMetadata) === "admin") total += 1;
    }
    offset += page.data.length;
    if (offset >= page.totalCount || page.data.length === 0) break;
  }
  return total;
}

/**
 * Block demote/delete that would leave zero Super Admins.
 * Call when target currently has role `admin` and would lose that role.
 */
async function assertNotLastSuperAdmin(
  clerk: ClerkClient,
  existingRole: CmsRole,
): Promise<void> {
  if (existingRole !== "admin") return;
  const admins = await countSuperAdmins(clerk);
  if (admins <= 1) {
    throw new CmsAuthError(
      "Tidak dapat menurunkan atau menghapus Super Admin terakhir. Promosikan Super Admin lain terlebih dahulu.",
      403,
    );
  }
}

export const usersRoutes = new Hono<AppEnv>();

usersRoutes.get("/", async (c) => {
  try {
    await requireCmsUserManager(c.req.raw, c.env);
    const clerk = requireClerk(c.env);
    if (!clerk) {
      return errJson(c, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
    }
    const limit = Math.min(
      Math.max(Number(c.req.query("limit") ?? "50") || 50, 1),
      100,
    );
    const offset = Math.max(Number(c.req.query("offset") ?? "0") || 0, 0);
    const page = Math.floor(offset / limit) + 1;

    const result = await clerk.users.getUserList({
      limit,
      offset,
      orderBy: "-created_at",
    });

    const items = result.data.map(toListItem);
    return okListJson(c, items, {
      page,
      limit,
      total: result.totalCount,
    });
  } catch (err) {
    if (err instanceof CmsAuthError) return handleApiError(c, err);
    return errJson(c, "CLERK", clerkErrorMessage(err), 502);
  }
});

usersRoutes.post("/", async (c) => {
  try {
    const session = await requireCmsUserManager(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = cmsUserCreateSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const { email, nama, role, password } = parsed.data;
    const expiresInDays =
      parsed.data.expiresInDays ?? CMS_INVITE_EXPIRY_DEFAULT;
    assertCanAssign(session.role, role);

    const clerk = requireClerk(c.env);
    if (!clerk) {
      return errJson(c, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
    }
    const names = splitNama(nama);
    const publicMetadata: { role: CmsRole; expiresInDays?: number } = { role };

    if (password && password.length >= 8) {
      const baseUsername = deriveClerkUsername(email);
      let lastErr: unknown;

      for (let attempt = 0; attempt < 5; attempt++) {
        const username =
          attempt === 0
            ? baseUsername
            : withClerkUsernameSuffix(baseUsername, attempt);
        try {
          const user = await clerk.users.createUser({
            emailAddress: [email],
            username,
            password,
            ...names,
            publicMetadata,
            skipPasswordChecks: false,
          });
          return okJson(c, { ...toListItem(user), invited: false as const }, 201);
        } catch (err) {
          lastErr = err;

          // Instance has Username disabled — create without it.
          if (attempt === 0 && isUsernameFeatureDisabled(err)) {
            try {
              const user = await clerk.users.createUser({
                emailAddress: [email],
                password,
                ...names,
                publicMetadata,
                skipPasswordChecks: false,
              });
              return okJson(
                c,
                { ...toListItem(user), invited: false as const },
                201,
              );
            } catch (retryErr) {
              lastErr = retryErr;
              break;
            }
          }

          // Username taken — try a suffixed handle.
          if (isUsernameConflict(err) && attempt < 4) continue;

          break;
        }
      }

      const mapped = mapClerkCreateUserError(lastErr);
      return errJson(c, mapped.code, mapped.message, mapped.status);
    }

    // No password → Clerk invitation (user sets password on accept).
    try {
      publicMetadata.expiresInDays = expiresInDays;
      const cmsOrigin = (c.env.CMS_ORIGIN || "https://cms.smkteknovo.sch.id").replace(
        /\/$/,
        "",
      );
      const invitation = await clerk.invitations.createInvitation({
        emailAddress: email,
        publicMetadata,
        notify: true,
        ignoreExisting: false,
        expiresInDays,
        redirectUrl: `${cmsOrigin}/sign-in`,
      });
      const item = toInvitationListItem(invitation);
      return okJson(
        c,
        {
          id: invitation.id,
          email: invitation.emailAddress,
          name: nama?.trim() || null,
          role,
          createdAt: item.createdAt,
          invited: true as const,
          status: item.status,
          expiresAt: item.expiresAt,
          expiresInDays: item.expiresInDays,
          url: item.url,
        },
        201,
      );
    } catch (err) {
      if (isClerkConflict(err)) {
        return errJson(
          c,
          "CONFLICT",
          "Email sudah terdaftar atau undangan masih aktif.",
          409,
        );
      }
      return errJson(c, "CLERK", clerkErrorMessage(err), 502);
    }
  } catch (err) {
    return handleApiError(c, err);
  }
});

usersRoutes.get("/invitations", async (c) => {
  try {
    const session = await requireCmsUserManager(c.req.raw, c.env);
    const clerk = requireClerk(c.env);
    if (!clerk) {
      return errJson(c, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
    }
    const limit = Math.min(
      Math.max(Number(c.req.query("limit") ?? "50") || 50, 1),
      100,
    );
    const offset = Math.max(Number(c.req.query("offset") ?? "0") || 0, 0);
    const page = Math.floor(offset / limit) + 1;
    const statusRaw = c.req.query("status");
    const status =
      statusRaw === "pending" ||
      statusRaw === "accepted" ||
      statusRaw === "revoked" ||
      statusRaw === "expired"
        ? statusRaw
        : undefined;

    // Editors need role filtering client-side; fetch a wider window then slice.
    const fetchLimit = session.role === "editor" ? 100 : limit;
    const fetchOffset = session.role === "editor" ? 0 : offset;

    const result = await clerk.invitations.getInvitationList({
      limit: fetchLimit,
      offset: fetchOffset,
      ...(status ? { status } : {}),
    });

    const filtered = filterInvitationsForActor(
      session.role,
      result.data.map(toInvitationListItem),
    );
    const items =
      session.role === "editor"
        ? filtered.slice(offset, offset + limit)
        : filtered;

    return okListJson(c, items, {
      page,
      limit,
      total:
        session.role === "editor" ? filtered.length : result.totalCount,
    });
  } catch (err) {
    if (err instanceof CmsAuthError) return handleApiError(c, err);
    return errJson(c, "CLERK", clerkErrorMessage(err), 502);
  }
});

usersRoutes.post("/invitations/:id/revoke", async (c) => {
  try {
    const session = await requireCmsUserManager(c.req.raw, c.env);
    const invitationId = c.req.param("id");
    const clerk = requireClerk(c.env);
    if (!clerk) {
      return errJson(c, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
    }

    try {
      const listed = await clerk.invitations.getInvitationList({
        query: invitationId,
        limit: 10,
      });
      const existing = listed.data.find((inv) => inv.id === invitationId);
      if (!existing) {
        return errJson(c, "NOT_FOUND", "Undangan tidak ditemukan.", 404);
      }

      const existingRole = parseCmsRole(existing.publicMetadata);
      if (session.role === "editor" && existingRole !== "siswa") {
        throw new CmsAuthError(
          "Admin hanya dapat membatalkan undangan Siswa.",
          403,
        );
      }
      if (existing.status === "revoked" || existing.revoked) {
        return errJson(c, "CONFLICT", "Undangan sudah dibatalkan.", 409);
      }
      if (existing.status === "accepted") {
        return errJson(
          c,
          "CONFLICT",
          "Undangan sudah diterima; tidak dapat dibatalkan.",
          409,
        );
      }

      const revoked = await clerk.invitations.revokeInvitation(invitationId);
      return okJson(c, toInvitationListItem(revoked));
    } catch (err) {
      if (err instanceof CmsAuthError) throw err;
      const msg = clerkErrorMessage(err).toLowerCase();
      if (msg.includes("not found") || msg.includes("couldn't find")) {
        return errJson(c, "NOT_FOUND", "Undangan tidak ditemukan.", 404);
      }
      return errJson(c, "CLERK", clerkErrorMessage(err), 502);
    }
  } catch (err) {
    return handleApiError(c, err);
  }
});

usersRoutes.patch("/:id", async (c) => {
  try {
    const session = await requireCmsUserManager(c.req.raw, c.env);
    const userId = c.req.param("id");
    const json = await c.req.json();
    const parsed = cmsUserPatchSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const clerk = requireClerk(c.env);
    if (!clerk) {
      return errJson(c, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
    }

    try {
      const existing = await clerk.users.getUser(userId);
      const existingRole = parseCmsRole(existing.publicMetadata);

      assertEditorMayTouchTarget(
        session.role,
        session.userId,
        userId,
        existingRole,
      );

      if (parsed.data.role !== undefined) {
        // Block self-promotion / self-demotion (any role) and enforce assignable matrix.
        if (userId === session.userId && parsed.data.role !== existingRole) {
          throw new CmsAuthError(
            "Tidak dapat mengubah peran akun Anda sendiri.",
            403,
          );
        }
        assertCanAssign(session.role, parsed.data.role);
        if (
          existingRole === "admin" &&
          parsed.data.role !== "admin"
        ) {
          await assertNotLastSuperAdmin(clerk, existingRole);
        }
      }

      if (parsed.data.nama !== undefined) {
        const names = splitNama(parsed.data.nama);
        await clerk.users.updateUser(userId, {
          firstName: names.firstName ?? "",
          lastName: names.lastName ?? "",
        });
      }
      if (parsed.data.role !== undefined) {
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: { role: parsed.data.role },
        });
      }
      const user = await clerk.users.getUser(userId);
      return okJson(c, toListItem(user));
    } catch (err) {
      if (err instanceof CmsAuthError) throw err;
      const msg = clerkErrorMessage(err).toLowerCase();
      if (msg.includes("not found") || msg.includes("couldn't find")) {
        return errJson(c, "NOT_FOUND", "Pengguna tidak ditemukan.", 404);
      }
      return errJson(c, "CLERK", clerkErrorMessage(err), 502);
    }
  } catch (err) {
    return handleApiError(c, err);
  }
});

usersRoutes.delete("/:id", async (c) => {
  try {
    const session = await requireCmsUserManager(c.req.raw, c.env);
    const userId = c.req.param("id");

    if (userId === session.userId) {
      return errJson(
        c,
        "FORBIDDEN",
        "Tidak dapat menghapus akun Anda sendiri.",
        403,
      );
    }

    const clerk = requireClerk(c.env);
    if (!clerk) {
      return errJson(c, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
    }
    try {
      const existing = await clerk.users.getUser(userId);
      const existingRole = parseCmsRole(existing.publicMetadata);

      assertEditorMayTouchTarget(
        session.role,
        session.userId,
        userId,
        existingRole,
      );

      if (existingRole === "admin") {
        await assertNotLastSuperAdmin(clerk, existingRole);
      }

      await clerk.users.deleteUser(userId);
      return okJson(c, { deleted: true });
    } catch (err) {
      if (err instanceof CmsAuthError) throw err;
      const msg = clerkErrorMessage(err).toLowerCase();
      if (msg.includes("not found") || msg.includes("couldn't find")) {
        return errJson(c, "NOT_FOUND", "Pengguna tidak ditemukan.", 404);
      }
      return errJson(c, "CLERK", clerkErrorMessage(err), 502);
    }
  } catch (err) {
    return handleApiError(c, err);
  }
});
