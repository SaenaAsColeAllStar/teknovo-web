import { Router } from "express";
import { kontakFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createKontak,
  deleteKontak,
  getKontakById,
  getKontakBySlug,
  listKontak,
  updateKontak,
} from "../lib/data/kontak";
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

export const kontakExpressRouter = Router();

kontakExpressRouter.get(
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

      const result = await listKontak(env, {
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

kontakExpressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const parsed = kontakFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const created = await createKontak(env, {
        ...parsed.data,
        whatsapp: parsed.data.whatsapp || undefined,
        googleMapsUrl: parsed.data.googleMapsUrl || undefined,
        googleMapsEmbed: parsed.data.googleMapsEmbed || undefined,
        jamOperasional: parsed.data.jamOperasional ?? null,
        mediaSosial: parsed.data.mediaSosial ?? null,
      });

      if (shouldRebuildForSiteContentStatus(created.status)) {
        exBackground(
          triggerWebRebuild(env, `kontak:create:${created.slug}`),
        );
      }

      exOk(res, created, 201);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kontakExpressRouter.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSession(toWebRequest(req), env);
      const item = await getKontakById(env, p(req, "id"));
      if (!item) {
        exErr(res, "NOT_FOUND", "Kontak tidak ditemukan.", 404);
        return;
      }
      exOk(res, item);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kontakExpressRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const key = p(req, "key");
      const byId = await getKontakById(env, key);
      if (byId) {
        if (byId.status !== "PUBLISHED") {
          await requireCmsSession(toWebRequest(req), env);
        }
        exOk(res, byId);
        return;
      }
      const publishedOnly = !bearerAuth(req);
      const bySlug = await getKontakBySlug(env, key, publishedOnly);
      if (!bySlug) {
        exErr(res, "NOT_FOUND", "Kontak tidak ditemukan.", 404);
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

kontakExpressRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getKontakById(env, key)) ??
        (await getKontakBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Kontak tidak ditemukan.", 404);
        return;
      }

      const parsed = kontakFormSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const updated = await updateKontak(env, existing.id, {
        ...parsed.data,
        whatsapp: parsed.data.whatsapp || undefined,
        googleMapsUrl: parsed.data.googleMapsUrl || undefined,
        googleMapsEmbed: parsed.data.googleMapsEmbed || undefined,
        jamOperasional: parsed.data.jamOperasional ?? null,
        mediaSosial: parsed.data.mediaSosial ?? null,
      });

      if (
        updated &&
        (shouldRebuildForSiteContentStatus(updated.status) ||
          shouldRebuildForSiteContentStatus(existing.status))
      ) {
        exBackground(
          triggerWebRebuild(env, `kontak:update:${updated.slug}`),
        );
      }

      exOk(res, updated);
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

kontakExpressRouter.delete(
  "/:key",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteContentWriter(toWebRequest(req), env);
      const key = p(req, "key");
      const existing =
        (await getKontakById(env, key)) ??
        (await getKontakBySlug(env, key, false));
      if (!existing) {
        exErr(res, "NOT_FOUND", "Kontak tidak ditemukan.", 404);
        return;
      }
      await deleteKontak(env, existing.id);
      if (shouldRebuildForSiteContentStatus(existing.status)) {
        exBackground(
          triggerWebRebuild(env, `kontak:delete:${existing.slug}`),
        );
      }
      exOk(res, { deleted: true });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
