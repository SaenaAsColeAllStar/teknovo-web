import { Router } from "express";
import {
  cmsUserCreateSchema,
  cmsUserPatchSchema,
  CMS_INVITE_EXPIRY_DEFAULT,
  deriveClerkUsername,
  parseCmsRole,
  withClerkUsernameSuffix,
} from "@teknovo/shared";
import { requireCmsUserManager, CmsAuthError } from "../auth/cms-auth";
import {
  assertCanAssign,
  assertEditorMayTouchTarget,
  assertNotLastSuperAdmin,
  clerkErrorMessage,
  createCmsInvitation,
  filterInvitationsForActor,
  findInvitationById,
  isUsernameConflict,
  isUsernameFeatureDisabled,
  mapClerkCreateUserError,
  mapClerkInvitationError,
  readInviteExpiresInDays,
  requireClerk,
  splitNama,
  toInvitationListItem,
  toListItem,
} from "../routes/users";
import {
  asyncHandler,
  exErr,
  exHandleError,
  exOk,
  exOkList,
  getBindings,
  p,
  q,
  toWebRequest,
} from "../lib/express-http";

export const usersExpressRouter = Router();

usersExpressRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsUserManager(toWebRequest(req), env);
      const clerk = requireClerk(env);
      if (!clerk) {
        exErr(res, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
        return;
      }
      const limit = Math.min(
        Math.max(Number(q(req, "limit") ?? "50") || 50, 1),
        100,
      );
      const offset = Math.max(Number(q(req, "offset") ?? "0") || 0, 0);
      const page = Math.floor(offset / limit) + 1;

      const result = await clerk.users.getUserList({
        limit,
        offset,
        orderBy: "-created_at",
      });

      exOkList(res, result.data.map(toListItem), {
        page,
        limit,
        total: result.totalCount,
      });
    } catch (err) {
      if (err instanceof CmsAuthError) {
        exHandleError(res, err);
        return;
      }
      exErr(res, "CLERK", clerkErrorMessage(err), 502);
    }
  }),
);

usersExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsUserManager(toWebRequest(req), env);
      const parsed = cmsUserCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const { email, nama, role, password } = parsed.data;
      const expiresInDays =
        parsed.data.expiresInDays ?? CMS_INVITE_EXPIRY_DEFAULT;
      assertCanAssign(session.role, role);

      const clerk = requireClerk(env);
      if (!clerk) {
        exErr(res, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
        return;
      }
      const names = splitNama(nama);
      const publicMetadata: { role: typeof role; expiresInDays?: number } = {
        role,
      };

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
            exOk(res, { ...toListItem(user), invited: false as const }, 201);
            return;
          } catch (err) {
            lastErr = err;

            if (attempt === 0 && isUsernameFeatureDisabled(err)) {
              try {
                const user = await clerk.users.createUser({
                  emailAddress: [email],
                  password,
                  ...names,
                  publicMetadata,
                  skipPasswordChecks: false,
                });
                exOk(res, { ...toListItem(user), invited: false as const }, 201);
                return;
              } catch (retryErr) {
                lastErr = retryErr;
                break;
              }
            }

            if (isUsernameConflict(err) && attempt < 4) continue;
            break;
          }
        }

        const mapped = mapClerkCreateUserError(lastErr);
        exErr(res, mapped.code, mapped.message, mapped.status);
        return;
      }

      try {
        const created = await createCmsInvitation({
          clerk,
          env,
          email,
          role,
          expiresInDays,
          nama,
        });
        exOk(res, created, 201);
      } catch (err) {
        const mapped = mapClerkInvitationError(err);
        exErr(res, mapped.code, mapped.message, mapped.status);
      }
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

usersExpressRouter.get(
  "/invitations",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsUserManager(toWebRequest(req), env);
      const clerk = requireClerk(env);
      if (!clerk) {
        exErr(res, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
        return;
      }
      const limit = Math.min(
        Math.max(Number(q(req, "limit") ?? "50") || 50, 1),
        100,
      );
      const offset = Math.max(Number(q(req, "offset") ?? "0") || 0, 0);
      const page = Math.floor(offset / limit) + 1;
      const statusRaw = q(req, "status");
      const status =
        statusRaw === "pending" ||
        statusRaw === "accepted" ||
        statusRaw === "revoked" ||
        statusRaw === "expired"
          ? statusRaw
          : undefined;

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

      exOkList(res, items, {
        page,
        limit,
        total: session.role === "editor" ? filtered.length : result.totalCount,
      });
    } catch (err) {
      if (err instanceof CmsAuthError) {
        exHandleError(res, err);
        return;
      }
      exErr(res, "CLERK", clerkErrorMessage(err), 502);
    }
  }),
);

