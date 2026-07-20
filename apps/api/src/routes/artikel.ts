import { Hono } from "hono";
import { artikelSiswaFormSchema } from "@teknovo/shared";
import {
  requireCmsArtikelWriter,
  requireCmsModerator,
  requireCmsSession,
} from "../auth/cms-auth";
import {
  approveArtikel,
  createArtikel,
  deleteArtikel,
  getArtikelById,
  getArtikelBySlug,
  listArtikel,
  rejectArtikel,
  updateArtikel,
} from "../lib/data/artikel";
import {
  shouldRebuildForArtikelStatus,
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

export const artikelRoutes = new Hono<AppEnv>();

artikelRoutes.get("/", async (c) => {
  try {
    const status = c.req.query("status") as
      | "DRAFT"
      | "REVIEW"
      | "PUBLISHED"
      | "ARCHIVED"
      | undefined;
    const page = Number(c.req.query("page") ?? "1");
    const limit = Number(c.req.query("limit") ?? "20");
    const mine = c.req.query("mine") === "1" || c.req.query("mine") === "true";
    const includeTotal = c.req.query("includeTotal") !== "0";

    let mineUserId: string | undefined;
    if (!status || status !== "PUBLISHED" || mine) {
      const session = await requireCmsSession(c.req.raw, c.env);
      if (mine) mineUserId = session.userId;
    }

    const result = await listArtikel(c.env, {
      status: status ?? undefined,
      page,
      limit,
      mineUserId,
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

artikelRoutes.post("/", async (c) => {
  try {
    const session = await requireCmsArtikelWriter(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = artikelSiswaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    let status = parsed.data.status;
    // Only Super Admin may publish directly; siswa/editor go through REVIEW / approve.
    if (session.role !== "admin" && status === "PUBLISHED") {
      status = "REVIEW";
    }

    const created = await createArtikel(c.env, {
      ...parsed.data,
      status,
      konten: sanitizeArtikelHtml(parsed.data.konten),
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      penulisId: session.userId,
      penulisNama: session.fullName || session.email || "Siswa",
      penulisKelas: parsed.data.penulisKelas,
      metaTitle: parsed.data.metaTitle || undefined,
      metaDescription: parsed.data.metaDescription || undefined,
      metaKeywords: parsed.data.metaKeywords || undefined,
      ogImageUrl: parsed.data.ogImageUrl || undefined,
      canonicalUrl: parsed.data.canonicalUrl || undefined,
    });

    if (shouldRebuildForArtikelStatus(created.status)) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `artikel:create:${created.slug}`),
      );
    }

    return okJson(c, created, 201);
  } catch (err) {
    return handleApiError(c, err);
  }
});

artikelRoutes.get("/id/:id", async (c) => {
  try {
    await requireCmsSession(c.req.raw, c.env);
    const item = await getArtikelById(c.env, c.req.param("id"));
    if (!item) return errJson(c, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

artikelRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let item = await getArtikelById(c.env, id);
    if (!item) {
      const publishedOnly =
        !c.req.header("Authorization")?.startsWith("Bearer ");
      item = await getArtikelBySlug(c.env, id, publishedOnly);
    }
    if (!item) return errJson(c, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
    if (item.status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

artikelRoutes.patch("/:id", async (c) => {
  try {
    const session = await requireCmsArtikelWriter(c.req.raw, c.env);
    const existing = await getArtikelById(c.env, c.req.param("id"));
    if (!existing) return errJson(c, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
    if (
      session.role === "siswa" &&
      existing.penulis?.id &&
      existing.penulis.id !== session.userId
    ) {
      return errJson(c, "FORBIDDEN", "Hanya milik sendiri.", 403);
    }

    const json = await c.req.json();
    const parsed = artikelSiswaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    let status = parsed.data.status;
    // Editors may edit body for moderation but cannot publish without admin approve.
    if (session.role !== "admin" && status === "PUBLISHED") {
      status = "REVIEW";
    }

    const updated = await updateArtikel(c.env, existing.id, {
      ...parsed.data,
      status,
      konten: sanitizeArtikelHtml(parsed.data.konten),
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      penulisKelas: parsed.data.penulisKelas,
      penulisId: existing.penulis?.id ?? session.userId,
      metaTitle: parsed.data.metaTitle || undefined,
      metaDescription: parsed.data.metaDescription || undefined,
      metaKeywords: parsed.data.metaKeywords || undefined,
      ogImageUrl: parsed.data.ogImageUrl || undefined,
      canonicalUrl: parsed.data.canonicalUrl || undefined,
    });

    if (
      updated &&
      (shouldRebuildForArtikelStatus(updated.status) ||
        shouldRebuildForArtikelStatus(existing.status))
    ) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `artikel:update:${updated.slug}`),
      );
    }

    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});

artikelRoutes.delete("/:id", async (c) => {
  try {
    const session = await requireCmsArtikelWriter(c.req.raw, c.env);
    const existing = await getArtikelById(c.env, c.req.param("id"));
    if (!existing) return errJson(c, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
    if (
      session.role === "siswa" &&
      existing.penulis?.id &&
      existing.penulis.id !== session.userId
    ) {
      return errJson(c, "FORBIDDEN", "Hanya milik sendiri.", 403);
    }
    await deleteArtikel(c.env, existing.id);
    if (shouldRebuildForArtikelStatus(existing.status)) {
      scheduleBackground(
        c,
        triggerWebRebuild(c.env, `artikel:delete:${existing.slug}`),
      );
    }
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});

artikelRoutes.post("/:id/approve", async (c) => {
  try {
    await requireCmsModerator(c.req.raw, c.env);
    const updated = await approveArtikel(c.env, c.req.param("id"));
    if (!updated) {
      return errJson(
        c,
        "CONFLICT",
        "Artikel tidak dalam status REVIEW.",
        409,
      );
    }
    scheduleBackground(
        c,
        triggerWebRebuild(c.env, `artikel:approve:${updated.slug}`),
      );
    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});

artikelRoutes.post("/:id/reject", async (c) => {
  try {
    await requireCmsModerator(c.req.raw, c.env);
    const body = (await c.req.json().catch(() => ({}))) as {
      reason?: string;
    };
    const updated = await rejectArtikel(
      c.env,
      c.req.param("id"),
      body.reason,
    );
    if (!updated) {
      return errJson(
        c,
        "CONFLICT",
        "Artikel tidak dalam status REVIEW.",
        409,
      );
    }
    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});
