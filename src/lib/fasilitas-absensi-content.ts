import { LANDING_MEDIA } from "@/lib/public-media-paths";

import type {
  FasilitasFeaturePillar,
  FasilitasHoursRow,
  FasilitasLandingItem,
  FasilitasServiceBand,
} from "./fasilitas-landing-content";

export type FasilitasWorkflowStep = {
  id: string;
  title: string;
  description: string;
};

export type FasilitasAudienceCard = {
  id: string;
  audience: string;
  summary: string;
  items: readonly string[];
  iconKey: "audience-siswa" | "audience-guru" | "audience-ortu" | "audience-kesiswaan";
};

export type FasilitasFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const ABSENSI_WORKFLOW_STEPS: readonly FasilitasWorkflowStep[] = [
  {
    id: "tap",
    title: "Tap masuk & pulang",
    description:
      "Siswa mencatat kehadiran harian melalui perangkat sekolah dengan cap waktu yang konsisten — menggantikan lembar manual di kelas.",
  },
  {
    id: "sinkron",
    title: "Sinkron ke basis data",
    description:
      "Setiap entri langsung tersimpan di sistem sekolah, selaras dengan model KehadiranPertemuanSiswa untuk absensi per pertemuan mapel.",
  },
  {
    id: "dashboard",
    title: "Dashboard wali & TU",
    description:
      "Guru wali kelas, Tata Usaha, dan kesiswaan memantau rekap real-time — tanpa menunggu rekap mingguan di kertas.",
  },
  {
    id: "portal",
    title: "Portal orang tua",
    description:
      "Wali murid melihat ringkasan hadir, izin, dan keterlambatan melalui portal siswa — transparan tanpa membuka data sensitif lain.",
  },
] as const;

export const ABSENSI_AUDIENCE_CARDS: readonly FasilitasAudienceCard[] = [
  {
    id: "siswa",
    audience: "Siswa",
    summary: "Kehadiran harian dan disiplin terpantau sejak awal masa belajar.",
    items: [
      "Tap masuk–pulang terintegrasi jadwal sekolah",
      "Riwayat kehadiran di portal siswa",
      "Notifikasi keterlambatan untuk refleksi mandiri",
    ],
    iconKey: "audience-siswa",
  },
  {
    id: "guru",
    audience: "Guru",
    summary: "Absensi kelas per pertemuan mapel melalui modul guru.",
    items: [
      "Pencatatan via /guru/absensi-kelas per pertemuan",
      "Status hadir, sakit, izin, atau alfa per siswa",
      "Data mengalir ke jurnal pembelajaran & rapor",
    ],
    iconKey: "audience-guru",
  },
  {
    id: "ortu",
    audience: "Orang tua",
    summary: "Memantau kedisiplinan anak tanpa harus menunggu rapat wali kelas.",
    items: [
      "Ringkasan kehadiran bulanan di portal",
      "Keterlambatan dan izin terdokumentasi",
      "Komunikasi rumah–sekolah lebih terarah",
    ],
    iconKey: "audience-ortu",
  },
  {
    id: "kesiswaan",
    audience: "Kesiswaan",
    summary: "Pola kehadiran menjadi dasar pembinaan dan program kedisiplinan.",
    items: [
      "Rekap per kelas untuk intervensi dini",
      "Acuan pelanggaran & pembinaan karakter",
      "Laporan administrasi rapi untuk audit",
    ],
    iconKey: "audience-kesiswaan",
  },
] as const;

export const ABSENSI_INTEGRATION_ITEMS: readonly string[] = [
  "Kedisiplinan & pelanggaran tata tertib — kehadiran menjadi bukti objektif saat pembinaan siswa.",
  "Rapor digital — sinkron capaian akademik dengan pola hadir per semester.",
  "LMS sekolah — guru mengaitkan pertemuan pembelajaran dengan daftar hadir di kelas.",
  "Portal siswa & orang tua — satu ekosistem akun untuk materi, tugas, dan kehadiran.",
] as const;

export const ABSENSI_FAQ_ITEMS: readonly FasilitasFaqItem[] = [
  {
    id: "perangkat",
    question: "Apakah absensi hanya lewat perangkat di sekolah?",
    answer:
      "Kehadiran harian siswa dicatat melalui titik absensi di lingkungan sekolah. Absensi per pertemuan mapel diisi guru di modul absensi kelas sesuai jadwal pembelajaran — keduanya tersimpan di basis data yang sama.",
  },
  {
    id: "ortu-akses",
    question: "Bagaimana orang tua mengakses data kehadiran?",
    answer:
      "Setelah siswa terdaftar, wali murid masuk ke portal dengan kredensial yang diberikan sekolah. Yang ditampilkan adalah ringkasan hadir, izin, dan keterlambatan — bukan nilai atau data pribadi siswa lain.",
  },
  {
    id: "guru-kelas",
    question: "Apa bedanya absensi harian dan absensi kelas?",
    answer:
      "Absensi harian mencatat masuk–pulang ke sekolah. Absensi kelas (KehadiranPertemuanSiswa) mencatat kehadiran per pertemuan mapel yang diampu guru — berguna untuk jurnal mengajar dan rekap pembelajaran.",
  },
  {
    id: "privasi",
    question: "Apakah data kehadiran aman dan terbatas?",
    answer:
      "Akses mengikuti peran (siswa, guru, TU, kesiswaan, orang tua) melalui autentikasi sekolah. Data dipakai untuk operasional pendidikan, bukan dibuka ke publik umum di luar portal resmi.",
  },
] as const;

