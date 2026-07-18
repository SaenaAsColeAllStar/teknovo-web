import type { ReactElement, ReactNode } from "react";

import { KesiswaanHubBands } from "@/components/features/landing/kesiswaan/KesiswaanHubBands";
import { KesiswaanLandingSubNav } from "@/components/features/landing/kesiswaan/KesiswaanLandingSubNav";
import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import { MotionInView } from "@/components/motion/MotionInView";
import { KESISWAAN_HUB_HERO_EYEBROW } from "@/lib/kesiswaan-landing-content";
import { publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type KesiswaanPageShellProps = {
  title: string;
  lede: string | readonly string[];
  eyebrow?: string;
  /** Hub `/kesiswaan` — four-band intro slice. */
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
    <MotionInView
      as="section"
      id="kesiswaan"
      className={cn(
        publicPageSectionWhiteClassName,
        showHubHero && "py-16 sm:py-20 lg:py-24",
      )}
    >
      <div className="public-site-container">
        {showHubHero ? (
          <KesiswaanHubBands />
        ) : (
          <PublicPageHero
            eyebrow={eyebrow}
            title={title}
            lede={lede}
            titleAdornment={titleAdornment}
          >
            {heroChildren}
          </PublicPageHero>
        )}

        <div className={cn("mt-10", showHubHero && "sm:mt-12")}>
          <KesiswaanLandingSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
