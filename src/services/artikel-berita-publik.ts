import type { BeritaRelatedItem } from "@/lib/berita-seo";
import { getBeritaSiswaDetailPath } from "@/lib/berita-seo";
import {
  fetchArtikelSiswaBySlugOrNull,
  fetchArtikelSiswaListOrNull,
} from "@/lib/api-client";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import type {
  ArtikelSiswa,
  ArtikelSiswaListItem,
} from "@/types/artikel-siswa";

export type ArtikelSiswaPublikCard = {
  id: string;
  slugPublik: string;
  judul: string;
  ringkasan: string;
  tanggalIso: string;
  penulisNama: string;
  penulisKelas: string;
  coverSrc: string;
};

export type ArtikelSiswaPublikDetail = {
  slugPublik: string;
  judul: string;
  ringkasan: string;
  konten: string;
  publishedAt: Date;
  penulisNama: string;
  penulisKelas: string;
  coverSrc: string;
  coverAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImageOverride: string | null;
  kategori: string | null;
  canonicalUrl: string | null;
};

export type BeritaSitemapEntry = {
  slug: string;
  lastModified: Date;
};

const FALLBACK_COVER = LANDING_MEDIA.berita.ekstrakurikulerWebp;

function listItemToCard(item: ArtikelSiswaListItem): ArtikelSiswaPublikCard {
  const tanggalIso = item.publishedAt ?? new Date().toISOString();
  return {
    id: item.id,
    slugPublik: item.slug,
    judul: item.judul,
    ringkasan: item.ringkasan?.trim() || item.judul,
    tanggalIso,
    penulisNama: item.penulis?.nama?.trim() || "Siswa",
    penulisKelas: item.penulis?.kelas?.trim() || "—",
    coverSrc: item.coverUrl?.trim() || FALLBACK_COVER,
  };
}

function artikelToDetail(row: ArtikelSiswa): ArtikelSiswaPublikDetail {
  const publishedAt = row.publishedAt
    ? new Date(row.publishedAt)
    : new Date(row.updatedAt || row.createdAt);
  return {
    slugPublik: row.slug,
    judul: row.judul,
    ringkasan: row.ringkasan?.trim() || row.judul,
    konten: row.konten,
    publishedAt,
    penulisNama: row.penulis?.nama?.trim() || "Siswa",
    penulisKelas: row.penulis?.kelas?.trim() || "—",
    coverSrc: row.coverUrl?.trim() || FALLBACK_COVER,
    coverAlt: null,
    metaTitle: row.metaTitle?.trim() || null,
    metaDescription: row.metaDescription?.trim() || row.ringkasan,
    metaKeywords: row.metaKeywords?.trim() || null,
    ogImageOverride: row.ogImageUrl?.trim() || row.coverUrl,
    kategori: row.kategori?.nama ?? null,
    canonicalUrl: row.canonicalUrl?.trim() || null,
  };
}

/** Artikel siswa published — kosong aman saat API down (tanpa fallback lokal). */
export async function getPublishedArtikelSiswaCards(
  limit = 48,
): Promise<ArtikelSiswaPublikCard[]> {
  const fromApi = await fetchArtikelSiswaListOrNull({
    page: 1,
    limit,
    status: "PUBLISHED",
  });
  if (fromApi === null) return [];
  return fromApi.map(listItemToCard);
}

export async function getArtikelSiswaPublikBySlug(
  slug: string,
): Promise<ArtikelSiswaPublikDetail | null> {
  const fromApi = await fetchArtikelSiswaBySlugOrNull(slug);
  if (fromApi === undefined || fromApi === null) return null;
  if (fromApi.status !== "PUBLISHED") return null;
  return artikelToDetail(fromApi);
}

export async function getRelatedArtikelSiswa(
  excludeSlug: string,
  limit = 3,
): Promise<BeritaRelatedItem[]> {
  const cards = await getPublishedArtikelSiswaCards(limit + 4);
  return cards
    .filter((item) => item.slugPublik !== excludeSlug)
    .slice(0, limit)
    .map((item) => ({
      href: getBeritaSiswaDetailPath(item.slugPublik),
      judul: item.judul,
      ringkasan: item.ringkasan,
      tanggalIso: item.tanggalIso,
      kind: "siswa" as const,
    }));
}

export async function listPublishedArtikelSiswaSitemapEntries(): Promise<
  BeritaSitemapEntry[]
> {
  const fromApi = await fetchArtikelSiswaListOrNull({
    page: 1,
    limit: 200,
    status: "PUBLISHED",
  });
  if (fromApi === null) return [];
  return fromApi.map((item) => ({
    slug: item.slug,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
  }));
}
