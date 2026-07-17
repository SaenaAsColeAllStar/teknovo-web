import type { ReactElement, ReactNode } from "react";

import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { KesiswaanIconGlyph } from "@/components/features/landing/kesiswaan/KesiswaanIconGlyph";
import { KesiswaanLandingSubNav } from "@/components/features/landing/kesiswaan/KesiswaanLandingSubNav";
import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  KESISWAAN_HUB_HERO_CARD_BODY,
  KESISWAAN_HUB_HERO_CARD_TAGLINE,
  KESISWAAN_HUB_HERO_CARD_TITLE,
  KESISWAAN_HUB_HERO_EYEBROW,
  KESISWAAN_HUB_HERO_IMAGE_SRC,
  KESISWAAN_HUB_PAGE_TITLE,
} from "@/lib/kesiswaan-landing-content";
import {
  publicFormalBodyClassName,
  publicPageSectionWhiteClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type KesiswaanPageShellProps = {
  title: string;
  lede: string | readonly string[];
  eyebrow?: string;
  /** Kartu hero ringkasan — hanya `/kesiswaan`. */
  showHubHero?: boolean;
  titleAdornment?: ReactNode;
  heroChildren?: ReactNode;
  children: ReactNode;
};

export function KesiswaanPageShell({
  title,
  lede,
  eyebrow = KESISWAAN_HUB_HERO_EYEBROW,
  showHubHero = false,
  titleAdornment,
  heroChildren,
  children,
}: KesiswaanPageShellProps): ReactElement {
  return (
    <MotionInView as="section" id="kesiswaan" className={publicPageSectionWhiteClassName}>
      <div className="public-site-container">
        <PublicPageHero
          eyebrow={eyebrow}
          title={title}
          lede={lede}
          titleAdornment={titleAdornment}
        >
          {heroChildren}
        </PublicPageHero>

        {showHubHero ? (
          <MotionInView
            as="article"
            className={cn(publicSplitCardShellClassName, "mt-10 min-h-[16rem] sm:min-h-[18rem]")}
            delay={0.04}
          >
            <PublicSplitContentCard
              tone="neutral"
              insetImage
              image={{
                src: KESISWAAN_HUB_HERO_IMAGE_SRC,
                alt: `Ilustrasi ${KESISWAAN_HUB_PAGE_TITLE}`,
                quality: 70,
                priority: true,
              }}
            >
              <KesiswaanIconGlyph iconKey="program" className="size-8 text-amber-700 dark:text-amber-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
                {KESISWAAN_HUB_HERO_CARD_TAGLINE}
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {KESISWAAN_HUB_HERO_CARD_TITLE}
              </h2>
              <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                {KESISWAAN_HUB_HERO_CARD_BODY}
              </p>
              <AkademikLearnMoreLink href="/kesiswaan/ekstrakurikuler">
                Jelajahi ekstrakurikuler
              </AkademikLearnMoreLink>
            </PublicSplitContentCard>
          </MotionInView>
        ) : null}

        <div className="mt-10">
          <KesiswaanLandingSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
