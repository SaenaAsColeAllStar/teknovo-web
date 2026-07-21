import { Router } from "express";
import { pengumumanFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createPengumuman,
  deletePengumuman,
  getPengumumanById,
  getPengumumanBySlug,
  listPengumuman,
  updatePengumuman,
} from "../lib/data/pengumuman";
import {
  shouldRebuildForSiteContentStatus,
  triggerWebRebuild,
} from "../lib/rebuild-web";
import {
  asyncHandler,
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

export const pengumumanExpressRouter = Router();

pengumumanExpressRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const status = q(req, "status") as
        | "DRAFT"
        | "PENDING_REVIEW"
        | "PUBLISHED"
        | "REJECTED"
        | "ARCHIVED"
        | undefined;
      const page = Number(q(req, "page") ?? "1");
      const limit = Number(q(req, "limit") ?? "50");
      const includeTotal = q(req, "includeTotal") !== "0";

      if (!status || status !== "PUBLISHED") {
        await requireCmsSession(toWebRequest(req), env);
      }

      const result = await listPengumuman(env, {
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

pengumumanExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = pengumumanFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createPengumuman(env, {
        ...parsed.data,
        bannerUrl: parsed.data.bannerUrl || undefined,
        tanggalMulai: parsed.data.tanggalMulai || null,
        tanggalAkhir: parsed.data.tanggalAkhir || null,
      });

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `pengumuman:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

pengumumanExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getPengumumanById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Pengumuman tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

pengumumanExpressRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const item = await getPengumumanBySlug(env, p(req, "slug"), true);
      if (!item) {
        exErr(res, "NOT_FOUND", "Pengumuman tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

pengumumanExpressRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const existing = await getPengumumanById(env, p(req, "id"));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Pengumuman tidak ditemukan.", 404);
        return;
      }

      const parsed = pengumumanFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updatePengumuman(env, existing.id, {
        ...parsed.data,
        bannerUrl: parsed.data.bannerUrl || undefined,
        tanggalMulai: parsed.data.tanggalMulai || null,
        tanggalAkhir: parsed.data.tanggalAkhir || null,
      });

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `pengumuman:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

pengumumanExpressRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const existing = await getPengumumanById(env, p(req, "id"));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Pengumuman tidak ditemukan.", 404);
        return;
      }
      await deletePengumuman(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `pengumuman:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
