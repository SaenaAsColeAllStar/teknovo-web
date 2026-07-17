import type { BeritaKegiatanPublikCard } from "@/services/berita-kegiatan-publik";

import type { BeritaItem } from "./berita-data";

export function beritaKegiatanToBeritaItem(row: BeritaKegiatanPublikCard): BeritaItem {
  const credit =
    row.penulisNama?.trim() && row.penulisNama.trim().length > 0
      ? `Humas sekolah · ${row.penulisNama.trim()}`
      : "Humas sekolah";

  return {
    id: `sekolah-${row.id}`,
    source: "sekolah",
    judul: row.judul,
    ringkasan: row.ringkasan,
    tanggal: row.tanggalIso,
    coverSrc: row.coverSrc,
    detailHref: `/berita/kegiatan/${row.slug}`,
    creditLine: credit,
  };
}
