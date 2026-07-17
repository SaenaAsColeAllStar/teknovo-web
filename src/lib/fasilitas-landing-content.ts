import { ABSENSI_LANDING_ITEM } from "@/lib/fasilitas-absensi-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

export const FASILITAS_SLUGS = [
  "absensi-digital",
  "laboratorium-komputer",
  "perpustakaan-digital",
  "lms-sekolah",
] as const;

export type FasilitasSlug = (typeof FASILITAS_SLUGS)[number];

export type FasilitasFeaturePillar = {
  id: string;
  title: string;
  description: string;
};

export type FasilitasHoursRow = {
  label: string;
  value: string;
};

export type FasilitasServiceBand = {
  audience: string;
  items: readonly string[];
};

export type FasilitasStatChip = {
  label: string;
  value: string;
};

export type FasilitasPathwayStep = {
  step: string;
  title: string;
  description: string;
};

export type FasilitasQuote = {
  text: string;
  attribution: string;
};

export type FasilitasLandingItem = {
  slug: FasilitasSlug;
  title: string;
  description: string;
  coverSrc: string;
  highlights: readonly string[];
  paragraphs: readonly string[];
  features?: readonly FasilitasFeaturePillar[];
  hours?: readonly FasilitasHoursRow[];
  services?: readonly FasilitasServiceBand[];
  stats?: readonly FasilitasStatChip[];
  pathwaySteps?: readonly FasilitasPathwayStep[];
  quote?: FasilitasQuote;
  splitNarrative?: {
    title: string;
    paragraphs: readonly string[];
  };
};

export const FASILITAS_PAGE_TITLE = "Fasilitas" as const;

export const FASILITAS_PAGE_LEDE =
  "Sarana dan layanan digital yang mendukung belajar aman dan terukur: absensi, LMS, laboratorium komputer, dan perpustakaan digital—dapat dikunjungi saat tur sekolah." as const;

export const FASILITAS_HERO_EYEBROW = "Sarana & teknologi sekolah" as const;

export const FASILITAS_HUB_HERO_IMAGE_SRC = LANDING_MEDIA.fasilitas.laboratoriumWebp;

export type FasilitasSubNavItem = {
  id: FasilitasSlug | "ringkasan";
  label: string;
  href: "/fasilitas" | `/fasilitas/${FasilitasSlug}`;
  exact?: boolean;
};

/** Sub-nav halaman fasilitas — selaras `public-site-nav` dan route `[slug]`. */
export const FASILITAS_SUB_NAV_ITEMS: readonly FasilitasSubNavItem[] = [
  { id: "ringkasan", label: "Ringkasan fasilitas", href: "/fasilitas", exact: true },
  { id: "absensi-digital", label: "Absensi Digital", href: "/fasilitas/absensi-digital" },
  { id: "laboratorium-komputer", label: "Lab Komputer", href: "/fasilitas/laboratorium-komputer" },
  { id: "perpustakaan-digital", label: "Perpustakaan Digital", href: "/fasilitas/perpustakaan-digital" },
  { id: "lms-sekolah", label: "LMS Sekolah", href: "/fasilitas/lms-sekolah" },
] as const;

export function getFasilitasSubNavActiveHref(pathname: string): string | null {
  let winner: string | null = null;
  let winnerLen = -1;
  for (const item of FASILITAS_SUB_NAV_ITEMS) {
    const match = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (match && item.href.length > winnerLen) {
      winner = item.href;
      winnerLen = item.href.length;
    }
  }
  return winner;
}

/** Pemetaan hash lama (halaman tunggal) ke route baru. */
export const FASILITAS_LEGACY_HASH_TO_PATH: Readonly<Record<string, `/fasilitas/${FasilitasSlug}`>> = {
  "absensi-digital": "/fasilitas/absensi-digital",
  "laboratorium-komputer": "/fasilitas/laboratorium-komputer",
  "perpustakaan-digital": "/fasilitas/perpustakaan-digital",
  "lms-sekolah": "/fasilitas/lms-sekolah",
};

export const FASILITAS_FOOTER_CTA_TITLE = "Ingin melihat fasilitas secara langsung?" as const;

