import {
  BRAND_KEPALA_FOTO_SRC,
  BRAND_KEPALA_JABATAN,
  BRAND_KEPALA_NAMA,
  BRAND_SHORT,
} from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import {
  PUBLIC_SITE_PORTAL_LOGIN_HREF,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";

export type AkademikJurusanItem = {
  id: string;
  title: string;
  description: string;
  coverSrc: string;
  highlights: readonly string[];
};

export type AkademikPillarItem = {
  id: string;
  title: string;
  description: string;
};

export type AkademikPathwayStep = {
  tingkat: string;
  fase: string;
  bullets: readonly string[];
};

export type AkademikDigitalItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  hrefLabel: string;
};

export type AkademikSubNavSlug = "kurikulum" | "jurusan" | "pengajar" | "program-digital";

export type AkademikSubNavItem = {
  id: AkademikSubNavSlug | "ringkasan";
  label: string;
  href: "/akademik" | `/akademik/${AkademikSubNavSlug}`;
  /** Hanya cocok pathname persis (untuk ringkasan `/akademik`). */
  exact?: boolean;
};

export type AkademikOverviewTeaser = {
  iconKey: "kurikulum" | "jurusan" | "pengajar" | "digital";
  title: string;
  description: string;
  href: `/akademik/${AkademikSubNavSlug}`;
  linkLabel: string;
};

export type PengajarQuoteItem = {
  nama: string;
  jabatan: string;
  quote: string;
  fotoSrc?: string;
};

export type PengajarPillarItem = {
  id: string;
  title: string;
  description: string;
};

export const AKADEMIK_PAGE_TITLE = "Akademik & Kurikulum" as const;

export const AKADEMIK_PAGE_INTRO =
  "Kurikulum nasional diperkuat dengan program kejuruan, praktik industri, dan pengajar yang berpengalaman di bidangnya.";

export const AKADEMIK_PAGE_LEDE =
  `${AKADEMIK_PAGE_INTRO} Halaman ini merangkum kurikulum Merdeka, jalur kelas X–XII, program kejuruan, komunitas pengajar, serta layanan digital ${BRAND_SHORT} untuk calon siswa dan orang tua.`;

export const AKADEMIK_HERO_EYEBROW = "Program akademik" as const;

export const AKADEMIK_HERO_IMAGE_SRC = LANDING_MEDIA.fasilitas.laboratoriumWebp;

export const AKADEMIK_SUB_NAV_ITEMS: readonly AkademikSubNavItem[] = [
  { id: "ringkasan", label: "Ringkasan akademik", href: "/akademik", exact: true },
  { id: "kurikulum", label: "Kurikulum", href: "/akademik/kurikulum" },
  { id: "jurusan", label: "Jurusan", href: "/akademik/jurusan" },
  { id: "pengajar", label: "Pengajar", href: "/akademik/pengajar" },
  { id: "program-digital", label: "Program digital", href: "/akademik/program-digital" },
] as const;

