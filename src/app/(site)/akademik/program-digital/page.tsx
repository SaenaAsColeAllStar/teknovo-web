import type { Metadata } from "next";
import type { ReactElement } from "react";

import { AkademikDigitalContent } from "@/components/features/landing/AkademikDigitalContent";
import { LmsJsonLd } from "@/components/features/lms/LmsJsonLd";
import { buildLmsLandingMetadata } from "@/lib/lms-dashboard-seo";

export const metadata: Metadata = buildLmsLandingMetadata("akademik-digital");

export default function AkademikProgramDigitalPage(): ReactElement {
  return (
    <>
      <LmsJsonLd pageId="akademik-digital" />
      <AkademikDigitalContent />
    </>
  );
}
