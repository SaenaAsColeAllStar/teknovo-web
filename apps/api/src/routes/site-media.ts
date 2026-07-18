import { Hono } from "hono";
import { siteMediaPatchSchema } from "@teknovo/shared";
import { requireCmsSiteMediaManager } from "../auth/cms-auth";
import {
  d1DeleteSiteMedia,
  d1GetSiteMedia,
  d1ListSiteMedia,
  d1UpsertSiteMedia,
  SITE_MEDIA_CATALOG,
} from "../lib/d1/site-media-repo";
import { r2ObjectUrl } from "../media/cms-media";
import { triggerWebRebuild } from "../lib/rebuild-web";
import {
  errJson,
  handleApiError,
  okJson,
  type AppEnv,
} from "../lib/http";

export const siteMediaRoutes = new Hono<AppEnv>();

/** Public + CMS: merged catalog with overrides from D1. */
siteMediaRoutes.get("/", async (c) => {
  try {
    const overrides = await d1ListSiteMedia(c.env.DB);
    const byKey = new Map(overrides.map((o) => [o.mediaKey, o]));

    const items = SITE_MEDIA_CATALOG.map((entry) => {
      const override = byKey.get(entry.mediaKey);
      return {
        mediaKey: entry.mediaKey,
        label: override?.label ?? entry.label,
        category: entry.category,
        url: override?.url ?? r2ObjectUrl(c.env, entry.defaultPath),
        defaultPath: entry.defaultPath,
        isOverride: Boolean(override),
        updatedAt: override?.updatedAt ?? null,
        updatedBy: override?.updatedBy ?? null,
      };
    });

    return okJson(c, { items });
  } catch (err) {
    return handleApiError(c, err);
  }
});

siteMediaRoutes.get("/:mediaKey", async (c) => {
  try {
    const mediaKey = decodeURIComponent(c.req.param("mediaKey"));
    const catalog = SITE_MEDIA_CATALOG.find((e) => e.mediaKey === mediaKey);
    if (!catalog) {
      return errJson(c, "NOT_FOUND", "Media key tidak dikenal.", 404);
    }
    const override = await d1GetSiteMedia(c.env.DB, mediaKey);
    return okJson(c, {
      mediaKey,
      label: override?.label ?? catalog.label,
      category: catalog.category,
      url: override?.url ?? r2ObjectUrl(c.env, catalog.defaultPath),
      defaultPath: catalog.defaultPath,
      isOverride: Boolean(override),
      updatedAt: override?.updatedAt ?? null,
      updatedBy: override?.updatedBy ?? null,
    });
  } catch (err) {
    return handleApiError(c, err);
  }
});

siteMediaRoutes.put("/:mediaKey", async (c) => {
  try {
    const session = await requireCmsSiteMediaManager(c.req.raw, c.env);
    const mediaKey = decodeURIComponent(c.req.param("mediaKey"));
    const catalog = SITE_MEDIA_CATALOG.find((e) => e.mediaKey === mediaKey);
    if (!catalog) {
      return errJson(c, "NOT_FOUND", "Media key tidak dikenal.", 404);
    }

    const json = await c.req.json();
    const parsed = siteMediaPatchSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const saved = await d1UpsertSiteMedia(c.env.DB, {
      mediaKey,
      label: parsed.data.label?.trim() || catalog.label,
      category: catalog.category,
      url: parsed.data.url,
      updatedBy: session.userId,
    });

    c.executionCtx.waitUntil(
      triggerWebRebuild(c.env, `site-media:update:${mediaKey}`),
    );

    return okJson(c, {
      ...saved,
      defaultPath: catalog.defaultPath,
      isOverride: true,
    });
  } catch (err) {
    return handleApiError(c, err);
  }
});

siteMediaRoutes.delete("/:mediaKey", async (c) => {
  try {
    await requireCmsSiteMediaManager(c.req.raw, c.env);
    const mediaKey = decodeURIComponent(c.req.param("mediaKey"));
    const catalog = SITE_MEDIA_CATALOG.find((e) => e.mediaKey === mediaKey);
    if (!catalog) {
      return errJson(c, "NOT_FOUND", "Media key tidak dikenal.", 404);
    }
    await d1DeleteSiteMedia(c.env.DB, mediaKey);
    c.executionCtx.waitUntil(
      triggerWebRebuild(c.env, `site-media:reset:${mediaKey}`),
    );
    return okJson(c, {
      deleted: true,
      url: r2ObjectUrl(c.env, catalog.defaultPath),
    });
  } catch (err) {
    return handleApiError(c, err);
  }
});
