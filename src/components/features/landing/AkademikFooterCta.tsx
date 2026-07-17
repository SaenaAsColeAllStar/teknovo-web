import Link from "next/link";
import type { ReactElement } from "react";

import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { PublicFinalCta } from "@/components/features/landing/PublicFinalCta";
import {
  AKADEMIK_FOOTER_CTA_BODY,
  AKADEMIK_FOOTER_CTA_EYEBROW,
  AKADEMIK_FOOTER_CTA_KONTAK_HREF,
  AKADEMIK_FOOTER_CTA_TITLE,
} from "@/lib/akademik-landing-content";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

export function AkademikFooterCta(): ReactElement {
  return (
    <PublicFinalCta
      as="article"
      className="mt-16"
      eyebrow={AKADEMIK_FOOTER_CTA_EYEBROW}
      title={AKADEMIK_FOOTER_CTA_TITLE}
      description={AKADEMIK_FOOTER_CTA_BODY}
    >
      <PpdbCtaLink href={PUBLIC_SITE_PPDB_HREF} label="Daftar PPDB" />
      <Link
        href={AKADEMIK_FOOTER_CTA_KONTAK_HREF}
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Hubungi sekolah
      </Link>
    </PublicFinalCta>
  );
}
