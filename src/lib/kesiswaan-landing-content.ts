import { BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

/** Ringkasan kesiswaan publik — selaras `/akademik` dan `/fasilitas`. */
export const KESISWAAN_PUBLIC_HUB_HREF = "/kesiswaan" as const;

export const KESISWAAN_HUB_PAGE_TITLE = "Kesiswaan" as const;

export const KESISWAAN_HUB_HERO_EYEBROW = "Kehidupan siswa" as const;

export const KESISWAAN_HUB_PAGE_LEDE =
  `Ringkasan kehidupan siswa di ${BRAND_SHORT}: ekstrakurikuler terstruktur, OSIS, dan prestasi yang diverifikasi sekolah—bahan diskusi orang tua tentang pengembangan di luar kelas.` as const;

export const KESISWAAN_PRESTASI_VARIANT_LEDE =
  "Sorotan pencapaian siswa yang telah diverifikasi admin—motivasi sejawat, dokumentasi sekolah, dan referensi portofolio." as const;

export const KESISWAAN_EKSTRA_VARIANT_LEDE =
  "Aktivitas di luar jam pelajaran inti: klub, OSIS, dan pembinaan karakter—dikelola sekolah dengan jadwal dan pembina yang jelas." as const;

export const KESISWAAN_METADATA_DESCRIPTION = KESISWAAN_HUB_PAGE_LEDE;

export const KESISWAAN_HUB_HERO_IMAGE_SRC = LANDING_MEDIA.kegiatan.ekstraOsisWebp;

export const KESISWAAN_HUB_HERO_CARD_TAGLINE = "Kehidupan siswa terstruktur" as const;

export const KESISWAAN_HUB_HERO_CARD_TITLE =
  "Ekstrakurikuler, OSIS, dan prestasi yang transparan" as const;

export const KESISWAAN_HUB_HERO_CARD_BODY =
  `Setiap unit kegiatan dan pencapaian siswa dikelola melalui sistem sekolah — orang tua dapat memantau perkembangan di luar kelas tanpa menunggu pengumuman manual.` as const;

export const KESISWAAN_PRESTASI_HERO_EYEBROW = "Apresiasi pencapaian" as const;

export const KESISWAAN_PRESTASI_PAGE_TITLE = "Prestasi Siswa" as const;

export const KESISWAAN_PRESTASI_PAGE_LEDE = KESISWAAN_PRESTASI_VARIANT_LEDE;

export const KESISWAAN_PRESTASI_GRID_INTRO =
  "Setiap entri memuat judul lomba, penyelenggara, tanggal, dan bukti yang disetujui. Nama ditampilkan sesuai kebijakan publikasi sekolah." as const;

export const KESISWAAN_PRESTASI_EMPTY_TITLE = "Belum ada prestasi terverifikasi" as const;

export const KESISWAAN_PRESTASI_EMPTY_BODY =
  "Setelah admin menyetujui unggahan bukti dari portal siswa, prestasi akan tampil di halaman ini secara otomatis." as const;

export const KESISWAAN_PRESTASI_PORTAL_NOTE =
  "Siswa aktif dapat mengajukan prestasi baru melalui portal sertifikat prestasi." as const;

export const KESISWAAN_PRESTASI_PORTAL_HREF = "/siswa/sertifikat-prestasi" as const;

export const KESISWAAN_PRESTASI_PORTAL_LINK_LABEL = "Buka portal sertifikat prestasi" as const;

export const KESISWAAN_PRESTASI_FILTER_ALL = "Semua tahun" as const;

export const KESISWAAN_PPDB_CTA = {
  href: PUBLIC_SITE_PPDB_HREF,
  label: "Daftar PPDB",
} as const;

export type KesiswaanSubnavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

/** Sub-nav halaman kehidupan siswa. */
export const KESISWAAN_SUBNAV_ITEMS: readonly KesiswaanSubnavItem[] = [
  { href: KESISWAAN_PUBLIC_HUB_HREF, label: "Ringkasan", exact: true },
  { href: "/kesiswaan/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/kesiswaan/prestasi", label: "Prestasi" },
] as const;
