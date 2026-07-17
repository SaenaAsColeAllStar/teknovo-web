import type { ReactElement } from "react";

import { AkademikPageShell } from "@/components/features/landing/AkademikPageShell";
import { AkademikPengajarSection } from "@/components/features/landing/AkademikPengajarSection";
import { AKADEMIK_PENGAJAR_PAGE_LEDE, AKADEMIK_PENGAJAR_PAGE_TITLE } from "@/lib/akademik-landing-content";

export async function AkademikPengajarPageContent(): Promise<ReactElement> {
  return (
    <AkademikPageShell title={AKADEMIK_PENGAJAR_PAGE_TITLE} lede={AKADEMIK_PENGAJAR_PAGE_LEDE}>
      <AkademikPengajarSection standalone />
    </AkademikPageShell>
  );
}
