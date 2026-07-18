import { requireCmsSession } from "@/lib/cms-auth";
import { getDb } from "@/lib/d1";
import { d1GetBeritaById } from "@/lib/d1/berita-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireCmsSession();
    const { id } = await ctx.params;
    const db = await getDb();
    const row = await d1GetBeritaById(db, id);
    if (!row) return errJson("NOT_FOUND", "Berita tidak ditemukan.", 404);
    return okJson(row);
  } catch (err) {
    return handleCmsApiError(err);
  }
}
