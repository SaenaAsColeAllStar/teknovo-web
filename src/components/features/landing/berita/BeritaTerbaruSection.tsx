import type { ReactElement } from "react";

import {
  BERITA_BLOG_SECTION_TITLE,
  BERITA_EMPTY_TERBARU,
} from "@/lib/berita-landing-content";
import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";
import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";

import { artikelSiswaToBeritaItem } from "./artikel-siswa-to-berita-item";
import { BERITA_TERBARU } from "./berita-data";
import { beritaKegiatanToBeritaItem } from "./berita-kegiatan-to-berita-item";
import { BeritaKegiatanBlogSection } from "./BeritaKegiatanBlogSection";

export type BeritaTerbaruSectionProps = {
  artikelSiswa?: ArtikelSiswaPublikCard[];
  beritaKegiatan?: BeritaKegiatanPublikCard[];
};

/**
 * Blok blog di `/berita/berita-terbaru`: utamakan berita kegiatan (featured + 3 kartu),
 * fallback ke gabungan terbaru bila kegiatan kosong.
 */
export function BeritaTerbaruSection({
  artikelSiswa = [],
  beritaKegiatan = [],
}: BeritaTerbaruSectionProps): ReactElement {
  const dariSekolah = beritaKegiatan.map(beritaKegiatanToBeritaItem);
  const dariSiswa = artikelSiswa.map(artikelSiswaToBeritaItem);
  const gabungan = [...dariSiswa, ...dariSekolah, ...BERITA_TERBARU].sort(
    (x, y) => new Date(y.tanggal).getTime() - new Date(x.tanggal).getTime(),
  );

  const blogItems = dariSekolah.length > 0 ? dariSekolah : gabungan;

  return (
    <BeritaKegiatanBlogSection
      items={blogItems}
      emptyMessage={BERITA_EMPTY_TERBARU}
      title={dariSekolah.length > 0 ? BERITA_BLOG_SECTION_TITLE : "Berita terbaru"}
    />
  );
}
