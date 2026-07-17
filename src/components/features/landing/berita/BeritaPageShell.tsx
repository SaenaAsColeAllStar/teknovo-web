import type { ReactElement, ReactNode } from "react";

import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { MotionInView } from "@/components/motion/MotionInView";
import { BERITA_HERO_EYEBROW, BERITA_HERO_IMAGE_SRC, BERITA_PAGE_TITLE } from "@/lib/berita-landing-content";
import {
  publicFormalBodyClassName,
  publicPageSectionWhiteClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

import { BeritaSubNav } from "./BeritaSubNav";

export type BeritaPageShellProps = {
  title: string;
  lede: string;
  /** Kartu hero arsip — hanya ringkasan `/berita` bila diperlukan. */
  showArchiveHero?: boolean;
  children: ReactNode;
};

export function BeritaPageShell({
  title,
  lede,
  showArchiveHero = false,
  children,
}: BeritaPageShellProps): ReactElement {
  return (
    <MotionInView as="section" className={publicPageSectionWhiteClassName}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={BERITA_HERO_EYEBROW} title={title} lede={lede} />

        {showArchiveHero ? (
          <MotionInView
            as="article"
            className={cn(publicSplitCardShellClassName, "mt-10 min-h-[16rem] sm:min-h-[18rem]")}
            delay={0.04}
          >
            <PublicSplitContentCard
              tone="neutral"
              insetImage
              image={{
                src: BERITA_HERO_IMAGE_SRC,
                alt: `Ilustrasi ${BERITA_PAGE_TITLE}`,
                quality: 70,
                priority: true,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Blogger Club &amp; humas
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Satu arsip untuk artikel siswa dan kegiatan resmi
              </h2>
              <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                Telusuri berita terbaru atau sorotan kegiatan sekolah melalui sub-menu di bawah — setiap bagian memiliki
                halaman sendiri agar tautan mudah dibagikan.
              </p>
            </PublicSplitContentCard>
          </MotionInView>
        ) : null}

        <div className="mt-10">
          <BeritaSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
