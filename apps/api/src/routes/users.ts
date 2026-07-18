import { Hono } from "hono";
import { createClerkClient } from "@clerk/backend";
import type { User } from "@clerk/backend";
import {
  cmsUserCreateSchema,
  cmsUserPatchSchema,
  parseCmsRole,
  type CmsUserListItem,
} from "@teknovo/shared";
import { requireCmsAdmin, CmsAuthError } from "../auth/cms-auth";
import {
  errJson,
  handleApiError,
  okJson,
  okListJson,
  type AppEnv,
} from "../lib/http";

function requireClerk(env: Env) {
  if (!env.CLERK_SECRET_KEY || env.CLERK_SECRET_KEY.startsWith("GANTI_")) {
    return null;
  }
  return createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
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

function clerkErrorMessage(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "errors" in err &&
    Array.isArray((err as { errors: unknown }).errors)
  ) {
    const first = (err as { errors: Array<{ longMessage?: string; message?: string }> })
      .errors[0];
    return first?.longMessage || first?.message || "Permintaan Clerk gagal.";
  }
  if (err instanceof Error) return err.message;
  return "Permintaan Clerk gagal.";
}

function isClerkConflict(err: unknown): boolean {
  const msg = clerkErrorMessage(err).toLowerCase();
  return (
    msg.includes("already exists") ||
    msg.includes("taken") ||
    msg.includes("duplicate") ||
    msg.includes("identifier")
  );
}

export const usersRoutes = new Hono<AppEnv>();

usersRoutes.get("/", async (c) => {
  try {
    await requireCmsAdmin(c.req.raw, c.env);
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
    await requireCmsAdmin(c.req.raw, c.env);
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
    const clerk = requireClerk(c.env);
    if (!clerk) {
      return errJson(c, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
    }
    const names = splitNama(nama);
    const publicMetadata = { role };

    if (password && password.length >= 8) {
      try {
        const user = await clerk.users.createUser({
          emailAddress: [email],
          password,
          ...names,
          publicMetadata,
          skipPasswordChecks: false,
        });
        return okJson(c, { ...toListItem(user), invited: false as const }, 201);
      } catch (err) {
        if (isClerkConflict(err)) {
          return errJson(
            c,
            "CONFLICT",
            "Email sudah terdaftar di Clerk.",
            409,
          );
        }
        return errJson(c, "CLERK", clerkErrorMessage(err), 502);
      }
    }

    // No password → Clerk invitation (user sets password on accept).
    try {
      const invitation = await clerk.invitations.createInvitation({
        emailAddress: email,
        publicMetadata,
        notify: true,
        ignoreExisting: false,
      });
      return okJson(
        c,
        {
          id: invitation.id,
          email: invitation.emailAddress,
          name: nama?.trim() || null,
          role,
          createdAt: new Date(invitation.createdAt).toISOString(),
          invited: true as const,
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

usersRoutes.patch("/:id", async (c) => {
  try {
    const session = await requireCmsAdmin(c.req.raw, c.env);
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
    void session;

    try {
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
    const session = await requireCmsAdmin(c.req.raw, c.env);
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
      await clerk.users.deleteUser(userId);
      return okJson(c, { deleted: true });
    } catch (err) {
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
