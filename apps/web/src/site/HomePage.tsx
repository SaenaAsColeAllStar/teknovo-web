"use client";

import type { ReactElement } from "react";

import { ActivitiesShowcaseSection } from "@/components/features/landing/home/ActivitiesShowcaseSection";
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
};

/**
 * Pixel-parity beranda — same section stack as Next `(site)/page`.
 * Own `PublicMotionProvider`: page main is a sibling of chrome islands, so
 * LazyMotion from the navbar island does not apply here.
 */
export function HomePage({
  stats,
  artikelSiswa,
  beritaKegiatan,
  mainNav,
}: HomePageProps): ReactElement {
  return (
    <PublicMotionProvider>
      <HeroSection mainNav={mainNav} />
      <FasilitasSection embedded />
      <SocialProofSectionView stats={stats} />
      <ActivitiesShowcaseSection />
      <HomeBeritaArchiveSection
        artikelSiswa={artikelSiswa}
        beritaKegiatan={beritaKegiatan}
      />
      <FinalCtaSection />
    </PublicMotionProvider>
  );
}
