import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Suspense } from "react";

import { ActivitiesShowcaseSection } from "@/components/features/landing/home/ActivitiesShowcaseSection";
import { HomeBeritaArchiveSection } from "@/components/features/landing/home/HomeBeritaArchiveSection";
import { getPublishedArtikelSiswaCards } from "@/services/artikel-berita-publik";
import { getPublishedBeritaKegiatanCards } from "@/services/berita-kegiatan-publik";
import { HomeFlashMarqueeSection } from "@/components/features/landing/home/HomeFlashMarqueeSection";
import { FinalCtaSection } from "@/components/features/landing/home/FinalCtaSection";
import { FasilitasSection } from "@/components/features/landing/FasilitasSection";
import { HeroSection } from "@/components/features/landing/HeroSection";
import { StatsSection } from "@/components/features/landing/StatsSection";
import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

/** Jaga streaming: jika agregasi statistik DB lambat, marquee + blok di atas tetap tampil. */
function StatsSectionSkeleton(): ReactElement {
  return (
    <section
      className="border-y border-blue-900/30 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 py-14 text-white"
      aria-hidden
    >
      <div className="public-site-container">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {["a", "b", "c", "d"].map((k) => (
            <div key={k} className="text-center">
              <div className="mx-auto h-9 max-w-[5rem] animate-pulse rounded-md bg-white/15 sm:h-10" />
              <div className="mx-auto mt-2 h-4 max-w-[7rem] animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = buildLocalSeoPageMetadata("home");

export const revalidate = 60;

/** Blok berita — fetch sendiri agar paralel dengan `StatsSection` + `ActivitiesShowcaseSection` (bukan menunggu di parent). */
async function HomeBeritaArchiveBlock(): Promise<ReactElement> {
  const [artikelSiswaBeranda, beritaKegiatanBeranda] = await Promise.all([
    getPublishedArtikelSiswaCards(12),
    getPublishedBeritaKegiatanCards(8),
  ]);
  return (
    <HomeBeritaArchiveSection
      artikelSiswa={artikelSiswaBeranda}
      beritaKegiatan={beritaKegiatanBeranda}
    />
  );
}

/**
 * Beranda — hero + fasilitas, pengumuman berjalan, statistik, etalase aktivitas, berita, dan CTA akhir.
 */
export default function HomePage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="home" includeWebSite includeFaq useGraph />
      <header>
        <HeroSection />
      </header>
      <FasilitasSection embedded />
      <HomeFlashMarqueeSection />
      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSection />
      </Suspense>
      <ActivitiesShowcaseSection />
      <Suspense fallback={null}>
        <HomeBeritaArchiveBlock />
      </Suspense>
      <FinalCtaSection />
    </>
  );
}
