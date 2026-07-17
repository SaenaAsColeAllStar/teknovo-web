import type { Metadata } from "next";
import type {
  BreadcrumbList,
  Course,
  FAQPage,
  WithContext,
} from "schema-dts";

import { BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { LOCAL_SEO_LONG_TAIL_KEYWORDS } from "@/lib/seo/local-pages";
import {
  LOCAL_SEO_SCHOOL,
  PPDB_SCHOOL_LOCATION,
  PPDB_SCHOOL_NPSN,
  SEO_PRIMARY_LANGUAGE,
  SEO_PRIMARY_LOCALE,
} from "@/lib/seo/school";
import { buildEducationalOrganizationJsonLd } from "@/lib/seo/structured-data";
import {
  buildLandingAbsoluteUrl,
  buildPpdbAbsoluteUrl,
  resolveOgImageUrl,
  truncateMetaDescription,
} from "@/lib/seo/urls";
import { PPDB_ACADEMIC_YEAR, PPDB_FAQ_ITEMS } from "@/lib/ppdb-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

export {
  PPDB_SCHOOL_ACCREDITATION,
  PPDB_SCHOOL_LOCALITY,
  PPDB_SCHOOL_LOCATION,
  PPDB_SCHOOL_NPSN,
  PPDB_SCHOOL_REGION,
} from "@/lib/seo/school";

export { buildPpdbAbsoluteUrl };

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
  LOCAL_SEO_SCHOOL.subLocality,
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

export function resolvePpdbOgImageUrl(imagePath?: string): string {
  return resolveOgImageUrl(imagePath, LANDING_MEDIA.ppdb.heroWebp);
}

export function buildPpdbPageMetadata(input: PpdbPageSeoInput): Metadata {
  const description = truncateMetaDescription(input.description);
  const canonical = buildPpdbAbsoluteUrl(input.path);
  const title = input.title;
  const ogImage = resolvePpdbOgImageUrl(LANDING_MEDIA.ppdb.heroWebp);
  const fullTitle = `${title} | ${BRAND_SHORT}`;
  const keywords = [...PPDB_BASE_KEYWORDS, ...(input.keywords ?? [])];
  const robots = input.noIndex ? { index: false, follow: false } : { index: true, follow: true };

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: input.noIndex ? undefined : { [SEO_PRIMARY_LANGUAGE]: canonical },
    },
    openGraph: {
      type: "website",
      locale: SEO_PRIMARY_LOCALE,
      url: canonical,
      title: fullTitle,
      description,
      siteName: BRAND_SCHOOL_FULL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `PPDB ${BRAND_SHORT} ${PPDB_ACADEMIC_YEAR}`,
        },
      ],
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
    description:
      "Konfirmasi pengiriman formulir PPDB SMK TEKNOVO. Simpan nomor pendaftaran dan ikuti langkah verifikasi berkas.",
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

export function buildPpdbEducationalOrganizationJsonLd(): Record<string, unknown> {
  const org = buildEducationalOrganizationJsonLd();
  const hubUrl = buildPpdbAbsoluteUrl(PPDB_PUBLIC_PATHS.hub);
  return {
    ...org,
    "@id": `${hubUrl}#organization`,
    url: buildLandingAbsoluteUrl("/tentang-smk-teknovo"),
    description: `SMK vokasi berakreditasi ${LOCAL_SEO_SCHOOL.accreditation} di ${PPDB_SCHOOL_LOCATION}. NPSN ${PPDB_SCHOOL_NPSN}.`,
  };
}

export function buildPpdbCourseJsonLd(
  program: (typeof PPDB_JURUSAN_PROGRAMS)[number],
): WithContext<Course> {
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
    inLanguage: SEO_PRIMARY_LANGUAGE,
  };
}

export function buildPpdbWebPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): WithContext<import("schema-dts").WebPage> {
  const url = buildPpdbAbsoluteUrl(input.path);
  const home = buildLandingAbsoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: input.name,
    description: truncateMetaDescription(input.description),
    inLanguage: SEO_PRIMARY_LANGUAGE,
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

export function buildPpdbBreadcrumbJsonLd(
  items: readonly PpdbBreadcrumbItem[],
): WithContext<BreadcrumbList> {
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

export function buildPpdbFaqPageJsonLd(): WithContext<FAQPage> {
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

export const PPDB_SITEMAP_ENTRIES = [
  { path: PPDB_PUBLIC_PATHS.hub, priority: 0.95, changeFrequency: "weekly" as const },
  { path: PPDB_PUBLIC_PATHS.daftar, priority: 0.9, changeFrequency: "weekly" as const },
] as const;
