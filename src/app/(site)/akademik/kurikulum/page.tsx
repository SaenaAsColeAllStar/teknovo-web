import type { Metadata } from "next";
import type { ReactElement } from "react";

import { AkademikKurikulumContent } from "@/components/features/landing/AkademikKurikulumContent";
import { LmsJsonLd } from "@/components/features/lms/LmsJsonLd";
import { buildLmsLandingMetadata } from "@/lib/lms-dashboard-seo";

export const metadata: Metadata = buildLmsLandingMetadata("akademik-kurikulum");

export default function AkademikKurikulumPage(): ReactElement {
  return (
    <>
      <LmsJsonLd pageId="akademik-kurikulum" />
      <AkademikKurikulumContent />
    </>
  );
}
