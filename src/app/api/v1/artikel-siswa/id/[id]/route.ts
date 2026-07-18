import { requireCmsSession } from "@/lib/cms-auth";
import { getDb } from "@/lib/d1";
import { d1GetArtikelById } from "@/lib/d1/artikel-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const session = await requireCmsSession();
    const { id } = await ctx.params;
    const db = await getDb();
    const row = await d1GetArtikelById(db, id);
    if (!row) return errJson("NOT_FOUND", "Artikel tidak ditemukan.", 404);
    if (
      session.role === "siswa" &&
      row.penulis?.id &&
      row.penulis.id !== session.userId
    ) {
      return errJson("FORBIDDEN", "Bukan artikel Anda.", 403);
    }
    return okJson(row);
  } catch (err) {
    return handleCmsApiError(err);
  }
}
