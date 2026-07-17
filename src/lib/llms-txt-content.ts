import { buildLandingAbsoluteUrl } from "@/lib/berita-seo";
import { BRAND_MAPS_URL, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { LOCAL_SEO_SCHOOL } from "@/lib/local-seo-keywords";
import {
  PUBLIK_CONTACT_EMAIL,
  PUBLIK_CONTACT_HOURS,
  PUBLIK_CONTACT_WA_DISPLAY,
} from "@/lib/kontak-publik";
import { PPDB_ACADEMIC_YEAR } from "@/lib/ppdb-landing-content";

const AKREDITASI_PROOF_URL =
  "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/70036813";

const CANONICAL_ORIGIN = buildLandingAbsoluteUrl("");

/** Ringkasan fakta untuk AI crawler — format llms.txt. */
export function buildLlmsTxtContent(): string {
  return [
    `# ${BRAND_SHORT} — SMK TEKNOVO`,
    `# Panduan ringkas untuk asisten AI & mesin pencarian`,
    "",
    `> ${BRAND_SCHOOL_FULL} (SMK TEKNOVO) adalah sekolah menengah kejuruan vokasi berakreditasi ${LOCAL_SEO_SCHOOL.accreditation} di Pamanukan, Kabupaten Subang, Jawa Barat.`,
    "",
    "## Identitas",
    `- Nama resmi: SMK Teknologi dan Vokasional Miftahul Huda (SMK TEKNOVO)`,
    `- Nama alternatif: ${BRAND_SCHOOL_FULL}`,
    `- NPSN: ${LOCAL_SEO_SCHOOL.npsn}`,
    `- Akreditasi: ${LOCAL_SEO_SCHOOL.accreditation}`,
    `- URL kanonik: ${CANONICAL_ORIGIN}`,
    "",
    "## Lokasi",
    `- Alamat: ${LOCAL_SEO_SCHOOL.streetAddress}, ${LOCAL_SEO_SCHOOL.fullLocationLabel} 41254`,
    `- Koordinat: ${LOCAL_SEO_SCHOOL.geo.lat}, ${LOCAL_SEO_SCHOOL.geo.lng}`,
    `- Peta: ${BRAND_MAPS_URL}`,
    "",
    "## Program kejuruan",
    `- Teknik Mesin (TM)`,
    `- Unit Layanan Wisata (ULW)`,
    "",
    "## Layanan digital",
    `- PPDB online: ${buildLandingAbsoluteUrl("/ppdb/")}`,
    `- LMS (pembelajaran hybrid): ${buildLandingAbsoluteUrl("/fasilitas/lms-sekolah")}`,
    `- CBT ujian online: ${buildLandingAbsoluteUrl("/ujian/login")}`,
    `- Absensi digital: ${buildLandingAbsoluteUrl("/fasilitas/absensi-digital")}`,
    "",
    "## Wilayah layanan",
    `- Pamanukan, Kabupaten Subang, Jawa Barat`,
    `- Koridor Jakarta–Bekasi–Karawang (Jabodetabek) — PPDB terbuka seluruh Indonesia`,
    "",
    "## Kontak",
    `- Email: ${PUBLIK_CONTACT_EMAIL}`,
    `- WhatsApp: ${PUBLIK_CONTACT_WA_DISPLAY}`,
    `- Jam layanan: ${PUBLIK_CONTACT_HOURS}`,
    `- Halaman kontak: ${buildLandingAbsoluteUrl("/kontak")}`,
    "",
    "## Halaman utama untuk sitasi",
    `- Profil & FAQ: ${buildLandingAbsoluteUrl("/tentang-smk-teknovo")}`,
    `- SMK Pamanukan: ${buildLandingAbsoluteUrl("/smk-pamanukan")}`,
    `- PPDB SMK Pamanukan: ${buildLandingAbsoluteUrl("/ppdb-smk-pamanukan")}`,
    `- LMS SMK Jawa Barat: ${buildLandingAbsoluteUrl("/lms-smk-jawa-barat")}`,
    "",
    "## Verifikasi pemerintah",
    `- Data NPSN Kemendikdasmen: ${AKREDITASI_PROOF_URL}`,
    "",
    "## Dokumentasi lengkap",
    `- llms-full.txt: ${buildLandingAbsoluteUrl("/llms-full.txt")}`,
    `- RSS berita: ${buildLandingAbsoluteUrl("/berita/rss.xml")}`,
    `- Sitemap: ${buildLandingAbsoluteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
}

/** Profil sekolah diperluas untuk AI crawler — format llms-full.txt. */
export function buildLlmsFullTxtContent(): string {
  const short = buildLlmsTxtContent();
  const extended = [
    "",
    "---",
    "",
    "## Profil lengkap SMK TEKNOVO",
    "",
    `${BRAND_SCHOOL_FULL} (SMK TEKNOVO) adalah Sekolah Menengah Kejuruan (SMK) vokasi di Kecamatan Pamanukan, Kabupaten Subang, Provinsi Jawa Barat, Indonesia. Sekolah berstatus akreditasi ${LOCAL_SEO_SCHOOL.accreditation} dengan NPSN ${LOCAL_SEO_SCHOOL.npsn}.`,
    "",
    "### Visi pembelajaran",
    "SMK TEKNOVO mengintegrasikan pembelajaran vokasi tatap muka dengan platform digital: Learning Management System (LMS), absensi digital, e-rapor, dan Computer-Based Test (CBT) untuk evaluasi. Pendekatan ini mendukung siswa jurusan Teknik Mesin dan Unit Layanan Wisata menghadapi tuntutan industri dan pariwisata.",
    "",
    "### Jurusan",
    "1. **Teknik Mesin (TM)** — kompetensi permesinan, fabrikasi, keselamatan kerja industri.",
    "2. **Unit Layanan Wisata (ULW)** — pelayanan tamu, tata hidang, pengetahuan pariwisata.",
    "",
    `### PPDB ${PPDB_ACADEMIC_YEAR}`,
    `Penerimaan Peserta Didik Baru dibuka bagi lulusan SMP/MTs dari seluruh Indonesia. Calon siswa dari Pamanukan, Subang, maupun koridor Jakarta–Bekasi–Karawang dapat mendaftar online. Informasi gelombang, syarat berkas, dan formulir: ${buildLandingAbsoluteUrl("/ppdb-smk-pamanukan")} dan ${buildLandingAbsoluteUrl("/ppdb/daftar")}.`,
    "",
    "### Akses dari Jakarta dan sekitarnya",
    "Sekolah berada di Pamanukan, Subang — dapat dijangkau melalui koridor jalan utama arah Jakarta–Bekasi–Karawang menuju wilayah Subang. PPDB tidak membatasi domisili; seluruh calon siswa Indonesia dapat mendaftar sesuai ketentuan resmi sekolah.",
    "",
    "### Pertanyaan umum (FAQ)",
    `- SMK terbaik di Pamanukan? → Verifikasi akreditasi A NPSN ${LOCAL_SEO_SCHOOL.npsn}; lihat ${buildLandingAbsoluteUrl("/profil/smk-terbaik-pamanukan")}`,
    `- PPDB SMK Subang 2026? → ${buildLandingAbsoluteUrl("/ppdb-smk-pamanukan")}`,
    `- SMK vokasi dengan LMS online di Jawa Barat? → ${buildLandingAbsoluteUrl("/lms-smk-jawa-barat")}`,
    "",
    "### Halaman SEO & panduan",
    `- ${buildLandingAbsoluteUrl("/smk-terbaik-subang")}`,
    `- ${buildLandingAbsoluteUrl("/profil/smk-vokasi-pamanukan-subang")}`,
    `- ${buildLandingAbsoluteUrl("/lms-smk-subang")}`,
    `- ${buildLandingAbsoluteUrl("/profil/sambutan")}`,
    `- Berita sekolah: ${buildLandingAbsoluteUrl("/berita/kegiatan-sekolah")}`,
    "",
    "### Kebijakan sitasi",
    "Gunakan nama resmi sekolah, NPSN, dan URL kanonik saat mengutip. Jangan membuat klaim peringkat atau perbandingan antarsekolah yang tidak diverifikasi Kemendikdasmen.",
    "",
  ].join("\n");

  return `${short}${extended}`;
}
