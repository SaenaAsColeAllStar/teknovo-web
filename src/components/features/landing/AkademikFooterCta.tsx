import type { ReactElement } from "react";

import { CenteredCtaStack } from "@/components/features/landing/CenteredCtaStack";
import {
  AKADEMIK_FOOTER_CTA_BODY,
  AKADEMIK_FOOTER_CTA_EYEBROW,
  AKADEMIK_FOOTER_CTA_KONTAK_HREF,
  AKADEMIK_FOOTER_CTA_TITLE,
} from "@/lib/akademik-landing-content";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

export function AkademikFooterCta(): ReactElement {
  return (
    <CenteredCtaStack
      className="mt-16"
      delay={0.22}
      eyebrow={AKADEMIK_FOOTER_CTA_EYEBROW}
      title={AKADEMIK_FOOTER_CTA_TITLE}
      body={AKADEMIK_FOOTER_CTA_BODY}
      primary={{ href: PUBLIC_SITE_PPDB_HREF, label: "Daftar PPDB" }}
      secondary={{ href: AKADEMIK_FOOTER_CTA_KONTAK_HREF, label: "Hubungi sekolah" }}
    />
  );
}
