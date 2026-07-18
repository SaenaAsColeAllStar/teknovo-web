import type { ReactElement } from "react";

import { BERITA_EMPTY_KEGIATAN } from "@/lib/berita-landing-content";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";

import { beritaKegiatanToBeritaItem } from "./berita-kegiatan-to-berita-item";
import { BeritaKegiatanBlogSection } from "./BeritaKegiatanBlogSection";

export type BeritaKegiatanSekolahSectionProps = {
  beritaKegiatan?: BeritaKegiatanPublikCard[];
};

export function BeritaKegiatanSekolahSection({
  beritaKegiatan = [],
}: BeritaKegiatanSekolahSectionProps): ReactElement {
  const items = beritaKegiatan.map(beritaKegiatanToBeritaItem);

  return (
    <BeritaKegiatanBlogSection items={items} emptyMessage={BERITA_EMPTY_KEGIATAN} />
  );
}
