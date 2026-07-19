import { BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

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

/** Multi-line hub headline (`\\n` → line breaks in FourBandPageSlice). */
export const KESISWAAN_SLICE_HEADLINE =
  "Ekstrakurikuler, OSIS,\ndan prestasi yang transparan" as const;

export const KESISWAAN_SLICE_SUPPORT = KESISWAAN_HUB_PAGE_LEDE;

export const KESISWAAN_SLICE_SHOWCASE_ALT = `Kegiatan kesiswaan ${BRAND_SHORT}` as const;

export const KESISWAAN_SLICE_FEATURES = [
  {
    iconKey: "program" as const,
    title: "Ekstrakurikuler terstruktur",
    body: KESISWAAN_EKSTRA_VARIANT_LEDE,
  },
  {
    iconKey: "prestasi" as const,
    title: "Prestasi terverifikasi",
    body: KESISWAAN_PRESTASI_VARIANT_LEDE,
  },
] as const;

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

/** Blok prestasi blog-style di hub `/kesiswaan` (`#prestasi`). */
export const KESISWAAN_HUB_PRESTASI_TITLE = "Prestasi siswa" as const;

export const KESISWAAN_HUB_PRESTASI_LEDE =
  "Berikut bukti prestasi yang telah terverifikasi oleh admin kesiswaan. Daftar diperbarui otomatis dari sistem. Untuk pengajuan prestasi baru, siswa dapat mengunggah bukti melalui portal." as const;

export const KESISWAAN_HUB_PRESTASI_VIEW_ALL_LABEL = "Lihat semua" as const;

export const KESISWAAN_HUB_PRESTASI_VIEW_ALL_HREF = "/kesiswaan/prestasi" as const;

export const KESISWAAN_HUB_PRESTASI_READ_MORE_LABEL = "Baca selengkapnya" as const;

export const KESISWAAN_HUB_PRESTASI_CATEGORY_FALLBACK = "Prestasi" as const;

export const KESISWAAN_HUB_PRESTASI_AUTHOR_FALLBACK = BRAND_SHORT as const;

export const KESISWAAN_HUB_NEWSLETTER_TITLE = "Daftar buletin sekolah" as const;

export const KESISWAAN_HUB_NEWSLETTER_LEDE =
  "Terima sorotan prestasi, kegiatan kesiswaan, dan pengumuman resmi lewat email — tanpa spam." as const;

export const KESISWAAN_HUB_NEWSLETTER_EMAIL_PLACEHOLDER = "Alamat email Anda" as const;

export const KESISWAAN_HUB_NEWSLETTER_SUBMIT_LABEL = "Berlangganan" as const;

export const KESISWAAN_HUB_NEWSLETTER_PRIVACY_BEFORE =
  "Dengan berlangganan, Anda menyetujui " as const;

export const KESISWAAN_HUB_NEWSLETTER_PRIVACY_LINK_LABEL = "kebijakan privasi" as const;

export const KESISWAAN_HUB_NEWSLETTER_PRIVACY_AFTER =
  " sekolah. Kami hanya memakai email untuk buletin resmi." as const;

export const KESISWAAN_HUB_NEWSLETTER_PRIVACY_HREF = "/kontak" as const;

export const KESISWAAN_HUB_NEWSLETTER_MAIL_SUBJECT = "Daftar buletin sekolah" as const;

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
