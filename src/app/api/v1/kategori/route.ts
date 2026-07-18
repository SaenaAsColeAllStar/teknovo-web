import { requireCmsWriter } from "@/lib/cms-auth";
import { kategoriFormSchema } from "@/lib/api-client";
import { getDb } from "@/lib/d1";
import {
  d1CreateKategori,
  d1ListKategori,
} from "@/lib/d1/kategori-repo";
import { errJson, handleCmsApiError, okJson, okListJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const items = await d1ListKategori(db);
    return okListJson(items, {
      page: 1,
      limit: items.length,
      total: items.length,
    });
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    await requireCmsWriter();
    const json = await request.json();
    const parsed = kategoriFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }
    const db = await getDb();
    const created = await d1CreateKategori(db, parsed.data);
    return okJson(created, { status: 201 });
  } catch (err) {
    return handleCmsApiError(err);
  }
}
