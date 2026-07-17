import type { ReactElement } from "react";

import { BERITA_EMPTY_KEGIATAN } from "@/lib/berita-landing-content";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";

import { beritaKegiatanToBeritaItem } from "./berita-kegiatan-to-berita-item";
import { BeritaLoadMoreList } from "./BeritaLoadMoreList";

export type BeritaKegiatanSekolahSectionProps = {
  beritaKegiatan?: BeritaKegiatanPublikCard[];
};

export function BeritaKegiatanSekolahSection({
  beritaKegiatan = [],
}: BeritaKegiatanSekolahSectionProps): ReactElement {
  const items = beritaKegiatan.map(beritaKegiatanToBeritaItem);

  return (
    <BeritaLoadMoreList
      items={items}
      initialCount={6}
      step={6}
      showThumbnail
      emptyMessage={BERITA_EMPTY_KEGIATAN}
    />
  );
}
