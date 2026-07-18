/** Branding & site constants — re-export from `branding.ts` (assets on R2). */

export {
  BRAND_HERO_IMAGE_SRC,
  BRAND_KEPALA_FOTO_SRC,
  BRAND_KEPALA_JABATAN,
  BRAND_KEPALA_NAMA,
  BRAND_LOGO_SRC,
  BRAND_MAP_COORDS,
  BRAND_MAP_EMBED_URL,
  BRAND_MAPS_URL,
  BRAND_SCHOOL_FULL,
  BRAND_SHORT,
} from "@/lib/branding";

export const BRAND_TAGLINE = "SMK Vokasi Akreditasi A · Pamanukan, Subang";

export const SITE_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/tentang-smk-teknovo", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/dashboard/berita", label: "Berita", icon: "Newspaper" },
  { href: "/dashboard/artikel", label: "Artikel siswa", icon: "PenLine" },
  { href: "/dashboard/moderasi", label: "Moderasi", icon: "ShieldCheck" },
  { href: "/dashboard/kategori", label: "Kategori", icon: "Tags" },
  { href: "/dashboard/media", label: "Media", icon: "Image" },
  { href: "/dashboard/pengguna", label: "Pengguna", icon: "Users" },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: "Settings" },
] as const;

export const CONTACT = {
  address:
    "Jl. Raya Rancasari, Pamanukan, Kabupaten Subang, Jawa Barat",
  email: "info@smkteknovo.sch.id",
  phone: "+62 260 000000",
} as const;
