import type { Metadata } from "next";
import type { ReactElement } from "react";

import { AkademikJurusanPageContent } from "@/components/features/landing/AkademikJurusanPageContent";
import { AKADEMIK_JURUSAN_PAGE_LEDE, AKADEMIK_JURUSAN_PAGE_TITLE } from "@/lib/akademik-landing-content";

export const metadata: Metadata = {
  title: AKADEMIK_JURUSAN_PAGE_TITLE,
  description: AKADEMIK_JURUSAN_PAGE_LEDE,
};

export const revalidate = 60;

export default async function AkademikJurusanPage(): Promise<ReactElement> {
  return <AkademikJurusanPageContent />;
}
