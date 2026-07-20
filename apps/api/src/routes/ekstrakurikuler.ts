import { Hono } from "hono";
import { ekstrakurikulerFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  createEkstrakurikuler,
  deleteEkstrakurikuler,
  getEkstrakurikulerById,
  getEkstrakurikulerBySlug,
  listEkstrakurikuler,
  listEkstrakurikulerFull,
  updateEkstrakurikuler,
} from "../lib/data/ekstrakurikuler";
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

export const ekstrakurikulerRoutes = new Hono<AppEnv>();

ekstrakurikulerRoutes.get("/", async (c) => {
  try {
    const status = c.req.query("status") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
      | undefined;
    const page = Number(c.req.query("page") ?? "1");
    const limit = Number(c.req.query("limit") ?? "50");
    const full = c.req.query("full") === "1";
    const includeTotal = c.req.query("includeTotal") !== "0";

    if (!status || status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }

    if (full && status === "PUBLISHED") {
      const items = await listEkstrakurikulerFull(c.env, "PUBLISHED");
      return okListJson(c, items, {
        page: 1,
        limit: items.length,
        total: items.length,
      });
    }

    const result = await listEkstrakurikuler(c.env, {
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

ekstrakurikulerRoutes.post("/", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = ekstrakurikulerFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const created = await createEkstrakurikuler(c.env, {
      ...parsed.data,
      previewUrl: parsed.data.previewUrl || undefined,
      jadwalRingkas: parsed.data.jadwalRingkas || undefined,
      lokasiLatihan: parsed.data.lokasiLatihan || undefined,
      pembinaNama: parsed.data.pembinaNama || undefined,
    });

    if (shouldRebuildForSiteContentStatus(created.status)) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `ekstrakurikuler:create:${created.slug}`),
      );
    }

    return okJson(c, created, 201);
  } catch (err) {
    return handleApiError(c, err);
  }
});

ekstrakurikulerRoutes.get("/id/:id", async (c) => {
  try {
    await requireCmsSession(c.req.raw, c.env);
    const item = await getEkstrakurikulerById(c.env, c.req.param("id"));
    if (!item) {
      return errJson(c, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
    }
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

ekstrakurikulerRoutes.get("/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const byId = await getEkstrakurikulerById(c.env, key);
    if (byId) {
      if (byId.status !== "PUBLISHED") {
        await requireCmsSession(c.req.raw, c.env);
      }
      return okJson(c, byId);
    }
    const publishedOnly =
      !c.req.header("Authorization")?.startsWith("Bearer ");
    const bySlug = await getEkstrakurikulerBySlug(
      c.env,
      key,
      publishedOnly,
    );
    if (!bySlug) {
      return errJson(c, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
    }
    if (bySlug.status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }
    return okJson(c, bySlug);
  } catch (err) {
    return handleApiError(c, err);
  }
});

ekstrakurikulerRoutes.patch("/:key", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const key = c.req.param("key");
    const existing =
      (await getEkstrakurikulerById(c.env, key)) ??
      (await getEkstrakurikulerBySlug(c.env, key, false));
    if (!existing) {
      return errJson(c, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
    }

    const json = await c.req.json();
    const parsed = ekstrakurikulerFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const updated = await updateEkstrakurikuler(c.env, existing.id, {
      ...parsed.data,
      previewUrl: parsed.data.previewUrl || undefined,
      jadwalRingkas: parsed.data.jadwalRingkas || undefined,
      lokasiLatihan: parsed.data.lokasiLatihan || undefined,
      pembinaNama: parsed.data.pembinaNama || undefined,
    });

    if (
      updated &&
      (shouldRebuildForSiteContentStatus(updated.status) ||
        shouldRebuildForSiteContentStatus(existing.status))
    ) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `ekstrakurikuler:update:${updated.slug}`),
      );
    }

    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});

ekstrakurikulerRoutes.delete("/:key", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const key = c.req.param("key");
    const existing =
      (await getEkstrakurikulerById(c.env, key)) ??
      (await getEkstrakurikulerBySlug(c.env, key, false));
    if (!existing) {
      return errJson(c, "NOT_FOUND", "Ekstrakurikuler tidak ditemukan.", 404);
    }
    await deleteEkstrakurikuler(c.env, existing.id);
    if (shouldRebuildForSiteContentStatus(existing.status)) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `ekstrakurikuler:delete:${existing.slug}`),
      );
    }
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});
