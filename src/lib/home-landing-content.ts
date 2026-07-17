import { BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";

/** Watermark tipografi besar di hero beranda. */
export const HOME_HERO_WATERMARK = BRAND_SHORT;

export const HOME_HERO_TITLE = "Kompetensi kejuruan untuk masa depan" as const;

export const HOME_HERO_LEDE =
  `${BRAND_SCHOOL_FULL} menyiapkan siswa melalui praktik bengkel, PKL, dan layanan digital yang terukur.` as const;

export const HOME_HERO_CTA_LABEL = "Lihat PPDB" as const;

export const HOME_HERO_CTA_EXPLORE_HREF = "/profil/program-sekolah" as const;

/** @deprecated Diganti CTA tunggal di hero foto. */
export const HOME_HERO_EYEBROW = "SMK · Pendidikan menengah kejuruan" as const;

/** @deprecated Diganti `HOME_HERO_CTA_LABEL`. */
export const HOME_HERO_CTA_PPDB_LABEL = HOME_HERO_CTA_LABEL;

/** @deprecated Hero foto memakai satu CTA. */
export const HOME_HERO_CTA_EXPLORE_LABEL = "Profil & program sekolah" as const;

/**
 * Teks marquee beranda — tanpa tanggal/prestasi spesifik yang belum diverifikasi.
 * Perbarui daftar ini atau sumber CMS saat pengumuman resmi tersedia.
 */
export const HOME_FLASH_MARQUEE_ITEMS: readonly string[] = [
  "Jadwal dan gelombang PPDB diumumkan melalui halaman PPDB resmi sekolah—pantau pembaruan di sini.",
  "Informasi kegiatan siswa dan prestasi dipublikasikan setelah verifikasi admin sekolah.",
  "Orang tua dapat memantau presensi dan capaian akademik melalui layanan digital (sesuai kebijakan akses sekolah).",
] as const;

export const HOME_FLASH_MARQUEE_LABEL = "Informasi" as const;

export const HOME_FINAL_CTA_EYEBROW = "Pendaftaran peserta didik baru" as const;

export const HOME_FINAL_CTA_TITLE = "Kenali program sekolah, lalu lanjutkan ke PPDB" as const;

export const HOME_FINAL_CTA_BODY =
  "Telusuri jurusan, kurikulum, dan fasilitas di situs ini. Proses pendaftaran mengikuti ketentuan gelombang yang diumumkan di portal PPDB—tanpa janji kuota atau jadwal di luar pengumuman resmi." as const;

export const HOME_FINAL_CTA_PPDB_LABEL = "Buka portal PPDB" as const;

export const HOME_METADATA_DESCRIPTION =
  `Portal resmi ${BRAND_SHORT} untuk orang tua dan calon siswa: profil sekolah, program kejuruan, fasilitas, berita, dan PPDB ${BRAND_SCHOOL_FULL}.` as const;

/** Pesan fallback bila berkas video hero belum diunggah. */
export const HOME_HERO_VIDEO_FALLBACK_TITLE = "Sorotan sekolah" as const;

export const HOME_HERO_VIDEO_FALLBACK_BODY =
  "Cuplikan video kegiatan belajar dan kehidupan siswa akan ditampilkan di sini. Sementara itu, jelajahi profil sekolah, program kejuruan, dan PPDB melalui menu di atas." as const;
