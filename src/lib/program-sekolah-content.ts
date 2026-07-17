import { AKADEMIK_JURUSAN_ITEMS } from "@/lib/akademik-landing-content";
import { BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import {
  PUBLIC_SITE_PORTAL_LOGIN_HREF,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";

export type ProgramPembinaanIconKey = "kurikulum" | "pkl" | "sertifikasi" | "literasi-digital";

export type ProgramPembinaanItem = {
  id: ProgramPembinaanIconKey;
  title: string;
  summary: string;
  description: string;
  coverSrc: string;
};

export type ProgramDigitalIconKey = "portal" | "elearning" | "ppdb";

export type ProgramDigitalItem = {
  id: ProgramDigitalIconKey;
  title: string;
  description: string;
  href: string;
  hrefLabel: string;
};

export const PROGRAM_SEKOLAH_HERO_EYEBROW = "Profil sekolah" as const;

export const PROGRAM_SEKOLAH_PAGE_TITLE = "Program Sekolah" as const;

export const PROGRAM_SEKOLAH_PAGE_LEDE =
  `Ringkasan program pembinaan ${BRAND_SHORT}: kurikulum kejuruan, PKL, sertifikasi, literasi digital, dan layanan daring—untuk calon siswa dan orang tua sebelum memilih jurusan.` as const;

/** @deprecated Gunakan {@link PROGRAM_SEKOLAH_PAGE_LEDE} untuk intro halaman. */
export const PROGRAM_SEKOLAH_PAGE_SUBTITLE = PROGRAM_SEKOLAH_PAGE_LEDE;

export const PROGRAM_SEKOLAH_HERO_IMAGE_SRC = LANDING_MEDIA.misc.aktivitasUmumJpg;

export const PROGRAM_SEKOLAH_HERO_INTRO = [
  `${BRAND_SCHOOL_FULL} (${BRAND_SHORT}) menyelenggarakan program pembinaan terpadu: kurikulum kejuruan, praktik industri, sertifikasi kompetensi, dan literasi digital berkarakter.`,
  "Halaman ini merangkum pilar pembinaan, jurusan kejuruan yang aktif, serta layanan digital sekolah — sebagai referensi sebelum mengikuti PPDB atau berkolaborasi dengan dunia usaha dan industri.",
] as const;

export const PROGRAM_SEKOLAH_PEMBINAAN_SECTION_TITLE = "Program pembinaan" as const;

export const PROGRAM_SEKOLAH_PEMBINAAN_SECTION_INTRO =
  "Empat pilar utama yang memperkuat capaian lulusan dan kesiapan kerja di era digital." as const;

export const PROGRAM_SEKOLAH_PEMBINAAN_ITEMS: readonly ProgramPembinaanItem[] = [
  {
    id: "kurikulum",
    title: "Kurikulum Merdeka & Jurusan",
    summary: "Pembelajaran berbasis proyek dan capaian lulusan terukur.",
    description:
      "Kurikulum Merdeka diperkuat muatan kejuruan per jurusan, P5, portofolio siswa, serta penilaian autentik. Rapor digital dan LMS memudahkan guru, siswa, dan orang tua memantau perkembangan kompetensi secara transparan.",
    coverSrc: LANDING_MEDIA.fasilitas.lmsJpg,
  },
  {
    id: "pkl",
    title: "Praktik Kerja Lapangan (PKL)",
    summary: "Kemitraan DU/DI dan pengalaman kerja nyata.",
    description:
      "PKL terstruktur dengan mitra dunia usaha dan industri setempat. Siswa mengenal budaya kerja, standar keselamatan, serta tanggung jawab profesional sebelum melangkah ke dunia kerja atau pendidikan lanjutan.",
    coverSrc: LANDING_MEDIA.kegiatan.ekstraCodingClubJpg,
  },
  {
    id: "sertifikasi",
    title: "Sertifikasi & Kompetensi",
    summary: "Uji kompetensi keahlian dan sertifikasi bidang.",
    description:
      "Program persiapan uji kompetensi keahlian (UKK) dan sertifikasi yang relevan dengan jurusan — dari workshop teknik mesin hingga layanan wisata — agar lulusan memiliki bukti kompetensi yang diakui industri.",
    coverSrc: LANDING_MEDIA.fasilitas.laboratoriumJpg,
  },
  {
    id: "literasi-digital",
    title: "Literasi Digital & Karakter",
    summary: "Teknologi etis, kepemimpinan siswa, dan karakter unggulan.",
    description:
      "Literasi digital, etika daring, kegiatan ekstrakurikuler teknologi, serta pembinaan karakter melalui OSIS, pramuka, dan program rutin sekolah — menyelaraskan kompetensi teknis dengan integritas dan sportivitas.",
    coverSrc: LANDING_MEDIA.kegiatan.ekstraBloggerClubJpg,
  },
] as const;

export const PROGRAM_SEKOLAH_JURUSAN_SECTION_TITLE = "Jurusan kejuruan" as const;

export const PROGRAM_SEKOLAH_JURUSAN_SECTION_INTRO =
  "Program kejuruan aktif yang tersedia — data diperbarui dari master jurusan sekolah." as const;

export const PROGRAM_SEKOLAH_DIGITAL_SECTION_TITLE = "Ekosistem digital" as const;

export const PROGRAM_SEKOLAH_DIGITAL_SECTION_INTRO =
  "Layanan daring terintegrasi untuk pembelajaran, administrasi, dan pendaftaran siswa baru." as const;

export const PROGRAM_SEKOLAH_DIGITAL_ITEMS: readonly ProgramDigitalItem[] = [
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
    href: "/akademik/kurikulum",
    hrefLabel: "Lihat kurikulum",
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

export const PROGRAM_SEKOLAH_CTA_TITLE = "Siap memilih jurusan dan bergabung?" as const;

export const PROGRAM_SEKOLAH_CTA_BODY =
  "Mulai pendaftaran PPDB atau telusuri ringkasan jurusan dan kurikulum di halaman akademik." as const;

export const PROGRAM_SEKOLAH_CTA_JURUSAN_HREF = "/akademik/jurusan" as const;

/** Deskripsi satu baris untuk kartu jurusan publik — kunci `kode` DB atau slug landing. */
function buildJurusanDeskripsiMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const kodeBySlug: Record<string, string> = {
    "teknik-mesin": "TM",
    "unit-layanan-wisata": "ULW",
  };
  for (const item of AKADEMIK_JURUSAN_ITEMS) {
    map[item.id] = item.description;
    const kode = kodeBySlug[item.id];
    if (kode) {
      map[kode] = item.description;
    }
  }
  map.TM = map.TM ?? map["teknik-mesin"];
  map.ULW = map.ULW ?? map["unit-layanan-wisata"];
  return map;
}

export const JURUSAN_PUBLIK_DESKRIPSI_BY_KODE: Readonly<Record<string, string>> =
  buildJurusanDeskripsiMap();

export function getJurusanPublikDeskripsi(kode: string): string {
  const key = kode.trim();
  return (
    JURUSAN_PUBLIK_DESKRIPSI_BY_KODE[key] ??
    JURUSAN_PUBLIK_DESKRIPSI_BY_KODE[key.toUpperCase()] ??
    JURUSAN_PUBLIK_DESKRIPSI_BY_KODE[key.toLowerCase()] ??
    `Program kejuruan ${BRAND_SHORT} — kompetensi terstruktur, PKL, dan jalur sertifikasi.`
  );
}
