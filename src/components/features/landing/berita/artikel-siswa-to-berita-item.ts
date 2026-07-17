import type { ArtikelSiswaPublikCard } from "@/services/artikel-berita-publik";

import type { BeritaItem } from "./berita-data";

/** Kartu berita publik dari artikel siswa yang sudah dimoderasi. */
export function artikelSiswaToBeritaItem(a: ArtikelSiswaPublikCard): BeritaItem {
  return {
    id: `siswa-${a.id}`,
    source: "siswa",
    judul: a.judul,
    ringkasan: a.ringkasan,
    tanggal: a.tanggalIso,
    coverSrc: a.coverSrc,
    detailHref: `/berita/siswa/${a.slugPublik}`,
    creditLine: `Ditulis oleh ${a.penulisNama} · ${a.penulisKelas}`,
  };
}
