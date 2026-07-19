import type { ReactElement } from "react";

import { AkademikHashRedirect } from "@/components/features/landing/AkademikHashRedirect";
import { AkademikJurusanSection } from "@/components/features/landing/AkademikJurusanSection";
import { AkademikPageShell } from "@/components/features/landing/AkademikPageShell";
import { AKADEMIK_JURUSAN_PAGE_LEDE, AKADEMIK_JURUSAN_PAGE_TITLE } from "@/lib/akademik-landing-content";

export async function AkademikJurusanPageContent(): Promise<ReactElement> {
  return (
    <>
      <AkademikHashRedirect />
      <AkademikPageShell title={AKADEMIK_JURUSAN_PAGE_TITLE} lede={AKADEMIK_JURUSAN_PAGE_LEDE}>
        <AkademikJurusanSection standalone />
      </AkademikPageShell>
    </>
  );
}
