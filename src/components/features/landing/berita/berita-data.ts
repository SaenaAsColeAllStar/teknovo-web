/** Isi statis + artikel siswa / berita kegiatan sekolah yang sudah diterbitkan. */
export type BeritaItem = {
  id: string;
  judul: string;
  ringkasan: string;
  tanggal: string;
  /** URL gambar latar kartu berita. */
  coverSrc: string;
  /** Jika diisi, kartu mengarah ke halaman detail (mis. `/berita/siswa/...`). */
  detailHref?: string;
  /** Kredit penulis (mis. nama siswa & kelas). */
  creditLine?: string;
  /** Asal konten untuk blok sorotan “Berita kegiatan”. */
  source?: "siswa" | "sekolah";
};

export const BERITA_TERBARU: BeritaItem[] = [];
