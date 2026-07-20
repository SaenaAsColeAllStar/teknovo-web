import { Router } from "express";
import { prestasiFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createPrestasi,
  deletePrestasi,
  getPrestasiById,
  listPrestasi,
  updatePrestasi,
} from "../lib/data/prestasi";
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

export const prestasiExpressRouter = Router();

prestasiExpressRouter.get(
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

      const result = await listPrestasi(env, {
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

prestasiExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = prestasiFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createPrestasi(env, parsed.data);

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(triggerWebRebuild(env, `prestasi:create:${created.id}`));
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

prestasiExpressRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const item = await getPrestasiById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Prestasi tidak ditemukan.", 404);
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

prestasiExpressRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const existing = await getPrestasiById(env, p(req, "id"));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Prestasi tidak ditemukan.", 404);
        return;
      }

      const parsed = prestasiFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updatePrestasi(env, existing.id, parsed.data);

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(triggerWebRebuild(env, `prestasi:update:${updated.id}`));
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

prestasiExpressRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const existing = await getPrestasiById(env, p(req, "id"));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Prestasi tidak ditemukan.", 404);
        return;
      }
      await deletePrestasi(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(triggerWebRebuild(env, `prestasi:delete:${existing.id}`));
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
