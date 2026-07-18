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

const EKSKUL_DATA: EkskulPublikCard[] = [
  {
    slug: "blogger",
    name: "Blogger Club",
    detail: "Kontributor artikel sekolah dengan moderasi pembina sebelum tayang.",
    fullDescription:
      "Blogger Club membina literasi digital, penulisan berita, dan etika publikasi konten sekolah.",
    kategori: "TEKNOLOGI",
    previewSrc: LANDING_MEDIA.kegiatan.ekstraBloggerClubWebp,
    relatedAchievements: [
      "Juara 2 Lomba Blog Pelajar Kabupaten",
      "50+ artikel siswa terbit tiap semester",
    ],
  },
  {
    slug: "codingclub",
    name: "Coding Club",
    detail: "Kegiatan pemrograman, web, dan project teknologi siswa.",
    fullDescription:
      "Coding Club berfokus pada pemecahan masalah, kolaborasi tim, dan pembuatan produk digital sederhana.",
    kategori: "TEKNOLOGI",
    previewSrc: LANDING_MEDIA.kegiatan.ekstraCodingClubWebp,
    relatedAchievements: [
      "Finalis Hackathon Pelajar Jawa Barat",
      "Proyek website internal sekolah",
    ],
  },
  {
    slug: "futsal",
    name: "Futsal",
    detail: "Pembinaan fisik, sportivitas, dan kompetisi antar sekolah.",
    fullDescription:
      "Ekskul futsal menekankan disiplin latihan, kerja sama tim, dan gaya hidup sehat.",
    kategori: "OLAHRAGA",
    previewSrc: LANDING_MEDIA.kegiatan.ekstraFutsalWebp,
    relatedAchievements: ["Juara 1 Turnamen Futsal Antar SMK Subang"],
  },
  {
    slug: "paskibra",
    name: "Paskibra",
    detail: "Latihan baris-berbaris, kepemimpinan, dan kedisiplinan.",
    fullDescription:
      "Paskibra membentuk karakter, ketegasan, dan tanggung jawab melalui program latihan rutin.",
    kategori: "AKADEMIK",
    previewSrc: LANDING_MEDIA.kegiatan.ekstraPaskibrakaWebp,
    relatedAchievements: [
      "Petugas upacara tingkat kecamatan",
      "Delegasi lomba PBB kabupaten",
    ],
  },
  {
    slug: "pencaksilat",
    name: "Pencak Silat",
    detail: "Pelestarian seni bela diri nusantara dan penguatan mental.",
    fullDescription:
      "Ekskul pencak silat melatih teknik dasar, ketahanan fisik, dan nilai-nilai sportivitas.",
    kategori: "OLAHRAGA",
    previewSrc: LANDING_MEDIA.kegiatan.ekstraPencakSilatWebp,
    relatedAchievements: ["Medali perunggu O2SN tingkat kabupaten"],
  },
];

const PRESTASI_DATA: PrestasiPublikCard[] = [
  {
    id: "prestasi-1",
    judul: "Juara 1 Lomba Robotik Nasional",
    penyelenggara: "Kemendikbud",
    tanggalIso: "2026-03-18T00:00:00.000Z",
    siswaLabel: "Tim Robotik TEKNOVO",
    ringkasan:
      "Tim robotik meraih juara 1 kategori autonomous challenge tingkat nasional.",
    fileUrl:
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200&h=800&fit=crop&q=80",
  },
  {
    id: "prestasi-2",
    judul: "Finalis Hackathon Pelajar Jawa Barat",
    penyelenggara: "Disdik Jabar",
    tanggalIso: "2026-02-07T00:00:00.000Z",
    siswaLabel: "Coding Club",
    ringkasan:
      "Siswa berhasil membangun aplikasi prototipe layanan akademik berbasis web.",
    fileUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop&q=80",
  },
  {
    id: "prestasi-3",
    judul: "Juara 1 Turnamen Futsal Antar SMK Subang",
    penyelenggara: "Forum SMK Subang",
    tanggalIso: "2025-11-22T00:00:00.000Z",
    siswaLabel: "Tim Futsal TEKNOVO",
    ringkasan:
      "Skuad futsal sekolah meraih juara 1 pada turnamen antar SMK se-Kabupaten Subang.",
    fileUrl: LANDING_MEDIA.kegiatan.ekstraFutsalWebp,
  },
  {
    id: "prestasi-4",
    judul: "Juara 2 Lomba Blog Pelajar Kabupaten",
    penyelenggara: "Disdik Kabupaten",
    tanggalIso: "2025-09-14T00:00:00.000Z",
    siswaLabel: "Blogger Club",
    ringkasan:
      "Kontributor Blogger Club meraih juara 2 lomba blog pelajar tingkat kabupaten.",
    fileUrl: LANDING_MEDIA.kegiatan.ekstraBloggerClubWebp,
  },
];

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

export async function getEkskulPublikCards(): Promise<EkskulPublikCard[]> {
  const fromApi = await fetchEkstrakurikulerFullOrNull();
  if (fromApi === null || fromApi.length === 0) return EKSKUL_DATA;
  return fromApi.map(mapEkskul);
}

export async function countEkskulPublikAktif(): Promise<number> {
  const cards = await getEkskulPublikCards();
  return cards.length;
}

export async function getPrestasiPublikTerverifikasi(
  limit = 24,
): Promise<PrestasiPublikCard[]> {
  const fromApi = await fetchPrestasiListOrNull({
    status: "PUBLISHED",
    limit: Math.max(limit, 1),
  });
  if (fromApi === null) {
    return PRESTASI_DATA.slice(0, Math.max(0, limit));
  }
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
