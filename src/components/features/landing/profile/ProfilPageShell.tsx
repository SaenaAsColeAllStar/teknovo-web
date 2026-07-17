import type { ReactElement, ReactNode } from "react";

import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import { ProfilSubNav } from "@/components/features/landing/profile/ProfilSubNav";
import { MotionInView } from "@/components/motion/MotionInView";
import { PROFIL_HERO_EYEBROW } from "@/lib/profil-landing-content";
import { publicPageSectionWhiteClassName } from "@/lib/public-section-styles";

export type ProfilPageShellProps = {
  title: string;
  lede: string;
  eyebrow?: string;
  children: ReactNode;
};

export function ProfilPageShell({
  title,
  lede,
  eyebrow = PROFIL_HERO_EYEBROW,
  children,
}: ProfilPageShellProps): ReactElement {
  return (
    <MotionInView as="section" className={publicPageSectionWhiteClassName}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={eyebrow} title={title} lede={lede} />

        <div className="mt-10">
          <ProfilSubNav />
        </div>

        {children}
      </div>
    </MotionInView>
  );
}
