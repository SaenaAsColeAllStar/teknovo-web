import type { Metadata } from "next";
import type { ReactElement } from "react";

import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { LocalSeoPageShell } from "@/components/features/landing/local-seo/LocalSeoPageShell";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

export const metadata: Metadata = buildLocalSeoPageMetadata("lms-smk-subang");

export default function LmsSmkSubangPage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="lms-smk-subang" />
      <LocalSeoPageShell pageId="lms-smk-subang" />
    </>
  );
}
