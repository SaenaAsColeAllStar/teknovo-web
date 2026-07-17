/**
 * Server-only SEO / RSS / llms.txt infrastructure.
 * Import from here (or subpaths) in layouts, pages, and route handlers — never in client components as UI chrome.
 */

export {
  buildLandingAbsoluteUrl,
  buildPpdbAbsoluteUrl,
  resolveBeritaOgImageUrl,
  resolveOgImageUrl,
  truncateMetaDescription,
} from "@/lib/seo/urls";

export {
  LOCAL_SEO_SCHOOL,
  PPDB_SCHOOL_ACCREDITATION,
  PPDB_SCHOOL_LOCALITY,
  PPDB_SCHOOL_LOCATION,
  PPDB_SCHOOL_NPSN,
  PPDB_SCHOOL_REGION,
  SCHOOL_NPSN_PROOF_URL,
  SEO_HTML_LANG,
  SEO_PRIMARY_LANGUAGE,
  SEO_PRIMARY_LOCALE,
} from "@/lib/seo/school";

export { buildSiteVerificationMetadata } from "@/lib/seo/verification";

export {
  LOCAL_SEO_ALL_KEYWORDS,
  LOCAL_SEO_COMPETITOR_AWARE_KEYWORDS,
  LOCAL_SEO_LONG_TAIL_KEYWORDS,
  LOCAL_SEO_PAGES,
  LOCAL_SEO_PRIMARY_KEYWORDS,
  LOCAL_SEO_SITEMAP_ENTRIES,
  buildLocalSeoPageMetadata,
  getLocalSeoLogoUrl,
  getLocalSeoPageConfig,
  resolveLocalSeoOgImageUrl,
  type LocalSeoPageConfig,
  type LocalSeoPageId,
} from "@/lib/seo/local-pages";

export {
  buildBeritaArticleMetadata,
  buildBeritaBreadcrumbJsonLd,
  buildBeritaHubMetadata,
  buildBeritaNewsArticleJsonLd,
  getBeritaKegiatanDetailPath,
  getBeritaSiswaDetailPath,
  type BeritaArticleKind,
  type BeritaArticleSeoInput,
  type BeritaBreadcrumbJsonLdInput,
  type BeritaHubSeoInput,
  type BeritaRelatedItem,
} from "@/lib/seo/berita";

export {
  PPDB_BASE_KEYWORDS,
  PPDB_JURUSAN_PROGRAMS,
  PPDB_PAGE_SEO,
  PPDB_PUBLIC_PATHS,
  PPDB_SITEMAP_ENTRIES,
  buildPpdbBreadcrumbJsonLd,
  buildPpdbCourseJsonLd,
  buildPpdbDaftarMetadata,
  buildPpdbDaftarSuksesMetadata,
  buildPpdbEducationalOrganizationJsonLd,
  buildPpdbFaqPageJsonLd,
  buildPpdbHubMetadata,
  buildPpdbPageMetadata,
  buildPpdbWebPageJsonLd,
  resolvePpdbOgImageUrl,
  type PpdbBreadcrumbItem,
  type PpdbPageId,
  type PpdbPageSeoInput,
} from "@/lib/seo/ppdb";

export {
  LMS_BASE_KEYWORDS,
  LMS_BERITA_KEGIATAN_PATH,
  LMS_BERITA_KEGIATAN_SLUG,
  LMS_PAGE_SEO,
  LMS_PUBLIC_PATHS,
  LMS_SITEMAP_ENTRIES,
  buildConsoleAbsoluteUrl,
  buildLmsBreadcrumbJsonLd,
  buildLmsDashboardMetadata,
  buildLmsEducationalOrganizationJsonLd,
  buildLmsLandingMetadata,
  buildLmsPageMetadata,
  buildLmsSoftwareApplicationJsonLd,
  buildLmsWebApplicationJsonLd,
  buildLmsWebPageJsonLd,
  resolveLmsOgImageUrl,
  type LmsBreadcrumbItem,
  type LmsPageId,
  type LmsPageSeoInput,
} from "@/lib/seo/lms";

export {
  buildAiSearchFaqPageJsonLd,
  buildBreadcrumbJsonLd,
  buildEducationalOrganizationJsonLd,
  buildHomePageJsonLdGraph,
  buildLocalBreadcrumbJsonLd,
  buildLocalEducationalOrganizationJsonLd,
  buildLocalSeoBreadcrumbsForPage,
  buildLocalWebPageJsonLd,
  buildLocalWebSiteJsonLd,
  buildWebSiteJsonLd,
  type LocalSeoBreadcrumbItem,
} from "@/lib/seo/structured-data";

export { buildBeritaRssXml, type BeritaRssItem } from "@/lib/seo/rss";

export { buildLlmsFullTxtContent, buildLlmsTxtContent } from "@/lib/seo/llms";

export { buildSecurityTxtContent } from "@/lib/seo/security";

export { JsonLdScript } from "@/lib/seo/json-ld";
