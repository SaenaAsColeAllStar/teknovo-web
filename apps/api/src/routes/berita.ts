import { Hono } from "hono";
import { beritaFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsWriter } from "../auth/cms-auth";
import {
  createBerita,
  deleteBerita,
  getBeritaById,
  getBeritaBySlug,
  listBerita,
  updateBerita,
} from "../lib/data/berita";
import {
  shouldRebuildForBeritaStatus,
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
import { sanitizeArtikelHtml } from "../lib/sanitize-html";

export const beritaRoutes = new Hono<AppEnv>();

beritaRoutes.get("/", async (c) => {
  try {
    const status = c.req.query("status") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
      | undefined;
    const page = Number(c.req.query("page") ?? "1");
    const limit = Number(c.req.query("limit") ?? "20");
    const includeTotal = c.req.query("includeTotal") !== "0";

    // Public: only explicit PUBLISHED. Any other filter (or all statuses) needs auth.
    if (!status || status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }

    const result = await listBerita(c.env, {
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

beritaRoutes.post("/", async (c) => {
  try {
    const session = await requireCmsWriter(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = beritaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const created = await createBerita(c.env, {
      ...parsed.data,
      konten: sanitizeArtikelHtml(parsed.data.konten),
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      metaTitle: parsed.data.metaTitle || undefined,
      metaDescription: parsed.data.metaDescription || undefined,
      metaKeywords: parsed.data.metaKeywords || undefined,
      ogImageUrl: parsed.data.ogImageUrl || undefined,
      canonicalUrl: parsed.data.canonicalUrl || undefined,
      penulisId: session.userId,
      penulisNama: session.fullName || session.email || "Editor",
    });

    if (shouldRebuildForBeritaStatus(created.status)) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `berita:create:${created.slug}`),
      );
    }

    return okJson(c, created, 201);
  } catch (err) {
    return handleApiError(c, err);
  }
});

beritaRoutes.get("/id/:id", async (c) => {
  try {
    await requireCmsSession(c.req.raw, c.env);
    const item = await getBeritaById(c.env, c.req.param("id"));
    if (!item) return errJson(c, "NOT_FOUND", "Berita tidak ditemukan.", 404);
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

beritaRoutes.get("/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const byId = await getBeritaById(c.env, key);
    if (byId) {
      if (byId.status !== "PUBLISHED") {
        await requireCmsSession(c.req.raw, c.env);
      }
      return okJson(c, byId);
    }
    const publishedOnly =
      !c.req.header("Authorization")?.startsWith("Bearer ");
    const bySlug = await getBeritaBySlug(c.env, key, publishedOnly);
    if (!bySlug) return errJson(c, "NOT_FOUND", "Berita tidak ditemukan.", 404);
    if (bySlug.status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }
    return okJson(c, bySlug);
  } catch (err) {
    return handleApiError(c, err);
  }
});

beritaRoutes.patch("/:key", async (c) => {
  try {
    await requireCmsWriter(c.req.raw, c.env);
    const key = c.req.param("key");
    const existing =
      (await getBeritaById(c.env, key)) ??
      (await getBeritaBySlug(c.env, key, false));
    if (!existing) return errJson(c, "NOT_FOUND", "Berita tidak ditemukan.", 404);

    const json = await c.req.json();
    const parsed = beritaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const updated = await updateBerita(c.env, existing.id, {
      ...parsed.data,
      konten: sanitizeArtikelHtml(parsed.data.konten),
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      metaTitle: parsed.data.metaTitle || undefined,
      metaDescription: parsed.data.metaDescription || undefined,
      metaKeywords: parsed.data.metaKeywords || undefined,
      ogImageUrl: parsed.data.ogImageUrl || undefined,
      canonicalUrl: parsed.data.canonicalUrl || undefined,
    });

    if (
      updated &&
      (shouldRebuildForBeritaStatus(updated.status) ||
        shouldRebuildForBeritaStatus(existing.status))
    ) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `berita:update:${updated.slug}`),
      );
    }

    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});

beritaRoutes.delete("/:key", async (c) => {
  try {
    await requireCmsWriter(c.req.raw, c.env);
    const key = c.req.param("key");
    const existing =
      (await getBeritaById(c.env, key)) ??
      (await getBeritaBySlug(c.env, key, false));
    if (!existing) return errJson(c, "NOT_FOUND", "Berita tidak ditemukan.", 404);
    await deleteBerita(c.env, existing.id);
    if (shouldRebuildForBeritaStatus(existing.status)) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `berita:delete:${existing.slug}`),
      );
    }
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});
