import type { Metadata } from "next";

import { buildLandingAbsoluteUrl, truncateMetaDescription } from "@/lib/berita-seo";
import { BRAND_LOGO_SRC, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { getFasilitasDetailPath, type FasilitasSlug } from "@/lib/fasilitas-landing-content";
import { getSitePublicOrigin } from "@/lib/keuangan-url";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { PUBLIC_SITE_PORTAL_LOGIN_HREF } from "@/lib/public-site-nav";
import {
  buildPpdbEducationalOrganizationJsonLd,
  PPDB_SCHOOL_ACCREDITATION,
  PPDB_SCHOOL_LOCALITY,
  PPDB_SCHOOL_LOCATION,
  PPDB_SCHOOL_NPSN,
  PPDB_SCHOOL_REGION,
  type BreadcrumbListJsonLd,
  type EducationalOrganizationJsonLd,
} from "@/lib/ppdb-seo";

/** Kata kunci inti LMS & pembelajaran digital SMK TEKNOVO. */
export const LMS_BASE_KEYWORDS = [
  "LMS online SMK",
  "e-learning SMK TEKNOVO",
  "pembelajaran digital Rancasari Subang",
  "portal guru siswa",
  "portal pembelajaran online",
  "LMS sekolah Subang",
  PPDB_SCHOOL_NPSN,
  BRAND_SHORT,
  BRAND_SCHOOL_FULL,
  PPDB_SCHOOL_LOCALITY,
  "Pamanukan",
  "Kabupaten Subang",
] as const;

/** Slug berita LMS yang diseed untuk internal linking. */
export const LMS_BERITA_KEGIATAN_SLUG =
  "platform-lms-online-pembelajaran-hybrid-smk-teknovo-rancasari" as const;

export const LMS_BERITA_KEGIATAN_PATH = `/berita/kegiatan/${LMS_BERITA_KEGIATAN_SLUG}` as const;

/** Rute publik terkait LMS (path relatif, tanpa origin). */
export const LMS_PUBLIC_PATHS = {
  portalLogin: PUBLIC_SITE_PORTAL_LOGIN_HREF,
  fasilitasHub: "/fasilitas",
  fasilitasLms: getFasilitasDetailPath("lms-sekolah"),
  akademikDigital: "/akademik/program-digital",
  akademikKurikulum: "/akademik/kurikulum",
  beritaLms: LMS_BERITA_KEGIATAN_PATH,
  guruPortal: "/guru",
  kurikulumHub: "/kurikulum",
} as const;

export type LmsPageId =
  | "dashboard-login"
  | "guru-portal"
  | "kurikulum-hub"
  | "fasilitas-hub"
  | "fasilitas-lms"
  | "akademik-digital"
  | "akademik-kurikulum";

export type LmsPageSeoInput = {
  pageId: LmsPageId;
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  /** Halaman autentikasi / dashboard privat — tidak diindeks. */
  noIndex?: boolean;
  /** Origin kanonik: landing (default) atau console. */
  origin?: "landing" | "console";
};

export function buildConsoleAbsoluteUrl(path: string): string {
  const base = getSitePublicOrigin() || buildLandingAbsoluteUrl("").replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function resolveLmsOgImageUrl(imagePath?: string): string {
  const src = imagePath?.trim() || LANDING_MEDIA.fasilitas.lmsJpg;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return buildLandingAbsoluteUrl(src.startsWith("/") ? src : `/${src}`);
}

function resolveLmsCanonicalUrl(input: LmsPageSeoInput): string {
  if (input.origin === "console") {
    return buildConsoleAbsoluteUrl(input.path);
  }
  return buildLandingAbsoluteUrl(input.path);
}

export function buildLmsPageMetadata(input: LmsPageSeoInput): Metadata {
  const description = truncateMetaDescription(input.description);
  const canonical = resolveLmsCanonicalUrl(input);
  const title = input.title;
  const ogImage = resolveLmsOgImageUrl(LANDING_MEDIA.fasilitas.lmsJpg);
  const fullTitle = `${title} | ${BRAND_SHORT}`;
  const keywords = [...LMS_BASE_KEYWORDS, ...(input.keywords ?? [])];
  const robots = input.noIndex ? { index: false, follow: false } : { index: true, follow: true };

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonical,
      title: fullTitle,
      description,
      siteName: BRAND_SCHOOL_FULL,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `LMS ${BRAND_SHORT} — pembelajaran online` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: ogImage, alt: `LMS ${BRAND_SHORT}` }],
    },
    robots,
  };
}

