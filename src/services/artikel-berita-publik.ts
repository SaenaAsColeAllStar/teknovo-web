import type { BeritaRelatedItem } from "@/lib/berita-seo";

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
};

export type BeritaSitemapEntry = {
  slug: string;
  lastModified: Date;
};

/** Tanpa Postgres di CF — artikel siswa dari API homelab (belum wired); kosong aman. */
export async function getPublishedArtikelSiswaCards(_limit = 48): Promise<ArtikelSiswaPublikCard[]> {
  return [];
}

export async function getArtikelSiswaPublikBySlug(_slug: string): Promise<ArtikelSiswaPublikDetail | null> {
  return null;
}

export async function getRelatedArtikelSiswa(
  _excludeSlug: string,
  _limit = 3,
): Promise<BeritaRelatedItem[]> {
  return [];
}

export async function listPublishedArtikelSiswaSitemapEntries(): Promise<BeritaSitemapEntry[]> {
  return [];
}
