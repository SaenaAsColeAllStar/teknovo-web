import { requireCmsWriter } from "@/lib/cms-auth";
import { kategoriFormSchema } from "@/lib/api-client";
import { getDb } from "@/lib/d1";
import {
  d1DeleteKategori,
  d1UpdateKategori,
} from "@/lib/d1/kategori-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireCmsWriter();
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = kategoriFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid", 400);
    }
    const db = await getDb();
    const updated = await d1UpdateKategori(db, id, parsed.data);
    if (!updated) return errJson("NOT_FOUND", "Kategori tidak ditemukan.", 404);
    return okJson(updated);
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireCmsWriter();
    const { id } = await ctx.params;
    const db = await getDb();
    const ok = await d1DeleteKategori(db, id);
    if (!ok) return errJson("NOT_FOUND", "Kategori tidak ditemukan.", 404);
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleCmsApiError(err);
  }
}
