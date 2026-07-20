import { Hono } from "hono";
import { siteMediaPatchSchema } from "@teknovo/shared";
import { requireCmsSiteMediaManager } from "../auth/cms-auth";
import {
  SITE_MEDIA_CATALOG,
  deleteSiteMedia,
  getSiteMedia,
  listSiteMedia,
  upsertSiteMedia,
} from "../lib/data/site-media";
import { publicObjectUrl, scheduleBackground } from "../lib/runtime";
import { triggerWebRebuild } from "../lib/rebuild-web";
import {
  errJson,
  handleApiError,
  okJson,
  type AppEnv,
} from "../lib/http";

export const siteMediaRoutes = new Hono<AppEnv>();

/** Public + CMS: merged catalog with overrides from DB. */
siteMediaRoutes.get("/", async (c) => {
  try {
    const overrides = await listSiteMedia(c.env);
    const byKey = new Map(overrides.map((o) => [o.mediaKey, o]));

    const items = SITE_MEDIA_CATALOG.map((entry) => {
      const override = byKey.get(entry.mediaKey);
      return {
        mediaKey: entry.mediaKey,
        label: override?.label ?? entry.label,
        category: entry.category,
        url: override?.url ?? publicObjectUrl(c.env, entry.defaultPath),
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
    const override = await getSiteMedia(c.env, mediaKey);
    return okJson(c, {
      mediaKey,
      label: override?.label ?? catalog.label,
      category: catalog.category,
      url: override?.url ?? publicObjectUrl(c.env, catalog.defaultPath),
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

    const saved = await upsertSiteMedia(c.env, {
      mediaKey,
      label: parsed.data.label?.trim() || catalog.label,
      category: catalog.category,
      url: parsed.data.url,
      updatedBy: session.userId,
    });

    scheduleBackground(
      c,
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
    await deleteSiteMedia(c.env, mediaKey);
    scheduleBackground(
      c,
      triggerWebRebuild(c.env, `site-media:reset:${mediaKey}`),
    );
    return okJson(c, {
      deleted: true,
      url: publicObjectUrl(c.env, catalog.defaultPath),
    });
  } catch (err) {
    return handleApiError(c, err);
  }
});
