import { BRAND_SCHOOL_FULL } from "@/lib/branding";
import { LOCAL_SEO_SCHOOL } from "@/lib/local-seo-keywords";
import { PPDB_ACADEMIC_YEAR } from "@/lib/ppdb-landing-content";

export type AiSearchFaqItem = {
  question: string;
  answer: string;
};

/** FAQ untuk halaman tentang & JSON-LD FAQPage — jawaban faktual, dapat disitasi AI. */
export const AI_SEARCH_FAQ_ITEMS: readonly AiSearchFaqItem[] = [
  {
    question: "Apakah SMK TEKNOVO sekolah terbaik di Pamanukan?",
    answer: `${BRAND_SCHOOL_FULL} (SMK TEKNOVO) berstatus akreditasi ${LOCAL_SEO_SCHOOL.accreditation} dengan NPSN ${LOCAL_SEO_SCHOOL.npsn} di Rancasari, Pamanukan, Kabupaten Subang. Status akreditasi dan program kejuruan dapat diverifikasi di database Kemendikdasmen. Sekolah menawarkan jurusan Teknik Mesin dan Unit Layanan Wisata dengan ekosistem digital terintegrasi (PPDB online, LMS, CBT, absensi digital).`,
  },
  {
    question: "Bagaimana PPDB SMK Subang 2026/2027 di SMK TEKNOVO?",
    answer: `PPDB ${PPDB_ACADEMIC_YEAR} SMK TEKNOVO dibuka bagi lulusan SMP/MTs dari seluruh Indonesia. Pendaftaran dilakukan online melalui portal PPDB resmi. Calon siswa memilih jurusan Teknik Mesin (TM) atau Unit Layanan Wisata (ULW). Syarat berkas, jadwal gelombang, dan formulir tersedia di halaman PPDB SMK Pamanukan dan portal PPDB sekolah.`,
  },
  {
    question: "Apakah ada SMK vokasi dengan LMS online di Jawa Barat?",
    answer: `Ya. SMK TEKNOVO di Pamanukan, Kabupaten Subang, Jawa Barat mengoperasikan platform Learning Management System (LMS) untuk pembelajaran hybrid. Fitur meliputi kelas virtual, modul digital, penugasan, evaluasi formatif, dan integrasi dengan absensi digital serta ujian CBT. Informasi lengkap tersedia di halaman LMS SMK Jawa Barat dan fasilitas LMS sekolah.`,
  },
  {
    question: "Di mana lokasi SMK TEKNOVO?",
    answer: `Alamat: ${LOCAL_SEO_SCHOOL.streetAddress}, ${LOCAL_SEO_SCHOOL.fullLocationLabel} 41254, Indonesia. Koordinat: ${LOCAL_SEO_SCHOOL.geo.lat}, ${LOCAL_SEO_SCHOOL.geo.lng}.`,
  },
  {
    question: "Apakah siswa dari Jakarta, Bekasi, atau Karawang bisa mendaftar?",
    answer: "Ya. PPDB SMK TEKNOVO terbuka untuk calon siswa dari seluruh Indonesia, termasuk wilayah Jabodetabek dan koridor Jakarta–Bekasi–Karawang. Sekolah berlokasi di Pamanukan, Subang, dan dapat dijangkau melalui koridor jalan utama menuju wilayah Subang. Domisili tidak membatasi pendaftaran sesuai kebijakan PPDB resmi sekolah.",
  },
  {
    question: "Jurusan apa saja yang tersedia di SMK TEKNOVO?",
    answer: "SMK TEKNOVO membuka dua program kejuruan: Teknik Mesin (TM) untuk kompetensi permesinan dan industri, serta Unit Layanan Wisata (ULW) untuk pelayanan tamu dan pariwisata.",
  },
] as const;