export const FASILITAS_FOOTER_CTA_BODY =
  "Jadwalkan kunjungan sekolah atau hubungi Tata Usaha untuk tur fasilitas dan informasi PPDB." as const;

export const FASILITAS_FOOTER_CTA_KONTAK_HREF = "/kontak" as const;

export const FASILITAS_FOOTER_CTA_PPDB_HREF = PUBLIC_SITE_PPDB_HREF;

export const FASILITAS_ITEMS: readonly FasilitasLandingItem[] = [
  ABSENSI_LANDING_ITEM,
  {
    slug: "laboratorium-komputer",
    title: "Lab Komputer",
    description:
      "Ruang praktik dengan perangkat mutakhir untuk pemrograman, desain, dan simulasi — mendukung proyek digital serta persiapan sertifikasi kompetensi.",
    coverSrc: LANDING_MEDIA.fasilitas.laboratoriumWebp,
    highlights: ["Perangkat praktik mutakhir", "Proyek kejuruan", "Simulasi industri"],
    paragraphs: [
      "Laboratorium komputer dirancang sebagai ruang produksi digital: siswa berlatih pemrograman, desain grafis, jaringan, dan simulasi sesuai kompetensi kejuruan masing-masing. Tata letak meja memudahkan kolaborasi proyek kecil maupun bimbingan guru mapel produktif.",
      "Perangkat dikelola dengan jadwal pemakaian terstruktur agar setiap rombel mendapat slot praktik yang adil. Lingkungan lab juga dipakai untuk persiapan lomba, sertifikasi, dan showcase karya siswa kepada mitra industri.",
      "Keselamatan kerja dan etika digital diajarkan sejak sesi pertama — dari backup data, lisensi software, hingga kebiasaan dokumentasi portofolio proyek.",
    ],
    features: [
      {
        id: "hardware",
        title: "Perangkat siap produksi",
        description: "Spesifikasi menengah–atas untuk IDE, rendering ringan, dan virtual lab sesuai kebutuhan jurusan.",
      },
      {
        id: "proyek",
        title: "Proyek terukur",
        description: "Capaian praktik terhubung ke rubrik kompetensi dan portofolio UKK.",
      },
      {
        id: "mitra",
        title: "Jembatan industri",
        description: "Workshop tamu dan simulasi alur kerja mitra memperkaya pengalaman belajar di lab.",
      },
    ],
  },
  {
    slug: "perpustakaan-digital",
    title: "Perpustakaan Digital",
    description:
      "Pusat informasi dengan katalog daring, akses e-book, dan ruang baca yang mendukung literasi serta riset mandiri siswa.",
    coverSrc: LANDING_MEDIA.fasilitas.perpustakaanWebp,
    highlights: ["Katalog daring", "E-book & referensi", "Ruang baca nyaman", "Literasi digital"],
    paragraphs: [
      "Perpustakaan digital SMK TEKNOVO menggabungkan koleksi cetak terkurasi dengan katalog daring dan akses e-book untuk mendukung tugas sekolah, riset proyek, dan kebiasaan membaca mandiri. Siswa dapat menelusuri referensi kejuruan maupun literasi umum dari perangkat kelas atau area baca.",
      "Ruang baca dirancang tenang dan terang dengan zona diskusi singkat agar kolaborasi literasi tidak mengganggu fokus individu. Staf perpustakaan mendampingi orientasi penggunaan katalog, etika sitasi, dan pencarian sumber terpercaya di internet.",
      "Program literasi digital rutin — dari klub baca hingga bimbingan penulisan karya ilmiah ringkas — memperkuat kemampuan siswa menyaring informasi dan mempresentasikan temuan secara profesional.",
    ],
    features: [
      {
        id: "katalog",
        title: "Katalog daring",
        description: "Pencarian judul, penulis, dan subjek terintegrasi dengan status ketersediaan koleksi.",
      },
      {
        id: "ebook",
        title: "E-book & referensi",
        description: "Akses materi elektronik untuk mapel produktif, bahasa, dan pengembangan diri.",
      },
      {
        id: "ruang-baca",
        title: "Ruang baca",
        description: "Area baca dengan jam operasional jelas dan titik konsultasi pustakawan.",
      },
      {
        id: "literasi",
        title: "Literasi digital",
        description: "Pelatihan sitasi, anti-plagiarisme, dan literasi media untuk siswa serta guru.",
      },
    ],
    hours: [
      { label: "Senin–Jumat", value: "07.30 – 15.30 WIB" },
      { label: "Sabtu (program literasi)", value: "08.00 – 12.00 WIB" },
      { label: "Istirahat layanan", value: "12.00 – 12.45 WIB" },
    ],
    services: [
      {
        audience: "Untuk siswa",
        items: [
          "Peminjaman buku & akses e-book via akun sekolah",
          "Bimbingan riset proyek dan sitasi sumber",
          "Klub baca & literasi media digital",
        ],
      },
      {
        audience: "Untuk guru",
        items: [
          "Kurasi referensi mapel dan paket bacaan tematik",
          "Dukungan bahan ajar digital untuk LMS",
          "Koordinasi jam kunjungan rombel",
        ],
      },
    ],
  },
  {
    slug: "lms-sekolah",
    title: "LMS Sekolah",
    description:
      "Platform pembelajaran daring terintegrasi untuk materi, tugas, dan evaluasi — menghubungkan guru, siswa, dan orang tua melalui portal TEKNOVO yang selaras dengan rapor digital.",
    coverSrc: LANDING_MEDIA.fasilitas.lmsWebp,
    highlights: [
      "Portal guru & siswa",
      "Tugas ber-deadline",
      "Evaluasi formatif",
      "Notifikasi orang tua",
      "Terintegrasi rapor",
    ],
    stats: [
      { label: "Ekosistem", value: "Terintegrasi portal TEKNOVO" },
      { label: "Akses", value: "Guru · Siswa · Orang tua" },
      { label: "Data", value: "Selaras rapor digital" },
    ],
    paragraphs: [
      "LMS sekolah SMK TEKNOVO menjadi pusat distribusi materi, pengumpulan tugas, dan evaluasi formatif–sumatif yang selaras dengan jadwal pembelajaran di kelas. Guru mengunggah modul, rubrik penilaian, dan umpan balik terstruktur melalui portal e-learning — siswa melanjutkan belajar mandiri di luar jam tatap muka dengan alur yang sama seperti di kelas.",
      "Setiap penugasan memiliki deadline, status pengumpulan, dan riwayat revisi sehingga portofolio belajar terdokumentasi. Siswa mengakses daftar tugas dan materi per mapel dari portal tugas; guru memantau keterlambatan dan memberi nilai tanpa kehilangan jejak administrasi.",
      "Evaluasi formatif — kuis ringkas, refleksi, dan asesmen diagnostik — membantu remediasi sebelum penilaian sumatif masuk rapor. Bank soal internal dan ujian terjadwal mendukung persiapan UKK serta showcase program kejuruan.",
      "Integrasi dengan rapor digital dan dashboard sekolah menjaga satu sumber kebenaran akademik. Orang tua memantau progres, pengumuman wali kelas, dan ringkasan capaian tanpa mengakses data privat antar siswa — transparansi rumah–sekolah yang terukur.",
    ],
    pathwaySteps: [
      {
        step: "01",
        title: "Guru menyiapkan materi & tugas",
        description:
          "Modul, lampiran, dan penugasan diunggah melalui portal e-learning guru — terhubung ke penugasan mapel dan jadwal rombel.",
      },
      {
        step: "02",
        title: "Siswa belajar & mengumpulkan",
        description:
          "Materi diakses per topik; tugas dikumpulkan sebelum deadline dengan status terpantau di portal siswa.",
      },
      {
        step: "03",
        title: "Evaluasi & umpan balik",
        description:
          "Kuis formatif, penilaian tugas, dan catatan revisi tercatat untuk remediasi sebelum nilai sumatif.",
      },
      {
        step: "04",
        title: "Sinkron ke rapor & orang tua",
        description:
          "Capaian akademik dan pengumuman wali kelas selaras data rapor digital — orang tua memantau tanpa membuka detail privat siswa lain.",
      },
    ],
    quote: {
      text: "Pembelajaran digital yang baik bukan mengganti guru di kelas — melainkan memperpanjang dialog belajar, transparansi capaian, dan tanggung jawab siswa di rumah.",
      attribution: "Filosofi pembelajaran digital SMK TEKNOVO",
    },
    splitNarrative: {
      title: "Satu platform, tiga pengguna",
      paragraphs: [
        "Guru, siswa, dan orang tua masuk melalui portal masing-masing dengan hak akses yang jelas — materi dan penilaian tidak bocor antar peran, tetapi alur informasi capaian tetap selaras.",
        "LMS berdampingan dengan absensi digital, laboratorium, dan perpustakaan digital sehingga kedisiplinan, praktik, dan literasi terbaca dalam satu gambaran perkembangan siswa.",
      ],
    },
    features: [
      {
        id: "materi",
        title: "Materi terstruktur",
        description: "Modul per topik dengan lampiran, video ringkas, dan prasyarat — selaras unggahan portal guru e-learning.",
      },
      {
        id: "tugas",
        title: "Tugas & pengumpulan",
        description: "Deadline, status kirim, dan rubrik penilaian — siswa melacak tugas dari portal tugas sekolah.",
      },
      {
        id: "ujian",
        title: "Ujian internal",
        description: "Bank soal dan jadwal ujian terkontrol untuk persiapan kompetensi sebelum UKK.",
      },
      {
        id: "portofolio",
        title: "Portofolio proyek",
        description: "Arsip karya dan refleksi belajar siap ditinjau wali kelas, pembina jurusan, atau akreditasi.",
      },
      {
        id: "notifikasi",
        title: "Notifikasi orang tua",
        description: "Ringkasan progres, pengumuman wali kelas, dan pengingat tugas — tanpa membuka data sensitif siswa lain.",
      },
    ],
    hours: [
      { label: "Senin–Jumat", value: "06.00 – 21.00 WIB (akses daring)" },
      { label: "Sabtu", value: "08.00 – 14.00 WIB (review & pengumpulan)" },
      { label: "Pemeliharaan", value: "Minggu & libur nasional — notifikasi diumumkan sebelumnya" },
    ],
    services: [
      {
        audience: "Untuk siswa",
        items: [
          "Mengakses materi e-learning per mapel dan topik",
          "Melihat daftar tugas, deadline, dan status pengumpulan di portal tugas",
          "Mengumpulkan berkas tugas dan melihat umpan balik guru",
          "Mengikuti kuis formatif dan refleksi belajar sebelum sumatif",
        ],
      },
      {
        audience: "Untuk guru",
        items: [
          "Mengunggah konten & mengelola bank materi di portal e-learning",
          "Membuat tugas dengan petunjuk, tipe pengumpulan, dan rubrik penilaian",
          "Memantau keterlambatan pengumpulan dan memberi nilai terstruktur",
          "Menyelaraskan capaian dengan rapor digital dan pengumuman rombel",
        ],
      },
      {
        audience: "Untuk orang tua",
        items: [
          "Memantau ringkasan progres dan kehadiran tugas anak",
          "Menerima pengumuman wali kelas melalui portal orang tua",
          "Transparansi capaian tanpa akses ke data atau tugas siswa lain",
          "Berkoordinasi dengan wali kelas berdasarkan informasi yang sama dengan sekolah",
        ],
      },
    ],
  },
] as const;

export function getFasilitasItem(slug: string): FasilitasLandingItem | undefined {
  return FASILITAS_ITEMS.find((item) => item.slug === slug);
}

export function getFasilitasDetailPath(slug: FasilitasSlug): `/fasilitas/${FasilitasSlug}` {
  return `/fasilitas/${slug}`;
}

export function getRelatedFasilitasItems(currentSlug: FasilitasSlug): readonly FasilitasLandingItem[] {
  return FASILITAS_ITEMS.filter((item) => item.slug !== currentSlug);
}

/** Urutan tile terkait untuk halaman LMS (absensi → lab → perpustakaan). */
export function getRelatedFasilitasItemsForLms(): readonly FasilitasLandingItem[] {
  const order: FasilitasSlug[] = ["absensi-digital", "laboratorium-komputer", "perpustakaan-digital"];
  return order
    .map((slug) => getFasilitasItem(slug))
    .filter((item): item is FasilitasLandingItem => item !== undefined);
}

export function isFasilitasSlug(value: string): value is FasilitasSlug {
  return (FASILITAS_SLUGS as readonly string[]).includes(value);
}
