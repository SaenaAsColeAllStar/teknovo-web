import type { Metadata } from "next";
import type { ReactElement } from "react";

import { KesiswaanEkstrakurikulerPage } from "@/components/features/landing/kesiswaan/KesiswaanEkstrakurikulerPage";
import { EKSTRA_PAGE_LEDE, EKSTRA_PAGE_TITLE } from "@/lib/ekstrakurikuler-landing-content";

export const metadata: Metadata = {
  title: EKSTRA_PAGE_TITLE,
  description: EKSTRA_PAGE_LEDE[0],
};

export const revalidate = 60;

export default async function EkstrakurikulerPage(): Promise<ReactElement> {
  return <KesiswaanEkstrakurikulerPage />;
}