export function getAkademikSubNavActiveHref(pathname: string): string | null {
  let winner: string | null = null;
  let winnerLen = -1;
  for (const item of AKADEMIK_SUB_NAV_ITEMS) {
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

/** Pemetaan hash lama (halaman tunggal) ke route dedicated. */
export const AKADEMIK_LEGACY_HASH_TO_PATH: Readonly<Record<string, AkademikSubNavItem["href"]>> = {
  kurikulum: "/akademik/kurikulum",
  jurusan: "/akademik/jurusan",
  pengajar: "/akademik/pengajar",
  "program-digital": "/akademik/program-digital",
};

export const AKADEMIK_KURIKULUM_SECTION_TITLE = "Kurikulum & jalur belajar" as const;

export const AKADEMIK_KURIKULUM_SECTION_INTRO =
  "Kurikulum Merdeka, penilaian autentik, dan pembelajaran berjenjang dari fondasi kelas X hingga PKL dan uji kompetensi keahlian." as const;

export const AKADEMIK_KURIKULUM_PARAGRAPHS = [
  "SMK TEKNOVO mengimplementasikan Kurikulum Merdeka dengan pembelajaran berbasis proyek, capaian pembelajaran yang terukur, dan penguatan literasi serta numerasi. Mata pelajaran umum dipadukan dengan muatan lokal dan program kejuruan sesuai pilihan siswa.",
  "Proses belajar didukung asesmen formatif-sumatif, rapor digital, serta integrasi LMS sekolah agar guru, siswa, dan orang tua dapat memantau perkembangan kompetensi secara transparan.",
] as const;

export const AKADEMIK_KURIKULUM_NARRATIVE = AKADEMIK_KURIKULUM_PARAGRAPHS;

export const AKADEMIK_PATHWAY_STEPS: readonly AkademikPathwayStep[] = [
  {
    tingkat: "Kelas X",
    fase: "Fondasi & eksplorasi",
    bullets: [
      "Penguatan literasi, numerasi, dan karakter unggulan",
      "Pengenalan dasar program kejuruan dan keselamatan kerja",
      "Orientasi LMS, rapor digital, dan budaya belajar sekolah",
    ],
  },
  {
    tingkat: "Kelas XI",
    fase: "Penguatan kejuruan",
    bullets: [
      "Proyek kejuruan dan praktik bengkel atau layanan",
      "P5 serta portofolio kompetensi terukur",
      "Persiapan penempatan mitra PKL sesuai jurusan",
    ],
  },
  {
    tingkat: "Kelas XII",
    fase: "Kesiapan UKK & kelulusan",
    bullets: [
      "Simulasi uji kompetensi keahlian (UKK)",
      "Bimbingan karier, studi lanjut, atau dunia kerja",
      "Refleksi capaian dan dokumentasi prestasi",
    ],
  },
  {
    tingkat: "PKL",
    fase: "Praktik industri",
    bullets: [
      "Penempatan terstruktur di mitra DU/DI",
      "Supervisi guru produktif dan laporan berkala",
      "Integrasi pengalaman kerja ke penilaian autentik",
    ],
  },
] as const;

export const AKADEMIK_DIGITAL_SPLIT_TITLE = "Kurikulum terintegrasi digital" as const;

export const AKADEMIK_DIGITAL_SPLIT_PARAGRAPHS = [
  `Rapor digital, LMS, dan portal ${BRAND_SHORT} memudahkan guru, siswa, dan orang tua memantau perkembangan kompetensi secara transparan — selaras dengan capaian Kurikulum Merdeka.`,
  "Literasi digital, etika daring, dan tata kelola data sekolah dijaga agar teknologi mendukung pembelajaran, bukan sekadar administrasi.",
] as const;

export const AKADEMIK_KURIKULUM_CTA = {
  href: "/akademik/program-digital",
  label: "Lihat ekosistem digital",
} as const;

export const AKADEMIK_DIGITAL_SECTION_TITLE = "Ekosistem digital" as const;

export const AKADEMIK_DIGITAL_SECTION_INTRO =
  "Layanan daring terintegrasi untuk pembelajaran, administrasi akademik, dan pendaftaran siswa baru." as const;

export const AKADEMIK_DIGITAL_ITEMS: readonly AkademikDigitalItem[] = [
  {
    id: "portal",
    title: "Portal Siswa & Guru",
    description:
      "Akses terpusat ke jadwal, presensi, nilai, dan komunikasi akademik — masuk melalui halaman autentikasi sekolah dengan peran sesuai RBAC.",
    href: PUBLIC_SITE_PORTAL_LOGIN_HREF,
    hrefLabel: "Masuk portal",
  },
  {
    id: "elearning",
    title: "E-Learning & LMS",
    description:
      "Materi digital, tugas, dan umpan balik guru dalam lingkungan belajar daring yang selaras kurikulum kejuruan.",
    href: "/fasilitas/lms-sekolah",
    hrefLabel: "Lihat fasilitas LMS",
  },
  {
    id: "ppdb",
    title: "PPDB Online",
    description:
      "Pendaftaran peserta didik baru secara daring — formulir, unggah berkas, dan pantau status pendaftaran dari satu pintu.",
    href: PUBLIC_SITE_PPDB_HREF,
    hrefLabel: "Buka PPDB",
  },
] as const;

export const AKADEMIK_FOOTER_CTA_EYEBROW = "Program akademik" as const;

export const AKADEMIK_FOOTER_CTA_TITLE = "Siap menelusuri program akademik?" as const;

export const AKADEMIK_FOOTER_CTA_BODY =
  "Daftar PPDB untuk tahun ajaran berikutnya, atau hubungi sekolah untuk konsultasi jurusan, kurikulum, dan jadwal kunjungan sekolah." as const;

export const AKADEMIK_FOOTER_CTA_KONTAK_HREF = "/kontak" as const;

export const PENGAJAR_SECTION_TITLE = "Tenaga pengajar & pembinaan" as const;

export const PENGAJAR_SECTION_INTRO = [
  "Guru mapel umum dan produktif dibimbing melalui komunitas belajar sekolah, supervisi akademik, dan penyesuaian dengan kebutuhan industri mitra PKL.",
  "Kualitas pengajaran dijaga melalui sertifikasi, pengembangan profesional berkelanjutan, serta kolaborasi dengan dunia usaha dan industri.",
] as const;

export const PENGAJAR_QUOTES: readonly PengajarQuoteItem[] = [
  {
    nama: BRAND_KEPALA_NAMA,
    jabatan: BRAND_KEPALA_JABATAN,
    quote:
      "Pendidikan vokasi di SMK harus menyatukan kompetensi teknis, karakter, dan kesiapan kerja — dengan pengajar yang dekat dengan perkembangan industri.",
    fotoSrc: BRAND_KEPALA_FOTO_SRC,
  },
  {
    nama: "Komunitas Guru Produktif",
    jabatan: "Koordinator mapel kejuruan",
    quote:
      "Praktik bengkel dan proyek autentik menjadi jantung pembelajaran — guru memfasilitasi siswa menyelesaikan masalah nyata dengan standar industri.",
  },
  {
    nama: "Tim Pembina Akademik",
    jabatan: "Supervisi & literasi digital",
    quote:
      "Integrasi LMS dan rapor digital membantu kami memantau capaian siswa secara adil, transparan, dan selaras Kurikulum Merdeka.",
  },
] as const;

export const PENGAJAR_PILLARS: readonly PengajarPillarItem[] = [
  {
    id: "komunitas-belajar",
    title: "Komunitas belajar guru",
    description:
      "MGMP, refleksi praktik mengajar, dan pertukaran materi antar mapel umum maupun produktif secara berkala.",
  },
  {
    id: "sertifikasi",
    title: "Sertifikasi & kompetensi",
    description:
      "Penguatan kompetensi pedagogik dan keahlian bidang melalui pelatihan, sertifikasi, dan supervisi akademik terstruktur.",
  },
  {
    id: "mitra-industri",
    title: "Kolaborasi mitra industri",
    description:
      "Penyelarasan materi praktik dengan standar DU/DI mitra PKL agar siswa mengenal budaya kerja sebelum lulus.",
  },
] as const;

export const PENGAJAR_FEATURED_INTRO =
  "Profil pengajar aktif dan bidang keahlian yang mendampingi pembelajaran vokasi di SMK TEKNOVO." as const;

export const PENGAJAR_CTA_EYEBROW = "Komunitas pendidik" as const;

export const PENGAJAR_CTA_TITLE = "Konsultasi kurikulum & pengajar" as const;

export const PENGAJAR_CTA_BODY =
  "Hubungi sekolah untuk informasi struktur mapel, atau masuk portal untuk layanan akademik sesuai peran Anda." as const;

export const PENGAJAR_CTA_KONTAK_HREF = "/kontak" as const;

export const PENGAJAR_CTA_PORTAL_HREF = PUBLIC_SITE_PORTAL_LOGIN_HREF;

export const PENGAJAR_CTA_PORTAL_LABEL = "Masuk portal" as const;

export const JURUSAN_SECTION_TITLE = "Program Kejuruan" as const;

export const JURUSAN_SECTION_INTRO = [
  "Setiap jurusan dirancang dengan pembelajaran berbasis proyek, praktik bengkel atau layanan, serta penilaian autentik yang selaras capaian lulusan SMK.",
  "Siswa mengikuti PKL terstruktur, persiapan uji kompetensi keahlian (UKK), dan pembinaan karakter agar siap melanjutkan studi vokasi atau masuk dunia kerja.",
] as const;

export const AKADEMIK_KURIKULUM_PAGE_TITLE = AKADEMIK_KURIKULUM_SECTION_TITLE;

export const AKADEMIK_KURIKULUM_PAGE_LEDE = AKADEMIK_KURIKULUM_SECTION_INTRO;

export const AKADEMIK_JURUSAN_PAGE_TITLE = JURUSAN_SECTION_TITLE;

export const AKADEMIK_JURUSAN_PAGE_LEDE = JURUSAN_SECTION_INTRO[0];

export const AKADEMIK_PENGAJAR_PAGE_TITLE = PENGAJAR_SECTION_TITLE;

export const AKADEMIK_PENGAJAR_PAGE_LEDE = PENGAJAR_SECTION_INTRO[0];

export const AKADEMIK_DIGITAL_PAGE_TITLE = AKADEMIK_DIGITAL_SECTION_TITLE;

export const AKADEMIK_DIGITAL_PAGE_LEDE = AKADEMIK_DIGITAL_SECTION_INTRO;

export const AKADEMIK_OVERVIEW_TEASERS: readonly AkademikOverviewTeaser[] = [
  {
    iconKey: "kurikulum",
    title: AKADEMIK_KURIKULUM_SECTION_TITLE,
    description: AKADEMIK_KURIKULUM_SECTION_INTRO,
    href: "/akademik/kurikulum",
    linkLabel: "Telusuri kurikulum",
  },
  {
    iconKey: "jurusan",
    title: JURUSAN_SECTION_TITLE,
    description: JURUSAN_SECTION_INTRO[0],
    href: "/akademik/jurusan",
    linkLabel: "Lihat program jurusan",
  },
  {
    iconKey: "pengajar",
    title: PENGAJAR_SECTION_TITLE,
    description: PENGAJAR_SECTION_INTRO[0],
    href: "/akademik/pengajar",
    linkLabel: "Kenali pengajar",
  },
  {
    iconKey: "digital",
    title: AKADEMIK_DIGITAL_SECTION_TITLE,
    description: AKADEMIK_DIGITAL_SECTION_INTRO,
    href: "/akademik/program-digital",
    linkLabel: "Ekosistem digital",
  },
] as const;

export const JURUSAN_STAT_LABELS = {
  jurusan: "Jurusan aktif",
  pkl: "PKL terstruktur",
  sertifikasi: "Jalur UKK & sertifikasi",
} as const;

export const JURUSAN_PKL_BAND = {
  title: "PKL & kompetensi industri",
  description:
    "Praktik Kerja Lapangan memadukan pengalaman di mitra DU/DI dengan bimbingan guru produktif. Siswa mengenal budaya kerja, standar keselamatan, dan tanggung jawab profesional sebelum lulus.",
  highlights: [
    "Penempatan mitra sesuai jurusan",
    "Laporan dan supervisi berkala",
    "Refleksi kompetensi pasca-PKL",
  ],
} as const;

export const JURUSAN_CTA_EYEBROW = "Penjurusan" as const;

export const JURUSAN_CTA_TITLE = "Siap memilih program kejuruan?" as const;

export const JURUSAN_CTA_BODY =
  "Daftar PPDB untuk tahun ajaran berikutnya, atau telusuri ringkasan lengkap program pembinaan di halaman program sekolah." as const;

/** Tiga poin unggulan per kode jurusan (DB / singkatan). */
export const JURUSAN_HIGHLIGHTS_BY_KODE: Readonly<Record<string, readonly string[]>> = {
  TM: [
    "Workshop & bengkel praktik",
    "Keselamatan kerja industri",
    "Siap PKL & uji kompetensi",
  ],
  ULW: [
    "Layanan wisata & pariwisata",
    "Manajemen destinasi & guiding",
    "Kemitraan industri pariwisata",
  ],
};

const JURUSAN_COVER_ROTATION = [
  LANDING_MEDIA.fasilitas.laboratoriumWebp,
  LANDING_MEDIA.fasilitas.lmsWebp,
  LANDING_MEDIA.fasilitas.perpustakaanWebp,
  LANDING_MEDIA.kegiatan.ekstraCodingClubWebp,
] as const;

const KODE_TO_LANDING_SLUG: Record<string, string> = {
  TM: "teknik-mesin",
  ULW: "unit-layanan-wisata",
};

export const AKADEMIK_KURIKULUM_PILLARS: readonly AkademikPillarItem[] = [
  {
    id: "proyek",
    title: "Pembelajaran berbasis proyek",
    description:
      "P5, proyek kejuruan, dan portofolio siswa menjadi bagian rutin untuk melatih pemecahan masalah dan kolaborasi.",
  },
  {
    id: "literasi",
    title: "Literasi & numerasi",
    description:
      "Penguatan kemampuan dasar di semua mapel agar siswa siap membaca data, berkomunikasi, dan bernalar secara mandiri.",
  },
  {
    id: "penilaian",
    title: "Penilaian autentik",
    description:
      "Formatif dan sumatif diselaraskan capaian lulusan; hasilnya tercatat di rapor digital dan dashboard sekolah.",
  },
  {
    id: "karakter",
    title: "Karakter & kepemimpinan",
    description:
      "Pembinaan melalui OSIS, ekstrakurikuler, dan program rutin sekolah — menyelaraskan kompetensi teknis dengan integritas.",
  },
] as const;

export const AKADEMIK_JURUSAN_ITEMS: readonly AkademikJurusanItem[] = [
  {
    id: "teknik-mesin",
    title: "Teknik Mesin",
    description:
      "Penguasaan dasar-dasar teknik mesin, workshop, dan keselamatan kerja — menyiapkan siswa untuk melanjutkan ke vokasi atau dunia industri.",
    coverSrc: LANDING_MEDIA.akademik.jurusanTeknikMesinWebp,
    highlights: ["Workshop & bengkel praktik", "Keselamatan kerja industri", "Siap PKL & uji kompetensi"],
  },
  {
    id: "unit-layanan-wisata",
    title: "Unit Layanan Wisata",
    description:
      "Kompetensi layanan wisata, manajemen destinasi, dan operasional pariwisata dengan praktik berbasis studi kasus mitra industri.",
    coverSrc: LANDING_MEDIA.akademik.jurusanUlwWebp,
    highlights: ["Layanan wisata & pariwisata", "Manajemen destinasi & guiding", "Kemitraan industri pariwisata"],
  },
] as const;

const LANDING_ITEM_BY_SLUG = Object.fromEntries(
  AKADEMIK_JURUSAN_ITEMS.map((item) => [item.id, item]),
) as Record<string, AkademikJurusanItem>;

export function normalizeJurusanKode(kode: string): string {
  return kode.trim().toUpperCase();
}

export function getJurusanHighlightsByKode(kode: string): readonly string[] {
  const normalized = normalizeJurusanKode(kode);
  const fromMap = JURUSAN_HIGHLIGHTS_BY_KODE[normalized];
  if (fromMap && fromMap.length > 0) {
    return fromMap.slice(0, 3);
  }
  const slug = KODE_TO_LANDING_SLUG[normalized] ?? kode.trim().toLowerCase().replace(/_/g, "-");
  const item = LANDING_ITEM_BY_SLUG[slug];
  if (item) {
    return item.highlights.slice(0, 3);
  }
  return ["Praktik terstruktur", "PKL & mitra industri", "Jalur uji kompetensi"];
}

export function getJurusanLandingCover(kode: string, fallbackIndex: number): string {
  const normalized = normalizeJurusanKode(kode);
  const slug = KODE_TO_LANDING_SLUG[normalized] ?? kode.trim().toLowerCase().replace(/_/g, "-");
  const item = LANDING_ITEM_BY_SLUG[slug];
  if (item) {
    return item.coverSrc;
  }
  return JURUSAN_COVER_ROTATION[fallbackIndex % JURUSAN_COVER_ROTATION.length] ?? JURUSAN_COVER_ROTATION[0];
}

export function formatJurusanKodeBadge(kode: string): string {
  const normalized = normalizeJurusanKode(kode);
  if (normalized.length <= 4 && !normalized.includes("_")) {
    return normalized;
  }
  const short = KODE_TO_LANDING_SLUG[normalized];
  if (short === "teknik-mesin") return "TM";
  if (short === "unit-layanan-wisata") return "ULW";
  return normalized.replace(/_/g, " ");
}

export const AKADEMIK_PENGAJAR_PARAGRAPHS = [
  "Tenaga pengajar mapel produktif dan umum dibimbing melalui komunitas belajar sekolah, supervisi akademik, dan penyesuaian dengan kebutuhan industri mitra PKL.",
  "Daftar pengajar resmi, struktur mapel, dan jadwal konsultasi dapat diminta melalui bagian kurikulum atau tata usaha sekolah.",
] as const;
