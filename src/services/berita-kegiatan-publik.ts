import type { BeritaRelatedItem } from "@/lib/berita-seo";
import { getBeritaKegiatanDetailPath } from "@/lib/berita-seo";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { LMS_BERITA_KEGIATAN_SLUG } from "@/lib/seo/lms";

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
    coverSrc: LANDING_MEDIA.berita.ppdb2026Webp,
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
    coverSrc: LANDING_MEDIA.berita.jurusanTmWebp,
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
  {
    id: "bk-lms-hybrid",
    slug: LMS_BERITA_KEGIATAN_SLUG,
    judul: "Platform LMS Online & Pembelajaran Hybrid",
    ringkasan:
      "Portal pembelajaran daring menghubungkan guru, siswa, dan orang tua—materi, tugas, serta evaluasi formatif dalam satu ekosistem digital sekolah.",
    tanggalIso: "2026-02-01T00:00:00.000Z",
    coverSrc: LANDING_MEDIA.berita.lmsHybridWebp,
    penulisNama: "Humas sekolah",
    konten:
      "<p>SMK Teknovo mengoperasikan LMS untuk pembelajaran hybrid: akses materi, pengumpulan tugas, dan komunikasi kelas dari perangkat yang tersedia.</p><p>Detail fitur dan panduan masuk portal tersedia di halaman fasilitas LMS sekolah.</p>",
    publishedAt: new Date("2026-02-01T00:00:00.000Z"),
    coverAlt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    ogImageOverride: null,
    kategori: null,
  },
  {
    id: "bk-lab-komputer",
    slug: "laboratorium-komputer-siap-praktik",
    judul: "Laboratorium Komputer Siap Praktik Kejuruan",
    ringkasan:
      "Ruang praktik dengan workstation untuk pemrograman, desain, dan simulasi—mendukung proyek siswa serta persiapan sertifikasi kompetensi.",
    tanggalIso: "2026-01-20T00:00:00.000Z",
    coverSrc: LANDING_MEDIA.berita.labKomputerWebp,
    penulisNama: "Humas sekolah",
    konten:
      "<p>Laboratorium komputer sekolah dilengkapi perangkat untuk praktik kejuruan dan proyek kelas.</p><p>Kunjungan orang tua serta calon siswa dapat dijadwalkan melalui Tata Usaha.</p>",
    publishedAt: new Date("2026-01-20T00:00:00.000Z"),
    coverAlt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    ogImageOverride: null,
    kategori: null,
  },
  {
    id: "bk-akreditasi",
    slug: "akreditasi-a-komitmen-mutu-sekolah",
    judul: "Akreditasi A: Komitmen Mutu Pendidikan",
    ringkasan:
      "Status akreditasi menegaskan standar pengelolaan, pembelajaran, dan layanan kepada peserta didik serta masyarakat.",
    tanggalIso: "2026-01-10T00:00:00.000Z",
    coverSrc: LANDING_MEDIA.berita.akreditasiAWebp,
    penulisNama: "Humas sekolah",
    konten:
      "<p>SMK Teknovo mempertahankan komitmen mutu melalui akreditasi dan perbaikan berkelanjutan.</p><p>Informasi profil sekolah dan program keahlian dapat dibaca di situs resmi.</p>",
    publishedAt: new Date("2026-01-10T00:00:00.000Z"),
    coverAlt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    ogImageOverride: null,
    kategori: null,
  },
  {
    id: "bk-ekstrakurikuler",
    slug: "ekstrakurikuler-dan-blogger-club",
    judul: "Ekstrakurikuler & Blogger Club",
    ringkasan:
      "Unit kegiatan siswa membina literasi digital, kepemimpinan, olahraga, dan penulisan berita sekolah setelah proses redaksi.",
    tanggalIso: "2025-12-15T00:00:00.000Z",
    coverSrc: LANDING_MEDIA.berita.ekstrakurikulerWebp,
    penulisNama: "Humas sekolah",
    konten:
      "<p>Kegiatan ekstrakurikuler termasuk Blogger Club terbuka bagi siswa sesuai jadwal pembinaan.</p><p>Artikel yang telah disetujui redaksi ditampilkan pada arsip berita terbaru.</p>",
    publishedAt: new Date("2025-12-15T00:00:00.000Z"),
    coverAlt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    ogImageOverride: null,
    kategori: null,
  },
  {
    id: "bk-pkl-industri",
    slug: "praktik-kerja-lapangan-industri",
    judul: "Praktik Kerja Lapangan di Dunia Industri",
    ringkasan:
      "PKL menghubungkan kompetensi kejuruan dengan pengalaman lapangan—persiapan etos kerja dan kesiapan dunia usaha.",
    tanggalIso: "2025-12-01T00:00:00.000Z",
    coverSrc: LANDING_MEDIA.berita.pklIndustriWebp,
    penulisNama: "Humas sekolah",
    konten:
      "<p>Program praktik kerja lapangan menempatkan siswa pada mitra industri sesuai jurusan.</p><p>Informasi jadwal dan persyaratan diumumkan melalui humas serta portal sekolah.</p>",
    publishedAt: new Date("2025-12-01T00:00:00.000Z"),
    coverAlt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    ogImageOverride: null,
    kategori: null,
  },
];

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
