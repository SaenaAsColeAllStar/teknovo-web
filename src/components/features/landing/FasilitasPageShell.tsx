import type { ReactElement, ReactNode } from "react";

import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { FasilitasIconGlyph } from "@/components/features/landing/FasilitasIconGlyph";
import { FasilitasSubNav } from "@/components/features/landing/FasilitasSubNav";
import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  FASILITAS_HERO_EYEBROW,
  FASILITAS_HUB_HERO_IMAGE_SRC,
  FASILITAS_PAGE_TITLE,
} from "@/lib/fasilitas-landing-content";
import {
  publicFormalBodyClassName,
  publicPageSectionWhiteClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type FasilitasPageShellProps = {
  title: string;
  lede: string;
  eyebrow?: string;
  /** Kartu hero ringkasan — hanya `/fasilitas`. */
  showHubHero?: boolean;
  children: ReactNode;
};

export function FasilitasPageShell({
  title,
  lede,
  eyebrow = FASILITAS_HERO_EYEBROW,
  showHubHero = false,
  children,
}: FasilitasPageShellProps): ReactElement {
  return (
    <MotionInView as="section" id="fasilitas" className={publicPageSectionWhiteClassName}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={eyebrow} title={title} lede={lede} />

        {showHubHero ? (
          <MotionInView
            as="article"
            className={cn(publicSplitCardShellClassName, "mt-10 min-h-[16rem] sm:min-h-[18rem]")}
            delay={0.04}
          >
            <PublicSplitContentCard
              tone="accent"
              image={{
                src: FASILITAS_HUB_HERO_IMAGE_SRC,
                alt: `Ilustrasi ${FASILITAS_PAGE_TITLE}`,
                quality: 70,
                priority: true,
              }}
            >
              <FasilitasIconGlyph iconKey="hub" className="size-8 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Sekolah siap digital
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Sarana yang mendukung belajar, praktik, dan transparansi
              </h2>
              <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                Setiap fasilitas memiliki halaman khusus — jelajahi absensi pintar, laboratorium, perpustakaan digital,
                dan LMS sekolah untuk memahami bagaimana TEKNOVO mendukung siswa dan orang tua.
              </p>
              <AkademikLearnMoreLink href="/fasilitas/perpustakaan-digital">
                Sorotan perpustakaan digital
              </AkademikLearnMoreLink>
            </PublicSplitContentCard>
          </MotionInView>
        ) : null}

        <div className="mt-10">
          <FasilitasSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
