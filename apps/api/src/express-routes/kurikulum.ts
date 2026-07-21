import { Router } from "express";
import { kurikulumFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createKurikulum,
  deleteKurikulum,
  getKurikulumById,
  getKurikulumBySlug,
  listKurikulum,
  updateKurikulum,
} from "../lib/data/kurikulum";
import {
  shouldRebuildForSiteContentStatus,
  triggerWebRebuild,
} from "../lib/rebuild-web";
import {
  asyncHandler,
  bearerAuth,
  exBackground,
  exErr,
  exHandleError,
  exOk,
  exOkList,
  getBindings,
  p,
  q,
  toWebRequest,
} from "../lib/express-http";

export const kurikulumExpressRouter = Router();

kurikulumExpressRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const status = q(req, "status") as
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED"
        | undefined;
      const page = Number(q(req, "page") ?? "1");
      const limit = Number(q(req, "limit") ?? "50");
      const includeTotal = q(req, "includeTotal") !== "0";

      if (!status || status !== "PUBLISHED") {
        await requireCmsSession(toWebRequest(req), env);
      }

      const result = await listKurikulum(env, {
        status: status ?? undefined,
        page,
        limit,
        includeTotal,
      });
      exOkList(res, result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kurikulumExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = kurikulumFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createKurikulum(env, {
        ...parsed.data,
        coverUrl: parsed.data.coverUrl || undefined,
        dokumenUrl: parsed.data.dokumenUrl || undefined,
        strukturKurikulum: parsed.data.strukturKurikulum ?? null,
      });

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `kurikulum:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kurikulumExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getKurikulumById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Kurikulum tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kurikulumExpressRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const key = p(req, "key");
      const byId = await getKurikulumById(env, key);
      if (byId) {
        if (byId.status !== "PUBLISHED") {
          await requireCmsSession(toWebRequest(req), env);
        }
        exOk(res, byId);
        return;
      }
      const publishedOnly = !bearerAuth(req);
      const bySlug = await getKurikulumBySlug(env, key, publishedOnly);
      if (!bySlug) {
        exErr(res, "NOT_FOUND", "Kurikulum tidak ditemukan.", 404);
        return;
      }
      if (bySlug.status !== "PUBLISHED") {
        await requireCmsSession(toWebRequest(req), env);
      }
      exOk(res, bySlug);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kurikulumExpressRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getKurikulumById(env, key)) ??
        (await getKurikulumBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Kurikulum tidak ditemukan.", 404);
        return;
      }

      const parsed = kurikulumFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updateKurikulum(env, existing.id, {
        ...parsed.data,
        coverUrl: parsed.data.coverUrl || undefined,
        dokumenUrl: parsed.data.dokumenUrl || undefined,
        strukturKurikulum: parsed.data.strukturKurikulum ?? null,
      });

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `kurikulum:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kurikulumExpressRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getKurikulumById(env, key)) ??
        (await getKurikulumBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Kurikulum tidak ditemukan.", 404);
        return;
      }
      await deleteKurikulum(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `kurikulum:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
