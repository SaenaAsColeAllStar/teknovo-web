/**
 * Menu situs publik — dipakai navbar `apps/web` dan `apps/admissions` (satu sumber, layout sama).
 * Hanya tautan ke route yang benar-benar ada di `apps/web` atau `/ppdb/` pada origin yang sama.
 */
export type PublicSiteNavLeaf = {
  label: string;
  href: string;
  /** Keterangan singkat untuk mobile / tooltip opsional */
  description?: string;
};

export type PublicSiteNavGroup = {
  type: "group";
  id: "profil" | "kesiswaan" | "akademik" | "fasilitas" | "berita" | "kontak";
  label: string;
  items: readonly PublicSiteNavLeaf[];
};

export type PublicSiteNavLink = {
  type: "link";
  label: string;
  href: string;
};

export type PublicSiteNavEntry = PublicSiteNavGroup | PublicSiteNavLink;

/** Tautan ke portal autentikasi (app console, Clerk `/sign-in`). */
export const PUBLIC_SITE_PORTAL_LOGIN_HREF = "/sign-in" as const;

/** Tautan PPDB — item terakhir `PUBLIC_SITE_MAIN_NAV` (selaras footer & mobile dock). */
export const PUBLIC_SITE_PPDB_HREF = "/ppdb/" as const;
export const PUBLIC_SITE_PPDB_DAFTAR_HREF = "/ppdb/daftar" as const;
export const PUBLIC_SITE_NAV_PPDB_CTA_LABEL = "PPDB" as const;

/** Urutan menu desktop & mobile (SMK pada umumnya, disesuaikan konten TEKNOVO). */
export const PUBLIC_SITE_MAIN_NAV: readonly PublicSiteNavEntry[] = [
  { type: "link", label: "Beranda", href: "/" },
  {
    type: "group",
    id: "profil",
    label: "Profil",
    items: [
      { label: "Sambutan Kepala Sekolah", href: "/profil/sambutan" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Sejarah Sekolah", href: "/profil/sejarah" },
      { label: "Program Keahlian", href: "/profil/program-sekolah" },
    ],
  },
  {
    type: "group",
    id: "akademik",
    label: "Akademik",
    items: [
      { label: "Ringkasan Jurusan", href: "/akademik" },
      { label: "Kurikulum", href: "/akademik/kurikulum" },
      { label: "Program Jurusan", href: "/akademik/jurusan" },
      { label: "Tenaga Pengajar", href: "/akademik/pengajar" },
    ],
  },
  {
    type: "group",
    id: "kesiswaan",
    label: "Kesiswaan",
    items: [
      { label: "Ringkasan Kesiswaan", href: "/kesiswaan" },
      { label: "Ekstrakurikuler", href: "/kesiswaan/ekstrakurikuler" },
      { label: "Prestasi", href: "/kesiswaan/prestasi" },
    ],
  },
  {
    type: "group",
    id: "fasilitas",
    label: "Fasilitas",
    items: [
      { label: "Ringkasan Fasilitas", href: "/fasilitas" },
      { label: "Absensi Digital", href: "/fasilitas/absensi-digital" },
      { label: "Lab Komputer", href: "/fasilitas/laboratorium-komputer" },
      { label: "Perpustakaan Digital", href: "/fasilitas/perpustakaan-digital" },
      { label: "LMS Sekolah", href: "/fasilitas/lms-sekolah" },
    ],
  },
  {
    type: "group",
    id: "berita",
    label: "Berita",
    items: [
      { label: "Berita Terbaru", href: "/berita/berita-terbaru" },
      { label: "Berita Kegiatan Sekolah", href: "/berita/kegiatan-sekolah" },
    ],
  },
  {
    type: "group",
    id: "kontak",
    label: "Kontak",
    items: [
      { label: "Lokasi & Peta", href: "/kontak" },
      { label: "Telepon Tata Usaha", href: "tel:+622123456789" },
      { label: "Email Sekolah", href: "mailto:info@smateknovo.sch.id" },
    ],
  },
  { type: "link", label: PUBLIC_SITE_NAV_PPDB_CTA_LABEL, href: PUBLIC_SITE_PPDB_HREF },
] as const;

export type PublicSiteFooterSection = {
  title: string;
  links: readonly PublicSiteNavLeaf[];
};

/** Kolom tautan footer situs publik — empat band IA selaras `PUBLIC_SITE_MAIN_NAV`. */
export const PUBLIC_SITE_FOOTER_SECTIONS: readonly PublicSiteFooterSection[] = [
  {
    title: "Profil",
    links: [
      { label: "Sambutan Kepala Sekolah", href: "/profil/sambutan" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Sejarah Sekolah", href: "/profil/sejarah" },
      { label: "Program Keahlian", href: "/profil/program-sekolah" },
    ],
  },
  {
    title: "Akademik",
    links: [
      { label: "Ringkasan Jurusan", href: "/akademik" },
      { label: "Kurikulum", href: "/akademik/kurikulum" },
      { label: "Program Jurusan", href: "/akademik/jurusan" },
      { label: "Tenaga Pengajar", href: "/akademik/pengajar" },
    ],
  },
  {
    title: "Kesiswaan & Fasilitas",
    links: [
      { label: "Ringkasan Kesiswaan", href: "/kesiswaan" },
      { label: "Ekstrakurikuler", href: "/kesiswaan/ekstrakurikuler" },
      { label: "Prestasi", href: "/kesiswaan/prestasi" },
      { label: "Fasilitas Sekolah", href: "/fasilitas" },
      { label: "LMS Sekolah", href: "/fasilitas/lms-sekolah" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { label: "Berita Terbaru", href: "/berita/berita-terbaru" },
      { label: "Kegiatan Sekolah", href: "/berita/kegiatan-sekolah" },
      { label: "Kontak & Lokasi", href: "/kontak" },
      { label: "PPDB", href: PUBLIC_SITE_PPDB_HREF },
    ],
  },
] as const;