/** Metadata siap pakai per halaman LMS. */
export const LMS_PAGE_SEO: Record<LmsPageId, LmsPageSeoInput> = {
  "dashboard-login": {
    pageId: "dashboard-login",
    title: "Portal LMS SMK TEKNOVO — Pembelajaran Online Terintegrasi",
    description:
      "Portal pembelajaran online SMK TEKNOVO Rancasari Subang — LMS hybrid untuk guru, siswa, dan orang tua. Materi digital, tugas, nilai, dan rapor terintegrasi NPSN 70036813.",
    path: LMS_PUBLIC_PATHS.portalLogin,
    keywords: ["masuk portal", "login siswa guru", "hybrid learning"],
    noIndex: true,
    origin: "console",
  },
  "guru-portal": {
    pageId: "guru-portal",
    title: "Portal Guru SMK TEKNOVO — Agenda & LMS Digital",
    description:
      "Dasbor guru SMK TEKNOVO — jadwal mengajar, absensi kelas, input nilai, e-learning, dan agenda digital terintegrasi portal sekolah Rancasari Subang.",
    path: LMS_PUBLIC_PATHS.guruPortal,
    keywords: ["portal guru", "agenda mengajar", "e-learning guru"],
    noIndex: true,
    origin: "console",
  },
  "kurikulum-hub": {
    pageId: "kurikulum-hub",
    title: "Kurikulum Digital SMK TEKNOVO",
    description:
      "Koordinasi kurikulum digital SMK TEKNOVO — jadwal, penilaian, e-learning, bank soal CBT, dan e-rapor terintegrasi untuk admin kurikulum Rancasari Subang.",
    path: LMS_PUBLIC_PATHS.kurikulumHub,
    keywords: ["kurikulum digital", "admin kurikulum", "e-rapor"],
    noIndex: true,
    origin: "console",
  },
  "fasilitas-hub": {
    pageId: "fasilitas-hub",
    title: "Fasilitas Digital SMK TEKNOVO — LMS, Lab & Absensi",
    description:
      "Fasilitas digital SMK TEKNOVO Rancasari: LMS online, absensi digital, laboratorium komputer, dan perpustakaan digital untuk pembelajaran hybrid Subang.",
    path: LMS_PUBLIC_PATHS.fasilitasHub,
    keywords: ["fasilitas sekolah", "LMS sekolah", "absensi digital"],
  },
  "fasilitas-lms": {
    pageId: "fasilitas-lms",
    title: "LMS Terbaik SMK Subang — Platform E-Learning SMK TEKNOVO Rancasari",
    description:
      "LMS terbaik SMK Subang: platform e-learning hybrid SMK TEKNOVO Pamanukan — materi digital, tugas, evaluasi formatif, portal guru–siswa terintegrasi rapor digital NPSN 70036813.",
    path: LMS_PUBLIC_PATHS.fasilitasLms,
    keywords: [
      "LMS terbaik SMK Subang",
      "LMS online SMK",
      "LMS SMK Pamanukan",
      "platform e-learning",
      "pembelajaran hybrid",
    ],
  },
  "akademik-digital": {
    pageId: "akademik-digital",
    title: "Program Digital SMK TEKNOVO — Portal & E-Learning",
    description:
      "Ekosistem digital SMK TEKNOVO: portal siswa & guru, LMS online, PPDB daring, dan rapor digital — pembelajaran terintegrasi Kurikulum Merdeka di Rancasari Subang.",
    path: LMS_PUBLIC_PATHS.akademikDigital,
    keywords: ["program digital sekolah", "portal siswa", "rapor digital"],
  },
  "akademik-kurikulum": {
    pageId: "akademik-kurikulum",
    title: "Kurikulum SMK TEKNOVO — Merdeka & Pembelajaran Digital",
    description:
      "Kurikulum Merdeka SMK TEKNOVO Rancasari dengan integrasi LMS, asesmen formatif-sumatif, dan rapor digital — transparansi capaian guru, siswa, dan orang tua.",
    path: LMS_PUBLIC_PATHS.akademikKurikulum,
    keywords: ["kurikulum merdeka SMK", "pembelajaran digital", "asesmen formatif"],
  },
};

export function buildLmsDashboardMetadata(pageId: Extract<LmsPageId, "dashboard-login" | "guru-portal" | "kurikulum-hub">): Metadata {
  return buildLmsPageMetadata(LMS_PAGE_SEO[pageId]);
}

export function buildLmsLandingMetadata(pageId: Extract<LmsPageId, "fasilitas-hub" | "fasilitas-lms" | "akademik-digital" | "akademik-kurikulum">): Metadata {
  return buildLmsPageMetadata(LMS_PAGE_SEO[pageId]);
}

export type SoftwareApplicationJsonLd = {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  "@id": string;
  name: string;
  alternateName: string[];
  applicationCategory: string;
  operatingSystem: string;
  description: string;
  url: string;
  image: string;
  inLanguage: string;
  offers: { "@type": "Offer"; price: string; priceCurrency: string };
  provider: { "@type": "EducationalOrganization"; name: string; url: string };
  audience: { "@type": "EducationalAudience"; educationalRole: string };
};

