import { buildLandingAbsoluteUrl } from "@/lib/berita-seo";
import { AI_SEARCH_FAQ_ITEMS } from "@/lib/ai-search-faq";
import { BRAND_MAPS_URL, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import {
  getLocalSeoLogoUrl,
  getLocalSeoPageConfig,
  LOCAL_SEO_SCHOOL,
  type LocalSeoPageId,
} from "@/lib/local-seo-keywords";
import {
  PUBLIK_CONTACT_EMAIL,
  PUBLIK_CONTACT_HOURS,
  PUBLIK_CONTACT_WA_DISPLAY,
} from "@/lib/kontak-publik";

const AKREDITASI_PROOF_URL =
  "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/70036813";

export type WebSiteJsonLd = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  name: string;
  alternateName: string[];
  url: string;
  inLanguage: string;
  publisher: { "@type": "EducationalOrganization"; name: string; url: string };
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
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

/** JSON-LD organisasi pendidikan — multi-tipe untuk pengenalan entitas AI & mesin pencari. */
export function buildLocalEducationalOrganizationJsonLd(): Record<string, unknown> {
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
    sameAs: [homeUrl, BRAND_MAPS_URL, AKREDITASI_PROOF_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: PUBLIK_CONTACT_EMAIL,
      telephone: PUBLIK_CONTACT_WA_DISPLAY,
      hoursAvailable: PUBLIK_CONTACT_HOURS,
      availableLanguage: ["Indonesian"],
      areaServed: "ID",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: `Akreditasi ${LOCAL_SEO_SCHOOL.accreditation}`,
    },
  };
}

export function buildLocalWebSiteJsonLd(): WebSiteJsonLd {
  const homeUrl = buildLandingAbsoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    name: BRAND_SCHOOL_FULL,
    alternateName: [BRAND_SHORT, "SMK TEKNOVO"],
    url: homeUrl,
    inLanguage: "id-ID",
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
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildLocalWebPageJsonLd(pageId: LocalSeoPageId): WebPageJsonLd {
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

export function buildAiSearchFaqPageJsonLd(limit?: number): FaqPageJsonLd {
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

/** JSON-LD @graph untuk beranda — EducationalOrganization + WebSite + FAQ (5) + WebPage. */
export function buildHomePageJsonLdGraph(): { "@context": "https://schema.org"; "@graph": object[] } {
  return {
    "@context": "https://schema.org",
    "@graph": [
      stripJsonLdContext(buildLocalEducationalOrganizationJsonLd()),
      stripJsonLdContext(buildLocalWebSiteJsonLd()),
      stripJsonLdContext(buildLocalWebPageJsonLd("home")),
      stripJsonLdContext(buildAiSearchFaqPageJsonLd(5)),
      stripJsonLdContext(buildLocalBreadcrumbJsonLd(buildLocalSeoBreadcrumbsForPage("home"))),
    ],
  };
}

export type LocalSeoBreadcrumbItem = {
  name: string;
  path?: string;
};

export function buildLocalBreadcrumbJsonLd(items: readonly LocalSeoBreadcrumbItem[]): BreadcrumbListJsonLd {
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

export function buildLocalSeoBreadcrumbsForPage(pageId: LocalSeoPageId): readonly LocalSeoBreadcrumbItem[] {
  const page = getLocalSeoPageConfig(pageId);

  if (pageId === "home") {
    return [{ name: "Beranda" }];
  }

  if (pageId === "tentang-smk-teknovo") {
    return [
      { name: "Beranda", path: "/" },
      { name: page.h1 },
    ];
  }

  if (pageId === "smk-terbaik-pamanukan" || pageId === "smk-vokasi-pamanukan-subang") {
    return [
      { name: "Beranda", path: "/" },
      { name: "Profil", path: "/profil/sambutan" },
      { name: page.h1 },
    ];
  }

  return [
    { name: "Beranda", path: "/" },
    { name: page.h1 },
  ];
}
