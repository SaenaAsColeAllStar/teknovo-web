import type { ReactElement, ReactNode } from "react";

import { AkademikPengajarBands } from "@/components/features/landing/AkademikPengajarBands";
import { AkademikSubNav } from "@/components/features/landing/AkademikSubNav";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  AKADEMIK_HERO_EYEBROW,
  type AkademikFeedKey,
} from "@/lib/akademik-landing-content";
import {
  publicFormalBodyClassName,
  publicPageSectionWhiteClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type AkademikPageShellProps = {
  title: string;
  lede: string;
  /**
   * When set, replaces centered intro with the four-band tenaga pengajar
   * page slice (top bar → intro → showcase → features).
   */
  featuredFeedKey?: AkademikFeedKey;
  children: ReactNode;
};

export function AkademikPageShell({
  title,
  lede,
  featuredFeedKey,
  children,
}: AkademikPageShellProps): ReactElement {
  const showPengajarBands = featuredFeedKey != null;

  return (
    <MotionInView
      as="section"
      id="akademik"
      className={cn(
        publicPageSectionWhiteClassName,
        showPengajarBands && "py-16 sm:py-20 lg:py-24",
      )}
    >
      <div className="public-site-container">
        {showPengajarBands ? (
          <AkademikPengajarBands />
        ) : (
          <MotionInView as="header" className="mx-auto max-w-3xl text-center" delay={0.02}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              {AKADEMIK_HERO_EYEBROW}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-heading sm:text-4xl">{title}</h1>
            <p
              className={cn(
                "mx-auto mt-5 max-w-2xl text-base leading-relaxed text-body",
                publicFormalBodyClassName,
              )}
            >
              {lede}
            </p>
          </MotionInView>
        )}

        <div className="mt-10 sm:mt-12">
          <AkademikSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
