import type { Metadata } from "next";
import type { ReactElement } from "react";

import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import { PublicContactSection } from "@/components/layout/PublicContactSection";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  KONTAK_HERO_EYEBROW,
  KONTAK_PAGE_LEDE,
  KONTAK_PAGE_TITLE,
} from "@/lib/kontak-landing-content";
import { publicPageSectionContactClassName } from "@/lib/public-section-styles";

export const metadata: Metadata = {
  title: KONTAK_PAGE_TITLE,
  description: KONTAK_PAGE_LEDE,
};

export default function KontakPage(): ReactElement {
  return (
    <MotionInView as="section" className={publicPageSectionContactClassName}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={KONTAK_HERO_EYEBROW} title={KONTAK_PAGE_TITLE} lede={KONTAK_PAGE_LEDE} />
        <MotionInView as="div" className="mt-12" delay={0.06}>
          <PublicContactSection />
        </MotionInView>
      </div>
    </MotionInView>
  );
}
