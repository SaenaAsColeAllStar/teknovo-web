/**
 * Express routers — Node/VPS production path (Prisma + MinIO).
 * Worker keeps Hono modules under `../routes/*`.
 */
import { Router } from "express";
import { beritaFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsWriter } from "../auth/cms-auth";
import {
  createBerita,
  deleteBerita,
  getBeritaById,
  getBeritaBySlug,
  listBerita,
  updateBerita,
} from "../lib/data/berita";
import {
  shouldRebuildForBeritaStatus,
  triggerWebRebuild,
} from "../lib/rebuild-web";
import { sanitizeArtikelHtml } from "../lib/sanitize-html";
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

export const beritaExpressRouter = Router();

beritaExpressRouter.get(
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
      const limit = Number(q(req, "limit") ?? "20");
      const includeTotal = q(req, "includeTotal") !== "0";

      if (!status || status !== "PUBLISHED") {
        await requireCmsSession(toWebRequest(req), env);
      }

      const result = await listBerita(env, {
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

beritaExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsWriter(toWebRequest(req), env);
      const parsed = beritaFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createBerita(env, {
        ...parsed.data,
        konten: sanitizeArtikelHtml(parsed.data.konten),
        coverUrl: parsed.data.coverUrl || undefined,
        kategoriId: parsed.data.kategoriId || undefined,
        metaTitle: parsed.data.metaTitle || undefined,
        metaDescription: parsed.data.metaDescription || undefined,
        metaKeywords: parsed.data.metaKeywords || undefined,
        ogImageUrl: parsed.data.ogImageUrl || undefined,
        canonicalUrl: parsed.data.canonicalUrl || undefined,
        penulisId: session.userId,
        penulisNama: session.fullName || session.email || "Editor",
      });

      if (shouldRebuildForBeritaStatus(created.status)) {
        exBackground(triggerWebRebuild(env, `berita:create:${created.slug}`));
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

beritaExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getBeritaById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Berita tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

beritaExpressRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const key = p(req, "key");
      const byId = await getBeritaById(env, key);
      if (byId) {
        if (byId.status !== "PUBLISHED") {
          await requireCmsSession(toWebRequest(req), env);
        }
        exOk(res, byId);
        return;
      }
      const publishedOnly = !bearerAuth(req);
      const bySlug = await getBeritaBySlug(env, key, publishedOnly);
      if (!bySlug) {
        exErr(res, "NOT_FOUND", "Berita tidak ditemukan.", 404);
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

beritaExpressRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getBeritaById(env, key)) ??
        (await getBeritaBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Berita tidak ditemukan.", 404);
        return;
      }

      const parsed = beritaFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updateBerita(env, existing.id, {
        ...parsed.data,
        konten: sanitizeArtikelHtml(parsed.data.konten),
        coverUrl: parsed.data.coverUrl || undefined,
        kategoriId: parsed.data.kategoriId || undefined,
        metaTitle: parsed.data.metaTitle || undefined,
        metaDescription: parsed.data.metaDescription || undefined,
        metaKeywords: parsed.data.metaKeywords || undefined,
        ogImageUrl: parsed.data.ogImageUrl || undefined,
        canonicalUrl: parsed.data.canonicalUrl || undefined,
      });

      if (
        updated &&
        (shouldRebuildForBeritaStatus(updated.status) ||
          shouldRebuildForBeritaStatus(existing.status))
      ) {
        exBackground(triggerWebRebuild(env, `berita:update:${updated.slug}`));
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

beritaExpressRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getBeritaById(env, key)) ??
        (await getBeritaBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Berita tidak ditemukan.", 404);
        return;
      }
      await deleteBerita(env, existing.id);
      if (shouldRebuildForBeritaStatus(existing.status)) {
        exBackground(triggerWebRebuild(env, `berita:delete:${existing.slug}`));
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
