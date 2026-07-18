import type { ReactElement, ReactNode } from "react";

import { FasilitasHubBands } from "@/components/features/landing/FasilitasHubBands";
import { FasilitasSubNav } from "@/components/features/landing/FasilitasSubNav";
import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  FASILITAS_HERO_EYEBROW,
} from "@/lib/fasilitas-landing-content";
import { publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type FasilitasPageShellProps = {
  title: string;
  lede: string;
  eyebrow?: string;
  /** Hub `/fasilitas` — four-band page slice instead of centered hero. */
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
    <MotionInView
      as="section"
      id="fasilitas"
      className={cn(
        publicPageSectionWhiteClassName,
        showHubHero && "py-16 sm:py-20 lg:py-24",
      )}
    >
      <div className="public-site-container">
        {showHubHero ? (
          <FasilitasHubBands />
        ) : (
          <PublicPageHero eyebrow={eyebrow} title={title} lede={lede} />
        )}

        <div className={cn("mt-10", showHubHero && "sm:mt-12")}>
          <FasilitasSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
