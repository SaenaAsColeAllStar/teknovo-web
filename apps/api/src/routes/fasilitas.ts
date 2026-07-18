import { Hono } from "hono";
import { fasilitasFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  d1CreateFasilitas,
  d1DeleteFasilitas,
  d1GetFasilitasById,
  d1GetFasilitasBySlug,
  d1ListFasilitas,
  d1UpdateFasilitas,
} from "../lib/d1/fasilitas-repo";
import {
  shouldRebuildForSiteContentStatus,
  triggerWebRebuild,
} from "../lib/rebuild-web";
import {
  errJson,
  handleApiError,
  okJson,
  okListJson,
  type AppEnv,
} from "../lib/http";

export const fasilitasRoutes = new Hono<AppEnv>();

fasilitasRoutes.get("/", async (c) => {
  try {
    const status = c.req.query("status") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
      | undefined;
    const page = Number(c.req.query("page") ?? "1");
    const limit = Number(c.req.query("limit") ?? "50");

    if (!status || status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }

    const result = await d1ListFasilitas(c.env.DB, {
      status: status ?? undefined,
      page,
      limit,
    });
    return okListJson(c, result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (err) {
    return handleApiError(c, err);
  }
});

fasilitasRoutes.post("/", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = fasilitasFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const created = await d1CreateFasilitas(c.env.DB, {
      ...parsed.data,
      coverUrl: parsed.data.coverUrl || undefined,
    });

    if (shouldRebuildForSiteContentStatus(created.status)) {
      c.executionCtx.waitUntil(
        triggerWebRebuild(c.env, `fasilitas:create:${created.slug}`),
      );
    }

    return okJson(c, created, 201);
  } catch (err) {
    return handleApiError(c, err);
  }
});

fasilitasRoutes.get("/id/:id", async (c) => {
  try {
    await requireCmsSession(c.req.raw, c.env);
    const item = await d1GetFasilitasById(c.env.DB, c.req.param("id"));
    if (!item) return errJson(c, "NOT_FOUND", "Fasilitas tidak ditemukan.", 404);
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

fasilitasRoutes.get("/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const byId = await d1GetFasilitasById(c.env.DB, key);
    if (byId) {
      if (byId.status !== "PUBLISHED") {
        await requireCmsSession(c.req.raw, c.env);
      }
      return okJson(c, byId);
    }
    const publishedOnly =
      !c.req.header("Authorization")?.startsWith("Bearer ");
    const bySlug = await d1GetFasilitasBySlug(c.env.DB, key, publishedOnly);
    if (!bySlug) {
      return errJson(c, "NOT_FOUND", "Fasilitas tidak ditemukan.", 404);
    }
    if (bySlug.status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }
    return okJson(c, bySlug);
  } catch (err) {
    return handleApiError(c, err);
  }
});

fasilitasRoutes.patch("/:key", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const key = c.req.param("key");
    const existing =
      (await d1GetFasilitasById(c.env.DB, key)) ??
      (await d1GetFasilitasBySlug(c.env.DB, key, false));
    if (!existing) {
      return errJson(c, "NOT_FOUND", "Fasilitas tidak ditemukan.", 404);
    }

    const json = await c.req.json();
    const parsed = fasilitasFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const updated = await d1UpdateFasilitas(c.env.DB, existing.id, {
      ...parsed.data,
      coverUrl: parsed.data.coverUrl || undefined,
    });

    if (
      updated &&
      (shouldRebuildForSiteContentStatus(updated.status) ||
        shouldRebuildForSiteContentStatus(existing.status))
    ) {
      c.executionCtx.waitUntil(
        triggerWebRebuild(c.env, `fasilitas:update:${updated.slug}`),
      );
    }

    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});

fasilitasRoutes.delete("/:key", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const key = c.req.param("key");
    const existing =
      (await d1GetFasilitasById(c.env.DB, key)) ??
      (await d1GetFasilitasBySlug(c.env.DB, key, false));
    if (!existing) {
      return errJson(c, "NOT_FOUND", "Fasilitas tidak ditemukan.", 404);
    }
    await d1DeleteFasilitas(c.env.DB, existing.id);
    if (shouldRebuildForSiteContentStatus(existing.status)) {
      c.executionCtx.waitUntil(
        triggerWebRebuild(c.env, `fasilitas:delete:${existing.slug}`),
      );
    }
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});
