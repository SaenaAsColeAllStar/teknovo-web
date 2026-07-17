import type { Metadata } from "next";
import type { ReactElement } from "react";

import { BeritaPageShell } from "@/components/features/landing/berita/BeritaPageShell";
import { BeritaTerbaruSection } from "@/components/features/landing/berita/BeritaTerbaruSection";
import { buildBeritaHubMetadata } from "@/lib/berita-seo";
import { BERITA_TERBARU_PAGE_LEDE, BERITA_TERBARU_PAGE_TITLE } from "@/lib/berita-landing-content";
import { getPublishedArtikelSiswaCards } from "@/services/artikel-berita-publik";
import { getPublishedBeritaKegiatanCards } from "@/services/berita-kegiatan-publik";

export const metadata: Metadata = buildBeritaHubMetadata({
  title: BERITA_TERBARU_PAGE_TITLE,
  description: BERITA_TERBARU_PAGE_LEDE,
  path: "/berita/berita-terbaru",
});

export const revalidate = 60;

export default async function BeritaTerbaruPage(): Promise<ReactElement> {
  const [artikelSiswa, beritaKegiatan] = await Promise.all([
    getPublishedArtikelSiswaCards(48),
    getPublishedBeritaKegiatanCards(48),
  ]);

  return (
    <BeritaPageShell title={BERITA_TERBARU_PAGE_TITLE} lede={BERITA_TERBARU_PAGE_LEDE} showArchiveHero>
      <BeritaTerbaruSection artikelSiswa={artikelSiswa} beritaKegiatan={beritaKegiatan} />
    </BeritaPageShell>
  );
}
