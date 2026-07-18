import { Hono } from "hono";
import { artikelSiswaFormSchema } from "@teknovo/shared";
import {
  requireCmsArtikelWriter,
  requireCmsModerator,
  requireCmsSession,
} from "../auth/cms-auth";
import {
  d1ApproveArtikel,
  d1CreateArtikel,
  d1DeleteArtikel,
  d1GetArtikelById,
  d1GetArtikelBySlug,
  d1ListArtikel,
  d1RejectArtikel,
  d1UpdateArtikel,
} from "../lib/d1/artikel-repo";
import {
  shouldRebuildForArtikelStatus,
  triggerWebRebuild,
} from "../lib/rebuild-web";
import {
  errJson,
  handleApiError,
  okJson,
  okListJson,
  type AppEnv,
} from "../lib/http";

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

    let mineUserId: string | undefined;
    if (!status || status !== "PUBLISHED" || mine) {
      const session = await requireCmsSession(c.req.raw, c.env);
      if (mine) mineUserId = session.userId;
    }

    const result = await d1ListArtikel(c.env.DB, {
      status: status ?? undefined,
      page,
      limit,
      mineUserId,
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
    if (session.role === "siswa" && status === "PUBLISHED") {
      status = "REVIEW";
    }

    const created = await d1CreateArtikel(c.env.DB, {
      ...parsed.data,
      status,
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      penulisId: session.userId,
      penulisNama: session.fullName || session.email || "Siswa",
      penulisKelas: parsed.data.penulisKelas,
    });

    if (shouldRebuildForArtikelStatus(created.status)) {
      c.executionCtx.waitUntil(
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
    const item = await d1GetArtikelById(c.env.DB, c.req.param("id"));
    if (!item) return errJson(c, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

artikelRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let item = await d1GetArtikelById(c.env.DB, id);
    if (!item) {
      const publishedOnly =
        !c.req.header("Authorization")?.startsWith("Bearer ");
      item = await d1GetArtikelBySlug(c.env.DB, id, publishedOnly);
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
    const existing = await d1GetArtikelById(c.env.DB, c.req.param("id"));
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
    if (session.role === "siswa" && status === "PUBLISHED") {
      status = "REVIEW";
    }

    const updated = await d1UpdateArtikel(c.env.DB, existing.id, {
      ...parsed.data,
      status,
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      penulisKelas: parsed.data.penulisKelas,
    });

    if (
      updated &&
      (shouldRebuildForArtikelStatus(updated.status) ||
        shouldRebuildForArtikelStatus(existing.status))
    ) {
      c.executionCtx.waitUntil(
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
    const existing = await d1GetArtikelById(c.env.DB, c.req.param("id"));
    if (!existing) return errJson(c, "NOT_FOUND", "Artikel tidak ditemukan.", 404);
    if (
      session.role === "siswa" &&
      existing.penulis?.id &&
      existing.penulis.id !== session.userId
    ) {
      return errJson(c, "FORBIDDEN", "Hanya milik sendiri.", 403);
    }
    await d1DeleteArtikel(c.env.DB, existing.id);
    if (shouldRebuildForArtikelStatus(existing.status)) {
      c.executionCtx.waitUntil(
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
    const updated = await d1ApproveArtikel(c.env.DB, c.req.param("id"));
    if (!updated) {
      return errJson(
        c,
        "CONFLICT",
        "Artikel tidak dalam status REVIEW.",
        409,
      );
    }
    c.executionCtx.waitUntil(
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
    const updated = await d1RejectArtikel(
      c.env.DB,
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
