import type { PrismaClient } from "@prisma/client";
import type { CmsAnalyticsOverview } from "@teknovo/shared";

type AnalyticsRow = {
  berita_total: bigint;
  berita_published: bigint;
  berita_draft: bigint;
  berita_archived: bigint;
  artikel_total: bigint;
  artikel_review: bigint;
  artikel_published: bigint;
  kategori_total: bigint;
};

/** Call `fn_get_analytics_overview` — single-round-trip dashboard counts. */
export async function getAnalyticsOverview(
  prisma: PrismaClient,
): Promise<CmsAnalyticsOverview> {
  const rows = await prisma.$queryRaw<AnalyticsRow[]>`
    SELECT * FROM fn_get_analytics_overview()
  `;
  const row = rows[0];
  if (!row) {
    throw new Error("fn_get_analytics_overview returned no row");
  }
  return {
    beritaTotal: Number(row.berita_total),
    beritaPublished: Number(row.berita_published),
    beritaDraft: Number(row.berita_draft),
    beritaArchived: Number(row.berita_archived),
    artikelTotal: Number(row.artikel_total),
    artikelReview: Number(row.artikel_review),
    artikelPublished: Number(row.artikel_published),
    kategoriTotal: Number(row.kategori_total),
    source: "api",
  };
}
