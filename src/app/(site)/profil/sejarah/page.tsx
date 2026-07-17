import type { Metadata } from "next";
import type { ReactElement } from "react";

import { SejarahContent } from "@/components/features/landing/profile/SejarahContent";
import { SEJARAH_PAGE_LEDE, SEJARAH_PAGE_TITLE } from "@/lib/sejarah-content";

export const metadata: Metadata = {
  title: SEJARAH_PAGE_TITLE,
  description: SEJARAH_PAGE_LEDE,
};

export default function SejarahPage(): ReactElement {
  return <SejarahContent />;
}
