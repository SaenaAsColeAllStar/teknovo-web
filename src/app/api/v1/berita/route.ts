import { currentUser } from "@clerk/nextjs/server";

import {
  requireCmsSession,
  requireCmsWriter,
} from "@/lib/cms-auth";
import { getDb } from "@/lib/d1";
import {
  d1CreateBerita,
  d1ListBerita,
} from "@/lib/d1/berita-repo";
import { errJson, handleCmsApiError, okJson, okListJson } from "@/lib/d1/http";
import { beritaFormSchema } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
      | null;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");

    // Public published list needs no auth; other statuses require session
    if (status && status !== "PUBLISHED") {
      await requireCmsSession();
    }

    const db = await getDb();
    const result = await d1ListBerita(db, {
      status: status ?? undefined,
      page,
      limit,
    });
    return okListJson(result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (err) {
    return handleCmsApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireCmsWriter();
    const user = await currentUser();
    const json = await request.json();
    const parsed = beritaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid", 400);
    }

    const db = await getDb();
    const created = await d1CreateBerita(db, {
      ...parsed.data,
      ringkasan: parsed.data.ringkasan,
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      metaTitle: parsed.data.metaTitle || undefined,
      metaDescription: parsed.data.metaDescription || undefined,
      ogImageUrl: parsed.data.ogImageUrl || undefined,
      canonicalUrl: parsed.data.canonicalUrl || undefined,
      penulisId: session.userId,
      penulisNama:
        user?.fullName ||
        user?.primaryEmailAddress?.emailAddress ||
        "Editor",
    });
    return okJson(created, { status: 201 });
  } catch (err) {
    return handleCmsApiError(err);
  }
}
