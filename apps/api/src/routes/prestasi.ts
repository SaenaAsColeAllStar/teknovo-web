import { Hono } from "hono";
import { prestasiFormSchema } from "@teknovo/shared";
import { requireCmsSession, requireCmsSiteContentWriter } from "../auth/cms-auth";
import {
  d1CreatePrestasi,
  d1DeletePrestasi,
  d1GetPrestasiById,
  d1ListPrestasi,
  d1UpdatePrestasi,
} from "../lib/d1/prestasi-repo";
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

export const prestasiRoutes = new Hono<AppEnv>();

prestasiRoutes.get("/", async (c) => {
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

    const result = await d1ListPrestasi(c.env.DB, {
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

prestasiRoutes.post("/", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const json = await c.req.json();
    const parsed = prestasiFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const created = await d1CreatePrestasi(c.env.DB, parsed.data);

    if (shouldRebuildForSiteContentStatus(created.status)) {
      c.executionCtx.waitUntil(
        triggerWebRebuild(c.env, `prestasi:create:${created.id}`),
      );
    }

    return okJson(c, created, 201);
  } catch (err) {
    return handleApiError(c, err);
  }
});

prestasiRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const item = await d1GetPrestasiById(c.env.DB, id);
    if (!item) return errJson(c, "NOT_FOUND", "Prestasi tidak ditemukan.", 404);
    if (item.status !== "PUBLISHED") {
      await requireCmsSession(c.req.raw, c.env);
    }
    return okJson(c, item);
  } catch (err) {
    return handleApiError(c, err);
  }
});

prestasiRoutes.patch("/:id", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const existing = await d1GetPrestasiById(c.env.DB, c.req.param("id"));
    if (!existing) {
      return errJson(c, "NOT_FOUND", "Prestasi tidak ditemukan.", 404);
    }

    const json = await c.req.json();
    const parsed = prestasiFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        c,
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    const updated = await d1UpdatePrestasi(c.env.DB, existing.id, parsed.data);

    if (
      updated &&
      (shouldRebuildForSiteContentStatus(updated.status) ||
        shouldRebuildForSiteContentStatus(existing.status))
    ) {
      c.executionCtx.waitUntil(
        triggerWebRebuild(c.env, `prestasi:update:${updated.id}`),
      );
    }

    return okJson(c, updated);
  } catch (err) {
    return handleApiError(c, err);
  }
});

prestasiRoutes.delete("/:id", async (c) => {
  try {
    await requireCmsSiteContentWriter(c.req.raw, c.env);
    const existing = await d1GetPrestasiById(c.env.DB, c.req.param("id"));
    if (!existing) {
      return errJson(c, "NOT_FOUND", "Prestasi tidak ditemukan.", 404);
    }
    await d1DeletePrestasi(c.env.DB, existing.id);
    if (shouldRebuildForSiteContentStatus(existing.status)) {
      c.executionCtx.waitUntil(
        triggerWebRebuild(c.env, `prestasi:delete:${existing.id}`),
      );
    }
    return okJson(c, { deleted: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});
