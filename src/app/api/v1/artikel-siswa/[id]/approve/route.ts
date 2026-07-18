import { revalidateArtikelSiswaCache } from "@/lib/cms-revalidate";
import { requireCmsModerator } from "@/lib/cms-auth";
import { getDb } from "@/lib/d1";
import { d1ApproveArtikel } from "@/lib/d1/artikel-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  try {
    await requireCmsModerator();
    const { id } = await ctx.params;
    const db = await getDb();
    const updated = await d1ApproveArtikel(db, id);
    if (!updated) {
      return errJson(
        "CONFLICT",
        "Artikel tidak ada atau bukan status REVIEW.",
        409,
      );
    }
    try {
      await revalidateArtikelSiswaCache(updated.slug);
    } catch {
      /* best-effort */
    }
    return okJson(updated);
  } catch (err) {
    return handleCmsApiError(err);
  }
}
