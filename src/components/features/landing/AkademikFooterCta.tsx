import Link from "next/link";
import type { ReactElement } from "react";

import {
  AkademikFramePlusMarks,
  akademikFrameShellClass,
  akademikSecondaryBtnClass,
} from "@/components/features/landing/AkademikBlueprintFrame";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  AKADEMIK_FOOTER_CTA_BODY,
  AKADEMIK_FOOTER_CTA_EYEBROW,
  AKADEMIK_FOOTER_CTA_KONTAK_HREF,
  AKADEMIK_FOOTER_CTA_TITLE,
} from "@/lib/akademik-landing-content";
import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

export function AkademikFooterCta(): ReactElement {
  return (
    <MotionInView
      as="article"
      className={cn(akademikFrameShellClass, "mt-16")}
      delay={0.22}
    >
      <AkademikFramePlusMarks />
      <div className="relative space-y-6 p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {AKADEMIK_FOOTER_CTA_EYEBROW}
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
          {AKADEMIK_FOOTER_CTA_TITLE}
        </h2>
        <p
          className={cn(
            "mx-auto max-w-2xl text-sm leading-relaxed text-body",
            publicFormalBodyClassName,
          )}
        >
          {AKADEMIK_FOOTER_CTA_BODY}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <PpdbCtaLink href={PUBLIC_SITE_PPDB_HREF} label="Daftar PPDB" />
          <Link href={AKADEMIK_FOOTER_CTA_KONTAK_HREF} className={akademikSecondaryBtnClass}>
            Hubungi sekolah
          </Link>
        </div>
      </div>
    </MotionInView>
  );
}
