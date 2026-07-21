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
import { getPublishedKontakItems } from "@/services/kontak-publik";

export const metadata: Metadata = {
  title: KONTAK_PAGE_TITLE,
  description: KONTAK_PAGE_LEDE,
};

export default async function KontakPage(): Promise<ReactElement> {
  const items = await getPublishedKontakItems();

  return (
    <MotionInView as="section" className={publicPageSectionContactClassName}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={KONTAK_HERO_EYEBROW} title={KONTAK_PAGE_TITLE} />
        <div className="mt-16 sm:mt-20">
          <PublicContactSection items={items} />
        </div>
      </div>
    </MotionInView>
  );
}
