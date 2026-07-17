import type {
  BreadcrumbList,
  FAQPage,
  Graph,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";

import { AI_SEARCH_FAQ_ITEMS } from "@/lib/ai-search-faq";
import { BRAND_MAPS_URL, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import {
  getLocalSeoLogoUrl,
  getLocalSeoPageConfig,
  type LocalSeoPageId,
} from "@/lib/seo/local-pages";
import { LOCAL_SEO_SCHOOL, SEO_PRIMARY_LANGUAGE } from "@/lib/seo/school";
import { buildLandingAbsoluteUrl } from "@/lib/seo/urls";
import {
  PUBLIK_CONTACT_EMAIL,
  PUBLIK_CONTACT_HOURS,
  PUBLIK_CONTACT_WA_DISPLAY,
} from "@/lib/kontak-publik";

export type LocalSeoBreadcrumbItem = {
  name: string;
  path?: string;
};

/**
 * EducationalOrganization + School + HighSchool JSON-LD.
 * Typed loosely for multi-@type; shape validated against schema.org conventions.
 */
export function buildEducationalOrganizationJsonLd(): Record<string, unknown> {
  const homeUrl = buildLandingAbsoluteUrl("/");
  const tentangUrl = buildLandingAbsoluteUrl("/tentang-smk-teknovo");

  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "School", "HighSchool"],
    "@id": `${homeUrl}#organization`,
    name: BRAND_SCHOOL_FULL,
    alternateName: [
      BRAND_SHORT,
      "SMK TEKNOVO",
      "SMK Teknovo",
      "SMK Teknologi dan Vokasional Miftahul Huda",
      "SMK TEKNOVO Pamanukan",
      "SMK TEKNOVO Subang",
    ],
    url: tentangUrl,
    logo: getLocalSeoLogoUrl(),
    description: `SMK vokasi berakreditasi ${LOCAL_SEO_SCHOOL.accreditation} di ${LOCAL_SEO_SCHOOL.fullLocationLabel}. NPSN ${LOCAL_SEO_SCHOOL.npsn}. Jurusan Teknik Mesin & Unit Layanan Wisata dengan PPDB online, LMS hybrid, CBT, dan absensi digital.`,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "NPSN",
      value: LOCAL_SEO_SCHOOL.npsn,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: LOCAL_SEO_SCHOOL.streetAddress,
      addressLocality: `${LOCAL_SEO_SCHOOL.subLocality}, ${LOCAL_SEO_SCHOOL.locality}`,
      addressRegion: `${LOCAL_SEO_SCHOOL.administrativeArea}, ${LOCAL_SEO_SCHOOL.region}`,
      postalCode: LOCAL_SEO_SCHOOL.postalCode,
      addressCountry: LOCAL_SEO_SCHOOL.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LOCAL_SEO_SCHOOL.geo.lat,
      longitude: LOCAL_SEO_SCHOOL.geo.lng,
    },
    areaServed: [
      ...LOCAL_SEO_SCHOOL.areaServed.map((name) => ({
        "@type": "AdministrativeArea" as const,
        name,
      })),
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: LOCAL_SEO_SCHOOL.geo.lat,
          longitude: LOCAL_SEO_SCHOOL.geo.lng,
        },
        geoRadius: "120000",
        description:
          "Wilayah layanan informasi & PPDB — Pamanukan, Subang, koridor Jakarta–Bekasi–Karawang",
      },
    ],
    knowsAbout: [
      "Pendidikan vokasi",
      "Teknik Mesin",
      "Pariwisata",
      "Unit Layanan Wisata",
      "Learning Management System",
      "Computer-Based Test",
      "PPDB online",
      "Pendidikan kejuruan Jawa Barat",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Program Kejuruan SMK TEKNOVO",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Teknik Mesin (TM)",
            educationalProgramMode: "full-time",
            provider: { "@type": "EducationalOrganization", name: BRAND_SCHOOL_FULL },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Unit Layanan Wisata (ULW)",
            educationalProgramMode: "full-time",
            provider: { "@type": "EducationalOrganization", name: BRAND_SCHOOL_FULL },
          },
        },
      ],
    },
    sameAs: [homeUrl, BRAND_MAPS_URL, LOCAL_SEO_SCHOOL.npsnProofUrl],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: PUBLIK_CONTACT_EMAIL,
      telephone: PUBLIK_CONTACT_WA_DISPLAY,
      hoursAvailable: PUBLIK_CONTACT_HOURS,
      availableLanguage: ["Indonesian", "English"],
      areaServed: "ID",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: `Akreditasi ${LOCAL_SEO_SCHOOL.accreditation}`,
    },
  };
}

