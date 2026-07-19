import type { BeritaRelatedItem } from "@/lib/berita-seo";
import { getBeritaKegiatanDetailPath } from "@/lib/berita-seo";
import {
  fetchBeritaBySlugOrNull,
  fetchBeritaListOrNull,
} from "@/lib/api-client";
import { publicAssetUrl } from "@/lib/r2";
import type { Berita, BeritaListItem } from "@/types/berita";

export type BeritaKegiatanPublikCard = {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  tanggalIso: string;
  /** Absolute cover URL, or empty when missing / invalid. */
  coverSrc: string;
  penulisNama: string;
};

export type BeritaKegiatanPublikDetail = BeritaKegiatanPublikCard & {
  konten: string;
  publishedAt: Date;
  coverAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImageOverride: string | null;
  kategori: string | null;
  canonicalUrl: string | null;
};

/** Resolve CMS cover to an absolute public URL; empty when unset. */
function resolveCoverSrc(coverUrl: string | null | undefined): string {
  const raw = coverUrl?.trim();
  if (!raw) return "";
  return publicAssetUrl(raw);
}

function listItemToCard(item: BeritaListItem): BeritaKegiatanPublikCard {
  const tanggalIso = item.publishedAt ?? new Date().toISOString();
  return {
    id: item.id,
    slug: item.slug,
    judul: item.judul,
    ringkasan: item.ringkasan?.trim() || item.judul,
    tanggalIso,
    coverSrc: resolveCoverSrc(item.coverUrl),
    penulisNama: "Humas sekolah",
  };
}

function beritaToDetail(row: Berita): BeritaKegiatanPublikDetail {
  const publishedAt = row.publishedAt
    ? new Date(row.publishedAt)
    : new Date(row.updatedAt || row.createdAt);
  const coverSrc = resolveCoverSrc(row.coverUrl);
  return {
    id: row.id,
    slug: row.slug,
    judul: row.judul,
    ringkasan: row.ringkasan?.trim() || row.judul,
    tanggalIso: publishedAt.toISOString(),
    coverSrc,
    penulisNama: row.penulis?.nama?.trim() || "Humas sekolah",
    konten: row.konten,
    publishedAt,
    coverAlt: null,
    metaTitle: row.metaTitle?.trim() || null,
    metaDescription: row.metaDescription?.trim() || row.ringkasan,
    metaKeywords: row.metaKeywords?.trim() || null,
    ogImageOverride: resolveCoverSrc(row.ogImageUrl) || coverSrc || null,
    kategori: row.kategori?.nama ?? null,
    canonicalUrl: row.canonicalUrl?.trim() || null,
  };
}

/** Published berita kegiatan — empty when API down (no hardcoded mocks). */
export async function getPublishedBeritaKegiatanCards(
  limit = 48,
): Promise<BeritaKegiatanPublikCard[]> {
  const fromApi = await fetchBeritaListOrNull({
    page: 1,
    limit,
    status: "PUBLISHED",
  });
  if (fromApi === null) return [];
  return fromApi.map(listItemToCard);
}

export async function getBeritaKegiatanPublikBySlug(
  slug: string,
): Promise<BeritaKegiatanPublikDetail | null> {
  const fromApi = await fetchBeritaBySlugOrNull(slug);
  if (fromApi === undefined || fromApi === null) return null;
  if (fromApi.status && fromApi.status !== "PUBLISHED") return null;
  return beritaToDetail(fromApi);
}

export async function getRelatedBeritaKegiatan(
  excludeSlug: string,
  limit = 3,
): Promise<BeritaRelatedItem[]> {
  const cards = await getPublishedBeritaKegiatanCards(limit + 4);
  return cards
    .filter((item) => item.slug !== excludeSlug)
    .slice(0, limit)
    .map((item) => ({
      href: getBeritaKegiatanDetailPath(item.slug),
      judul: item.judul,
      ringkasan: item.ringkasan,
      tanggalIso: item.tanggalIso,
      kind: "kegiatan" as const,
    }));
}

export type BeritaKegiatanSitemapEntry = {
  slug: string;
  lastModified: Date;
};

export async function listBeritaKegiatanSitemapEntries(): Promise<
  BeritaKegiatanSitemapEntry[]
> {
  const fromApi = await fetchBeritaListOrNull({
    page: 1,
    limit: 200,
    status: "PUBLISHED",
  });
  if (fromApi === null) return [];
  return fromApi.map((item) => ({
    slug: item.slug,
    lastModified: item.publishedAt
      ? new Date(item.publishedAt)
      : new Date(),
  }));
}
