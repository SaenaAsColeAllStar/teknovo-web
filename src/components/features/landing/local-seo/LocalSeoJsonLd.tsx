import type { ReactElement } from "react";

import type { LocalSeoPageId } from "@/lib/seo/local-pages";
import { JsonLdScript } from "@/lib/seo/json-ld";
import {
  buildAiSearchFaqPageJsonLd,
  buildEducationalOrganizationJsonLd,
  buildHomePageJsonLdGraph,
  buildLocalBreadcrumbJsonLd,
  buildLocalSeoBreadcrumbsForPage,
  buildLocalWebPageJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/structured-data";

type LocalSeoJsonLdProps = {
  pageId: LocalSeoPageId;
  includeWebSite?: boolean;
  includeFaq?: boolean;
  useGraph?: boolean;
  faqLimit?: number;
};

/** JSON-LD terstruktur untuk halaman SEO lokal (server component). */
export function LocalSeoJsonLd({
  pageId,
  includeWebSite = false,
  includeFaq = false,
  useGraph = false,
  faqLimit,
}: LocalSeoJsonLdProps): ReactElement {
  if (useGraph && pageId === "home") {
    return <JsonLdScript data={buildHomePageJsonLdGraph()} />;
  }

  const breadcrumb = buildLocalBreadcrumbJsonLd(buildLocalSeoBreadcrumbsForPage(pageId));
  const resolvedFaqLimit = faqLimit ?? (pageId === "home" && includeFaq ? 5 : undefined);

  return (
    <>
      <JsonLdScript data={buildEducationalOrganizationJsonLd()} />
      {includeWebSite ? <JsonLdScript data={buildWebSiteJsonLd()} /> : null}
      {includeFaq ? <JsonLdScript data={buildAiSearchFaqPageJsonLd(resolvedFaqLimit)} /> : null}
      <JsonLdScript data={buildLocalWebPageJsonLd(pageId)} />
      <JsonLdScript data={breadcrumb} />
    </>
  );
}
