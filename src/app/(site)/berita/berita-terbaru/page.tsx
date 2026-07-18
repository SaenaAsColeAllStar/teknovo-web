import type { Metadata } from "next";
import type { ReactElement } from "react";

import { buildBeritaBentoTiles } from "@/components/features/landing/berita/BeritaBentoHero";
import { artikelSiswaToBeritaItem } from "@/components/features/landing/berita/artikel-siswa-to-berita-item";
import { BERITA_TERBARU } from "@/components/features/landing/berita/berita-data";
import { beritaKegiatanToBeritaItem } from "@/components/features/landing/berita/berita-kegiatan-to-berita-item";
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

  const gabungan = [
    ...artikelSiswa.map(artikelSiswaToBeritaItem),
    ...beritaKegiatan.map(beritaKegiatanToBeritaItem),
    ...BERITA_TERBARU,
  ].sort((x, y) => new Date(y.tanggal).getTime() - new Date(x.tanggal).getTime());

  const bentoTiles = buildBeritaBentoTiles(gabungan);

  return (
    <BeritaPageShell
      title={BERITA_TERBARU_PAGE_TITLE}
      lede={BERITA_TERBARU_PAGE_LEDE}
      showArchiveHero
      bentoTiles={bentoTiles}
    >
      <BeritaTerbaruSection artikelSiswa={artikelSiswa} beritaKegiatan={beritaKegiatan} />
    </BeritaPageShell>
  );
}
