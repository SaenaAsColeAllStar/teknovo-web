import type { ReactElement } from "react";

import {
  buildBeritaNewsArticleJsonLd,
  type BeritaArticleSeoInput,
} from "@/lib/seo/berita";
import { JsonLdScript } from "@/lib/seo/json-ld";

type BeritaArticleJsonLdProps = {
  seo: BeritaArticleSeoInput;
};

/** JSON-LD NewsArticle untuk halaman detail berita (server component). */
export function BeritaArticleJsonLd({ seo }: BeritaArticleJsonLdProps): ReactElement {
  return <JsonLdScript data={buildBeritaNewsArticleJsonLd(seo)} />;
}
