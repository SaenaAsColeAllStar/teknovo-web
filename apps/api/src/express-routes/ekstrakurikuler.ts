import { Router } from "express";
import { ekstrakurikulerFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createEkstrakurikuler,
  deleteEkstrakurikuler,
  getEkstrakurikulerById,
  getEkstrakurikulerBySlug,
  listEkstrakurikuler,
  listEkstrakurikulerFull,
  updateEkstrakurikuler,
} from "../lib/data/ekstrakurikuler";
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

export const ekstrakurikulerExpressRouter = Router();

ekstrakurikulerExpressRouter.get(
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
      const full = q(req, "full") === "1";
      const includeTotal = q(req, "includeTotal") !== "0";

      if (!status || status !== "PUBLISHED") {
        await requireCmsSession(toWebRequest(req), env);
      }

      if (full && status === "PUBLISHED") {
        const items = await listEkstrakurikulerFull(env, "PUBLISHED");
        exOkList(res, items, {
          page: 1,
          limit: items.length,
          total: items.length,
        });
        return;
      }

      const result = await listEkstrakurikuler(env, {
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

ekstrakurikulerExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = ekstrakurikulerFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createEkstrakurikuler(env, {
        ...parsed.data,
        previewUrl: parsed.data.previewUrl || undefined,
        jadwalRingkas: parsed.data.jadwalRingkas || undefined,
        lokasiLatihan: parsed.data.lokasiLatihan || undefined,
        pembinaNama: parsed.data.pembinaNama || undefined,
      });

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `ekstrakurikuler:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

ekstrakurikulerExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getEkstrakurikulerById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

ekstrakurikulerExpressRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const key = p(req, "key");
      const byId = await getEkstrakurikulerById(env, key);
      if (byId) {
        if (byId.status !== "PUBLISHED") {
          await requireCmsSession(toWebRequest(req), env);
        }
        exOk(res, byId);
        return;
      }
      const publishedOnly = !bearerAuth(req);
      const bySlug = await getEkstrakurikulerBySlug(env, key, publishedOnly);
      if (!bySlug) {
        exErr(res, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
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

ekstrakurikulerExpressRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getEkstrakurikulerById(env, key)) ??
        (await getEkstrakurikulerBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
        return;
      }

      const parsed = ekstrakurikulerFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updateEkstrakurikuler(env, existing.id, {
        ...parsed.data,
        previewUrl: parsed.data.previewUrl || undefined,
        jadwalRingkas: parsed.data.jadwalRingkas || undefined,
        lokasiLatihan: parsed.data.lokasiLatihan || undefined,
        pembinaNama: parsed.data.pembinaNama || undefined,
      });

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `ekstrakurikuler:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

ekstrakurikulerExpressRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getEkstrakurikulerById(env, key)) ??
        (await getEkstrakurikulerBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
        return;
      }
      await deleteEkstrakurikuler(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `ekstrakurikuler:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
