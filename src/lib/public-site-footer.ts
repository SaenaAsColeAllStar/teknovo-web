/**
 * Tautan portal & referensi pendidikan untuk footer / halaman terkait.
 * Kolom sitemap pemasaran ada di `PUBLIC_SITE_FOOTER_SECTIONS` (`public-site-nav`).
 */

import {
  TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH,
  TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH,
} from "@/lib/auth-sign-in-path";
import { getKeuanganHubUrl, getSitePublicOrigin } from "@/lib/keuangan-url";
import {
  PUBLIC_SITE_FOOTER_SECTIONS,
  PUBLIC_SITE_PORTAL_LOGIN_HREF,
  PUBLIC_SITE_PPDB_HREF,
  type PublicSiteFooterSection,
  type PublicSiteNavLeaf,
} from "@/lib/public-site-nav";

export type PublicSiteFooterLink = PublicSiteNavLeaf & {
  /** Buka tab baru + rel noopener (tautan eksternal). */
  external?: boolean;
};

/** Instansi pemerintah — URL resmi (SMK teknologi & vokasional, wilayah Bekasi / Jabar). */
export const PUBLIC_SITE_FOOTER_GOV_LINKS: readonly PublicSiteFooterLink[] = [
  {
    label: "Kemendikdasmen",
    href: "https://www.kemendikdasmen.go.id/",
    external: true,
  },
  {
    label: "Direktorat Pendidikan Vokasi",
    href: "https://vokasi.kemendikdasmen.go.id/",
    external: true,
  },
  {
    label: "Portal SMK Indonesia",
    href: "https://smk.kemendikdasmen.go.id/",
    external: true,
  },
  {
    label: "Data Pendidikan Kemendikdasmen",
    href: "https://data.kemendikdasmen.go.id/",
    external: true,
  },
  {
    label: "Disdik Provinsi Jawa Barat",
    href: "https://disdik.jabarprov.go.id/",
    external: true,
  },
  {
    label: "Dinas Pendidikan Kota Bekasi",
    href: "https://www.bekasikota.go.id/disdik",
    external: true,
  },
] as const;

/**
 * Path portal kanonik nginx — tanpa token rotasi (footer statis; token habis → 404).
 * Jangan gabungkan `NEXT_PUBLIC_TEKNOVO_CBT_URL` (/cbt) dengan `/ujian/login`.
 */
function publicSitePortalHref(path: string): string {
  const origin = getSitePublicOrigin();
  return origin ? `${origin}${path}` : path;
}

/** Portal operasional sekolah — path stabil selaras nginx (`/ujian/login`, bukan `/cbt/ujian/login`). */
export function getPublicSitePortalFooterLinks(): readonly PublicSiteFooterLink[] {
  return [
    {
      label: "Pendaftaran Siswa Baru (PPDB)",
      href: PUBLIC_SITE_PPDB_HREF,
      description: "Calon siswa baru — informasi & formulir PPDB",
    },
    {
      label: "Portal Sekolah (Beranda Staf)",
      href: publicSitePortalHref(PUBLIC_SITE_PORTAL_LOGIN_HREF),
      description: "Masuk siswa, guru, dan staf sekolah",
    },
    {
      label: "Portal Guru & Agenda Mengajar",
      href: publicSitePortalHref("/guru"),
      description: "Jadwal, absensi, nilai, dan e-learning guru",
    },
    {
      label: "Ujian Online (CBT)",
      href: publicSitePortalHref(TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH),
      description: "Ujian berbasis komputer untuk siswa & guru mapel",
    },
    {
      label: "Keuangan & SPP Siswa",
      href: getKeuanganHubUrl(),
      description: "Modul TU — tagihan SPP & kas sekolah",
    },
    {
      label: "Layanan WhatsApp Sekolah",
      href: publicSitePortalHref(TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH),
      description: "Pesan resmi TU ke orang tua & wali siswa",
    },
  ] as const;
}

export type PublicSiteFooterNavBlock = PublicSiteFooterSection & {
  links: readonly PublicSiteFooterLink[];
};

/** Semua kolom navigasi footer (internal + statis + dinamis). */
export function getPublicSiteFooterNavBlocks(): readonly PublicSiteFooterNavBlock[] {
  return [
    ...PUBLIC_SITE_FOOTER_SECTIONS.map((section) => ({
      ...section,
      links: section.links.map((link) => ({ ...link })),
    })),
    {
      title: "Portal Sistem",
      links: getPublicSitePortalFooterLinks(),
    },
    {
      title: "Referensi Pendidikan",
      links: PUBLIC_SITE_FOOTER_GOV_LINKS,
    },
  ];
}
