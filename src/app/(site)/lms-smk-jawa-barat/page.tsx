import type { Metadata } from "next";
import type { ReactElement } from "react";

import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { LocalSeoPageShell } from "@/components/features/landing/local-seo/LocalSeoPageShell";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

export const metadata: Metadata = buildLocalSeoPageMetadata("lms-smk-jawa-barat");

export default function LmsSmkJawaBaratPage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="lms-smk-jawa-barat" />
      <LocalSeoPageShell pageId="lms-smk-jawa-barat" />
    </>
  );
}
