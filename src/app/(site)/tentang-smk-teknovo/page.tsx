import type { Metadata } from "next";
import type { ReactElement } from "react";

import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { TentangSmkTeknovoShell } from "@/components/features/landing/local-seo/TentangSmkTeknovoShell";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

export const metadata: Metadata = buildLocalSeoPageMetadata("tentang-smk-teknovo");

export default function TentangSmkTeknovoPage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="tentang-smk-teknovo" includeFaq />
      <TentangSmkTeknovoShell />
    </>
  );
}
