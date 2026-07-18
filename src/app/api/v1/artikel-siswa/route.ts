import { currentUser } from "@clerk/nextjs/server";

import {
  requireCmsArtikelWriter,
  requireCmsSession,
} from "@/lib/cms-auth";
import { artikelSiswaFormSchema } from "@/lib/api-client";
import { getDb } from "@/lib/d1";
import { d1CreateArtikel, d1ListArtikel } from "@/lib/d1/artikel-repo";
import { errJson, handleCmsApiError, okJson, okListJson } from "@/lib/d1/http";
import type { ArtikelSiswaStatus } from "@/types/artikel-siswa";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ArtikelSiswaStatus | null;
    const mine = searchParams.get("mine") === "1";
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");

    let mineUserId: string | undefined;
    if (mine || (status && status !== "PUBLISHED")) {
      const session = await requireCmsSession();
      if (mine || session.role === "siswa") {
        mineUserId = session.userId;
      }
    }

    const db = await getDb();
    const result = await d1ListArtikel(db, {
      status: status ?? undefined,
      mineUserId,
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
    const session = await requireCmsArtikelWriter();
    const user = await currentUser();
    const json = await request.json();
    const parsed = artikelSiswaFormSchema.safeParse(json);
    if (!parsed.success) {
      return errJson(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid",
        400,
      );
    }

    // Siswa may not force PUBLISHED
    let status = parsed.data.status;
    if (session.role === "siswa" && status === "PUBLISHED") {
      status = "REVIEW";
    }

    const db = await getDb();
    const created = await d1CreateArtikel(db, {
      ...parsed.data,
      status,
      coverUrl: parsed.data.coverUrl || undefined,
      kategoriId: parsed.data.kategoriId || undefined,
      penulisKelas: parsed.data.penulisKelas || undefined,
      penulisId: session.userId,
      penulisNama:
        user?.fullName ||
        user?.primaryEmailAddress?.emailAddress ||
        "Siswa",
    });
    return okJson(created, { status: 201 });
  } catch (err) {
    return handleCmsApiError(err);
  }
}
