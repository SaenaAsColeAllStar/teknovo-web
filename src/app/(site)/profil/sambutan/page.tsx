import type { Metadata } from "next";
import type { ReactElement } from "react";

import { SambutanKepalaSection } from "@/components/features/landing/profile/SambutanKepalaSection";
import { SAMBUTAN_PAGE_LEDE, SAMBUTAN_PAGE_TITLE } from "@/lib/sambutan-landing-content";

export const metadata: Metadata = {
  title: SAMBUTAN_PAGE_TITLE,
  description: SAMBUTAN_PAGE_LEDE,
};

export default function SambutanPage(): ReactElement {
  return <SambutanKepalaSection variant="page" />;
}
