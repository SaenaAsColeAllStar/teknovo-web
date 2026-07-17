import { LANDING_MEDIA } from "@/lib/public-media-paths";

/** Lambang resmi SMK Teknovo — `public/brand/logo.png` (perbarui berkas ini untuk rebrand). */
export const BRAND_LOGO_SRC = "/brand/logo.png" as const;

/** Nama singkat pada logo. */
export const BRAND_SHORT = "TEKNOVO";

/** Nama lengkap sekolah (sesuai logo). */
export const BRAND_SCHOOL_FULL = "SMK Teknologi & Vokasional Miftahul Huda Rancasari";

/** Titik lokasi sekolah di Google Maps (lintang, bujur). */
export const BRAND_MAP_COORDS = { lat: -6.3044, lng: 107.816 } as const;

/** Tautan penuh ke lokasi di Google Maps. */
export const BRAND_MAPS_URL =
  `https://www.google.com/maps?q=${BRAND_MAP_COORDS.lat},${BRAND_MAP_COORDS.lng}` as const;

/** Sumber iframe peta (output=embed). */
export const BRAND_MAP_EMBED_URL = `${BRAND_MAPS_URL}&output=embed&hl=id&z=17` as const;

/** Foto hero beranda — `public/media/landing/hero/welcome.jpg`. */
export const BRAND_HERO_IMAGE_SRC = LANDING_MEDIA.hero.welcomeJpg;

/** Foto kepala sekolah di blok sambutan — berkas di `public/brand/`. */
export const BRAND_KEPALA_FOTO_SRC = "/brand/kepala-sekolah.jpg" as const;

/** Nama & jabatan untuk blok sambutan di beranda / profil (sesuaikan dengan SK resmi). */
export const BRAND_KEPALA_NAMA = "Fajar Nugraha Yusman, M.M. P.d" as const;
export const BRAND_KEPALA_JABATAN = "Kepala Sekolah" as const;
