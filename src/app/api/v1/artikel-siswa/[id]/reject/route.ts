import { requireCmsModerator } from "@/lib/cms-auth";
import { getDb } from "@/lib/d1";
import { d1RejectArtikel } from "@/lib/d1/artikel-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  try {
    await requireCmsModerator();
    const { id } = await ctx.params;
    let reason: string | undefined;
    try {
      const body = (await request.json()) as { reason?: string };
      reason = body.reason;
    } catch {
      reason = undefined;
    }
    const db = await getDb();
    const updated = await d1RejectArtikel(db, id, reason);
    if (!updated) {
      return errJson(
        "CONFLICT",
        "Artikel tidak ada atau bukan status REVIEW.",
        409,
      );
    }
    return okJson(updated);
  } catch (err) {
    return handleCmsApiError(err);
  }
}
