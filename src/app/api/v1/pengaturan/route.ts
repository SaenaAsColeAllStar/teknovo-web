import { requireCmsAdmin } from "@/lib/cms-auth";
import { getDb } from "@/lib/d1";
import { d1GetPengaturan, d1UpsertPengaturan } from "@/lib/d1/pengaturan-repo";
import { errJson, handleCmsApiError, okJson } from "@/lib/d1/http";
import { zPengaturanSitusPublikPatch } from "@/lib/validations/pengaturan-situs-publik";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const data = await d1GetPengaturan(db);
    return okJson(data);
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireCmsAdmin();
    const json = await request.json();
    const parsed = zPengaturanSitusPublikPatch.safeParse(json);
    if (!parsed.success) {
      return errJson(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }
    const db = await getDb();
    const saved = await d1UpsertPengaturan(db, parsed.data);
    return okJson(saved);
  } catch (err) {
    return handleCmsApiError(err);
  }
}
