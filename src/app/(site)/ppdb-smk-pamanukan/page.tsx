import type { Metadata } from "next";
import type { ReactElement } from "react";

import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { LocalSeoPageShell } from "@/components/features/landing/local-seo/LocalSeoPageShell";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

export const metadata: Metadata = buildLocalSeoPageMetadata("ppdb-smk-pamanukan");

export default function PpdbSmkPamanukanPage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="ppdb-smk-pamanukan" />
      <LocalSeoPageShell pageId="ppdb-smk-pamanukan" />
    </>
  );
}
