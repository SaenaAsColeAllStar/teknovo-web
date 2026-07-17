import type { Metadata } from "next";
import type { ReactElement } from "react";

import { AkademikPageContent } from "@/components/features/landing/AkademikPageContent";
import { AKADEMIK_PAGE_LEDE, AKADEMIK_PAGE_TITLE } from "@/lib/akademik-landing-content";

export const metadata: Metadata = {
  title: AKADEMIK_PAGE_TITLE,
  description: AKADEMIK_PAGE_LEDE,
};

export default function AkademikPage(): ReactElement {
  return <AkademikPageContent />;
}
