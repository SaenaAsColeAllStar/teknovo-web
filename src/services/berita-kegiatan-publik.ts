import type { BeritaRelatedItem } from "@/lib/berita-seo";
import { getBeritaKegiatanDetailPath } from "@/lib/berita-seo";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

export type BeritaKegiatanPublikCard = {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  tanggalIso: string;
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
};

const FALLBACK_BERITA_KEGIATAN: BeritaKegiatanPublikDetail[] = [
  {
    id: "bk-ppdb-g1",
    slug: "pembukaan-gelombang-1-ppdb-2026",
    judul: "Pembukaan Gelombang 1 PPDB 2026/2027",
    ringkasan:
      "Pendaftaran peserta didik baru gelombang pertama dibuka; orang tua dapat memulai lewat WhatsApp resmi atau formulir PPDB.",
    tanggalIso: "2026-03-01T00:00:00.000Z",
    coverSrc: LANDING_MEDIA.ppdb.heroJpg,
    penulisNama: "Humas sekolah",
    konten:
      "<p>SMK Teknovo membuka Penerimaan Peserta Didik Baru tahun ajaran 2026/2027 gelombang pertama.</p><p>Calon siswa dan orang tua dapat memeriksa jadwal, persyaratan berkas, dan kanal pendaftaran pada halaman PPDB resmi sekolah.</p>",
    publishedAt: new Date("2026-03-01T00:00:00.000Z"),
    coverAlt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    ogImageOverride: null,
    kategori: null,
  },
  {
    id: "bk-program-vokasi",
    slug: "program-kejuruan-teknik-mesin-dan-ulw",
    judul: "Program Kejuruan Teknik Mesin & Unit Layanan Wisata",
    ringkasan:
      "Sorotan program keahlian vokasi, praktik industri, dan pembinaan karakter untuk calon siswa jenjang menengah atas.",
    tanggalIso: "2026-02-15T00:00:00.000Z",
    coverSrc: LANDING_MEDIA.misc.aktivitasUmumJpg,
    penulisNama: "Humas sekolah",
    konten:
      "<p>Sekolah menyelenggarakan pendidikan menengah kejuruan dengan fokus kompetensi teknologi, etos kerja, dan kesiapan dunia usaha.</p><p>Informasi jurusan, fasilitas praktik, dan kegiatan siswa tersedia di situs resmi — hubungi Tata Usaha untuk jadwal kunjungan sekolah.</p>",
    publishedAt: new Date("2026-02-15T00:00:00.000Z"),
    coverAlt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    ogImageOverride: null,
    kategori: null,
  },
];


const FALLBACK_COVER = LANDING_MEDIA.misc.aktivitasUmumJpg;

function detailToCard(detail: BeritaKegiatanPublikDetail): BeritaKegiatanPublikCard {
  const { konten: _konten, publishedAt: _publishedAt, ...card } = detail;
  return card;
}

function fallbackCards(limit: number): BeritaKegiatanPublikCard[] {
  return FALLBACK_BERITA_KEGIATAN.slice(0, Math.max(0, limit)).map(detailToCard);
}

function fallbackDetailBySlug(slug: string): BeritaKegiatanPublikDetail | null {
  return FALLBACK_BERITA_KEGIATAN.find((item) => item.slug === slug) ?? null;
}

export async function getPublishedBeritaKegiatanCards(limit = 48): Promise<BeritaKegiatanPublikCard[]> {
  return fallbackCards(limit);
}

export async function getBeritaKegiatanPublikBySlug(
  slug: string,
): Promise<BeritaKegiatanPublikDetail | null> {
  return fallbackDetailBySlug(slug);
}

export async function getRelatedBeritaKegiatan(
  excludeSlug: string,
  limit = 3,
): Promise<BeritaRelatedItem[]> {
  return FALLBACK_BERITA_KEGIATAN.filter((item) => item.slug !== excludeSlug)
    .slice(0, limit)
    .map((item) => ({
      href: getBeritaKegiatanDetailPath(item.slug),
      judul: item.judul,
      ringkasan: item.ringkasan,
      tanggalIso: item.publishedAt.toISOString(),
      kind: "kegiatan" as const,
    }));
}

export type BeritaKegiatanSitemapEntry = {
  slug: string;
  lastModified: Date;
};

export async function listBeritaKegiatanSitemapEntries(): Promise<BeritaKegiatanSitemapEntry[]> {
  return FALLBACK_BERITA_KEGIATAN.map((item) => ({
    slug: item.slug,
    lastModified: item.publishedAt,
  }));
}
