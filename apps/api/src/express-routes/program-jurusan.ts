import { Router } from "express";
import { programJurusanFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createProgramJurusan,
  deleteProgramJurusan,
  getProgramJurusanById,
  getProgramJurusanBySlug,
  listProgramJurusan,
  updateProgramJurusan,
} from "../lib/data/program-jurusan";
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

export const programJurusanExpressRouter = Router();

programJurusanExpressRouter.get(
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

      const result = await listProgramJurusan(env, {
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

programJurusanExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = programJurusanFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createProgramJurusan(env, {
        ...parsed.data,
        coverUrl: parsed.data.coverUrl || undefined,
        ikon: parsed.data.ikon || undefined,
        linkPendaftaran: parsed.data.linkPendaftaran || undefined,
        jumlahSiswa: parsed.data.jumlahSiswa ?? null,
      });

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `program-jurusan:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

programJurusanExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getProgramJurusanById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Program jurusan tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

programJurusanExpressRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const key = p(req, "key");
      const byId = await getProgramJurusanById(env, key);
      if (byId) {
        if (byId.status !== "PUBLISHED") {
          await requireCmsSession(toWebRequest(req), env);
        }
        exOk(res, byId);
        return;
      }
      const publishedOnly = !bearerAuth(req);
      const bySlug = await getProgramJurusanBySlug(env, key, publishedOnly);
      if (!bySlug) {
        exErr(res, "NOT_FOUND", "Program jurusan tidak ditemukan.", 404);
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

programJurusanExpressRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getProgramJurusanById(env, key)) ??
        (await getProgramJurusanBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Program jurusan tidak ditemukan.", 404);
        return;
      }

      const parsed = programJurusanFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updateProgramJurusan(env, existing.id, {
        ...parsed.data,
        coverUrl: parsed.data.coverUrl || undefined,
        ikon: parsed.data.ikon || undefined,
        linkPendaftaran: parsed.data.linkPendaftaran || undefined,
        jumlahSiswa: parsed.data.jumlahSiswa ?? null,
      });

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `program-jurusan:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

programJurusanExpressRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getProgramJurusanById(env, key)) ??
        (await getProgramJurusanBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Program jurusan tidak ditemukan.", 404);
        return;
      }
      await deleteProgramJurusan(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `program-jurusan:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
