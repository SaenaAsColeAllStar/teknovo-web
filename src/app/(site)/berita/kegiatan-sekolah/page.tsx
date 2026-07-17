import type { Metadata } from "next";
import type { ReactElement } from "react";

import { BeritaKegiatanSekolahSection } from "@/components/features/landing/berita/BeritaKegiatanSekolahSection";
import { BeritaPageShell } from "@/components/features/landing/berita/BeritaPageShell";
import { buildBeritaHubMetadata } from "@/lib/berita-seo";
import {
  BERITA_KEGIATAN_PAGE_LEDE,
  BERITA_KEGIATAN_PAGE_TITLE,
} from "@/lib/berita-landing-content";
import { getPublishedBeritaKegiatanCards } from "@/services/berita-kegiatan-publik";

export const metadata: Metadata = buildBeritaHubMetadata({
  title: BERITA_KEGIATAN_PAGE_TITLE,
  description: BERITA_KEGIATAN_PAGE_LEDE,
  path: "/berita/kegiatan-sekolah",
});

export const revalidate = 60;

export default async function BeritaKegiatanSekolahPage(): Promise<ReactElement> {
  const beritaKegiatan = await getPublishedBeritaKegiatanCards(48);

  return (
    <BeritaPageShell title={BERITA_KEGIATAN_PAGE_TITLE} lede={BERITA_KEGIATAN_PAGE_LEDE}>
      <BeritaKegiatanSekolahSection beritaKegiatan={beritaKegiatan} />
    </BeritaPageShell>
  );
}
