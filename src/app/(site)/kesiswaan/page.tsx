import type { Metadata } from "next";
import type { ReactElement } from "react";

import { KesiswaanSection } from "@/components/features/landing/KesiswaanSection";
import { KESISWAAN_HUB_PAGE_TITLE, KESISWAAN_METADATA_DESCRIPTION } from "@/lib/kesiswaan-landing-content";

export const metadata: Metadata = {
  title: KESISWAAN_HUB_PAGE_TITLE,
  description: KESISWAAN_METADATA_DESCRIPTION,
};

export const revalidate = 60;

export default async function KesiswaanHubPage(): Promise<ReactElement> {
  return <KesiswaanSection />;
}
