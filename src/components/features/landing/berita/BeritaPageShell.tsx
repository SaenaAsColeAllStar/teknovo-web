import type { ReactElement, ReactNode } from "react";

import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import { MotionInView } from "@/components/motion/MotionInView";
import { BERITA_HERO_EYEBROW } from "@/lib/berita-landing-content";
import { publicPageSectionWhiteClassName } from "@/lib/public-section-styles";

import { BeritaBentoHero, type BeritaBentoTile } from "./BeritaBentoHero";
import { BeritaSubNav } from "./BeritaSubNav";

export type BeritaPageShellProps = {
  title: string;
  lede: string;
  /** Kartu hero arsip — bento foto untuk ringkasan `/berita/berita-terbaru`. */
  showArchiveHero?: boolean;
  /** Ubin bento (3); bila kosong memakai fallback destinasi arsip. */
  bentoTiles?: BeritaBentoTile[];
  children: ReactNode;
};

export function BeritaPageShell({
  title,
  lede,
  showArchiveHero = false,
  bentoTiles,
  children,
}: BeritaPageShellProps): ReactElement {
  return (
    <MotionInView as="section" className={publicPageSectionWhiteClassName}>
      <div className="public-site-container">
        {showArchiveHero ? (
          <BeritaBentoHero tiles={bentoTiles} />
        ) : (
          <PublicPageHero eyebrow={BERITA_HERO_EYEBROW} title={title} lede={lede} />
        )}

        <div className={showArchiveHero ? "mt-2 sm:mt-4" : "mt-10"}>
          <BeritaSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
