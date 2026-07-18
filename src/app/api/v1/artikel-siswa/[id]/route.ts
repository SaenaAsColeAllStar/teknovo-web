import {
  requireCmsArtikelWriter,
  requireCmsSession,
} from "@/lib/cms-auth";
import { artikelSiswaFormSchema } from "@/lib/api-client";
import { getDb } from "@/lib/d1";
import {
  d1DeleteArtikel,
  d1GetArtikelById,
  d1GetArtikelBySlug,
  d1UpdateArtikel,
} from "@/lib/d1/artikel-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const { id: key } = await ctx.params;
    const db = await getDb();
    if (UUID_RE.test(key)) {
      const session = await requireCmsSession();
      const row = await d1GetArtikelById(db, key);
      if (!row) return errJson("NOT_FOUND", "Artikel tidak ditemukan.", 404);
      if (
        session.role === "siswa" &&
        row.penulis?.id &&
        row.penulis.id !== session.userId
      ) {
        return errJson("FORBIDDEN", "Bukan artikel Anda.", 403);
      }
      return okJson(row);
    }
    const published = await d1GetArtikelBySlug(db, key, true);
    if (published) return okJson(published);
    return errJson("NOT_FOUND", "Artikel tidak ditemukan.", 404);
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const session = await requireCmsArtikelWriter();
    const { id: key } = await ctx.params;
    const json = await request.json();
    const parsed = artikelSiswaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }
    const db = await getDb();
    const existing = await d1GetArtikelById(db, key);
    if (!existing) return errJson("NOT_FOUND", "Artikel tidak ditemukan.", 404);
    if (session.role === "siswa" && existing.penulis?.id !== session.userId) {
      return errJson("FORBIDDEN", "Bukan artikel Anda.", 403);
    }
    let status = parsed.data.status;
    if (session.role === "siswa" && status === "PUBLISHED") {
      status = "REVIEW";
    }
    const updated = await d1UpdateArtikel(db, key, {
      ...parsed.data,
      status,
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      penulisKelas: parsed.data.penulisKelas || undefined,
      penulisId: existing.penulis?.id ?? session.userId,
      penulisNama: existing.penulis?.nama,
    });
    return okJson(updated);
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const session = await requireCmsArtikelWriter();
    const { id: key } = await ctx.params;
    const db = await getDb();
    const existing = await d1GetArtikelById(db, key);
    if (!existing) return errJson("NOT_FOUND", "Artikel tidak ditemukan.", 404);
    if (session.role === "siswa" && existing.penulis?.id !== session.userId) {
      return errJson("FORBIDDEN", "Bukan artikel Anda.", 403);
    }
    await d1DeleteArtikel(db, key);
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleCmsApiError(err);
  }
}
