import { Hono } from "hono";
import {
  kategoriFormSchema,
  zPengaturanSitusPublikPatch,
} from "@teknovo/shared";
import {
  requireCmsAdmin,
  requireCmsSession,
  requireCmsWriter,
  requireCmsMediaUploader,
  CmsAuthError,
} from "../auth/cms-auth";
import { d1AnalyticsOverview } from "../lib/d1/analytics-repo";
import {
  d1CreateKategori,
  d1DeleteKategori,
  d1ListKategori,
  d1UpdateKategori,
} from "../lib/d1/kategori-repo";
import {
  d1GetPengaturan,
  d1UpsertPengaturan,
} from "../lib/d1/pengaturan-repo";
import { triggerWebRebuild } from "../lib/rebuild-web";
import { safeEqualSecret } from "../lib/secrets";
import {
  errJson,
  handleApiError,
  okJson,
  type AppEnv,
} from "../lib/http";
import {
  CMS_MEDIA_ALLOWED_TYPES,
  CMS_MEDIA_MAX_BYTES,
  deleteCmsUpload,
  listCmsUploads,
  putCmsUpload,
} from "../media/cms-media";
import { cmsRoleCanWriteKategori } from "@teknovo/shared";

export const kategoriRoutes = new Hono<AppEnv>();

kategoriRoutes.get("/", async (c) => {
  try {
    const items = await d1ListKategori(c.env.DB);
    return okJson(c, items);
  } catch (err) {
    return handleApiError(c, err);
  }
});

kategoriRoutes.post("/", async (c) => {
  try {
    const session = await requireCmsSession(c.req.raw, c.env);
    if (!cmsRoleCanWriteKategori(session.role)) {
      throw new CmsAuthError("Tidak dapat menambah kategori.", 403);
    }
    const json = await c.req.json();
    const parsed = kategoriFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }
    const created = await d1CreateKategori(c.env.DB, parsed.data);
    return okJson(c, created, 201);
  } catch (err) {
    return handleApiError(c, err);
  }
});

kategoriRoutes.patch("/:id", async (c) => {
  try {
    await requireCmsWriter(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = kategoriFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }
    const updated = await d1UpdateKategori(
      c.env.DB,
      c.req.param("id"),
      parsed.data,
    );
    if (!updated) return errJson(c, "NOT_FOUND", "Kategori tidak ditemukan.", 404);
    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});

kategoriRoutes.delete("/:id", async (c) => {
  try {
    await requireCmsWriter(c.req.raw, c.env);
    const ok = await d1DeleteKategori(c.env.DB, c.req.param("id"));
    if (!ok) return errJson(c, "NOT_FOUND", "Kategori tidak ditemukan.", 404);
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});

export const pengaturanRoutes = new Hono<AppEnv>();

pengaturanRoutes.get("/", async (c) => {
  try {
    const data = await d1GetPengaturan(c.env.DB);
    return okJson(c, data);
  } catch (err) {
    return handleApiError(c, err);
  }
});

pengaturanRoutes.patch("/", async (c) => {
  try {
    await requireCmsAdmin(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = zPengaturanSitusPublikPatch.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }
    const data = await d1UpsertPengaturan(c.env.DB, parsed.data);
    c.executionCtx.waitUntil(triggerWebRebuild(c.env, "pengaturan:update"));
    return okJson(c, data);
  } catch (err) {
    return handleApiError(c, err);
  }
});

export const analyticsRoutes = new Hono<AppEnv>();

analyticsRoutes.get("/overview", async (c) => {
  try {
    await requireCmsSession(c.req.raw, c.env);
    const data = await d1AnalyticsOverview(c.env.DB);
    return okJson(c, data);
  } catch (err) {
    return handleApiError(c, err);
  }
});

export const mediaRoutes = new Hono<AppEnv>();

mediaRoutes.get("/", async (c) => {
  try {
    await requireCmsSession(c.req.raw, c.env);
    const cursor = c.req.query("cursor") ?? undefined;
    const limit = Number(c.req.query("limit") ?? "100");
    const result = await listCmsUploads(c.env, { cursor, limit });
    return okJson(c, result);
  } catch (err) {
    return handleApiError(c, err);
  }
});

mediaRoutes.post("/", async (c) => {
  try {
    await requireCmsMediaUploader(c.req.raw, c.env);
    const form = await c.req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return errJson(c, "VALIDATION", "Field file wajib.", 400);
    }
    if (file.size > CMS_MEDIA_MAX_BYTES) {
      return errJson(c, "PAYLOAD_TOO_LARGE", "Maksimal 8 MiB.", 413);
    }
    if (!CMS_MEDIA_ALLOWED_TYPES.has(file.type)) {
      return errJson(c, "UNSUPPORTED", "Tipe file tidak diizinkan.", 415);
    }
    const obj = await putCmsUpload(c.env, file, file.name, file.type);
    return okJson(c, obj, 201);
  } catch (err) {
    return handleApiError(c, err);
  }
});

mediaRoutes.delete("/", async (c) => {
  try {
    await requireCmsWriter(c.req.raw, c.env);
    const body = (await c.req.json()) as { key?: string };
    if (!body.key) return errJson(c, "VALIDATION", "key wajib.", 400);
    await deleteCmsUpload(c.env, body.key);
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});

export const hooksRoutes = new Hono<AppEnv>();

hooksRoutes.post("/rebuild-web", async (c) => {
  try {
    const secret = c.env.REBUILD_WEB_SECRET?.trim();
    if (!secret || secret.startsWith("GANTI_") || secret.length < 16) {
      return errJson(
        c,
        "UNCONFIGURED",
        "REBUILD_WEB_SECRET belum di-set (min. 16 karakter).",
        503,
      );
    }

    const auth = c.req.header("Authorization");
    const body = (await c.req.json().catch(() => ({}))) as {
      secret?: string;
      reason?: string;
    };
    // Prefer Authorization: Bearer; body.secret accepted for legacy callers.
    const provided =
      (auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "") ||
      (typeof body.secret === "string" ? body.secret.trim() : "");

    if (!provided || !safeEqualSecret(provided, secret)) {
      return errJson(c, "UNAUTHORIZED", "Secret tidak valid.", 401);
    }

    const reason =
      typeof body.reason === "string" && body.reason.trim()
        ? body.reason.trim().slice(0, 200)
        : "manual";
    const result = await triggerWebRebuild(c.env, reason);
    return okJson(c, result);
  } catch (err) {
    return handleApiError(c, err);
  }
});

export const webhookRoutes = new Hono<AppEnv>();

webhookRoutes.post("/clerk", async (c) => {
  const secret = c.env.CLERK_WEBHOOK_SECRET;
  if (!secret || secret.startsWith("GANTI_")) {
    return errJson(
      c,
      "UNCONFIGURED",
      "CLERK_WEBHOOK_SECRET belum di-set.",
      503,
    );
  }
  // Svix verification can be added later; accept and ack for Free Worker lightness.
  await c.req.text();
  return okJson(c, { received: true });
});
