import { BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

export type VisiMisiItem = {
  title: string;
  description: string;
};

export type VisiMisiNilaiCard = {
  id: string;
  title: string;
  description: string;
};

export const VISI_MISI_HERO_EYEBROW = "Profil sekolah" as const;

export const VISI_MISI_PAGE_TITLE = "Visi & Misi" as const;

export const VISI_MISI_PAGE_LEDE =
  `Visi, misi, tujuan, dan nilai ${BRAND_SHORT} — acuan orang tua memahami arah pembinaan karakter, kompetensi vokasi, dan kesiapan lulusan.` as const;

export const VISI_MISI_PAGE_SUBTITLE = VISI_MISI_PAGE_LEDE;

export const VISI_MISI_HERO_IMAGE_SRC = LANDING_MEDIA.misc.aktivitasUmumJpg;

export const VISI_MISI_HERO_INTRO = [
  `Visi dan misi menjadi landasan bagi calon siswa serta orang tua memahami arah pengembangan ${BRAND_SCHOOL_FULL} (${BRAND_SHORT}).`,
  "Dokumen ini menjelaskan cita-cita sekolah, langkah penyelenggaraan pendidikan kejuruan, capaian operasional yang ditargetkan, serta karakter unggulan yang dibina di lingkungan sekolah.",
  "Kami mengajak Anda menelusuri setiap bagian sebagai referensi sebelum memilih jurusan, mengikuti PPDB, atau berkolaborasi sebagai mitra pendidikan.",
] as const;

export const VISI_MISI_VISI_TEXT =
  "Menjadi SMK unggulan yang melahirkan lulusan berkarakter, berprestasi, dan mampu memanfaatkan teknologi secara etis untuk kemajuan bangsa." as const;

export const VISI_MISI_MOTTO =
  "Berilmu, berkarakter, berdaya saing — untuk bangsa dan daerah." as const;

export const VISI_MISI_MISI_ITEMS: readonly VisiMisiItem[] = [
  {
    title: "Pembelajaran berbasis kurikulum nasional",
    description:
      "Menyelenggarakan pembelajaran yang selaras dengan Kurikulum Merdeka, penguatan kompetensi kejuruan per jurusan, serta penilaian autentik yang mencerminkan capaian lulusan.",
  },
  {
    title: "Literasi digital terintegrasi",
    description:
      "Mengintegrasikan teknologi informasi, etika digital, dan literasi media dalam proses belajar agar siswa mampu belajar, berkarya, dan berkomunikasi secara aman di era digital.",
  },
  {
    title: "Kemitraan industri & dunia usaha",
    description:
      "Membangun kerja sama dengan dunia usaha dan industri untuk praktik kerja lapangan, sertifikasi kompetensi, serta bimbingan jalur kerja dan pendidikan lanjut bagi lulusan.",
  },
  {
    title: "Pembinaan karakter & kepemimpinan",
    description:
      "Menumbuhkan disiplin, tanggung jawab sosial, kepemimpinan siswa, serta jiwa nasionalisme melalui kegiatan intrakurikuler dan ekstrakurikuler terstruktur.",
  },
  {
    title: "Pengembangan guru & sarana prasarana",
    description:
      "Meningkatkan kompetensi pendidik, tata kelola pembelajaran, serta sarana praktik kejuruan yang memadai dan aman bagi proses belajar mengajar.",
  },
  {
    title: "Kolaborasi dengan orang tua & komunitas",
    description:
      "Melibatkan orang tua, alumni, dan pemangku kepentingan setempat dalam pembinaan siswa, transparansi informasi sekolah, serta program tanggung jawab sosial.",
  },
] as const;

export const VISI_MISI_TUJUAN_ITEMS: readonly string[] = [
  "Melahirkan lulusan yang memenuhi standar kompetensi nasional dan siap melanjutkan studi atau memasuki dunia kerja.",
  "Meningkatkan indeks literasi digital, kedisiplinan, dan prestasi akademik maupun nonakademik civitas sekolah.",
  "Mempertahankan kemitraan dunia usaha dan industri yang berkelanjutan untuk PKL, sertifikasi, dan relevansi kurikulum.",
  "Mewujudkan budaya sekolah yang tertib, inklusif, dan berorientasi pada inovasi serta integritas.",
] as const;

export const VISI_MISI_NILAI_CARDS: readonly VisiMisiNilaiCard[] = [
  {
    id: "disiplin",
    title: "Disiplin",
    description:
      "Ketertiban waktu, tata tertib, dan etos kerja menjadi fondasi keberhasilan belajar di kelas maupun bengkel praktik.",
  },
  {
    id: "integritas",
    title: "Integritas",
    description:
      "Kejujuran, tanggung jawab, dan etika dalam menggunakan teknologi serta menyelesaikan tugas akademik dan kejuruan.",
  },
  {
    id: "inovasi",
    title: "Inovasi",
    description:
      "Semangat mencoba solusi baru, berpikir kritis, dan mengadaptasi perkembangan industri tanpa melupakan nilai luhur.",
  },
  {
    id: "kolaborasi",
    title: "Kolaborasi",
    description:
      "Kerja sama antarsiswa, guru, orang tua, dan mitra untuk mencapai target pembelajaran dan pengembangan sekolah.",
  },
] as const;
