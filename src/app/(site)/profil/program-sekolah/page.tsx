import type { Metadata } from "next";
import type { ReactElement } from "react";

import { ProgramSekolahContent } from "@/components/features/landing/profile/ProgramSekolahContent";
import { PROGRAM_SEKOLAH_PAGE_LEDE, PROGRAM_SEKOLAH_PAGE_TITLE } from "@/lib/program-sekolah-content";

export const metadata: Metadata = {
  title: PROGRAM_SEKOLAH_PAGE_TITLE,
  description: PROGRAM_SEKOLAH_PAGE_LEDE,
};

export default function ProgramSekolahPage(): ReactElement {
  return <ProgramSekolahContent />;
}
