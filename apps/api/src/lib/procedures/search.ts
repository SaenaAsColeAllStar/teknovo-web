import type { BeritaStatus, PrismaClient } from "@prisma/client";

export type SearchBeritaHit = {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  coverUrl: string | null;
  status: BeritaStatus;
  publishedAt: Date | null;
  rank: number;
};

type SearchRow = {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  cover_url: string | null;
  status: BeritaStatus;
  published_at: Date | null;
  rank: number;
};

/** Call `fn_search_berita` — ILIKE + pg_trgm similarity (P1). */
export async function searchBerita(
  prisma: PrismaClient,
  query: string,
  limit = 20,
): Promise<SearchBeritaHit[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const rows = await prisma.$queryRaw<SearchRow[]>`
    SELECT * FROM fn_search_berita(${trimmed}, ${limit}::int)
  `;

  return rows.map((row) => ({
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    ringkasan: row.ringkasan,
    coverUrl: row.cover_url,
    status: row.status,
    publishedAt: row.published_at,
    rank: Number(row.rank),
  }));
}
