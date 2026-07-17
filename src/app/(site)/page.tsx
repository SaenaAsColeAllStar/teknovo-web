import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Suspense } from "react";

import { ActivitiesShowcaseSection } from "@/components/features/landing/home/ActivitiesShowcaseSection";
import { HomeBeritaArchiveSection } from "@/components/features/landing/home/HomeBeritaArchiveSection";
import { getPublishedArtikelSiswaCards } from "@/services/artikel-berita-publik";
import { getPublishedBeritaKegiatanCards } from "@/services/berita-kegiatan-publik";
import { HomeFlashMarqueeSection } from "@/components/features/landing/home/HomeFlashMarqueeSection";
import { FinalCtaSection } from "@/components/features/landing/home/FinalCtaSection";
import { SocialProofSection } from "@/components/features/landing/home/SocialProofSection";
import { FasilitasSection } from "@/components/features/landing/FasilitasSection";
import { HeroSection } from "@/components/features/landing/HeroSection";
import { LocalSeoJsonLd } from "@/components/features/landing/local-seo/LocalSeoJsonLd";
import { buildLocalSeoPageMetadata } from "@/lib/local-seo-keywords";

/** Jaga streaming: jika agregasi statistik DB lambat, marquee + blok di atas tetap tampil. */
function SocialProofSectionSkeleton(): ReactElement {
  return (
    <section className="border-y border-border-default bg-white py-14 sm:py-16" aria-hidden>
      <div className="public-site-container">
        <div className="mx-auto max-w-md space-y-3 text-center">
          <div className="mx-auto h-9 max-w-xs animate-pulse rounded-md bg-slate-100" />
          <div className="mx-auto h-4 max-w-[8rem] animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 md:grid-cols-2">
          {["a", "b"].map((k) => (
            <div key={k} className="aspect-[16/10] animate-pulse rounded-md bg-slate-100" />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:mt-12 sm:grid-cols-3 lg:grid-cols-6">
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <div key={k} className="text-center">
              <div className="mx-auto h-8 max-w-[4.5rem] animate-pulse rounded-md bg-slate-100 sm:h-9" />
              <div className="mx-auto mt-2 h-4 max-w-[6.5rem] animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = buildLocalSeoPageMetadata("home");

export const revalidate = 60;

/** Blok berita — fetch sendiri agar paralel dengan social proof + etalase aktivitas. */
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
 * Beranda — hero + fasilitas, pengumuman berjalan, social proof, etalase aktivitas, berita, dan CTA akhir.
 */
export default function HomePage(): ReactElement {
  return (
    <>
      <LocalSeoJsonLd pageId="home" includeWebSite includeFaq useGraph />
      <HeroSection />
      <FasilitasSection embedded />
      <HomeFlashMarqueeSection />
      <Suspense fallback={<SocialProofSectionSkeleton />}>
        <SocialProofSection />
      </Suspense>
      <ActivitiesShowcaseSection />
      <Suspense fallback={null}>
        <HomeBeritaArchiveBlock />
      </Suspense>
      <FinalCtaSection />
    </>
  );
}
