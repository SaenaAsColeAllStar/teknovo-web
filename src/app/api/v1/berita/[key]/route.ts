import {
  requireCmsSession,
  requireCmsWriter,
} from "@/lib/cms-auth";
import { beritaFormSchema } from "@/lib/api-client";
import { getDb } from "@/lib/d1";
import {
  d1DeleteBerita,
  d1GetBeritaById,
  d1GetBeritaBySlug,
  d1UpdateBerita,
} from "@/lib/d1/berita-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ key: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const { key } = await ctx.params;
    const db = await getDb();
    const row = UUID_RE.test(key)
      ? await d1GetBeritaById(db, key)
      : await d1GetBeritaBySlug(db, key, true);
    if (!row) return errJson("NOT_FOUND", "Berita tidak ditemukan.", 404);
    if (row.status !== "PUBLISHED") {
      await requireCmsSession();
      const full = UUID_RE.test(key)
        ? row
        : await d1GetBeritaBySlug(db, key, false);
      if (!full) return errJson("NOT_FOUND", "Berita tidak ditemukan.", 404);
      return okJson(full);
    }
    return okJson(row);
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireCmsWriter();
    const { key } = await ctx.params;
    const json = await request.json();
    const parsed = beritaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid", 400);
    }
    const db = await getDb();
    const updated = await d1UpdateBerita(db, key, {
      ...parsed.data,
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      metaTitle: parsed.data.metaTitle || undefined,
      metaDescription: parsed.data.metaDescription || undefined,
      ogImageUrl: parsed.data.ogImageUrl || undefined,
      canonicalUrl: parsed.data.canonicalUrl || undefined,
    });
    if (!updated) return errJson("NOT_FOUND", "Berita tidak ditemukan.", 404);
    return okJson(updated);
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireCmsWriter();
    const { key } = await ctx.params;
    const db = await getDb();
    const ok = await d1DeleteBerita(db, key);
    if (!ok) return errJson("NOT_FOUND", "Berita tidak ditemukan.", 404);
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleCmsApiError(err);
  }
}
