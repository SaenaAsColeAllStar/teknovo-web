import type { ReactElement } from "react";

import {
  buildBeritaBreadcrumbJsonLd,
  type BeritaBreadcrumbJsonLdInput,
} from "@/lib/seo/berita";
import { JsonLdScript } from "@/lib/seo/json-ld";

type BeritaBreadcrumbJsonLdProps = {
  input: BeritaBreadcrumbJsonLdInput;
};

export function BeritaBreadcrumbJsonLd({ input }: BeritaBreadcrumbJsonLdProps): ReactElement {
  return <JsonLdScript data={buildBeritaBreadcrumbJsonLd(input)} />;
}
