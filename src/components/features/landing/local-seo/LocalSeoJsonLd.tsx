import type { ReactElement } from "react";

import type { LocalSeoPageId } from "@/lib/local-seo-keywords";
import {
  buildAiSearchFaqPageJsonLd,
  buildHomePageJsonLdGraph,
  buildLocalBreadcrumbJsonLd,
  buildLocalEducationalOrganizationJsonLd,
  buildLocalSeoBreadcrumbsForPage,
  buildLocalWebPageJsonLd,
  buildLocalWebSiteJsonLd,
} from "@/lib/local-seo-structured-data";

type LocalSeoJsonLdProps = {
  pageId: LocalSeoPageId;
  /** Sertakan WebSite + SearchAction (biasanya beranda). */
  includeWebSite?: boolean;
  /** Sertakan FAQPage JSON-LD (halaman tentang / beranda). */
  includeFaq?: boolean;
  /** Pakai pola @graph (beranda). */
  useGraph?: boolean;
};

function JsonLdScript({ data }: { data: object }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** JSON-LD terstruktur untuk halaman SEO lokal (server component). */
export function LocalSeoJsonLd({
  pageId,
  includeWebSite = false,
  includeFaq = false,
  useGraph = false,
}: LocalSeoJsonLdProps): ReactElement {
  if (useGraph && pageId === "home") {
    return <JsonLdScript data={buildHomePageJsonLdGraph()} />;
  }

  const breadcrumb = buildLocalBreadcrumbJsonLd(buildLocalSeoBreadcrumbsForPage(pageId));
  const faqLimit = pageId === "home" && includeFaq ? 5 : undefined;

  return (
    <>
      <JsonLdScript data={buildLocalEducationalOrganizationJsonLd()} />
      {includeWebSite ? <JsonLdScript data={buildLocalWebSiteJsonLd()} /> : null}
      {includeFaq ? <JsonLdScript data={buildAiSearchFaqPageJsonLd(faqLimit)} /> : null}
      <JsonLdScript data={buildLocalWebPageJsonLd(pageId)} />
      <JsonLdScript data={breadcrumb} />
    </>
  );
}
