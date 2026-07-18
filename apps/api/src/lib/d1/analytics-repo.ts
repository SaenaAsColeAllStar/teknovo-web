import type { CmsAnalyticsOverview } from "@teknovo/shared";

export async function d1AnalyticsOverview(
  db: D1Database,
): Promise<CmsAnalyticsOverview> {
  const [
    beritaTotal,
    beritaPublished,
    beritaDraft,
    beritaArchived,
    artikelTotal,
    artikelReview,
    artikelPublished,
    kategoriTotal,
  ] = await Promise.all([
    count(db, `SELECT COUNT(*) AS c FROM berita`),
    count(db, `SELECT COUNT(*) AS c FROM berita WHERE status = 'PUBLISHED'`),
    count(db, `SELECT COUNT(*) AS c FROM berita WHERE status = 'DRAFT'`),
    count(db, `SELECT COUNT(*) AS c FROM berita WHERE status = 'ARCHIVED'`),
    count(db, `SELECT COUNT(*) AS c FROM artikel_siswa`),
    count(db, `SELECT COUNT(*) AS c FROM artikel_siswa WHERE status = 'REVIEW'`),
    count(
      db,
      `SELECT COUNT(*) AS c FROM artikel_siswa WHERE status = 'PUBLISHED'`,
    ),
    count(db, `SELECT COUNT(*) AS c FROM kategori`),
  ]);

  return {
    beritaTotal,
    beritaPublished,
    beritaDraft,
    beritaArchived,
    artikelTotal,
    artikelReview,
    artikelPublished,
    kategoriTotal,
    source: "api",
  };
}

async function count(db: D1Database, sql: string): Promise<number> {
  const row = await db.prepare(sql).first<{ c: number }>();
  return Number(row?.c ?? 0);
}
