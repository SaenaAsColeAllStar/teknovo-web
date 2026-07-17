import { BRAND_KEPALA_JABATAN, BRAND_KEPALA_NAMA, BRAND_SHORT } from "@/lib/branding";

export type SambutanVisionPillar = {
  title: string;
  description: string;
};

export type SambutanInitiativeItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  emphasis?: boolean;
};

export type SambutanTimelineItem = {
  period: string;
  title: string;
  description: string;
};

export const SAMBUTAN_HERO_EYEBROW = "Profil sekolah" as const;

export const SAMBUTAN_PAGE_TITLE = "Sambutan Kepala Sekolah" as const;

export const SAMBUTAN_PAGE_LEDE =
  "Pesan kepala sekolah untuk SMK TEKNOVO — arah pengembangan sekolah, komitmen terhadap siswa, dan kolaborasi dengan orang tua serta mitra industri." as const;

/** Intro panjang di dalam section (kompatibilitas komponen lama). */
export const SAMBUTAN_PAGE_INTRO = SAMBUTAN_PAGE_LEDE;

export const SAMBUTAN_LEADERSHIP_EYEBROW = "Kepimpinan sekolah";

export const SAMBUTAN_LEADERSHIP_CREDENTIAL =
  "Magister Manajemen Pendidikan — memimpin pengembangan kurikulum, tata kelola, dan budaya belajar di SMK TEKNOVO.";

export const SAMBUTAN_SERVICE_BADGE = "Melayani civitas TEKNOVO";

export const SAMBUTAN_VISION_PILLARS: readonly SambutanVisionPillar[] = [
  {
    title: "Kejelasan struktur",
    description:
      "Kurikulum, asesmen, dan layanan siswa disusun terukur agar guru, siswa, dan orang tua memahami capaian serta tanggung jawab masing-masing.",
  },
  {
    title: "Literasi digital",
    description:
      "Penguasaan teknologi dan etika digital menjadi kompetensi dasar — mendukung pembelajaran daring, portofolio, dan kesiapan kerja industri.",
  },
] as const;

export const SAMBUTAN_INITIATIVES: readonly SambutanInitiativeItem[] = [
  {
    id: "kurikulum-merdeka",
    label: "Kurikulum",
    title: "Integrasi Kurikulum Merdeka",
    description:
      "P5, proyek kejuruan, dan penilaian autentik diselaraskan dengan capaian lulusan serta rapor digital sekolah.",
  },
  {
    id: "sarana-praktik",
    label: "Sarana",
    title: "Penguatan praktik kejuruan",
    description:
      "Workshop, laboratorium, dan kemitraan PKL diperluas agar siswa berlatih dengan standar keselamatan dan etos kerja industri.",
    emphasis: true,
  },
  {
    id: "kemitraan",
    label: "Jaringan",
    title: "Kolaborasi industri & komunitas",
    description:
      "Hubungan dengan dunia usaha, alumni, dan jalur pendidikan lanjut memperkaya magang, sertifikasi kompetensi, dan literasi karier.",
  },
] as const;

export const SAMBUTAN_TIMELINE_INTRO =
  "Perjalanan pimpinan sekolah berfokus pada peningkatan mutu pembelajaran, tata kelola, dan penguatan karakter siswa di lingkungan SMK.";

export const SAMBUTAN_TIMELINE_ITEMS: readonly SambutanTimelineItem[] = [
  {
    period: "Saat ini",
    title: `${BRAND_KEPALA_JABATAN}, ${BRAND_SHORT}`,
    description:
      "Memimpin penyelarasan kurikulum, digitalisasi layanan akademik, dan pembinaan karakter serta kedisiplinan civitas sekolah.",
  },
  {
    period: "Pengembangan profesional",
    title: "Penguatan manajemen pendidikan",
    description:
      "Pendampingan guru, supervisi akademik, dan perbaikan berkelanjutan proses belajar mengajar di tingkat kelas dan jurusan.",
  },
  {
    period: "Pendidikan formal",
    title: "Magister Manajemen Pendidikan",
    description:
      "Landasan keilmuan untuk merancang kebijakan sekolah, evaluasi program, dan kolaborasi dengan pemangku kepentingan pendidikan.",
  },
] as const;

export const SAMBUTAN_COMMUNITY_MESSAGE_PARAGRAPHS = [
  "Kami percaya bahwa pendidikan abad ini menuntut keseimbangan antara hati nurani dan kemampuan teknis. Di SMK TEKNOVO, setiap siswa didorong untuk bertumbuh sebagai pembelajar sepanjang hayat yang peduli pada sesama dan siap berkontribusi bagi masyarakat.",
  "Melalui lingkungan yang aman, terstruktur, dan berorientasi pada prestasi, kami berkomitmen mendampingi siswa mengembangkan karakter, literasi digital, dan etos kerja yang dibutuhkan dunia usaha dan industri.",
] as const;

export const SAMBUTAN_COMMUNITY_SIGNATURE = {
  name: BRAND_KEPALA_NAMA,
  role: BRAND_KEPALA_JABATAN,
} as const;
