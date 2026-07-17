import type { Metadata } from "next";
import type { ReactElement } from "react";

import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { LocalSeoPageShell } from "@/components/features/landing/local-seo/LocalSeoPageShell";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

export const metadata: Metadata = buildLocalSeoPageMetadata("smk-pamanukan");

export default function SmkPamanukanPage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="smk-pamanukan" />
      <LocalSeoPageShell pageId="smk-pamanukan" />
    </>
  );
}
