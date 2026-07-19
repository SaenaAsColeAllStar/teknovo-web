import { LANDING_MEDIA } from "@/lib/public-media-paths";
import {
  fetchEkstrakurikulerFullOrNull,
  fetchPrestasiListOrNull,
} from "@/lib/api-client";
import { getKesiswaanEkstraPublikStats } from "@/services/kesiswaan-publik-stats";
import type { Ekstrakurikuler, PrestasiListItem } from "@teknovo/shared";

export type EkskulPublikKategori = "TEKNOLOGI" | "OLAHRAGA" | "AKADEMIK" | "SENI";

export type EkskulPublikCard = {
  slug: string;
  name: string;
  detail: string;
  fullDescription: string;
  kategori: EkskulPublikKategori;
  previewSrc: string;
  relatedAchievements: string[];
  jadwalRingkas?: string;
  lokasiLatihan?: string;
  pembinaNama?: string;
};

export type PrestasiPublikCard = {
  id: string;
  judul: string;
  penyelenggara: string;
  tanggalIso: string;
  siswaLabel: string;
  ringkasan: string;
  fileUrl: string;
};

function mapEkskul(row: Ekstrakurikuler): EkskulPublikCard {
  return {
    slug: row.slug,
    name: row.name,
    detail: row.detail,
    fullDescription: row.fullDescription,
    kategori: row.kategori,
    previewSrc: row.previewUrl?.trim() || LANDING_MEDIA.misc.aktivitasUmumWebp,
    relatedAchievements: row.relatedAchievements,
    jadwalRingkas: row.jadwalRingkas ?? undefined,
    lokasiLatihan: row.lokasiLatihan ?? undefined,
    pembinaNama: row.pembinaNama ?? undefined,
  };
}

function mapPrestasi(row: PrestasiListItem): PrestasiPublikCard {
  return {
    id: row.id,
    judul: row.judul,
    penyelenggara: row.penyelenggara,
    tanggalIso: row.tanggalIso,
    siswaLabel: row.siswaLabel,
    ringkasan: row.ringkasan,
    fileUrl: row.fileUrl,
  };
}

/** Published ekskul from API. Empty / unreachable / 429 → [] (no mock inventory). */
export async function getEkskulPublikCards(): Promise<EkskulPublikCard[]> {
  const fromApi = await fetchEkstrakurikulerFullOrNull();
  if (fromApi === null || fromApi.length === 0) return [];
  return fromApi.map(mapEkskul);
}

export async function countEkskulPublikAktif(): Promise<number> {
  const cards = await getEkskulPublikCards();
  return cards.length;
}

/** Published prestasi from API. Unreachable / 429 → [] (no mock inventory). */
export async function getPrestasiPublikTerverifikasi(
  limit = 24,
): Promise<PrestasiPublikCard[]> {
  const fromApi = await fetchPrestasiListOrNull({
    status: "PUBLISHED",
    limit: Math.max(limit, 1),
  });
  if (fromApi === null) return [];
  return fromApi.slice(0, Math.max(0, limit)).map(mapPrestasi);
}

export async function getPrestasiPublikCards(
  limit = 24,
): Promise<PrestasiPublikCard[]> {
  return getPrestasiPublikTerverifikasi(limit);
}

export type EkskulPublikHeroStats = {
  unitCount: number;
  kategoriCount: number;
  prestasiCount: number;
};

export async function getEkskulPublikHeroStats(): Promise<EkskulPublikHeroStats> {
  const stats = await getKesiswaanEkstraPublikStats();
  return {
    unitCount: stats.unitCount,
    kategoriCount: stats.kategoriCount,
    prestasiCount: stats.prestasiCount,
  };
}
