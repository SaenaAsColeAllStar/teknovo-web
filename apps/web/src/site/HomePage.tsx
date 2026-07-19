"use client";

import type { ReactElement } from "react";

import type { ActivitiesShowcaseItem } from "@/components/features/landing/home/activities-showcase-types";
import { ActivitiesShowcaseSectionClient } from "@/components/features/landing/home/ActivitiesShowcaseSectionClient";
import { FinalCtaSection } from "@/components/features/landing/home/FinalCtaSection";
import { HomeBeritaArchiveSection } from "@/components/features/landing/home/HomeBeritaArchiveSection";
import { SocialProofSectionView } from "@/components/features/landing/home/SocialProofSection";
import { FasilitasSection } from "@/components/features/landing/FasilitasSection";
import { HeroSection } from "@/components/features/landing/HeroSection";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";
import type { LandingPublicStatItem } from "@/services/landing-stats";
import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";
import type { PublicSiteNavEntry } from "@/lib/public-site-nav";

export type HomePageProps = {
  stats: LandingPublicStatItem[];
  artikelSiswa: ArtikelSiswaPublikCard[];
  beritaKegiatan: BeritaKegiatanPublikCard[];
  mainNav?: readonly PublicSiteNavEntry[];
  /** Preloaded at Astro build — never fetch ekskul inside this island. */
  activitiesItems: ActivitiesShowcaseItem[];
};

/**
 * Pixel-parity beranda — same section stack as Next `(site)/page`.
 * Own `PublicMotionProvider`: page main is a sibling of chrome islands, so
 * LazyMotion from the navbar island does not apply here.
 *
 * All data is passed as props from `index.astro`. Do not import async server
 * loaders here — they get bundled into the client island and re-hit the API
 * on hydrate (fetch storm → 429 → suspended/blank HomePage).
 */
export function HomePage({
  stats,
  artikelSiswa,
  beritaKegiatan,
  mainNav,
  activitiesItems,
}: HomePageProps): ReactElement {
  return (
    <PublicMotionProvider>
      <HeroSection mainNav={mainNav} />
      <FasilitasSection embedded />
      <SocialProofSectionView stats={stats} />
      <ActivitiesShowcaseSectionClient items={activitiesItems} />
      <HomeBeritaArchiveSection
        artikelSiswa={artikelSiswa}
        beritaKegiatan={beritaKegiatan}
      />
      <FinalCtaSection />
    </PublicMotionProvider>
  );
}
