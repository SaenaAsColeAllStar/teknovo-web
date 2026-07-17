import type { ReactElement } from "react";

import { buildBeritaBreadcrumbJsonLd, type BeritaBreadcrumbJsonLdInput } from "@/lib/berita-seo";

type BeritaBreadcrumbJsonLdProps = {
  input: BeritaBreadcrumbJsonLdInput;
};

export function BeritaBreadcrumbJsonLd({ input }: BeritaBreadcrumbJsonLdProps): ReactElement {
  const jsonLd = buildBeritaBreadcrumbJsonLd(input);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
