import type { Metadata } from "next";
import type { ReactElement } from "react";

import { VisiMisiContent } from "@/components/features/landing/profile/VisiMisiContent";
import { VISI_MISI_PAGE_LEDE, VISI_MISI_PAGE_TITLE } from "@/lib/visi-misi-content";

export const metadata: Metadata = {
  title: VISI_MISI_PAGE_TITLE,
  description: VISI_MISI_PAGE_LEDE,
};

export default function VisiMisiPage(): ReactElement {
  return <VisiMisiContent />;
}
