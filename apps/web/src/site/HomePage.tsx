"use client";

import type { ReactElement } from "react";

import { ActivitiesShowcaseSection } from "@/components/features/landing/home/ActivitiesShowcaseSection";
import { FinalCtaSection } from "@/components/features/landing/home/FinalCtaSection";
import { HomeBeritaArchiveSection } from "@/components/features/landing/home/HomeBeritaArchiveSection";
import { SocialProofSectionView } from "@/components/features/landing/home/SocialProofSection";
import { FasilitasSection } from "@/components/features/landing/FasilitasSection";
import { HeroSection } from "@/components/features/landing/HeroSection";
import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";
import type { LandingPublicStatItem } from "@/services/landing-stats";
import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";

export type HomePageProps = {
  stats: LandingPublicStatItem[];
  artikelSiswa: ArtikelSiswaPublikCard[];
  beritaKegiatan: BeritaKegiatanPublikCard[];
};

/**
 * Pixel-parity beranda — same section stack as Next `(site)/page`.
 * Own `PublicMotionProvider`: Astro nests this as a separate island from
 * `PublicChrome`, so LazyMotion context does not cross the island boundary.
 */
export function HomePage({
  stats,
  artikelSiswa,
  beritaKegiatan,
}: HomePageProps): ReactElement {
  return (
    <PublicMotionProvider>
      <LocalSeoJsonLd pageId="home" includeWebSite includeFaq useGraph />
      <HeroSection />
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
