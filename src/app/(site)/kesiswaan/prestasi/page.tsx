import type { Metadata } from "next";
import type { ReactElement } from "react";

import { KesiswaanPrestasiPage } from "@/components/features/landing/kesiswaan/KesiswaanPrestasiPage";
import {
  KESISWAAN_PRESTASI_PAGE_LEDE,
  KESISWAAN_PRESTASI_PAGE_TITLE,
} from "@/lib/kesiswaan-landing-content";

export const metadata: Metadata = {
  title: KESISWAAN_PRESTASI_PAGE_TITLE,
  description: KESISWAAN_PRESTASI_PAGE_LEDE,
};

export const revalidate = 60;

export default async function PrestasiPage(): Promise<ReactElement> {
  return <KesiswaanPrestasiPage />;
}

