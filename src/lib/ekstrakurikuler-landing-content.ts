import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

export const EKSTRA_HERO_EYEBROW = "Kesiswaan · Ekstrakurikuler" as const;

export const EKSTRA_PAGE_TITLE = "Klub, OSIS & Kehidupan Siswa" as const;

/** Dua paragraf lede — karakter, kepemimpinan, dan klub digital. */
export const EKSTRA_PAGE_LEDE: readonly [string, string] = [
  "Di luar jam pelajaran inti, siswa SMK TEKNOVO menemukan ruang untuk membangun karakter, kepemimpinan, dan kompetensi sesuai minat — dari OSIS hingga unit teknologi, olahraga, dan seni.",
  "Klub digital, literasi konten, robotik, dan kegiatan formal berjalan terstruktur dengan pembina guru, jadwal latihan, dan jalur prestasi yang terdokumentasi untuk portofolio siswa.",
] as const;

export const EKSTRA_OPPORTUNITIES_TITLE = "Kegiatan terstruktur di luar kelas" as const;

export const EKSTRA_OPPORTUNITIES_BODY =
  "Setiap unit ekstrakurikuler memiliki pembina, jadwal latihan, dan jalur dokumentasi prestasi. Siswa aktif mengelola keikutsertaan melalui portal; calon siswa mengenal program ini saat orientasi setelah diterima melalui PPDB." as const;

export const EKSTRA_GRID_INTRO =
  "Daftar unit aktif disinkronkan dari data sekolah. Filter menurut kategori, ketuk kartu untuk detail program, jadwal, pembina, dan prestasi terkait." as const;

export const EKSTRA_STATS_LABELS = {
  unit: "Unit ekstrakurikuler aktif",
  kategori: "Kategori kegiatan",
  prestasi: "Sorotan prestasi",
} as const;

export const EKSTRA_OSIS_TITLE = "OSIS" as const;

export const EKSTRA_OSIS_TAGLINE = "Program kerja & kepemimpinan" as const;

export const EKSTRA_OSIS_HEADLINE = "OSIS sebagai ruang tumbuh, kolaborasi, dan dampak sosial" as const;

export const EKSTRA_OSIS_BODY =
  "Wadah aspirasi, kegiatan sosial, dan pengembangan kepemimpinan. Program kerja OSIS dirancang untuk membangun budaya positif dan partisipasi aktif siswa di lingkungan sekolah." as const;

export const EKSTRA_OSIS_FOCUS_ITEMS = [
  "Event seni & kreativitas siswa",
  "Bakti sosial dan kegiatan kepedulian",
  "Forum dialog siswa & penguatan karakter",
  "Pelatihan kepemimpinan pengurus dan anggota",
] as const;

export const EKSTRA_OSIS_CTA_LABEL = "Lihat sorotan OSIS" as const;

export const EKSTRA_OSIS_CTA_HREF = "#osis" as const;

export const EKSTRA_PRESTASI_SECTION_EYEBROW = "Apresiasi pencapaian" as const;

export const EKSTRA_PRESTASI_SECTION_TITLE = "Prestasi dari kegiatan siswa" as const;

export const EKSTRA_PRESTASI_SECTION_BODY =
  "Sorotan lomba dan kompetisi yang telah diverifikasi admin kesiswaan — motivasi sejawat, dokumentasi sekolah, dan bekal portofolio." as const;

export const EKSTRA_PRESTASI_LINK_LABEL = "Semua prestasi terverifikasi" as const;

export const EKSTRA_PRESTASI_LINK_HREF = "/kesiswaan/prestasi" as const;

export const EKSTRA_CTA_TITLE = "Siap bergabung dengan kehidupan siswa TEKNOVO?" as const;

export const EKSTRA_CTA_BODY =
  "Calon siswa dapat mendaftar PPDB; siswa aktif mengelola keikutsertaan ekstrakurikuler dan mengajukan prestasi melalui portal." as const;

export const EKSTRA_PORTAL_HREF = "/siswa/ekstrakurikuler" as const;

export const EKSTRA_PORTAL_LABEL = "Portal ekstrakurikuler siswa" as const;

export const EKSTRA_PPDB_CTA = {
  href: PUBLIC_SITE_PPDB_HREF,
  label: "Daftar PPDB",
} as const;

export const EKSTRA_KATEGORI_LABELS: Record<
  "TEKNOLOGI" | "OLAHRAGA" | "AKADEMIK" | "SENI",
  string
> = {
  TEKNOLOGI: "Teknologi",
  OLAHRAGA: "Olahraga",
  AKADEMIK: "Akademik & kepemimpinan",
  SENI: "Seni & kreativitas",
};

export type EkstrakurikulerFilterKey = "SEMUA" | "TEKNOLOGI" | "OLAHRAGA" | "AKADEMIK" | "SENI";

export type EkstrakurikulerFilterIconKey =
  | "semua"
  | "teknologi"
  | "olahraga"
  | "akademik"
  | "seni";

export const EKSTRA_FILTER_OPTIONS: ReadonlyArray<{
  key: EkstrakurikulerFilterKey;
  label: string;
  iconKey: EkstrakurikulerFilterIconKey;
}> = [
  { key: "SEMUA", label: "Semua", iconKey: "semua" },
  { key: "TEKNOLOGI", label: "Teknologi", iconKey: "teknologi" },
  { key: "OLAHRAGA", label: "Olahraga", iconKey: "olahraga" },
  { key: "AKADEMIK", label: "Akademik", iconKey: "akademik" },
  { key: "SENI", label: "Seni", iconKey: "seni" },
];

/** Paragraf intro per kategori — ditampilkan saat filter Semua (desktop). */
export const EKSTRA_KATEGORI_INTRO: Record<
  Exclude<EkstrakurikulerFilterKey, "SEMUA">,
  { title: string; body: string }
> = {
  TEKNOLOGI: {
    title: "Klub teknologi & literasi digital",
    body:
      "Unit ini membina pemrograman, konten digital, dan produk teknologi siswa — landasan kompetensi SMK di luar jam pelajaran inti.",
  },
  OLAHRAGA: {
    title: "Athletics & kesehatan fisik",
    body:
      "Latihan terstruktur, sportivitas, dan kompetisi antar sekolah memperkuat disiplin serta kerja sama tim.",
  },
  AKADEMIK: {
    title: "Kepemimpinan & kedisiplinan",
    body:
      "Paskibra, pramuka, dan kegiatan formal lain menanamkan tanggung jawab, etos kerja, dan representasi sekolah.",
  },
  SENI: {
    title: "Seni & ekspresi kreatif",
    body:
      "Ruang eksplorasi budaya, pertunjukan, dan karya siswa yang melengkapi pengalaman holistik di sekolah.",
  },
};
