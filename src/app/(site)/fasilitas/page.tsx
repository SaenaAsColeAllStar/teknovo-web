import type { Metadata } from "next";
import type { ReactElement } from "react";

import { FasilitasHubPage } from "@/components/features/landing/FasilitasHubPage";
import { LmsJsonLd } from "@/components/features/lms/LmsJsonLd";
import { buildLmsLandingMetadata } from "@/lib/lms-dashboard-seo";

export const metadata: Metadata = buildLmsLandingMetadata("fasilitas-hub");

export default function FasilitasPage(): ReactElement {
  return (
    <>
      <LmsJsonLd pageId="fasilitas-hub" />
      <FasilitasHubPage />
    </>
  );
}
