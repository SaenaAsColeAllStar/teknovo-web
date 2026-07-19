import type { CmsAnalyticsOverview } from "@teknovo/shared";

export async function d1AnalyticsOverview(
  db: D1Database,
): Promise<CmsAnalyticsOverview> {
  const [beritaByStatus, artikelByStatus, kategoriTotal] = await Promise.all([
    countsByStatus(db, "berita"),
    countsByStatus(db, "artikel_siswa"),
    count(db, `SELECT COUNT(*) AS c FROM kategori`),
  ]);

  const beritaPublished = beritaByStatus.get("PUBLISHED") ?? 0;
  const beritaDraft = beritaByStatus.get("DRAFT") ?? 0;
  const beritaArchived = beritaByStatus.get("ARCHIVED") ?? 0;
  const beritaTotal = beritaPublished + beritaDraft + beritaArchived;

  const artikelPublished = artikelByStatus.get("PUBLISHED") ?? 0;
  const artikelReview = artikelByStatus.get("REVIEW") ?? 0;
  const artikelTotal = [...artikelByStatus.values()].reduce((a, b) => a + b, 0);

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

async function countsByStatus(
  db: D1Database,
  table: "berita" | "artikel_siswa",
): Promise<Map<string, number>> {
  const { results } = await db
    .prepare(`SELECT status, COUNT(*) AS c FROM ${table} GROUP BY status`)
    .all<{ status: string; c: number }>();
  const map = new Map<string, number>();
  for (const row of results ?? []) {
    map.set(row.status, Number(row.c ?? 0));
  }
  return map;
}

async function count(db: D1Database, sql: string): Promise<number> {
  const row = await db.prepare(sql).first<{ c: number }>();
  return Number(row?.c ?? 0);
}
