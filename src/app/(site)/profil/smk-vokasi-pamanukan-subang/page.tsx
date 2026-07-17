import type { Metadata } from "next";
import type { ReactElement } from "react";

import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { LocalSeoPageShell } from "@/components/features/landing/local-seo/LocalSeoPageShell";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

export const metadata: Metadata = buildLocalSeoPageMetadata("smk-vokasi-pamanukan-subang");

export default function SmkVokasiPamanukanSubangPage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="smk-vokasi-pamanukan-subang" />
      <LocalSeoPageShell pageId="smk-vokasi-pamanukan-subang" />
    </>
  );
}
