import { BRAND_MEDIA, LANDING_MEDIA } from "@/lib/public-media-paths";

/** Lambang resmi SMK Teknovo (R2: `brand/logo.webp`). */
export const BRAND_LOGO_SRC = BRAND_MEDIA.logoWebp;

/** Nama singkat pada logo. */
export const BRAND_SHORT = "TEKNOVO";

/** Wordmark header — baris atas (di samping lambang). */
export const BRAND_WORDMARK_LINE1 = "SMK" as const;

/** Wordmark header — baris bawah (di samping lambang). */
export const BRAND_WORDMARK_LINE2 = "TEKNOLOGI DAN VOKASIONAL" as const;

/** Nama lengkap sekolah (sesuai logo). */
export const BRAND_SCHOOL_FULL = "SMK Teknologi & Vokasional Miftahul Huda Rancasari";

/** Titik lokasi sekolah di Google Maps (lintang, bujur). */
export const BRAND_MAP_COORDS = { lat: -6.3044, lng: 107.816 } as const;

/** Tautan penuh ke lokasi di Google Maps. */
export const BRAND_MAPS_URL =
  `https://www.google.com/maps?q=${BRAND_MAP_COORDS.lat},${BRAND_MAP_COORDS.lng}` as const;

/** Sumber iframe peta (output=embed). */
export const BRAND_MAP_EMBED_URL = `${BRAND_MAPS_URL}&output=embed&hl=id&z=17` as const;

/**
 * Tautan media sosial footer — ganti ke akun resmi sekolah bila sudah tersedia.
 * Maps memakai `BRAND_MAPS_URL`.
 */
export const BRAND_SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/smateknovo/",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@smateknovo",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/smateknovo",
  },
  {
    id: "maps",
    label: "Google Maps",
    href: BRAND_MAPS_URL,
  },
] as const;

/** Foto hero beranda — R2 `media/landing/hero/bg-01.webp`. */
export const BRAND_HERO_IMAGE_SRC = LANDING_MEDIA.hero.bg01Webp;

/** Foto kepala sekolah di blok sambutan — R2 `brand/kepala-sekolah.webp`. */
export const BRAND_KEPALA_FOTO_SRC = BRAND_MEDIA.kepalaSekolahWebp;

/** Nama & jabatan untuk blok sambutan di beranda / profil (sesuaikan dengan SK resmi). */
export const BRAND_KEPALA_NAMA = "Fajar Nugraha Yusman, M.M. P.d" as const;
export const BRAND_KEPALA_JABATAN = "Kepala Sekolah" as const;
