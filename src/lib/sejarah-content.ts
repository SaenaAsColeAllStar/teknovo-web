import { BRAND_MAPS_URL, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { AKADEMIK_JURUSAN_ITEMS } from "@/lib/akademik-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";

export type SejarahMilestone = {
  year: string;
  title: string;
  description: string;
};

export type SejarahQuickFact = {
  id: string;
  label: string;
  value: string;
};

export const SEJARAH_HERO_EYEBROW = "Profil sekolah" as const;

export const SEJARAH_PAGE_TITLE = "Sejarah Sekolah" as const;

export const SEJARAH_PAGE_LEDE =
  `Perjalanan ${BRAND_SHORT} dari cikal bakal hingga integrasi pembelajaran berbasis teknologi di Rancasari.` as const;

/** @deprecated Gunakan {@link SEJARAH_PAGE_LEDE} untuk intro halaman. */
export const SEJARAH_PAGE_SUBTITLE = SEJARAH_PAGE_LEDE;

export const SEJARAH_HERO_IMAGE_SRC = LANDING_MEDIA.profil.sejarahSekolahWebp;

/** @deprecated Gunakan {@link SEJARAH_HERO_INTRO} pada kartu hero. */
export const SEJARAH_INTRO_LEDE =
  `${BRAND_SCHOOL_FULL} (${BRAND_SHORT}) berdiri sebagai wadah pendidikan menengah kejuruan yang menggabungkan pembinaan karakter, kompetensi vokasi, dan penguasaan teknologi. Halaman ini merangkum tonggak perkembangan sekolah bagi calon siswa, orang tua, alumni, dan mitra yang ingin memahami jejak sekolah sebelum bergabung dengan komunitas belajar kami.`;

export const SEJARAH_HERO_INTRO = [
  SEJARAH_INTRO_LEDE,
  "Dari kelas pertama hingga ekosistem digital terpadu, sekolah terus menyesuaikan kurikulum, sarana praktik, dan layanan informasi agar civitas tetap relevan dengan tuntutan industri dan masyarakat.",
] as const;

/** @deprecated Gunakan paragraf kedua {@link SEJARAH_HERO_INTRO}. */
export const SEJARAH_HERO_SUMMARY = SEJARAH_HERO_INTRO[1];

export const SEJARAH_TIMELINE_INTRO =
  "Tahun pada tiap tonggak merupakan rentang perkiraan berdasarkan arsip internal dan perkembangan kebijakan sekolah — dapat disesuaikan apabila dokumen resmi mutakhir tersedia.";

export const SEJARAH_MILESTONES: readonly SejarahMilestone[] = [
  {
    year: "2008–2010",
    title: "Cikal pendirian di Rancasari",
    description:
      "Lembaga pendidikan kejuruan di lingkungan Miftahul Huda Rancasari mulai disusun untuk menjawab kebutuhan lulusan SMK yang disiplin, siap kerja, dan berakhlak di wilayah Bekasi.",
  },
  {
    year: "2012–2015",
    title: "Penguatan program kejuruan",
    description:
      "Kurikulum dan bengkel praktik diperkuat pada bidang teknik dan layanan, mempersiapkan siswa untuk praktik kerja lapangan serta uji kompetensi keahlian.",
  },
  {
    year: "2017–2019",
    title: "Digitalisasi administrasi & laboratorium",
    description:
      "Pencatatan akademik, absensi, dan komunikasi sekolah mulai terintegrasi secara digital; sarana praktik dan keselamatan kerja laboratorium distandarkan.",
  },
  {
    year: "2020–2022",
    title: "Adaptasi Kurikulum Merdeka",
    description:
      "Pembelajaran berbasis proyek, P5, dan literasi digital diperluas — termasuk penyesuaian hybrid saat dibutuhkan — tanpa mengabaikan pembinaan karakter dan kedisiplinan.",
  },
  {
    year: "2023–2024",
    title: "Penyelarasan mutu & akreditasi",
    description:
      "Tata kelola pembelajaran, dokumentasi capaian, dan kemitraan industri diperketat sebagai landasan penjaminan mutu dan pengakuan eksternal.",
  },
  {
    year: "2025–sekarang",
    title: "Integrasi portal TEKNOVO",
    description:
      `Ekosistem ${BRAND_SHORT} menghubungkan PPDB, LMS, rapor digital, dan kanal informasi orang tua dalam satu pengalaman layanan sekolah yang transparan dan terukur.`,
  },
] as const;

export const SEJARAH_NARRATIVE_PARAGRAPHS: readonly string[] = [
  `Sejak awal berdiri, ${BRAND_SHORT} menempatkan keseimbangan antara nilai keislaman, kewarganegaraan, dan kesiapan kerja. Guru dan tenaga kependidikan membiasakan siswa menghargai waktu, protokol bengkel, serta etika berkomunikasi — fondasi yang sama pentingnya dengan penguasaan alat dan materi kejuruan.`,
  "Perjalanan sekolah ditandai perluasan kemitraan dengan dunia usaha dan industri setempat. Praktik kerja lapangan, kunjungan industri, dan program sertifikasi kompetensi dirancang agar pengalaman di kelas tidak terputus dari realitas lapangan kerja yang sesungguhnya.",
  `Hari ini, ${BRAND_SCHOOL_FULL} terus mengembangkan budaya belajar yang adaptif: kurikulum nasional diselaraskan dengan proyek kejuruan, literasi digital, serta portal terpadu yang memudahkan orang tua memantau perkembangan anak — tanpa menggantikan peran pembinaan langsung di sekolah.`,
] as const;

const jurusanLabels = AKADEMIK_JURUSAN_ITEMS.map((j) => j.title).join(" & ");

export const SEJARAH_QUICK_FACTS: readonly SejarahQuickFact[] = [
  {
    id: "lokasi",
    label: "Lokasi sekolah",
    value: "Rancasari, lingkungan Miftahul Huda — wilayah Bekasi, Jawa Barat",
  },
  {
    id: "jenis",
    label: "Jenjang & fokus",
    value: "SMK teknologi & vokasi — karakter, akademik, dan kompetensi industri",
  },
  {
    id: "jurusan",
    label: "Program kejuruan",
    value: `${AKADEMIK_JURUSAN_ITEMS.length} jurusan: ${jurusanLabels}`,
  },
  {
    id: "program",
    label: "Pilar pembelajaran",
    value: "Kurikulum Merdeka, PKL, sertifikasi kompetensi, literasi digital & karakter",
  },
  {
    id: "peta",
    label: "Peta sekolah",
    value: "Lihat lokasi di Google Maps",
  },
] as const;

export const SEJARAH_MAP_LINK = BRAND_MAPS_URL;

export const SEJARAH_MOTTO =
  "Berakar di Rancasari, melangkah dengan ilmu, karakter, dan teknologi yang bermanfaat bagi bangsa." as const;

export const SEJARAH_MOTTO_ATTRIBUTION = `Komunitas ${BRAND_SHORT}` as const;
