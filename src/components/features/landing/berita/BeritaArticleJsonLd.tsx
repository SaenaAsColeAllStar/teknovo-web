import type { ReactElement } from "react";

import {
  buildBeritaNewsArticleJsonLd,
  type BeritaArticleSeoInput,
} from "@/lib/berita-seo";

type BeritaArticleJsonLdProps = {
  seo: BeritaArticleSeoInput;
};

/** JSON-LD NewsArticle untuk halaman detail berita (server component). */
export function BeritaArticleJsonLd({ seo }: BeritaArticleJsonLdProps): ReactElement {
  const jsonLd = buildBeritaNewsArticleJsonLd(seo);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
