import type { ReactElement } from "react";

import { BERITA_EMPTY_TERBARU } from "@/lib/berita-landing-content";
import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";

import { artikelSiswaToBeritaItem } from "./artikel-siswa-to-berita-item";
import { beritaKegiatanToBeritaItem } from "./berita-kegiatan-to-berita-item";
import { BERITA_TERBARU } from "./berita-data";
import { BeritaLoadMoreList } from "./BeritaLoadMoreList";

export type BeritaTerbaruSectionProps = {
  artikelSiswa?: ArtikelSiswaPublikCard[];
  beritaKegiatan?: BeritaKegiatanPublikCard[];
};

export function BeritaTerbaruSection({
  artikelSiswa = [],
  beritaKegiatan = [],
}: BeritaTerbaruSectionProps): ReactElement {
  const dariSiswa = artikelSiswa.map(artikelSiswaToBeritaItem);
  const dariSekolah = beritaKegiatan.map(beritaKegiatanToBeritaItem);
  const gabungan = [...dariSiswa, ...dariSekolah, ...BERITA_TERBARU].sort(
    (x, y) => new Date(y.tanggal).getTime() - new Date(x.tanggal).getTime(),
  );

  return (
    <BeritaLoadMoreList
      items={gabungan}
      initialCount={8}
      step={8}
      showThumbnail
      emptyMessage={BERITA_EMPTY_TERBARU}
    />
  );
}
