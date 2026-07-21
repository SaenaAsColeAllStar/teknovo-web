import { Router } from "express";
import { programSekolahFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createProgramSekolah,
  deleteProgramSekolah,
  getProgramSekolahById,
  getProgramSekolahBySlug,
  listProgramSekolah,
  updateProgramSekolah,
} from "../lib/data/program-sekolah";
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

export const programSekolahExpressRouter = Router();

programSekolahExpressRouter.get(
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

      const result = await listProgramSekolah(env, {
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

programSekolahExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = programSekolahFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createProgramSekolah(env, {
        ...parsed.data,
        coverUrl: parsed.data.coverUrl || undefined,
        ikon: parsed.data.ikon || undefined,
      });

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `program-sekolah:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

programSekolahExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getProgramSekolahById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Program sekolah tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

programSekolahExpressRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const key = p(req, "key");
      const byId = await getProgramSekolahById(env, key);
      if (byId) {
        if (byId.status !== "PUBLISHED") {
          await requireCmsSession(toWebRequest(req), env);
        }
        exOk(res, byId);
        return;
      }
      const publishedOnly = !bearerAuth(req);
      const bySlug = await getProgramSekolahBySlug(env, key, publishedOnly);
      if (!bySlug) {
        exErr(res, "NOT_FOUND", "Program sekolah tidak ditemukan.", 404);
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

programSekolahExpressRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getProgramSekolahById(env, key)) ??
        (await getProgramSekolahBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Program sekolah tidak ditemukan.", 404);
        return;
      }

      const parsed = programSekolahFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updateProgramSekolah(env, existing.id, {
        ...parsed.data,
        coverUrl: parsed.data.coverUrl || undefined,
        ikon: parsed.data.ikon || undefined,
      });

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `program-sekolah:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

programSekolahExpressRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getProgramSekolahById(env, key)) ??
        (await getProgramSekolahBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Program sekolah tidak ditemukan.", 404);
        return;
      }
      await deleteProgramSekolah(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `program-sekolah:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
