import { Router } from "express";
import {
  kategoriFormSchema,
  zPengaturanSitusPublikPatch,
  cmsRoleCanWriteKategori,
} from "@teknovo/shared";
import {
  requireCmsAdmin,
  requireCmsSession,
  requireCmsWriter,
  requireCmsMediaUploader,
  CmsAuthError,
} from "../auth/cms-auth";
import { analyticsOverview } from "../lib/data/analytics";
import {
  createKategori,
  deleteKategori,
  listKategori,
  updateKategori,
} from "../lib/data/kategori";
import { getPengaturan, upsertPengaturan } from "../lib/data/pengaturan";
import { log } from "../lib/logger";
import { triggerWebRebuild } from "../lib/rebuild-web";
import { safeEqualSecret } from "../lib/secrets";
import { verifySvixSignature } from "../lib/svix-verify";
import {
  CMS_MEDIA_ALLOWED_TYPES,
  CMS_MEDIA_MAX_BYTES,
  deleteCmsUpload,
  listCmsUploads,
  putCmsUpload,
} from "../media/cms-media";
import {
  asyncHandler,
  getRawBody,
  exBackground,
  exErr,
  exHandleError,
  exOk,
  getBindings,
  p,
  q,
  toWebRequest,
} from "../lib/express-http";

export const kategoriExpressRouter = Router();

kategoriExpressRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    try {
      const items = await listKategori(getBindings(res));
      exOk(res, items);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kategoriExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsSession(toWebRequest(req), env);
      if (!cmsRoleCanWriteKategori(session.role)) {
        throw new CmsAuthError("Tidak dapat menambah kategori.", 403);
      }
      const parsed = kategoriFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }
      const created = await createKategori(env, parsed.data);
      exBackground(triggerWebRebuild(env, `kategori:create:${created.slug}`));
      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kategoriExpressRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsWriter(toWebRequest(req), env);
      const parsed = kategoriFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }
      const updated = await updateKategori(env, p(req, "id"), parsed.data);
      if (!updated) {
        exErr(res, "NOT_FOUND", "Kategori tidak ditemukan.", 404);
        return;
      }
      exBackground(triggerWebRebuild(env, `kategori:update:${updated.slug}`));
      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kategoriExpressRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsWriter(toWebRequest(req), env);
      const ok = await deleteKategori(env, p(req, "id"));
      if (!ok) {
        exErr(res, "NOT_FOUND", "Kategori tidak ditemukan.", 404);
        return;
      }
      exBackground(triggerWebRebuild(env, `kategori:delete:${p(req, "id")}`));
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

export const pengaturanExpressRouter = Router();

pengaturanExpressRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    try {
      exOk(res, await getPengaturan(getBindings(res)));
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

pengaturanExpressRouter.patch(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsAdmin(toWebRequest(req), env);
      const parsed = zPengaturanSitusPublikPatch.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }
      const data = await upsertPengaturan(env, parsed.data);
      exBackground(triggerWebRebuild(env, "pengaturan:update"));
      exOk(res, data);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

export const analyticsExpressRouter = Router();

analyticsExpressRouter.get(
  "/overview",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      exOk(res, await analyticsOverview(env));
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

export const mediaExpressRouter = Router();

mediaExpressRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const cursor = q(req, "cursor") ?? undefined;
      const limit = Number(q(req, "limit") ?? "100");
      exOk(res, await listCmsUploads(env, { cursor, limit }));
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

mediaExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsMediaUploader(toWebRequest(req), env);
      const webReq = toWebRequest(req);
      const form = await webReq.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        exErr(res, "VALIDATION", "Field file wajib.", 400);
        return;
      }
      if (file.size > CMS_MEDIA_MAX_BYTES) {
        exErr(res, "PAYLOAD_TOO_LARGE", "Maksimal 8 MiB.", 413);
        return;
      }
      if (!CMS_MEDIA_ALLOWED_TYPES.has(file.type)) {
        exErr(res, "UNSUPPORTED", "Tipe file tidak diizinkan.", 415);
        return;
      }
      const obj = await putCmsUpload(env, file, file.name, file.type);
      exOk(res, obj, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

mediaExpressRouter.delete(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsWriter(toWebRequest(req), env);
      const body = (req.body ?? {}) as { key?: string };
      if (!body.key) {
        exErr(res, "VALIDATION", "key wajib.", 400);
        return;
      }
      await deleteCmsUpload(env, body.key);
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

export const hooksExpressRouter = Router();

hooksExpressRouter.post(
  "/rebuild-web",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const secret = env.REBUILD_WEB_SECRET?.trim();
      if (!secret || secret.startsWith("GANTI_") || secret.length < 16) {
        exErr(
          res,
          "UNCONFIGURED",
          "REBUILD_WEB_SECRET belum di-set (min. 16 karakter).",
          503,
        );
        return;
      }

      const auth = req.get("Authorization");
      const provided = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
      if (!provided || !safeEqualSecret(provided, secret)) {
        exErr(res, "UNAUTHORIZED", "Secret tidak valid.", 401);
        return;
      }

      const body = (req.body ?? {}) as { reason?: string };
      const reason =
        typeof body.reason === "string" && body.reason.trim()
          ? body.reason.trim().slice(0, 200)
          : "manual";
      exOk(res, await triggerWebRebuild(env, reason));
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

export const webhookExpressRouter = Router();

webhookExpressRouter.post(
  "/clerk",
  asyncHandler(async (req, res) => {
    const env = getBindings(res);
    const secret = env.CLERK_WEBHOOK_SECRET;
    if (!secret || secret.startsWith("GANTI_")) {
      exErr(res, "UNCONFIGURED", "CLERK_WEBHOOK_SECRET belum di-set.", 503);
      return;
    }

    const raw = getRawBody(req);
    const payload = Buffer.isBuffer(raw)
      ? raw.toString("utf8")
      : typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body ?? {});

    const ok = await verifySvixSignature({
      secret,
      payload,
      svixId: req.get("svix-id") ?? null,
      svixTimestamp: req.get("svix-timestamp") ?? null,
      svixSignature: req.get("svix-signature") ?? null,
    });
    if (!ok) {
      log.warn("clerk_webhook_invalid_signature", {
        requestId: res.locals.requestId,
      });
      exErr(res, "UNAUTHORIZED", "Signature webhook tidak valid.", 401);
      return;
    }

    exOk(res, { received: true });
  }),
);