export type WebApplicationJsonLd = {
  "@context": "https://schema.org";
  "@type": "WebApplication";
  "@id": string;
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  browserRequirements: string;
  inLanguage: string;
  provider: { "@type": "EducationalOrganization"; name: string; url: string };
};

export type WebPageJsonLd = {
  "@context": "https://schema.org";
  "@type": "WebPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  isPartOf: { "@type": "WebSite"; name: string; url: string };
  about: { "@type": "SoftwareApplication"; name: string };
};

export function buildLmsEducationalOrganizationJsonLd(): EducationalOrganizationJsonLd {
  return buildPpdbEducationalOrganizationJsonLd();
}

export function buildLmsSoftwareApplicationJsonLd(): SoftwareApplicationJsonLd {
  const lmsUrl = buildLandingAbsoluteUrl(LMS_PUBLIC_PATHS.fasilitasLms);
  const portalUrl = buildConsoleAbsoluteUrl(LMS_PUBLIC_PATHS.portalLogin);
  const orgUrl = buildLandingAbsoluteUrl("/profil/sambutan");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${lmsUrl}#lms`,
    name: `LMS ${BRAND_SHORT}`,
    alternateName: ["LMS SMK TEKNOVO", "Platform E-Learning SMK TEKNOVO", "Portal Pembelajaran Online TEKNOVO"],
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: `Platform LMS online ${BRAND_SCHOOL_FULL} — pembelajaran hybrid, materi digital, tugas, dan evaluasi untuk guru, siswa, dan orang tua di ${PPDB_SCHOOL_LOCATION}.`,
    url: portalUrl,
    image: resolveLmsOgImageUrl(),
    inLanguage: "id-ID",
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
    provider: {
      "@type": "EducationalOrganization",
      name: BRAND_SCHOOL_FULL,
      url: orgUrl,
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student, teacher, parent",
    },
  };
}

export function buildLmsWebApplicationJsonLd(): WebApplicationJsonLd {
  const portalUrl = buildConsoleAbsoluteUrl(LMS_PUBLIC_PATHS.portalLogin);

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${portalUrl}#webapp`,
    name: `Portal LMS ${BRAND_SHORT}`,
    url: portalUrl,
    description: `Portal pembelajaran online terintegrasi ${BRAND_SHORT} — akses LMS, jadwal, nilai, dan layanan akademik untuk guru dan siswa SMK vokasi akreditasi ${PPDB_SCHOOL_ACCREDITATION}.`,
    applicationCategory: "EducationalApplication",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: "id-ID",
    provider: {
      "@type": "EducationalOrganization",
      name: BRAND_SCHOOL_FULL,
      url: buildLandingAbsoluteUrl("/profil/sambutan"),
    },
  };
}

export function buildLmsWebPageJsonLd(input: { name: string; description: string; path: string; origin?: "landing" | "console" }): WebPageJsonLd {
  const url =
    input.origin === "console" ? buildConsoleAbsoluteUrl(input.path) : buildLandingAbsoluteUrl(input.path);
  const home = buildLandingAbsoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: input.name,
    description: truncateMetaDescription(input.description),
    inLanguage: "id-ID",
    isPartOf: {
      "@type": "WebSite",
      name: BRAND_SCHOOL_FULL,
      url: home,
    },
    about: {
      "@type": "SoftwareApplication",
      name: `LMS ${BRAND_SHORT}`,
    },
  };
}

export type LmsBreadcrumbItem = {
  name: string;
  path?: string;
  origin?: "landing" | "console";
};

export function buildLmsBreadcrumbJsonLd(items: readonly LmsBreadcrumbItem[]): BreadcrumbListJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.path
        ? {
            item:
              item.origin === "console"
                ? buildConsoleAbsoluteUrl(item.path)
                : buildLandingAbsoluteUrl(item.path),
          }
        : {}),
    })),
  };
}

/** Entri sitemap publik LMS (landing origin). */
export const LMS_SITEMAP_ENTRIES = [
  { path: "/lms-smk-subang", priority: 0.95, changeFrequency: "weekly" as const },
  { path: LMS_PUBLIC_PATHS.fasilitasLms, priority: 0.92, changeFrequency: "weekly" as const },
  { path: LMS_PUBLIC_PATHS.fasilitasHub, priority: 0.85, changeFrequency: "monthly" as const },
  { path: LMS_PUBLIC_PATHS.akademikDigital, priority: 0.88, changeFrequency: "monthly" as const },
  { path: LMS_PUBLIC_PATHS.akademikKurikulum, priority: 0.82, changeFrequency: "monthly" as const },
  { path: LMS_PUBLIC_PATHS.beritaLms, priority: 0.8, changeFrequency: "monthly" as const },
] as const;

/** Konstanta sekolah untuk dokumentasi noindex (re-export). */
export { PPDB_SCHOOL_NPSN, PPDB_SCHOOL_LOCALITY, PPDB_SCHOOL_REGION, PPDB_SCHOOL_LOCATION };
