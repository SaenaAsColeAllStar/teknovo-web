import { Router } from "express";
import { tenagaPengajarFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createTenagaPengajar,
  deleteTenagaPengajar,
  getTenagaPengajarById,
  getTenagaPengajarBySlug,
  listTenagaPengajar,
  updateTenagaPengajar,
} from "../lib/data/tenaga-pengajar";
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

export const tenagaPengajarExpressRouter = Router();

tenagaPengajarExpressRouter.get(
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

      const result = await listTenagaPengajar(env, {
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

tenagaPengajarExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = tenagaPengajarFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createTenagaPengajar(env, {
        ...parsed.data,
        nip: parsed.data.nip || undefined,
        fotoUrl: parsed.data.fotoUrl || undefined,
        bidangKeahlian: parsed.data.bidangKeahlian || undefined,
        pendidikan: parsed.data.pendidikan || undefined,
        pengalaman: parsed.data.pengalaman || undefined,
        kontakEmail: parsed.data.kontakEmail || undefined,
        mediaSosial: parsed.data.mediaSosial ?? null,
      });

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `tenaga-pengajar:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

tenagaPengajarExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getTenagaPengajarById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Tenaga pengajar tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

tenagaPengajarExpressRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const key = p(req, "key");
      const byId = await getTenagaPengajarById(env, key);
      if (byId) {
        if (byId.status !== "PUBLISHED") {
          await requireCmsSession(toWebRequest(req), env);
        }
        exOk(res, byId);
        return;
      }
      const publishedOnly = !bearerAuth(req);
      const bySlug = await getTenagaPengajarBySlug(env, key, publishedOnly);
      if (!bySlug) {
        exErr(res, "NOT_FOUND", "Tenaga pengajar tidak ditemukan.", 404);
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

tenagaPengajarExpressRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getTenagaPengajarById(env, key)) ??
        (await getTenagaPengajarBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Tenaga pengajar tidak ditemukan.", 404);
        return;
      }

      const parsed = tenagaPengajarFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updateTenagaPengajar(env, existing.id, {
        ...parsed.data,
        nip: parsed.data.nip || undefined,
        fotoUrl: parsed.data.fotoUrl || undefined,
        bidangKeahlian: parsed.data.bidangKeahlian || undefined,
        pendidikan: parsed.data.pendidikan || undefined,
        pengalaman: parsed.data.pengalaman || undefined,
        kontakEmail: parsed.data.kontakEmail || undefined,
        mediaSosial: parsed.data.mediaSosial ?? null,
      });

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `tenaga-pengajar:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

tenagaPengajarExpressRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getTenagaPengajarById(env, key)) ??
        (await getTenagaPengajarBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Tenaga pengajar tidak ditemukan.", 404);
        return;
      }
      await deleteTenagaPengajar(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `tenaga-pengajar:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