const ABSENSI_FEATURES: readonly FasilitasFeaturePillar[] = [
  {
    id: "realtime",
    title: "Sinkronisasi real-time",
    description: "Rekap kehadiran per kelas diperbarui otomatis untuk wali kelas, TU, dan kepala program.",
  },
  {
    id: "pertemuan",
    title: "Per pertemuan mapel",
    description: "Guru mencatat hadir lewat absensi kelas — selaras jurnal pembelajaran dan KehadiranPertemuanSiswa.",
  },
  {
    id: "ortu",
    title: "Akses orang tua",
    description: "Portal menampilkan riwayat hadir, izin, dan keterlambatan tanpa membuka data sensitif lain.",
  },
  {
    id: "notifikasi",
    title: "Peringatan keterlambatan",
    description: "Pola terlambat terdeteksi lebih awal agar wali kelas dan orang tua dapat merespons tepat waktu.",
  },
  {
    id: "integrasi",
    title: "Ekosistem terpadu",
    description: "Terhubung ke kedisiplinan, rapor, dan LMS — satu gambaran belajar dan kedisiplinan.",
  },
] as const;

const ABSENSI_HOURS: readonly FasilitasHoursRow[] = [
  { label: "Absensi harian siswa", value: "Senin–Jumat, sesuai jam masuk sekolah" },
  { label: "Absensi kelas (mapel)", value: "Mengikuti jadwal pertemuan di /guru/absensi-kelas" },
  { label: "Portal orang tua", value: "24 jam (akses daring, data diperbarui berkala)" },
] as const;

const ABSENSI_SERVICES: readonly FasilitasServiceBand[] = [
  {
    audience: "Operasional harian",
    items: [
      "Titik absensi masuk–pulang di lingkungan sekolah",
      "Rekap otomatis ke dashboard internal",
      "Ekspor data untuk kebutuhan administrasi",
    ],
  },
  {
    audience: "Pembelajaran di kelas",
    items: [
      "Daftar hadir per pertemuan oleh guru mapel",
      "Status hadir, sakit, izin, atau alfa",
      "Catatan guru hingga 400 karakter bila diperlukan",
    ],
  },
] as const;

/** Entri hub & metadata untuk slug absensi-digital. */
export const ABSENSI_LANDING_ITEM: FasilitasLandingItem = {
  slug: "absensi-digital",
  title: "Absensi Digital",
  description:
    "Sistem absensi terintegrasi — dari tap masuk harian hingga daftar hadir per pertemuan mapel, dengan dashboard sekolah dan portal orang tua untuk transparansi kedisiplinan.",
  coverSrc: LANDING_MEDIA.fasilitas.absensiDigitalWebp,
  highlights: [
    "Tap masuk real-time",
    "Absensi kelas per mapel",
    "Portal orang tua",
    "Terintegrasi rapor & LMS",
  ],
  paragraphs: [
    "Absensi digital SMK TEKNOVO menggantikan pencatatan manual dengan alur yang terhubung ke basis data sekolah. Setiap masuk dan pulang tercatat dengan cap waktu konsisten; guru mapel melengkapi kehadiran per pertemuan melalui modul absensi kelas yang selaras dengan KehadiranPertemuanSiswa.",
    "Wali kelas, Tata Usaha, dan tim kesiswaan memantau pola kehadiran dari dashboard internal — tanpa menunggu rekap mingguan. Data menjadi acuan pembinaan, pelanggaran tata tertib, dan dokumentasi administrasi yang rapi.",
    "Orang tua mengakses ringkasan kehadiran anak melalui portal siswa: hadir, izin, sakit, dan keterlambatan terbaca jelas tanpa membuka nilai atau data siswa lain. Transparansi ini memperkuat komunikasi rumah–sekolah sejak awal masa belajar.",
    "Sistem ini tidak berdiri sendiri — terhubung ke LMS, rapor digital, dan program kedisiplinan sehingga pembelajaran dan karakter siswa terukur dalam satu ekosistem TEKNOVO.",
  ],
  features: ABSENSI_FEATURES,
  hours: ABSENSI_HOURS,
  services: ABSENSI_SERVICES,
};

export const ABSENSI_WORKFLOW_SECTION_TITLE = "Alur kerja absensi" as const;
export const ABSENSI_WORKFLOW_SECTION_INTRO =
  "Empat langkah dari tap di sekolah hingga informasi yang dapat diakses orang tua — tanpa rekapitulasi manual di papan tulis." as const;

export const ABSENSI_AUDIENCE_SECTION_TITLE = "Untuk siapa" as const;
export const ABSENSI_AUDIENCE_SECTION_INTRO =
  "Setiap peran memiliki pintu masuk dan hak akses yang sesuai — dari siswa dan guru hingga kesiswaan serta wali murid." as const;

export const ABSENSI_INTEGRATION_SECTION_TITLE = "Integrasi ekosistem" as const;
export const ABSENSI_INTEGRATION_SECTION_INTRO =
  "Data kehadiran mengalir ke modul yang sudah dipakai sehari-hari di SMA TEKNOVO — bukan aplikasi terpisah." as const;

export const ABSENSI_FAQ_SECTION_TITLE = "Pertanyaan umum" as const;
