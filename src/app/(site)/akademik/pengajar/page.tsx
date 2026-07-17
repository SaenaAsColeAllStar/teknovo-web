import type { Metadata } from "next";
import type { ReactElement } from "react";

import { AkademikPengajarPageContent } from "@/components/features/landing/AkademikPengajarPageContent";
import { AKADEMIK_PENGAJAR_PAGE_LEDE, AKADEMIK_PENGAJAR_PAGE_TITLE } from "@/lib/akademik-landing-content";

export const metadata: Metadata = {
  title: AKADEMIK_PENGAJAR_PAGE_TITLE,
  description: AKADEMIK_PENGAJAR_PAGE_LEDE,
};

export const revalidate = 60;

export default async function AkademikPengajarPage(): Promise<ReactElement> {
  return <AkademikPengajarPageContent />;
}
