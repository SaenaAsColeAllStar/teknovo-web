import { Router } from "express";
import { siteMediaPatchSchema } from "@teknovo/shared";
import { requireCmsSiteMediaManager } from "../auth/cms-auth";
import {
  SITE_MEDIA_CATALOG,
  deleteSiteMedia,
  getSiteMedia,
  listSiteMedia,
  upsertSiteMedia,
} from "../lib/data/site-media";
import { publicObjectUrl } from "../lib/runtime";
import { triggerWebRebuild } from "../lib/rebuild-web";
import {
  asyncHandler,
  exBackground,
  exErr,
  exHandleError,
  exOk,
  getBindings,
  p,
  toWebRequest,
} from "../lib/express-http";

export const siteMediaExpressRouter = Router();

siteMediaExpressRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    try {
      const env = getBindings(res);
      const overrides = await listSiteMedia(env);
      const byKey = new Map(overrides.map((o) => [o.mediaKey, o]));

      const items = SITE_MEDIA_CATALOG.map((entry) => {
        const override = byKey.get(entry.mediaKey);
        return {
          mediaKey: entry.mediaKey,
          label: override?.label ?? entry.label,
          category: entry.category,
          url: override?.url ?? publicObjectUrl(env, entry.defaultPath),
          defaultPath: entry.defaultPath,
          isOverride: Boolean(override),
          updatedAt: override?.updatedAt ?? null,
          updatedBy: override?.updatedBy ?? null,
        };
      });

      exOk(res, { items });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

siteMediaExpressRouter.get(
  "/:mediaKey",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const mediaKey = decodeURIComponent(p(req, "mediaKey"));
      const catalog = SITE_MEDIA_CATALOG.find((e) => e.mediaKey === mediaKey);
      if (!catalog) {
        exErr(res, "NOT_FOUND", "Media key tidak dikenal.", 404);
        return;
      }
      const override = await getSiteMedia(env, mediaKey);
      exOk(res, {
        mediaKey,
        label: override?.label ?? catalog.label,
        category: catalog.category,
        url: override?.url ?? publicObjectUrl(env, catalog.defaultPath),
        defaultPath: catalog.defaultPath,
        isOverride: Boolean(override),
        updatedAt: override?.updatedAt ?? null,
        updatedBy: override?.updatedBy ?? null,
      });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

siteMediaExpressRouter.put(
  "/:mediaKey",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsSiteMediaManager(toWebRequest(req), env);
      const mediaKey = decodeURIComponent(p(req, "mediaKey"));
      const catalog = SITE_MEDIA_CATALOG.find((e) => e.mediaKey === mediaKey);
      if (!catalog) {
        exErr(res, "NOT_FOUND", "Media key tidak dikenal.", 404);
        return;
      }

      const parsed = siteMediaPatchSchema.safeParse(req.body);
      if (!parsed.success) {
        exErr(
          res,
          "VALIDATION",
          parsed.error.issues[0]?.message ?? "Invalid",
          400,
        );
        return;
      }

      const saved = await upsertSiteMedia(env, {
        mediaKey,
        label: parsed.data.label?.trim() || catalog.label,
        category: catalog.category,
        url: parsed.data.url,
        updatedBy: session.userId,
      });

      exBackground(triggerWebRebuild(env, `site-media:update:${mediaKey}`));

      exOk(res, {
        ...saved,
        defaultPath: catalog.defaultPath,
        isOverride: true,
      });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

siteMediaExpressRouter.delete(
  "/:mediaKey",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      await requireCmsSiteMediaManager(toWebRequest(req), env);
      const mediaKey = decodeURIComponent(p(req, "mediaKey"));
      const catalog = SITE_MEDIA_CATALOG.find((e) => e.mediaKey === mediaKey);
      if (!catalog) {
        exErr(res, "NOT_FOUND", "Media key tidak dikenal.", 404);
        return;
      }
      await deleteSiteMedia(env, mediaKey);
      exBackground(triggerWebRebuild(env, `site-media:reset:${mediaKey}`));
      exOk(res, {
        deleted: true,
        url: publicObjectUrl(env, catalog.defaultPath),
      });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);
