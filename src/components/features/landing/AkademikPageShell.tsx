import type { ReactElement, ReactNode } from "react";

import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { AkademikSubNav } from "@/components/features/landing/AkademikSubNav";
import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  AKADEMIK_HERO_EYEBROW,
  AKADEMIK_HERO_IMAGE_SRC,
  AKADEMIK_PAGE_TITLE,
} from "@/lib/akademik-landing-content";
import { BRAND_SHORT } from "@/lib/branding";
import {
  publicFormalBodyClassName,
  publicPageSectionWhiteClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type AkademikPageShellProps = {
  title: string;
  lede: string;
  /** Kartu hero jalur belajar — hanya ringkasan `/akademik`. */
  showPathwayHero?: boolean;
  children: ReactNode;
};

export function AkademikPageShell({
  title,
  lede,
  showPathwayHero = false,
  children,
}: AkademikPageShellProps): ReactElement {
  return (
    <MotionInView as="section" id="akademik" className={publicPageSectionWhiteClassName}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={AKADEMIK_HERO_EYEBROW} title={title} lede={lede} />

        {showPathwayHero ? (
          <MotionInView
            as="article"
            className={cn(publicSplitCardShellClassName, "mt-10 min-h-[16rem] sm:min-h-[18rem]")}
            delay={0.04}
          >
            <PublicSplitContentCard
              tone="neutral"
              insetImage
              image={{
                src: AKADEMIK_HERO_IMAGE_SRC,
                alt: `Ilustrasi ${AKADEMIK_PAGE_TITLE}`,
                quality: 70,
                priority: true,
              }}
            >
              <AkademikIconGlyph iconKey="pathway" className="size-8 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Jalur {BRAND_SHORT}
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Dari fondasi kelas X hingga PKL &amp; UKK
              </h2>
              <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                Pembelajaran berjenjang mempersiapkan siswa menguasai kompetensi kejuruan, karakter, dan kesiapan kerja
                — dengan dukungan digital yang transparan bagi orang tua.
              </p>
            </PublicSplitContentCard>
          </MotionInView>
        ) : null}

        <div className="mt-10">
          <AkademikSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
