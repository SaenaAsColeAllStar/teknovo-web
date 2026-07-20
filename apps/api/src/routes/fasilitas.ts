import { Hono } from "hono";
import { fasilitasFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createFasilitas,
  deleteFasilitas,
  getFasilitasById,
  getFasilitasBySlug,
  listFasilitas,
  updateFasilitas,
} from "../lib/data/fasilitas";
import {
  shouldRebuildForSiteContentStatus,
  triggerWebRebuild,
} from "../lib/rebuild-web";
import { scheduleBackground } from "../lib/runtime";
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
    const includeTotal = c.req.query("includeTotal") !== "0";

    if (!status || status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }

    const result = await listFasilitas(c.env, {
      status: status ?? undefined,
      page,
      limit,
      includeTotal,
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

    const created = await createFasilitas(c.env, {
      ...parsed.data,
      coverUrl: parsed.data.coverUrl || undefined,
    });

    if (shouldRebuildForSiteContentStatus(created.status)) {
      scheduleBackground(
        c,
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
    const item = await getFasilitasById(c.env, c.req.param("id"));
    if (!item) return errJson(c, "NOT_FOUND", "Fasilitas tidak ditemukan.", 404);
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

fasilitasRoutes.get("/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const byId = await getFasilitasById(c.env, key);
    if (byId) {
      if (byId.status !== "PUBLISHED") {
        await requireCmsSession(c.req.raw, c.env);
      }
      return okJson(c, byId);
    }
    const publishedOnly =
      !c.req.header("Authorization")?.startsWith("Bearer ");
    const bySlug = await getFasilitasBySlug(c.env, key, publishedOnly);
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
      (await getFasilitasById(c.env, key)) ??
      (await getFasilitasBySlug(c.env, key, false));
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

    const updated = await updateFasilitas(c.env, existing.id, {
      ...parsed.data,
      coverUrl: parsed.data.coverUrl || undefined,
    });

    if (
      updated &&
      (shouldRebuildForSiteContentStatus(updated.status) ||
        shouldRebuildForSiteContentStatus(existing.status))
    ) {
      scheduleBackground(
        c,
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
      (await getFasilitasById(c.env, key)) ??
      (await getFasilitasBySlug(c.env, key, false));
    if (!existing) {
      return errJson(c, "NOT_FOUND", "Fasilitas tidak ditemukan.", 404);
    }
    await deleteFasilitas(c.env, existing.id);
    if (shouldRebuildForSiteContentStatus(existing.status)) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `fasilitas:delete:${existing.slug}`),
      );
    }
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});
