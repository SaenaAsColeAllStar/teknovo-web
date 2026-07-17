import type { Metadata } from "next";

import { buildLandingAbsoluteUrl, truncateMetaDescription } from "@/lib/berita-seo";
import { BRAND_LOGO_SRC, BRAND_MAP_COORDS, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

/** Fakta lokasi & identitas sekolah — sumber tunggal untuk SEO lokal. */
export const LOCAL_SEO_SCHOOL = {
  npsn: "70036813",
  accreditation: "A",
  streetAddress: "Jl. Rancasari RT 05 RW 03",
  subLocality: "Rancasari",
  locality: "Pamanukan",
  administrativeArea: "Kabupaten Subang",
  region: "Jawa Barat",
  country: "ID",
  geo: BRAND_MAP_COORDS,
  areaServed: [
    "Pamanukan",
    "Kabupaten Subang",
    "Jawa Barat",
    "Jakarta",
    "Bekasi",
    "Karawang",
    "Jabodetabek",
  ] as const,
  postalCode: "41254",
  fullLocationLabel: "Rancasari, Pamanukan, Kabupaten Subang, Jawa Barat",
} as const;

/** Kata kunci utama — wilayah & merek. */
export const LOCAL_SEO_PRIMARY_KEYWORDS = [
  "SMK TEKNOVO",
  "SMK Teknologi dan Vokasional",
  "SMK Teknologi & Vokasional Miftahul Huda Rancasari",
  "SMK Rancasari",
  "SMK Pamanukan",
  "SMK Subang",
  "Rancasari",
  "Pamanukan",
  "Kabupaten Subang",
  "Jawa Barat",
  BRAND_SHORT,
  BRAND_SCHOOL_FULL,
  `NPSN ${LOCAL_SEO_SCHOOL.npsn}`,
  `akreditasi ${LOCAL_SEO_SCHOOL.accreditation}`,
] as const;

/** Long-tail & intent pencarian calon siswa / orang tua. */
export const LOCAL_SEO_LONG_TAIL_KEYWORDS = [
  "PPDB SMK Pamanukan",
  "PPDB SMK Subang",
  "PPDB SMK TEKNOVO",
  "SMK terbaik Subang",
  "SMK terbaik Pamanukan",
  "LMS online SMK Subang",
  "LMS terbaik SMK",
  "LMS online SMK",
  "pendaftaran SMK Pamanukan",
  "sekolah kejuruan Pamanukan",
  "SMK vokasi Subang",
  "SMK akreditasi A Subang",
  "SMK Jabodetabek",
  "SMK Jakarta Bekasi Karawang",
  "SMK koridor Jakarta Subang",
  "SMK mudah dijangkau Jakarta",
  "pendidikan vokasi Jawa Barat",
  "sekolah kejuruan Jabodetabek",
] as const;

/** Kata kunci kompetitor — hanya untuk halaman perbandingan faktual, tanpa klaim negatif. */
export const LOCAL_SEO_COMPETITOR_AWARE_KEYWORDS = [
  "SMK di Pamanukan",
  "SMK di Subang",
  "sekolah menengah kejuruan Pamanukan",
  "pilihan SMK vokasi Pamanukan",
  "NEVAM",
  "NEPAM",
  "SMK Damar",
  "SMKS Damar",
  "Darul Maarif",
  "SMA NEVAM",
  "SMA 1 Pamanukan",
] as const;

export const LOCAL_SEO_ALL_KEYWORDS = [
  ...LOCAL_SEO_PRIMARY_KEYWORDS,
  ...LOCAL_SEO_LONG_TAIL_KEYWORDS,
] as const;

export type LocalSeoPageId =
  | "home"
  | "smk-pamanukan"
  | "smk-terbaik-pamanukan"
  | "smk-terbaik-subang"
  | "ppdb-smk-pamanukan"
  | "lms-smk-subang"
  | "lms-smk-jawa-barat"
  | "smk-vokasi-pamanukan-subang"
  | "tentang-smk-teknovo";

export type LocalSeoPageConfig = {
  pageId: LocalSeoPageId;
  path: string;
  title: string;
  description: string;
  keywords: readonly string[];
  h1: string;
  eyebrow: string;
  lede: readonly string[];
  sections: readonly {
    heading: string;
    paragraphs: readonly string[];
  }[];
  internalLinks: readonly { label: string; href: string; description?: string }[];
  sitemapPriority: number;
  ogImage?: string;
};

export const LOCAL_SEO_PAGES: Record<LocalSeoPageId, LocalSeoPageConfig> = {
  home: {
    pageId: "home",
    path: "/",
    title:
      "SMK TEKNOVO Pamanukan Subang | SMK Terbaik Rancasari Jawa Barat — PPDB & LMS Online",
    description:
      "SMK TEKNOVO (SMK Teknologi & Vokasional) di Rancasari Pamanukan Subang Jawa Barat — akreditasi A NPSN 70036813. PPDB online terbuka seluruh Indonesia, LMS hybrid, jurusan TM & ULW; mudah dijangkau dari koridor Jakarta–Bekasi–Karawang.",
    keywords: [
      ...LOCAL_SEO_PRIMARY_KEYWORDS,
      "PPDB SMK TEKNOVO",
      "LMS online SMK",
      "SMK terbaik Rancasari",
    ],
    h1: "SMK TEKNOVO — Sekolah Vokasi Digital di Pamanukan Subang",
    eyebrow: "Rancasari · Pamanukan · Kabupaten Subang",
    lede: [
      `${BRAND_SCHOOL_FULL} berlokasi di ${LOCAL_SEO_SCHOOL.fullLocationLabel}. Sekolah menengah kejuruan berakreditasi ${LOCAL_SEO_SCHOOL.accreditation} (NPSN ${LOCAL_SEO_SCHOOL.npsn}) dengan jurusan Teknik Mesin dan Unit Layanan Wisata, didukung PPDB online dan LMS hybrid.`,
      "Portal resmi untuk calon siswa, orang tua, dan masyarakat Subang serta koridor Jakarta–Bekasi–Karawang yang mencari informasi SMK vokasi terpercaya di wilayah Pamanukan.",
    ],
    sections: [],
    internalLinks: [],
    sitemapPriority: 1,
    ogImage: LANDING_MEDIA.hero.welcomeJpg,
  },
  "smk-pamanukan": {
    pageId: "smk-pamanukan",
    path: "/smk-pamanukan",
    title: "SMK Pamanukan — SMK TEKNOVO Rancasari Subang Akreditasi A",
    description:
      "SMK Pamanukan: SMK TEKNOVO di Rancasari Kabupaten Subang Jawa Barat. Akreditasi A NPSN 70036813, jurusan TM & ULW, PPDB online, LMS hybrid. PPDB terbuka seluruh Indonesia termasuk Jabodetabek.",
    keywords: [
      "SMK Pamanukan",
      "SMK di Pamanukan",
      "SMK TEKNOVO",
      "SMK Rancasari",
      "sekolah kejuruan Pamanukan",
      LOCAL_SEO_SCHOOL.npsn,
    ],
    h1: "SMK Pamanukan: SMK TEKNOVO Rancasari Subang",
    eyebrow: "Pendidikan vokasi · Pamanukan",
    lede: [
      `${BRAND_SCHOOL_FULL} (SMK TEKNOVO) adalah sekolah menengah kejuruan di ${LOCAL_SEO_SCHOOL.streetAddress}, ${LOCAL_SEO_SCHOOL.fullLocationLabel}. Status akreditasi ${LOCAL_SEO_SCHOOL.accreditation}, NPSN ${LOCAL_SEO_SCHOOL.npsn}.`,
      "Calon siswa dari Pamanukan, Subang, maupun koridor Jakarta–Bekasi–Karawang dapat mempelajari profil sekolah dan mendaftar PPDB online — pendaftaran terbuka seluruh Indonesia.",
    ],
    sections: [
      {
        heading: "Profil SMK di Pamanukan",
        paragraphs: [
          `SMK TEKNOVO melayani calon siswa yang mencari pendidikan vokasi di Kecamatan Pamanukan. Program kejuruan: Teknik Mesin (TM) dan Unit Layanan Wisata (ULW) dengan pembelajaran praktik terstruktur.`,
          "Sekolah mengintegrasikan PPDB daring, LMS hybrid, absensi digital, dan ujian CBT — indikator kesiapan pembelajaran modern di wilayah Subang, Jawa Barat.",
        ],
      },
      {
        heading: "Akses dari Jakarta dan Sekitarnya",
        paragraphs: [
          "Lokasi sekolah di Pamanukan dapat dijangkau melalui koridor jalan utama arah Jakarta–Bekasi–Karawang menuju wilayah Subang. PPDB tidak membatasi domisili; seluruh calon siswa Indonesia dapat mendaftar sesuai ketentuan resmi.",
          "Orang tua di Jabodetabek yang mempertimbangkan SMK vokasi di Jawa Barat disarankan memverifikasi NPSN di database Kemendikdasmen dan mengunjungi halaman kontak untuk konsultasi jadwal kunjungan.",
        ],
      },
    ],
    internalLinks: [
      { label: "Tentang SMK TEKNOVO", href: "/tentang-smk-teknovo", description: "Profil & FAQ" },
      { label: "SMK Terbaik Pamanukan", href: "/profil/smk-terbaik-pamanukan" },
      { label: "PPDB SMK Pamanukan", href: "/ppdb-smk-pamanukan" },
      { label: "Portal PPDB Online", href: PUBLIC_SITE_PPDB_HREF },
      { label: "Kontak & Peta", href: "/kontak" },
    ],
    sitemapPriority: 0.95,
    ogImage: LANDING_MEDIA.berita.profilSmkWebp,
  },
  "smk-terbaik-pamanukan": {
    pageId: "smk-terbaik-pamanukan",
    path: "/profil/smk-terbaik-pamanukan",
    title: "SMK Terbaik di Pamanukan Subang — SMK TEKNOVO Rancasari Akreditasi A",
    description:
      "Mencari SMK terbaik di Pamanukan Subang? SMK TEKNOVO Rancasari berakreditasi A (NPSN 70036813) dengan jurusan TM & ULW, fasilitas digital, dan PPDB online untuk wilayah Jawa Barat.",
    keywords: [
      "SMK terbaik Pamanukan",
      "SMK terbaik Subang",
      "SMK Pamanukan",
      "SMK Rancasari",
      "SMK TEKNOVO",
      `akreditasi ${LOCAL_SEO_SCHOOL.accreditation}`,
      LOCAL_SEO_SCHOOL.npsn,
    ],
    h1: "SMK Terbaik di Pamanukan Subang: SMK TEKNOVO Rancasari",
    eyebrow: "Profil sekolah · Pamanukan",
    lede: [
      `Bagi calon siswa dan orang tua di Kecamatan Pamanukan, memilih SMK yang tepat berarti memeriksa akreditasi, program kejuruan, dan kesiapan sekolah menghadapi era digital. ${BRAND_SCHOOL_FULL} — SMK TEKNOVO — menempatkan mutu vokasi dan infrastruktur pembelajaran sebagai prioritas.`,
      "Halaman ini merangkum fakta resmi sekolah di Rancasari tanpa klaim peringkat yang tidak dapat diverifikasi. Status akreditasi dan NPSN dapat dicek di database Kemendikdasmen.",
    ],
    sections: [
      {
        heading: "Mengapa Mempertimbangkan SMK TEKNOVO di Pamanukan?",
        paragraphs: [
          `SMK TEKNOVO berdiri di ${LOCAL_SEO_SCHOOL.streetAddress}, ${LOCAL_SEO_SCHOOL.fullLocationLabel}. Sebagai SMK vokasi berstatus akreditasi ${LOCAL_SEO_SCHOOL.accreditation} (NPSN ${LOCAL_SEO_SCHOOL.npsn}), sekolah menawarkan program Teknik Mesin (TM) dan Unit Layanan Wisata (ULW) dengan proporsi praktik yang terstruktur.`,
          "Pembeda yang dapat diperiksa secara objektif: integrasi LMS online, laboratorium komputer, absensi digital, dan portal PPDB daring — sehingga proses belajar dan administrasi lebih transparan bagi siswa serta orang tua di wilayah Subang.",
        ],
      },
      {
        heading: "Program Kejuruan & Kesiapan Kerja",
        paragraphs: [
          "Jurusan Teknik Mesin mempersiapkan siswa pada kompetensi permesinan, fabrikasi, dan keselamatan kerja industri. Jurusan Unit Layanan Wisata melatih pelayanan tamu, tata hidang, dan pengetahuan pariwisata lokal Jawa Barat.",
          "Kedua program dihubungkan dengan pembelajaran digital melalui platform LMS sekolah, sehingga materi, tugas, dan evaluasi dapat diakses secara hybrid — relevan bagi generasi siswa yang terbiasa dengan teknologi.",
        ],
      },
      {
        heading: "Verifikasi Akreditasi & Lokasi",
        paragraphs: [
          "Orang tua disarankan memverifikasi data sekolah melalui portal referensi Kemendikdasmen menggunakan NPSN 70036813. Informasi alamat, status akreditasi, dan program keahlian tercatat di sistem pemerintah — bukan hanya dari materi promosi.",
          "Untuk kunjungan sekolah, lihat peta dan kontak di halaman kontak resmi. Tim Humas dan Tata Usaha siap membantu pertanyaan PPDB, jadwal orientasi, dan informasi jurusan.",
        ],
      },
      {
        heading: "Langkah Berikutnya bagi Calon Siswa",
        paragraphs: [
          "Pelajari visi sekolah di halaman sambutan kepala sekolah, telusuri fasilitas digital, dan baca berita kegiatan terbaru untuk memahami budaya belajar di SMK TEKNOVO.",
          "Pendaftaran siswa baru dilakukan melalui PPDB online resmi. Formulir, syarat berkas, dan jadwal gelombang tersedia di portal PPDB SMK TEKNOVO tahun ajaran 2026/2027.",
        ],
      },
    ],
    internalLinks: [
      { label: "Tentang & FAQ", href: "/tentang-smk-teknovo", description: "Profil resmi sekolah" },
      { label: "SMK Pamanukan", href: "/smk-pamanukan" },
      { label: "PPDB SMK Pamanukan", href: "/ppdb-smk-pamanukan", description: "Informasi pendaftaran" },
      { label: "LMS SMK Jawa Barat", href: "/lms-smk-jawa-barat", description: "Platform pembelajaran online" },
      { label: "Portal PPDB Online", href: PUBLIC_SITE_PPDB_HREF },
      { label: "Kontak & Peta Lokasi", href: "/kontak" },
    ],
    sitemapPriority: 0.95,
    ogImage: LANDING_MEDIA.berita.profilSmkWebp,
  },
  "smk-terbaik-subang": {
    pageId: "smk-terbaik-subang",
    path: "/smk-terbaik-subang",
    title: "SMK Terbaik di Subang Jawa Barat — SMK TEKNOVO Pamanukan Akreditasi A",
    description:
      "Mencari SMK terbaik di Subang Jawa Barat? SMK TEKNOVO Pamanukan berakreditasi A NPSN 70036813 — jurusan TM & ULW, PPDB online, LMS hybrid. Terbuka untuk calon siswa Subang dan Jabodetabek.",
    keywords: [
      "SMK terbaik Subang",
      "SMK Subang",
      "SMK terbaik Jawa Barat",
      "SMK TEKNOVO",
      "SMK Pamanukan",
      `akreditasi ${LOCAL_SEO_SCHOOL.accreditation}`,
    ],
    h1: "SMK Terbaik di Subang: SMK TEKNOVO Pamanukan",
    eyebrow: "Kabupaten Subang · Jawa Barat",
    lede: [
      `Bagi calon siswa di Kabupaten Subang dan sekitarnya, memilih SMK vokasi berarti memeriksa akreditasi, program kejuruan, dan kesiapan digital sekolah. ${BRAND_SCHOOL_FULL} — SMK TEKNOVO — berlokasi di Pamanukan dengan status akreditasi ${LOCAL_SEO_SCHOOL.accreditation} (NPSN ${LOCAL_SEO_SCHOOL.npsn}).`,
      "Halaman ini merangkum fakta resmi tanpa klaim peringkat yang tidak diverifikasi. Calon siswa dari koridor Jakarta–Bekasi–Karawang juga dapat mendaftar PPDB — terbuka seluruh Indonesia.",
    ],
    sections: [
      {
        heading: "Kriteria Memilih SMK di Subang",
        paragraphs: [
          "Verifikasi NPSN dan akreditasi di portal Kemendikdasmen, telusuri program kejuruan (TM, ULW, atau jurusan lain di sekolah pilihan), periksa fasilitas praktik, dan pastikan transparansi proses PPDB.",
          "SMK TEKNOVO menawarkan ekosistem digital terintegrasi: PPDB online, LMS hybrid, absensi digital, laboratorium komputer, dan modul ujian CBT.",
        ],
      },
      {
        heading: "Program Kejuruan SMK TEKNOVO",
        paragraphs: [
          "Teknik Mesin (TM) mempersiapkan kompetensi permesinan dan keselamatan kerja industri. Unit Layanan Wisata (ULW) melatih pelayanan tamu dan pengetahuan pariwisata.",
          "Kedua program dihubungkan dengan pembelajaran digital melalui platform LMS sekolah — relevan bagi siswa yang membutuhkan fleksibilitas belajar hybrid.",
        ],
      },
    ],
    internalLinks: [
      { label: "SMK Pamanukan", href: "/smk-pamanukan" },
      { label: "SMK Terbaik Pamanukan", href: "/profil/smk-terbaik-pamanukan" },
      { label: "PPDB SMK Subang", href: "/ppdb-smk-pamanukan" },
      { label: "LMS SMK Jawa Barat", href: "/lms-smk-jawa-barat" },
      { label: "Tentang & FAQ", href: "/tentang-smk-teknovo" },
    ],
    sitemapPriority: 0.95,
    ogImage: LANDING_MEDIA.berita.profilSmkWebp,
  },
  "ppdb-smk-pamanukan": {
    pageId: "ppdb-smk-pamanukan",
    path: "/ppdb-smk-pamanukan",
    title: "PPDB SMK Pamanukan 2026/2027 — Pendaftaran SMK TEKNOVO Subang",
    description:
      "PPDB SMK Pamanukan dan Subang: pendaftaran online SMK TEKNOVO Rancasari TA 2026/2027. Jurusan Teknik Mesin & ULW, akreditasi A NPSN 70036813. Formulir & syarat berkas.",
    keywords: [
      "PPDB SMK Pamanukan",
      "PPDB SMK Subang",
      "PPDB SMK TEKNOVO",
      "PPDB SMK terbaik",
      "pendaftaran SMK Pamanukan",
      "PPDB 2026/2027",
    ],
    h1: "PPDB SMK Pamanukan: Pendaftaran SMK TEKNOVO 2026/2027",
    eyebrow: "Penerimaan Peserta Didik Baru",
    lede: [
      "Pendaftaran Peserta Didik Baru (PPDB) SMK TEKNOVO dibuka bagi lulusan SMP/MTs dari seluruh Indonesia — termasuk Pamanukan, Subang, dan koridor Jakarta–Bekasi–Karawang. Proses pendaftaran dilakukan secara online melalui portal resmi sekolah.",
      "Calon siswa dapat memilih jurusan Teknik Mesin (TM) atau Unit Layanan Wisata (ULW) di SMK vokasi berakreditasi A di Rancasari, Kabupaten Subang, Jawa Barat.",
    ],
    sections: [
      {
        heading: "Gelombang PPDB SMK TEKNOVO",
        paragraphs: [
          "PPDB tahun ajaran 2026/2027 SMK TEKNOVO mengutamakan kemudahan akses bagi orang tua dan calon siswa di wilayah Pamanukan. Formulir online memungkinkan pengisian data, pemilihan jurusan, dan unggah berkas tanpa antre panjang pada tahap awal.",
          "Jadwal gelombang, kuota, dan biaya diumumkan melalui portal PPDB resmi. Pastikan selalu merujuk pada pengumuman terbaru di situs sekolah, bukan informasi dari sumber tidak resmi.",
        ],
      },
      {
        heading: "Persyaratan & Dokumen",
        paragraphs: [
          "Persyaratan umum meliputi fotokopi ijazah atau SKL SMP/MTs, kartu keluarga, akta kelahiran, dan NISN. Panduan unggah dokumen tersedia di halaman formulir PPDB online.",
          "Tim PPDB sekolah siap membantu melalui kontak resmi Tata Usaha. Pertanyaan seputar jurusan TM atau ULW dapat dikonsultasikan sebelum mengirim berkas.",
        ],
      },
      {
        heading: "Mengapa Mendaftar ke SMK TEKNOVO?",
        paragraphs: [
          `SMK TEKNOVO di ${LOCAL_SEO_SCHOOL.fullLocationLabel} menawarkan pembelajaran vokasi dengan dukungan infrastruktur digital: LMS online, laboratorium komputer, dan sistem evaluasi terintegrasi.`,
          "Status akreditasi A (NPSN 70036813) dapat diverifikasi di database Kemendikdasmen. Sekolah berfokus pada peningkatan mutu internal — fasilitas praktik, karakter kerja, dan kesiapan industri — bukan klaim prestasi yang belum diverifikasi.",
        ],
      },
      {
        heading: "Mulai Pendaftaran Online",
        paragraphs: [
          "Kunjungi portal PPDB resmi untuk membaca informasi lengkap dan mengisi formulir pendaftaran. Setelah pengiriman, simpan nomor pendaftaran dan ikuti langkah verifikasi berkas sesuai jadwal sekolah.",
          "Baca juga artikel berita sekolah tentang PPDB dan profil jurusan untuk memahami lingkungan belajar sebelum memutuskan.",
        ],
      },
    ],
    internalLinks: [
      { label: "Portal PPDB Online", href: PUBLIC_SITE_PPDB_HREF },
      { label: "Formulir PPDB", href: "/ppdb/daftar" },
      { label: "Tentang SMK TEKNOVO", href: "/tentang-smk-teknovo" },
      { label: "SMK Pamanukan", href: "/smk-pamanukan" },
      { label: "SMK Terbaik Subang", href: "/smk-terbaik-subang" },
      { label: "Berita PPDB", href: "/berita/kegiatan-sekolah" },
    ],
    sitemapPriority: 0.95,
    ogImage: LANDING_MEDIA.ppdb.heroJpg,
  },
  "lms-smk-subang": {
    pageId: "lms-smk-subang",
    path: "/lms-smk-subang",
    title: "LMS Online Terbaik untuk SMK di Subang — Platform SMK TEKNOVO",
    description:
      "LMS online SMK Subang: platform pembelajaran hybrid SMK TEKNOVO Rancasari Pamanukan. Materi digital, tugas, evaluasi, dan portal guru–siswa terintegrasi NPSN 70036813.",
    keywords: [
      "LMS online SMK",
      "LMS terbaik SMK",
      "LMS SMK Subang",
      "e-learning SMK Pamanukan",
      "pembelajaran hybrid SMK",
      "platform LMS sekolah",
    ],
    h1: "LMS Online SMK Subang: Pembelajaran Hybrid SMK TEKNOVO",
    eyebrow: "Fasilitas digital · Subang",
    lede: [
      `${BRAND_SCHOOL_FULL} mengoperasikan platform Learning Management System (LMS) untuk mendukung pembelajaran tatap muka dan hybrid di wilayah Rancasari, Pamanukan, Kabupaten Subang.`,
      "Guru mengunggah materi, menetapkan tugas, dan memberikan evaluasi formatif; siswa jurusan TM dan ULW mengakses kelas virtual melalui portal resmi sekolah.",
    ],
    sections: [
      {
        heading: "Fitur LMS SMK TEKNOVO",
        paragraphs: [
          "Platform LMS sekolah menyediakan kelas virtual per rombel, unggah modul pembelajaran, penugasan ber-deadline, forum diskusi terawasi, dan rekap partisipasi siswa.",
          "Data pembelajaran terintegrasi dengan akun portal sekolah sehingga wali kelas dan orang tua dapat memantau progres belajar secara lebih transparan dibandingkan catatan manual semata.",
        ],
      },
      {
        heading: "Integrasi dengan Ekosistem Digital Sekolah",
        paragraphs: [
          "LMS tidak berdiri sendiri: terhubung dengan modul absensi digital, kurikulum Merdeka, e-rapor, dan sistem ujian berbasis komputer (CBT). Integrasi ini memperkuat budaya belajar mandiri sekaligus literasi digital siswa vokasi.",
          "Laboratorium komputer dan jaringan sekolah menjadi titik akses utama, dengan panduan penggunaan bagi guru baru dan siswa kelas X saat orientasi.",
        ],
      },
      {
        heading: "Akses Portal & Panduan",
        paragraphs: [
          "Akses LMS dilakukan melalui portal resmi SMK TEKNOVO dengan kredensial yang diberikan saat orientasi. Halaman fasilitas LMS memuat penjelasan lengkap fitur dan alur penggunaan.",
          "Untuk pertanyaan teknis, hubungi tim TU atau guru pembimbing masing-masing rombel. Materi dan kebijakan penggunaan mengikuti protokol sekolah yang berlaku.",
        ],
      },
      {
        heading: "LMS untuk Calon Siswa & Orang Tua",
        paragraphs: [
          "Bagi calon siswa di Pamanukan dan Subang yang membandingkan SMK, keberadaan LMS terintegrasi menjadi indikator kesiapan sekolah menghadapi pembelajaran modern.",
          "Pelajari juga program digital akademik dan berita sekolah tentang platform e-learning untuk memahami bagaimana teknologi mendukung jurusan Teknik Mesin dan Unit Layanan Wisata.",
        ],
      },
    ],
    internalLinks: [
      { label: "LMS SMK Jawa Barat", href: "/lms-smk-jawa-barat" },
      { label: "Fasilitas LMS Sekolah", href: "/fasilitas/lms-sekolah" },
      { label: "Program Digital Akademik", href: "/akademik/program-digital" },
      { label: "Tentang SMK TEKNOVO", href: "/tentang-smk-teknovo" },
      { label: "PPDB SMK Subang", href: "/ppdb-smk-pamanukan" },
    ],
    sitemapPriority: 0.95,
    ogImage: LANDING_MEDIA.fasilitas.lmsJpg,
  },
  "lms-smk-jawa-barat": {
    pageId: "lms-smk-jawa-barat",
    path: "/lms-smk-jawa-barat",
    title: "LMS Online SMK di Jawa Barat — Platform Pembelajaran SMK TEKNOVO",
    description:
      "LMS online untuk SMK di Jawa Barat: platform pembelajaran hybrid SMK TEKNOVO Pamanukan Subang. Materi digital, tugas, evaluasi, CBT — NPSN 70036813 akreditasi A.",
    keywords: [
      "LMS SMK Jawa Barat",
      "LMS online SMK",
      "e-learning SMK Jawa Barat",
      "pembelajaran hybrid SMK",
      "LMS SMK Subang",
      "platform LMS sekolah",
    ],
    h1: "LMS Online SMK di Jawa Barat: Platform SMK TEKNOVO",
    eyebrow: "Pembelajaran digital · Jawa Barat",
    lede: [
      `${BRAND_SCHOOL_FULL} mengoperasikan platform Learning Management System (LMS) untuk mendukung pembelajaran tatap muka dan hybrid di Pamanukan, Kabupaten Subang, Jawa Barat.`,
      "Siswa jurusan TM dan ULW — termasuk yang berasal dari wilayah Subang dan koridor Jakarta–Bekasi–Karawang — mengakses kelas virtual melalui portal resmi sekolah.",
    ],
    sections: [
      {
        heading: "LMS untuk SMK Vokasi di Jawa Barat",
        paragraphs: [
          "Platform LMS SMK TEKNOVO menyediakan kelas virtual per rombel, unggah modul, penugasan ber-deadline, forum diskusi, dan rekap partisipasi siswa.",
          "Integrasi dengan absensi digital, e-rapor, kurikulum Merdeka, dan modul ujian CBT memperkuat literasi digital siswa vokasi di seluruh Jawa Barat.",
        ],
      },
      {
        heading: "Indikator untuk Calon Siswa",
        paragraphs: [
          "Keberadaan LMS terintegrasi menjadi indikator kesiapan sekolah menghadapi pembelajaran modern. SMK TEKNOVO berstatus akreditasi A (NPSN 70036813) — verifikasi di database Kemendikdasmen.",
          "Pelajari detail fitur di halaman fasilitas LMS sekolah dan program digital akademik. PPDB terbuka seluruh Indonesia melalui portal resmi.",
        ],
      },
    ],
    internalLinks: [
      { label: "LMS SMK Subang", href: "/lms-smk-subang" },
      { label: "Fasilitas LMS Sekolah", href: "/fasilitas/lms-sekolah" },
      { label: "Program Digital Akademik", href: "/akademik/program-digital" },
      { label: "SMK Pamanukan", href: "/smk-pamanukan" },
      { label: "PPDB SMK Pamanukan", href: "/ppdb-smk-pamanukan" },
    ],
    sitemapPriority: 0.95,
    ogImage: LANDING_MEDIA.fasilitas.lmsJpg,
  },
  "smk-vokasi-pamanukan-subang": {
    pageId: "smk-vokasi-pamanukan-subang",
    path: "/profil/smk-vokasi-pamanukan-subang",
    title: "Sekolah Menengah Kejuruan di Pamanukan Subang — Pilihan SMK Vokasi",
    description:
      "Panduan memilih SMK vokasi di Pamanukan Subang Jawa Barat. Perbandingan faktual opsi pendidikan kejuruan — SMK TEKNOVO Rancasari akreditasi A, NPSN 70036813, jurusan TM & ULW.",
    keywords: [
      ...LOCAL_SEO_COMPETITOR_AWARE_KEYWORDS,
      "SMK TEKNOVO",
      "SMK vokasi Subang",
      "pendidikan kejuruan Pamanukan",
    ],
    h1: "Sekolah Menengah Kejuruan di Pamanukan Subang",
    eyebrow: "Panduan calon siswa · Jawa Barat",
    lede: [
      "Kecamatan Pamanukan, Kabupaten Subang, memiliki beberapa satuan pendidikan menengah — termasuk SMA, SMK, dan madrasah — yang melayani calon siswa dari wilayah Rancasari dan sekitarnya.",
      "Halaman ini menyajikan kerangka memilih SMK vokasi secara objektif. SMK TEKNOVO diposisikan berdasarkan fakta resmi sekolah; nama instansi lain disebut sebagai konteks pencarian tanpa pernyataan yang tidak dapat diverifikasi.",
    ],
    sections: [
      {
        heading: "Memilih SMK Vokasi yang Tepat",
        paragraphs: [
          "Saat mencari SMK di Pamanukan atau Subang, calon siswa dan orang tua sebaiknya memeriksa: status akreditasi di database Kemendikdasmen (NPSN), program kejuruan yang ditawarkan, fasilitas praktik, dan transparansi proses PPDB.",
          "Istilah pencarian seperti SMK terbaik, PPDB SMK, atau LMS online SMK mencerminkan kebutuhan akan sekolah yang mutunya terukur dan siap menghadapi tuntutan kerja digital — bukan sekadar popularitas nama.",
        ],
      },
      {
        heading: "Lanskap Pendidikan Menengah di Wilayah Pamanukan",
        paragraphs: [
          "Masyarakat setempat mungkin mengenal berbagai nama sekolah melalui pencarian seperti NEVAM, NEPAM, SMK Damar, SMKS Damar, Darul Maarif, SMA NEVAM, atau SMA 1 Pamanukan. Setiap satuan pendidikan memiliki profil, program, dan status akreditasi masing-masing yang dapat dicek secara mandiri di portal data Kemendikdasmen.",
          "Artikel ini tidak membuat perbandingan peringkat atau klaim superioritas antarsekolah. Yang disarankan: kunjungi situs resmi masing-masing instansi, verifikasi NPSN, dan cocokkan program kejuruan dengan minat serta rencana karier anak.",
        ],
      },
      {
        heading: "Profil Faktual SMK TEKNOVO Rancasari",
        paragraphs: [
          `${BRAND_SCHOOL_FULL} (SMK TEKNOVO) beralamat di ${LOCAL_SEO_SCHOOL.streetAddress}, ${LOCAL_SEO_SCHOOL.fullLocationLabel}. NPSN ${LOCAL_SEO_SCHOOL.npsn}, akreditasi ${LOCAL_SEO_SCHOOL.accreditation}. Program keahlian: Teknik Mesin (TM) dan Unit Layanan Wisata (ULW).`,
          "Pembeda yang dapat diperiksa: ekosistem digital terintegrasi — PPDB online, LMS hybrid, absensi digital, laboratorium komputer, dan modul ujian CBT — sebagai bagian dari visi smart school internal sekolah.",
        ],
      },
      {
        heading: "Langkah Verifikasi & Pendaftaran",
        paragraphs: [
          "Verifikasi data SMK TEKNOVO melalui referensi.data.kemendikdasmen.go.id dengan NPSN 70036813. Untuk profil lengkap, lihat halaman SMK terbaik Pamanukan, fasilitas sekolah, dan berita kegiatan resmi.",
          "Pendaftaran siswa baru SMK TEKNOVO dilakukan melalui PPDB online. Orang tua disarankan membandingkan beberapa opsi SMK vokasi di Subang dengan kriteria objektif sebelum mengambil keputusan.",
        ],
      },
    ],
    internalLinks: [
      { label: "Tentang & FAQ", href: "/tentang-smk-teknovo" },
      { label: "SMK Pamanukan", href: "/smk-pamanukan" },
      { label: "SMK Terbaik Subang", href: "/smk-terbaik-subang" },
      { label: "PPDB SMK Pamanukan", href: "/ppdb-smk-pamanukan" },
      { label: "LMS SMK Jawa Barat", href: "/lms-smk-jawa-barat" },
      { label: "Portal PPDB Resmi", href: PUBLIC_SITE_PPDB_HREF },
    ],
    sitemapPriority: 0.9,
    ogImage: LANDING_MEDIA.berita.memilihSmkVokasiWebp,
  },
  "tentang-smk-teknovo": {
    pageId: "tentang-smk-teknovo",
    path: "/tentang-smk-teknovo",
    title: "Tentang SMK TEKNOVO — Profil Sekolah Vokasi Pamanukan Subang Jawa Barat",
    description:
      "Profil resmi SMK TEKNOVO (SMK Teknologi dan Vokasional Miftahul Huda) di Pamanukan Subang Jawa Barat. NPSN 70036813, akreditasi A, jurusan TM & ULW, PPDB online, LMS, CBT. FAQ untuk calon siswa Jabodetabek.",
    keywords: [
      "tentang SMK TEKNOVO",
      "profil SMK Pamanukan",
      "SMK vokasi Subang",
      "SMK TEKNOVO",
      "FAQ SMK Pamanukan",
      LOCAL_SEO_SCHOOL.npsn,
    ],
    h1: "Tentang SMK TEKNOVO — Sekolah Vokasi Digital di Pamanukan",
    eyebrow: "Profil resmi · FAQ",
    lede: [
      `${BRAND_SCHOOL_FULL} (SMK TEKNOVO) adalah Sekolah Menengah Kejuruan vokasi di ${LOCAL_SEO_SCHOOL.streetAddress}, ${LOCAL_SEO_SCHOOL.fullLocationLabel} 41254.`,
      "Halaman ini merangkum fakta resmi yang dapat disitasi: identitas sekolah, program kejuruan, layanan digital, wilayah layanan, dan jawaban pertanyaan umum calon siswa dari Subang maupun koridor Jakarta–Bekasi–Karawang.",
    ],
    sections: [
      {
        heading: "Fakta Resmi Sekolah",
        paragraphs: [
          `• Nama: SMK Teknologi dan Vokasional Miftahul Huda (SMK TEKNOVO)\n• NPSN: ${LOCAL_SEO_SCHOOL.npsn}\n• Akreditasi: ${LOCAL_SEO_SCHOOL.accreditation}\n• Jurusan: Teknik Mesin (TM), Unit Layanan Wisata (ULW)\n• Layanan: PPDB online, LMS hybrid, CBT ujian online, absensi digital`,
          `Koordinat: ${LOCAL_SEO_SCHOOL.geo.lat}, ${LOCAL_SEO_SCHOOL.geo.lng}. PPDB terbuka seluruh Indonesia — tidak membatasi domisili calon siswa.`,
        ],
      },
      {
        heading: "Wilayah Layanan",
        paragraphs: [
          "Wilayah utama: Pamanukan, Kabupaten Subang, Jawa Barat. Sekolah juga melayani informasi dan pendaftaran bagi calon siswa dari koridor Jakarta–Bekasi–Karawang (Jabodetabek) yang mempertimbangkan SMK vokasi di Jawa Barat.",
          "Lokasi di Pamanukan dapat dijangkau melalui koridor jalan utama menuju Subang. Untuk kunjungan, lihat halaman kontak dan peta lokasi resmi.",
        ],
      },
    ],
    internalLinks: [
      { label: "Sambutan Kepala Sekolah", href: "/profil/sambutan" },
      { label: "SMK Pamanukan", href: "/smk-pamanukan" },
      { label: "PPDB SMK Pamanukan", href: "/ppdb-smk-pamanukan" },
      { label: "LMS SMK Jawa Barat", href: "/lms-smk-jawa-barat" },
      { label: "Kontak & Peta", href: "/kontak" },
    ],
    sitemapPriority: 0.98,
    ogImage: LANDING_MEDIA.hero.welcomeJpg,
  },
};

/** Entri sitemap halaman SEO lokal (tanpa beranda). */
export const LOCAL_SEO_SITEMAP_ENTRIES = (
  Object.values(LOCAL_SEO_PAGES).filter((p) => p.pageId !== "home") as LocalSeoPageConfig[]
).map((page) => ({
  path: page.path,
  priority: page.sitemapPriority,
  changeFrequency: "weekly" as const,
}));

export function getLocalSeoPageConfig(pageId: LocalSeoPageId): LocalSeoPageConfig {
  return LOCAL_SEO_PAGES[pageId];
}

export function resolveLocalSeoOgImageUrl(imagePath?: string): string {
  const src = imagePath?.trim() || LANDING_MEDIA.hero.welcomeJpg;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return buildLandingAbsoluteUrl(src.startsWith("/") ? src : `/${src}`);
}

export function buildLocalSeoPageMetadata(pageId: LocalSeoPageId): Metadata {
  const page = LOCAL_SEO_PAGES[pageId];
  const description = truncateMetaDescription(page.description);
  const canonical = buildLandingAbsoluteUrl(page.path);
  const ogImage = resolveLocalSeoOgImageUrl(page.ogImage);
  const title = page.title;
  const fullTitle = pageId === "home" ? title : `${title} | ${BRAND_SHORT}`;

  return {
    title: pageId === "home" ? { absolute: title } : title,
    description,
    keywords: [...page.keywords],
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonical,
      title: fullTitle,
      description,
      siteName: BRAND_SCHOOL_FULL,
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: ogImage, alt: page.h1 }],
    },
    robots: { index: true, follow: true },
    other: {
      "geo.region": "ID-JB",
      "geo.placename": LOCAL_SEO_SCHOOL.locality,
      "geo.position": `${LOCAL_SEO_SCHOOL.geo.lat};${LOCAL_SEO_SCHOOL.geo.lng}`,
      ICBM: `${LOCAL_SEO_SCHOOL.geo.lat}, ${LOCAL_SEO_SCHOOL.geo.lng}`,
    },
  };
}

/** Logo absolut untuk JSON-LD. */
export function getLocalSeoLogoUrl(): string {
  return buildLandingAbsoluteUrl(BRAND_LOGO_SRC);
}