/** @deprecated Prefer buildEducationalOrganizationJsonLd */
export const buildLocalEducationalOrganizationJsonLd = buildEducationalOrganizationJsonLd;

export function buildWebSiteJsonLd(): WithContext<WebSite> {
  const homeUrl = buildLandingAbsoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    name: BRAND_SCHOOL_FULL,
    alternateName: [BRAND_SHORT, "SMK TEKNOVO"],
    url: homeUrl,
    inLanguage: SEO_PRIMARY_LANGUAGE,
    publisher: {
      "@type": "EducationalOrganization",
      name: BRAND_SCHOOL_FULL,
      url: buildLandingAbsoluteUrl("/tentang-smk-teknovo"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${buildLandingAbsoluteUrl("/berita/berita-terbaru")}?q={search_term_string}`,
      },
      // Google SearchAction convention (schema-dts SearchAction omits query-input)
      "query-input": "required name=search_term_string",
    } as WithContext<WebSite>["potentialAction"],
  };
}

/** @deprecated Prefer buildWebSiteJsonLd */
export const buildLocalWebSiteJsonLd = buildWebSiteJsonLd;

export function buildLocalWebPageJsonLd(pageId: LocalSeoPageId): WithContext<WebPage> {
  const page = getLocalSeoPageConfig(pageId);
  const url = buildLandingAbsoluteUrl(page.path);
  const home = buildLandingAbsoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: page.title,
    description: page.description,
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

export function buildAiSearchFaqPageJsonLd(limit?: number): WithContext<FAQPage> {
  const items = limit ? AI_SEARCH_FAQ_ITEMS.slice(0, limit) : AI_SEARCH_FAQ_ITEMS;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer,
      },
    })),
  };
}

function stripJsonLdContext(node: Record<string, unknown>): Record<string, unknown> {
  const { "@context": _ctx, ...rest } = node;
  return rest;
}

/** JSON-LD @graph untuk beranda — Organization + WebSite + FAQ + WebPage + Breadcrumb. */
export function buildHomePageJsonLdGraph(): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      stripJsonLdContext(buildEducationalOrganizationJsonLd()),
      stripJsonLdContext(buildWebSiteJsonLd() as unknown as Record<string, unknown>),
      stripJsonLdContext(buildLocalWebPageJsonLd("home") as unknown as Record<string, unknown>),
      stripJsonLdContext(buildAiSearchFaqPageJsonLd(5) as unknown as Record<string, unknown>),
      stripJsonLdContext(
        buildBreadcrumbJsonLd(buildLocalSeoBreadcrumbsForPage("home")) as unknown as Record<
          string,
          unknown
        >,
      ),
    ] as unknown as Graph["@graph"],
  };
}

export function buildBreadcrumbJsonLd(
  items: readonly LocalSeoBreadcrumbItem[],
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: buildLandingAbsoluteUrl(item.path) } : {}),
    })),
  };
}

/** @deprecated Prefer buildBreadcrumbJsonLd */
export const buildLocalBreadcrumbJsonLd = buildBreadcrumbJsonLd;

export function buildLocalSeoBreadcrumbsForPage(
  pageId: LocalSeoPageId,
): readonly LocalSeoBreadcrumbItem[] {
  const page = getLocalSeoPageConfig(pageId);

  if (pageId === "home") {
    return [{ name: "Beranda" }];
  }

  if (pageId === "tentang-smk-teknovo") {
    return [{ name: "Beranda", path: "/" }, { name: page.h1 }];
  }

  if (pageId === "smk-terbaik-pamanukan" || pageId === "smk-vokasi-pamanukan-subang") {
    return [
      { name: "Beranda", path: "/" },
      { name: "Profil", path: "/profil/sambutan" },
      { name: page.h1 },
    ];
  }

  return [{ name: "Beranda", path: "/" }, { name: page.h1 }];
}
