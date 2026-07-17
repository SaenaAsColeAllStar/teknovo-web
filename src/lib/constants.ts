/** Branding & site constants — adapted from monorepo `src/lib/branding.ts`. */

export const BRAND_LOGO_SRC = "/brand/logo.png" as const;
export const BRAND_SHORT = "TEKNOVO";
export const BRAND_SCHOOL_FULL =
  "SMK Teknologi & Vokasional Miftahul Huda Rancasari";
export const BRAND_TAGLINE = "SMK Vokasi Akreditasi A · Pamanukan, Subang";

export const BRAND_MAP_COORDS = { lat: -6.3044, lng: 107.816 } as const;
export const BRAND_MAPS_URL =
  `https://www.google.com/maps?q=${BRAND_MAP_COORDS.lat},${BRAND_MAP_COORDS.lng}` as const;
export const BRAND_MAP_EMBED_URL = `${BRAND_MAPS_URL}&output=embed&hl=id&z=17` as const;

export const BRAND_HERO_IMAGE_SRC = "/media/landing/hero/welcome.jpg" as const;
export const BRAND_KEPALA_FOTO_SRC = "/brand/kepala-sekolah.jpg" as const;
export const BRAND_KEPALA_NAMA = "Fajar Nugraha Yusman, M.M. P.d" as const;
export const BRAND_KEPALA_JABATAN = "Kepala Sekolah" as const;

export const SITE_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/tentang-smk-teknovo", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/dashboard/berita", label: "Berita", icon: "Newspaper" },
  { href: "/dashboard/kategori", label: "Kategori", icon: "Tags" },
  { href: "/dashboard/media", label: "Media", icon: "Image" },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: "Settings" },
] as const;

export const CONTACT = {
  address:
    "Jl. Raya Rancasari, Pamanukan, Kabupaten Subang, Jawa Barat",
  email: "info@smkteknovo.sch.id",
  phone: "+62 260 000000",
} as const;