usersExpressRouter.post(
  "/invitations/:id/revoke",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsUserManager(toWebRequest(req), env);
      const invitationId = p(req, "id");
      const clerk = requireClerk(env);
      if (!clerk) {
        exErr(res, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
        return;
      }

      try {
        const existing = await findInvitationById(clerk, invitationId);
        if (!existing) {
          exErr(res, "NOT_FOUND", "Undangan tidak ditemukan.", 404);
          return;
        }

        const existingRole = parseCmsRole(existing.publicMetadata);
        if (session.role === "editor" && existingRole !== "siswa") {
          throw new CmsAuthError(
            "Admin hanya dapat membatalkan undangan Siswa.",
            403,
          );
        }
        if (existing.status === "revoked" || existing.revoked) {
          exErr(res, "CONFLICT", "Undangan sudah dibatalkan.", 409);
          return;
        }
        if (existing.status === "accepted") {
          exErr(
            res,
            "CONFLICT",
            "Undangan sudah diterima; tidak dapat dibatalkan.",
            409,
          );
          return;
        }

        const revoked = await clerk.invitations.revokeInvitation(invitationId);
        exOk(res, toInvitationListItem(revoked));
      } catch (err) {
        if (err instanceof CmsAuthError) throw err;
        const msg = clerkErrorMessage(err).toLowerCase();
        if (msg.includes("not found") || msg.includes("couldn't find")) {
          exErr(res, "NOT_FOUND", "Undangan tidak ditemukan.", 404);
          return;
        }
        exErr(res, "CLERK", clerkErrorMessage(err), 502);
      }
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

usersExpressRouter.post(
  "/invitations/:id/resend",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsUserManager(toWebRequest(req), env);
      const invitationId = p(req, "id");
      const clerk = requireClerk(env);
      if (!clerk) {
        exErr(res, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
        return;
      }

      try {
        const existing = await findInvitationById(clerk, invitationId);
        if (!existing) {
          exErr(res, "NOT_FOUND", "Undangan tidak ditemukan.", 404);
          return;
        }

        const existingRole = parseCmsRole(existing.publicMetadata);
        if (session.role === "editor" && existingRole !== "siswa") {
          throw new CmsAuthError(
            "Admin hanya dapat mengirim ulang undangan Siswa.",
            403,
          );
        }
        assertCanAssign(session.role, existingRole);

        if (existing.status === "revoked" || existing.revoked) {
          exErr(
            res,
            "CONFLICT",
            "Undangan sudah dibatalkan. Buat undangan baru dari Undang tim.",
            409,
          );
          return;
        }
        if (existing.status === "accepted") {
          exErr(
            res,
            "CONFLICT",
            "Undangan sudah diterima; tidak perlu dikirim ulang.",
            409,
          );
          return;
        }
        if (existing.status === "expired") {
          exErr(
            res,
            "CONFLICT",
            "Undangan kedaluwarsa. Buat undangan baru dari Undang tim.",
            409,
          );
          return;
        }

        const expiresInDays =
          readInviteExpiresInDays(existing.publicMetadata) ??
          CMS_INVITE_EXPIRY_DEFAULT;

        await clerk.invitations.revokeInvitation(invitationId);

        try {
          const created = await createCmsInvitation({
            clerk,
            env,
            email: existing.emailAddress,
            role: existingRole,
            expiresInDays,
          });
          exOk(res, created, 201);
        } catch (createErr) {
          const mapped = mapClerkInvitationError(createErr);
          exErr(
            res,
            mapped.code,
            `Undangan lama dibatalkan, tetapi pengiriman ulang gagal: ${mapped.message}`,
            mapped.status,
          );
        }
      } catch (err) {
        if (err instanceof CmsAuthError) throw err;
        const msg = clerkErrorMessage(err).toLowerCase();
        if (msg.includes("not found") || msg.includes("couldn't find")) {
          exErr(res, "NOT_FOUND", "Undangan tidak ditemukan.", 404);
          return;
        }
        exErr(res, "CLERK", clerkErrorMessage(err), 502);
      }
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

usersExpressRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsUserManager(toWebRequest(req), env);
      const userId = p(req, "id");
      const parsed = cmsUserPatchSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const clerk = requireClerk(env);
      if (!clerk) {
        exErr(res, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
        return;
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
          if (userId === session.userId && parsed.data.role !== existingRole) {
            throw new CmsAuthError(
              "Tidak dapat mengubah peran akun Anda sendiri.",
              403,
            );
          }
          assertCanAssign(session.role, parsed.data.role);
          if (existingRole === "admin" && parsed.data.role !== "admin") {
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
        exOk(res, toListItem(user));
      } catch (err) {
        if (err instanceof CmsAuthError) throw err;
        const msg = clerkErrorMessage(err).toLowerCase();
        if (msg.includes("not found") || msg.includes("couldn't find")) {
          exErr(res, "NOT_FOUND", "Pengguna tidak ditemukan.", 404);
          return;
        }
        exErr(res, "CLERK", clerkErrorMessage(err), 502);
      }
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

usersExpressRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsUserManager(toWebRequest(req), env);
      const userId = p(req, "id");

      if (userId === session.userId) {
        exErr(res, "FORBIDDEN", "Tidak dapat menghapus akun Anda sendiri.", 403);
        return;
      }

      const clerk = requireClerk(env);
      if (!clerk) {
        exErr(res, "UNCONFIGURED", "CLERK_SECRET_KEY belum dikonfigurasi.", 503);
        return;
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
        exOk(res, { deleted: true });
      } catch (err) {
        if (err instanceof CmsAuthError) throw err;
        const msg = clerkErrorMessage(err).toLowerCase();
        if (msg.includes("not found") || msg.includes("couldn't find")) {
          exErr(res, "NOT_FOUND", "Pengguna tidak ditemukan.", 404);
          return;
        }
        exErr(res, "CLERK", clerkErrorMessage(err), 502);
      }
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
