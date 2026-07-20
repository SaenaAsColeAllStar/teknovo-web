import { Router } from "express";
import { artikelSiswaFormSchema } from "@teknovo/shared";
import {
  requireCmsArtikelWriter,
  requireCmsModerator,
  requireCmsSession,
} from "../auth/cms-auth";
import {
  approveArtikel,
  createArtikel,
  deleteArtikel,
  getArtikelById,
  getArtikelBySlug,
  listArtikel,
  rejectArtikel,
  updateArtikel,
} from "../lib/data/artikel";
import {
  shouldRebuildForArtikelStatus,
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

export const artikelExpressRouter = Router();

artikelExpressRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const status = q(req, "status") as
        | "DRAFT"
        | "REVIEW"
        | "PUBLISHED"
        | "ARCHIVED"
        | undefined;
      const page = Number(q(req, "page") ?? "1");
      const limit = Number(q(req, "limit") ?? "20");
      const mine = q(req, "mine") === "1" || q(req, "mine") === "true";
      const includeTotal = q(req, "includeTotal") !== "0";

      let mineUserId: string | undefined;
      if (!status || status !== "PUBLISHED" || mine) {
        const session = await requireCmsSession(toWebRequest(req), env);
        if (mine) mineUserId = session.userId;
      }

      const result = await listArtikel(env, {
        status: status ?? undefined,
        page,
        limit,
        mineUserId,
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

artikelExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsArtikelWriter(toWebRequest(req), env);
      const parsed = artikelSiswaFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      let status = parsed.data.status;
      if (session.role !== "admin" && status === "PUBLISHED") {
        status = "REVIEW";
      }

      const created = await createArtikel(env, {
        ...parsed.data,
        status,
        konten: sanitizeArtikelHtml(parsed.data.konten),
        coverUrl: parsed.data.coverUrl || undefined,
        kategoriId: parsed.data.kategoriId || undefined,
        penulisId: session.userId,
        penulisNama: session.fullName || session.email || "Siswa",
        penulisKelas: parsed.data.penulisKelas,
        metaTitle: parsed.data.metaTitle || undefined,
        metaDescription: parsed.data.metaDescription || undefined,
        metaKeywords: parsed.data.metaKeywords || undefined,
        ogImageUrl: parsed.data.ogImageUrl || undefined,
        canonicalUrl: parsed.data.canonicalUrl || undefined,
      });

      if (shouldRebuildForArtikelStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `artikel:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

artikelExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getArtikelById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

artikelExpressRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const id = p(req, "id");
      let item = await getArtikelById(env, id);
      if (!item) {
        const publishedOnly = !bearerAuth(req);
        item = await getArtikelBySlug(env, id, publishedOnly);
      }
      if (!item) {
        exErr(res, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
        return;
      }
      if (item.status !== "PUBLISHED") {
        await requireCmsSession(toWebRequest(req), env);
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

artikelExpressRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsArtikelWriter(toWebRequest(req), env);
      const existing = await getArtikelById(env, p(req, "id"));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
        return;
      }
      if (
        session.role === "siswa" &&
        existing.penulis?.id &&
        existing.penulis.id !== session.userId
      ) {
        exErr(res, "FORBIDDEN", "Hanya milik sendiri.", 403);
        return;
      }

      const parsed = artikelSiswaFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      let status = parsed.data.status;
      if (session.role !== "admin" && status === "PUBLISHED") {
        status = "REVIEW";
      }

      const updated = await updateArtikel(env, existing.id, {
        ...parsed.data,
        status,
        konten: sanitizeArtikelHtml(parsed.data.konten),
        coverUrl: parsed.data.coverUrl || undefined,
        kategoriId: parsed.data.kategoriId || undefined,
        penulisKelas: parsed.data.penulisKelas,
        penulisId: existing.penulis?.id ?? session.userId,
        metaTitle: parsed.data.metaTitle || undefined,
        metaDescription: parsed.data.metaDescription || undefined,
        metaKeywords: parsed.data.metaKeywords || undefined,
        ogImageUrl: parsed.data.ogImageUrl || undefined,
        canonicalUrl: parsed.data.canonicalUrl || undefined,
      });

      if (
        updated &&
        (shouldRebuildForArtikelStatus(updated.status) ||
          shouldRebuildForArtikelStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `artikel:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

artikelExpressRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsArtikelWriter(toWebRequest(req), env);
      const existing = await getArtikelById(env, p(req, "id"));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
        return;
      }
      if (
        session.role === "siswa" &&
        existing.penulis?.id &&
        existing.penulis.id !== session.userId
      ) {
        exErr(res, "FORBIDDEN", "Hanya milik sendiri.", 403);
        return;
      }
      await deleteArtikel(env, existing.id);
      if (shouldRebuildForArtikelStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `artikel:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

artikelExpressRouter.post(
  "/:id/approve",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsModerator(toWebRequest(req), env);
      const updated = await approveArtikel(env, p(req, "id"));
      if (!updated) {
        exErr(res, "CONFLICT", "Artikel tidak dalam status REVIEW.", 409);
        return;
      }
      exBackground(
        triggerWebRebuild(env, `artikel:approve:${updated.slug}`),
      );
      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

artikelExpressRouter.post(
  "/:id/reject",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsModerator(toWebRequest(req), env);
      const body = (req.body ?? {}) as { reason?: string };
      const updated = await rejectArtikel(env, p(req, "id"), body.reason);
      if (!updated) {
        exErr(res, "CONFLICT", "Artikel tidak dalam status REVIEW.", 409);
        return;
      }
      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
