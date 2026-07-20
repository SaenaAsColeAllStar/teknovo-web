import type { Berita as BeritaModel, BeritaStatus, PrismaClient } from "@prisma/client";

type BeritaRow = {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string;
  cover_url: string | null;
  status: BeritaStatus;
  kategori_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  meta_keywords: string | null;
  penulis_id: string | null;
  penulis_nama: string | null;
  published_at: Date | null;
  sort_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

function mapBeritaRow(row: BeritaRow): BeritaModel {
  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    ringkasan: row.ringkasan,
    konten: row.konten,
    coverUrl: row.cover_url,
    status: row.status,
    kategoriId: row.kategori_id,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImageUrl: row.og_image_url,
    canonicalUrl: row.canonical_url,
    metaKeywords: row.meta_keywords,
    penulisId: row.penulis_id,
    penulisNama: row.penulis_nama,
    publishedAt: row.published_at,
    sortAt: row.sort_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Call `sp_publish_berita` — DRAFT → PUBLISHED with published_at / sort_at.
 * Idempotent if already PUBLISHED; rejects ARCHIVED.
 */
export async function publishBerita(
  prisma: PrismaClient,
  id: string,
): Promise<BeritaModel> {
  const rows = await prisma.$queryRaw<BeritaRow[]>`
    SELECT * FROM sp_publish_berita(${id}::uuid)
  `;
  const row = rows[0];
  if (!row) {
    throw new Error(`sp_publish_berita returned no row for ${id}`);
  }
  return mapBeritaRow(row);
}

export type ArchiveOutdatedResult = {
  beritaArchived: number;
  artikelArchived: number;
};

/** Call `sp_archive_outdated` — archive PUBLISHED content older than threshold. */
export async function archiveOutdated(
  prisma: PrismaClient,
  daysThreshold = 365,
): Promise<ArchiveOutdatedResult> {
  const rows = await prisma.$queryRaw<
    Array<{ berita_archived: bigint; artikel_archived: bigint }>
  >`
    SELECT * FROM sp_archive_outdated(${daysThreshold}::int)
  `;
  const row = rows[0] ?? { berita_archived: 0n, artikel_archived: 0n };
  return {
    beritaArchived: Number(row.berita_archived),
    artikelArchived: Number(row.artikel_archived),
  };
}
