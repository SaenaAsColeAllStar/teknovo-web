import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FolderOpen,
  GraduationCap,
  Headphones,
  MessageCircleQuestion,
  Trophy,
  Users,
} from "lucide-react";

import { BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";

export const PPDB_CARD_SHELL_CLASS =
  "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

export const PPDB_ICON_WRAP_CLASS =
  "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";

export const PPDB_ACADEMIC_YEAR = "Tahun Ajaran 2026/2027";

/** Kontak PPDB untuk teks layar (bukan rahasia). */
export const PPDB_CONTACT_EMAIL = "info@smateknovo.sch.id" as const;
export const PPDB_CONTACT_WA_DISPLAY = "0898-8131-858" as const;
export const PPDB_CONTACT_HOURS = "Senin–Jumat, 08.00–15.00 WIB" as const;

export const PPDB_HERO_HEADLINE = "Penerimaan Peserta Didik Baru";

export const PPDB_HERO_ACCENT = "SMK Teknovo";

export const PPDB_HERO_DESCRIPTION =
  `${BRAND_SCHOOL_FULL} di Rancasari, Pamanukan, Kabupaten Subang membuka PPDB ${PPDB_ACADEMIC_YEAR} untuk lulusan SMP/MTs. Daftar online via WhatsApp atau formulir resmi — jadwal gelombang, syarat berkas, jurusan Teknik Mesin (TM) & Unit Layanan Wisata (ULW), akreditasi A.`;

export type PpdbQuickInfoItem = {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

export const PPDB_QUICK_INFO_ITEMS: readonly PpdbQuickInfoItem[] = [
  {
    id: "gelombang",
    title: "Gelombang pendaftaran",
    body: "Gelombang 1: 1 Maret – 30 April 2026. Gelombang 2: 1 Mei – 30 Juni 2026 (selama kuota jurusan masih tersedia).",
    icon: CalendarDays,
  },
  {
    id: "biaya",
    title: "Biaya administrasi",
    body: "Biaya pendaftaran dan administrasi mengikuti keputusan yayasan sekolah. Rincian nominal dan tata cara pembayaran diinformasikan setelah verifikasi berkas awal.",
    icon: CreditCard,
  },
  {
    id: "bantuan",
    title: "Bantuan PPDB",
    body: `${PPDB_CONTACT_HOURS} · WhatsApp: ${PPDB_CONTACT_WA_DISPLAY} · Email: ${PPDB_CONTACT_EMAIL}`,
    icon: Headphones,
  },
] as const;

export type PpdbProcessStep = {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  emphasis?: boolean;
};

export const PPDB_PROCESS_STEPS: readonly PpdbProcessStep[] = [
  {
    step: 1,
    title: "Ajukan pendaftaran",
    description:
      "Hubungi WhatsApp resmi PPDB atau isi formulir online. Siapkan data calon siswa, kontak orang tua, dan minat jurusan (Teknik Mesin atau Unit Layanan Wisata).",
    icon: ClipboardList,
  },
  {
    step: 2,
    title: "Verifikasi berkas",
    description:
      "Lengkapi tiga dokumen wajib: akta kelahiran, ijazah SD, dan ijazah SMP atau SKL (bila ijazah SMP belum terbit). Unggah melalui formulir online atau serahkan ke Tata Usaha.",
    icon: FolderOpen,
  },
  {
    step: 3,
    title: "Seleksi sekolah",
    description:
      "Calon mengikuti tes dan/atau wawancara sesuai jadwal yang dikirim ke WhatsApp dan email aktif. Tidak ada klaim jalur khusus di luar kebijakan resmi sekolah.",
    icon: MessageCircleQuestion,
  },
  {
    step: 4,
    title: "Pengumuman & daftar ulang",
    description:
      "Peserta yang dinyatakan diterima melakukan daftar ulang dan pembayaran administrasi sesuai instruksi sekolah untuk mengamankan tempat di kelas.",
    icon: BadgeCheck,
    emphasis: true,
  },
] as const;

export type PpdbAdmissionPath = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  emphasis?: boolean;
};

export const PPDB_ADMISSION_PATHS: readonly PpdbAdmissionPath[] = [
  {
    id: "akademik",
    title: "Rekomendasi sekolah asal",
    description:
      "Calon dari SMP/MTs mitra atau yang membawa surat pengantar resmi dapat mengikuti alur verifikasi prioritas, tetap melalui seleksi dan kuota jurusan.",
    icon: GraduationCap,
  },
  {
    id: "prestasi",
    title: "Jalur prestasi",
    description:
      "Sertifikat kompetensi, portofolio kejuruan, atau prestasi akademik/ekstrakurikuler menjadi bahan pertimbangan tambahan, bukan jaminan diterima.",
    icon: Trophy,
  },
  {
    id: "reguler",
    title: "Pendaftaran reguler",
    description:
      "Terbuka untuk seluruh lulusan SMP/MTs sederajat sesuai jadwal gelombang dan kuota program keahlian yang tersedia.",
    icon: Users,
    emphasis: true,
  },
] as const;

export type PpdbDocumentItem = {
  title: string;
  detail: string;
};

export const PPDB_REQUIRED_DOCUMENTS: readonly PpdbDocumentItem[] = [
  {
    title: "Akta Kelahiran",
    detail: "Fotokopi atau scan akta kelahiran calon siswa — wajib untuk pencocokan identitas pada berkas penerimaan.",
  },
  {
    title: "Ijazah SD",
    detail: "Fotokopi atau scan ijazah Sekolah Dasar (SD/MI) — wajib.",
  },
  {
    title: "Ijazah SMP",
    detail: "Bisa diganti dengan Surat Keterangan Lulus/SKL jika ijazah asli belum terbit.",
  },
] as const;

export type PpdbImportantDate = {
  period: string;
  title: string;
  description: string;
};

export const PPDB_IMPORTANT_DATES: readonly PpdbImportantDate[] = [
  {
    period: "1 Mar – 30 Apr 2026",
    title: "Gelombang 1",
    description: "Pendaftaran dan pengumpulan berkas awal; kuota per jurusan diisi berdasarkan urutan verifikasi lengkap.",
  },
  {
    period: "1 Mei – 30 Jun 2026",
    title: "Gelombang 2",
    description: "Pendaftaran lanjutan selama kuota Teknik Mesin dan Unit Layanan Wisata masih tersedia.",
  },
  {
    period: "Sesuai pengumuman",
    title: "Seleksi & wawancara",
    description: "Jadwal tes dan wawancara dikirim ke WhatsApp serta email orang tua/wali yang terdaftar.",
  },
  {
    period: "Setelah seleksi",
    title: "Pengumuman & daftar ulang",
    description: "Hasil kelulusan dan tenggat daftar ulang diumumkan melalui portal PPDB dan kontak resmi sekolah.",
  },
] as const;

export type PpdbFaqItem = {
  question: string;
  answer: string;
};

export const PPDB_FAQ_ITEMS: readonly PpdbFaqItem[] = [
  {
    question: "Dokumen apa saja yang wajib dilampirkan?",
    answer:
      "Tiga dokumen wajib: (1) Akta Kelahiran, (2) Ijazah SD, dan (3) Ijazah SMP atau Surat Keterangan Lulus (SKL) bila ijazah SMP belum diterbitkan. Unggah melalui formulir online (langkah Berkas) atau serahkan ke Tata Usaha saat verifikasi.",
  },
  {
    question: "Siapa yang boleh mendaftar?",
    answer:
      "Lulusan SMP/MTs sederajat atau peserta didik yang memenuhi persyaratan usia dan dokumen sesuai peraturan penerimaan SMK. Pendaftaran diisi oleh orang tua/wali atau calon siswa dengan pengawasan keluarga.",
  },
  {
    question: "Apakah harus online atau bisa ke sekolah?",
    answer:
      "Anda dapat memulai lewat WhatsApp resmi PPDB atau formulir di halaman ini. Penyerahan berkas fisik dan konsultasi tatap muka tetap dilayani di jam operasional Tata Usaha.",
  },
  {
    question: "Program kejuruan apa saja yang dibuka?",
    answer:
      "Untuk tahun ajaran ini tersedia Teknik Mesin dan Unit Layanan Wisata. Pilih minat utama dan alternatif pada formulir; penempatan akhir mengikuti kuota dan hasil seleksi.",
  },
  {
    question: "Bagaimana jika kuota gelombang pertama penuh?",
    answer:
      "Daftar di gelombang 2 selama kuota masih ada, atau hubungi Tata Usaha untuk informasi daftar tunggu sesuai kebijakan sekolah.",
  },
  {
    question: "Berapa biaya pendaftaran dan administrasi?",
    answer:
      "Nominal dan jadwal pembayaran mengikuti keputusan yayasan. Rincian diberikan setelah berkas diverifikasi — tidak ada pembayaran di luar instruksi resmi sekolah.",
  },
  {
    question: "Kapan pengumuman hasil seleksi?",
    answer:
      "Jadwal pengumuman diinformasikan melalui WhatsApp, email, dan halaman portal PPDB. Pastikan nomor HP dan email yang Anda isi aktif dan rutin diperiksa.",
  },
] as const;

export const PPDB_PROCESS_INTRO =
  `Empat tahap PPDB ${BRAND_SHORT} — dari pengajuan hingga daftar ulang — dirancang agar orang tua dapat memantau progres dengan jelas.`;

export const PPDB_PATHS_INTRO =
  "Semua jalur di bawah ini tetap melalui verifikasi berkas dan seleksi sekolah; tidak ada jaminan otomatis masuk tanpa memenuhi persyaratan.";

export const PPDB_DOCUMENTS_INTRO =
  "Tiga dokumen berikut wajib dilengkapi sebelum verifikasi. Format unggah: JPG, PNG, atau PDF (maks. 4 MB per berkas).";

export const PPDB_DATES_INTAKE_LABEL = "Jadwal 2026/2027";

export const PPDB_FAQ_SECTION_INTRO =
  "Jawaban ringkas untuk pertanyaan yang sering diajukan orang tua dan calon siswa.";

export const PPDB_CHANNEL_SECTION_TITLE = "Pilih cara mendaftar";

export const PPDB_CHANNEL_SECTION_INTRO =
  "Gunakan salah satu kanal resmi di bawah ini. Data pribadi tidak disertakan di tautan WhatsApp; lengkapi setelah chat terbuka.";

export const PPDB_CHANNEL_WA_BODY =
  `Chat ke nomor resmi PPDB (${PPDB_CONTACT_WA_DISPLAY}). Pesan pembuka sudah disiapkan; silakan isi nama calon siswa, asal SMP, minat jurusan, dan nomor HP orang tua sebelum mengirim.`;

export const PPDB_CHANNEL_FORM_BODY =
  "Formulir enam langkah (termasuk unggah berkas) dengan tinjauan data sebelum dikirim. Setelah berhasil, Anda mendapat nomor pendaftaran untuk disimpan.";
