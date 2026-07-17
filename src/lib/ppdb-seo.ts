import type { Metadata } from "next";

import { BRAND_LOGO_SRC, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { LOCAL_SEO_LONG_TAIL_KEYWORDS, LOCAL_SEO_SCHOOL } from "@/lib/local-seo-keywords";
import { buildLocalEducationalOrganizationJsonLd } from "@/lib/local-seo-structured-data";
import { buildLandingAbsoluteUrl, truncateMetaDescription } from "@/lib/berita-seo";
import { PPDB_ACADEMIC_YEAR, PPDB_FAQ_ITEMS } from "@/lib/ppdb-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

/** Fakta sekolah untuk rich results & keyword targeting. */
export const PPDB_SCHOOL_NPSN = "70036813" as const;
export const PPDB_SCHOOL_ACCREDITATION = "A" as const;
export const PPDB_SCHOOL_LOCATION = "Rancasari, Pamanukan, Kabupaten Subang, Jawa Barat" as const;
export const PPDB_SCHOOL_LOCALITY = "Rancasari" as const;
export const PPDB_SCHOOL_REGION = "Jawa Barat" as const;

export const PPDB_JURUSAN_PROGRAMS = [
  {
    id: "tm",
    name: "Teknik Mesin",
    alternateName: "TM",
    description:
      "Program keahlian Teknik Mesin SMK TEKNOVO — praktik mesin, fabrikasi, dan kesiapan kerja industri di Subang.",
  },
  {
    id: "ulw",
    name: "Unit Layanan Wisata",
    alternateName: "ULW",
    description:
      "Program keahlian Unit Layanan Wisata SMK TEKNOVO — layanan pariwisata, hospitality, dan kewirausahaan wisata.",
  },
] as const;

/** Rute publik PPDB (tanpa origin). */
export const PPDB_PUBLIC_PATHS = {
  hub: "/ppdb/",
  daftar: "/ppdb/daftar",
  daftarSukses: "/ppdb/daftar/sukses",
} as const;

export const PPDB_BASE_KEYWORDS = [
  "PPDB SMK TEKNOVO",
  "PPDB SMK Pamanukan",
  "PPDB SMK Subang",
  "PPDB SMK terbaik",
  "PPDB Subang",
  "SMK Rancasari",
  "SMK Pamanukan",
  "SMK terbaik Subang",
  "pendaftaran online SMK",
  "PPDB 2026/2027",
  BRAND_SHORT,
  BRAND_SCHOOL_FULL,
  PPDB_SCHOOL_LOCALITY,
  "Pamanukan",
  "Kabupaten Subang",
  ...LOCAL_SEO_LONG_TAIL_KEYWORDS.filter((k) => k.startsWith("PPDB")),
] as const;

export type PpdbPageId = "hub" | "daftar" | "daftar-sukses";

export type PpdbPageSeoInput = {
  pageId: PpdbPageId;
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  /** Halaman transaksi — tidak diindeks. */
  noIndex?: boolean;
};

export function buildPpdbAbsoluteUrl(path: string): string {
  return buildLandingAbsoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

export function resolvePpdbOgImageUrl(imagePath?: string): string {
  const src = imagePath?.trim() || LANDING_MEDIA.ppdb.heroJpg;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return buildPpdbAbsoluteUrl(src.startsWith("/") ? src : `/${src}`);
}

export function buildPpdbPageMetadata(input: PpdbPageSeoInput): Metadata {
  const description = truncateMetaDescription(input.description);
  const canonical = buildPpdbAbsoluteUrl(input.path);
  const title = input.title;
  const ogImage = resolvePpdbOgImageUrl(LANDING_MEDIA.ppdb.heroJpg);
  const fullTitle = `${title} | ${BRAND_SHORT}`;
  const keywords = [...PPDB_BASE_KEYWORDS, ...(input.keywords ?? [])];
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: `PPDB ${BRAND_SHORT} ${PPDB_ACADEMIC_YEAR}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: ogImage, alt: `PPDB ${BRAND_SHORT}` }],
    },
    robots,
  };
}

/** Metadata siap pakai per halaman PPDB. */
export const PPDB_PAGE_SEO: Record<PpdbPageId, PpdbPageSeoInput> = {
  hub: {
    pageId: "hub",
    title: "PPDB SMK TEKNOVO 2026/2027 Pamanukan Subang — SMK Terbaik Rancasari",
    description:
      "PPDB SMK TEKNOVO Pamanukan Subang TA 2026/2027. Pendaftaran online SMK terbaik Rancasari — jurusan Teknik Mesin & ULW, akreditasi A NPSN 70036813. Jadwal gelombang & syarat berkas.",
    path: PPDB_PUBLIC_PATHS.hub,
    keywords: [
      "PPDB SMK Pamanukan",
      "PPDB SMK Subang",
      "Teknik Mesin",
      "Unit Layanan Wisata",
      "akreditasi A",
      PPDB_SCHOOL_NPSN,
    ],
  },
  daftar: {
    pageId: "daftar",
    title: "Formulir PPDB Online SMK TEKNOVO Subang",
    description:
      "Isi formulir PPDB online SMK TEKNOVO Rancasari Subang. Unggah akta, ijazah SD & SMP/SKL. Pilih jurusan TM atau ULW tahun ajaran 2026/2027.",
    path: PPDB_PUBLIC_PATHS.daftar,
    keywords: ["formulir PPDB", "unggah berkas", "pendaftaran siswa baru"],
  },
  "daftar-sukses": {
    pageId: "daftar-sukses",
    title: "Pendaftaran PPDB Berhasil",
    description: "Konfirmasi pengiriman formulir PPDB SMK TEKNOVO. Simpan nomor pendaftaran dan ikuti langkah verifikasi berkas.",
    path: PPDB_PUBLIC_PATHS.daftarSukses,
    noIndex: true,
  },
};

export function buildPpdbHubMetadata(): Metadata {
  return buildPpdbPageMetadata(PPDB_PAGE_SEO.hub);
}

export function buildPpdbDaftarMetadata(): Metadata {
  return buildPpdbPageMetadata(PPDB_PAGE_SEO.daftar);
}

export function buildPpdbDaftarSuksesMetadata(): Metadata {
  return buildPpdbPageMetadata(PPDB_PAGE_SEO["daftar-sukses"]);
}

export type EducationalOrganizationJsonLd = {
  "@context": "https://schema.org";
  "@type": "EducationalOrganization";
  "@id": string;
  name: string;
  alternateName: string[];
  url: string;
  logo: string;
  description: string;
  identifier: { "@type": "PropertyValue"; propertyID: string; value: string };
  address: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  areaServed:
    | { "@type": "AdministrativeArea"; name: string }
    | Array<{ "@type": "AdministrativeArea"; name: string }>;
  hasCredential: { "@type": "EducationalOccupationalCredential"; credentialCategory: string };
};

export type CourseJsonLd = {
  "@context": "https://schema.org";
  "@type": "Course";
  name: string;
  alternateName?: string;
  description: string;
  provider: { "@type": "EducationalOrganization"; name: string; url: string };
  educationalLevel: string;
  inLanguage: string;
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
  about: { "@type": "EducationalOrganization"; name: string };
};

export type BreadcrumbListJsonLd = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
};

export type FaqPageJsonLd = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
};

export function buildPpdbEducationalOrganizationJsonLd(): EducationalOrganizationJsonLd {
  const org = buildLocalEducationalOrganizationJsonLd();
  const hubUrl = buildPpdbAbsoluteUrl(PPDB_PUBLIC_PATHS.hub);
  return {
    ...org,
    "@id": `${hubUrl}#organization`,
    url: buildLandingAbsoluteUrl("/tentang-smk-teknovo"),
    logo: buildLandingAbsoluteUrl(BRAND_LOGO_SRC),
    description: `SMK vokasi berakreditasi ${LOCAL_SEO_SCHOOL.accreditation} di ${PPDB_SCHOOL_LOCATION}. NPSN ${PPDB_SCHOOL_NPSN}.`,
  } as EducationalOrganizationJsonLd;
}

export function buildPpdbCourseJsonLd(program: (typeof PPDB_JURUSAN_PROGRAMS)[number]): CourseJsonLd {
  const hubUrl = buildPpdbAbsoluteUrl(PPDB_PUBLIC_PATHS.hub);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.name,
    alternateName: program.alternateName,
    description: program.description,
    provider: {
      "@type": "EducationalOrganization",
      name: BRAND_SCHOOL_FULL,
      url: hubUrl,
    },
    educationalLevel: "SMK",
    inLanguage: "id-ID",
  };
}

export function buildPpdbWebPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): WebPageJsonLd {
  const url = buildPpdbAbsoluteUrl(input.path);
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
      "@type": "EducationalOrganization",
      name: BRAND_SCHOOL_FULL,
    },
  };
}

export type PpdbBreadcrumbItem = {
  name: string;
  path?: string;
};

export function buildPpdbBreadcrumbJsonLd(items: readonly PpdbBreadcrumbItem[]): BreadcrumbListJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: buildPpdbAbsoluteUrl(item.path) } : {}),
    })),
  };
}

export function buildPpdbFaqPageJsonLd(): FaqPageJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PPDB_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Entri sitemap PPDB untuk landing app atau ppdb app. */
export const PPDB_SITEMAP_ENTRIES = [
  { path: PPDB_PUBLIC_PATHS.hub, priority: 0.95, changeFrequency: "weekly" as const },
  { path: PPDB_PUBLIC_PATHS.daftar, priority: 0.9, changeFrequency: "weekly" as const },
] as const;
