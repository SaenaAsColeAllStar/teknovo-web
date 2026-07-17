import { BRAND_MAPS_URL, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import {
  PUBLIK_CONTACT_EMAIL,
  PUBLIK_CONTACT_HOURS,
  PUBLIK_CONTACT_WA_DISPLAY,
} from "@/lib/kontak-publik";
import { PPDB_ACADEMIC_YEAR } from "@/lib/ppdb-landing-content";
import { LOCAL_SEO_SCHOOL } from "@/lib/seo/school";
import { buildLandingAbsoluteUrl } from "@/lib/seo/urls";

const CANONICAL_ORIGIN = buildLandingAbsoluteUrl("");

/**
 * llms.txt — Indonesian primary, English summary block for international crawlers.
 * @see https://llmstxt.org/
 */
export function buildLlmsTxtContent(): string {
  return [
    `# ${BRAND_SHORT} — SMK TEKNOVO`,
    `# Panduan ringkas untuk asisten AI & mesin pencarian / Brief guide for AI assistants`,
    "",
    `> ${BRAND_SCHOOL_FULL} (SMK TEKNOVO) adalah sekolah menengah kejuruan vokasi berakreditasi ${LOCAL_SEO_SCHOOL.accreditation} di Pamanukan, Kabupaten Subang, Jawa Barat, Indonesia.`,
    `> ${BRAND_SCHOOL_FULL} (SMK TEKNOVO) is an accredited (${LOCAL_SEO_SCHOOL.accreditation}) vocational high school in Pamanukan, Subang Regency, West Java, Indonesia.`,
    "",
    "## Identitas / Identity",
    `- Nama resmi / Official name: SMK Teknologi dan Vokasional Miftahul Huda (SMK TEKNOVO)`,
    `- Nama alternatif / Alternate: ${BRAND_SCHOOL_FULL}`,
    `- NPSN: ${LOCAL_SEO_SCHOOL.npsn}`,
    `- Akreditasi / Accreditation: ${LOCAL_SEO_SCHOOL.accreditation}`,
    `- URL kanonik / Canonical: ${CANONICAL_ORIGIN}`,
    `- Bahasa konten primer / Primary language: Indonesian (id)`,
    "",
    "## Lokasi / Location",
    `- Alamat / Address: ${LOCAL_SEO_SCHOOL.streetAddress}, ${LOCAL_SEO_SCHOOL.fullLocationLabel} ${LOCAL_SEO_SCHOOL.postalCode}`,
    `- Koordinat / Coordinates: ${LOCAL_SEO_SCHOOL.geo.lat}, ${LOCAL_SEO_SCHOOL.geo.lng}`,
    `- Peta / Map: ${BRAND_MAPS_URL}`,
    "",
    "## Program kejuruan / Vocational programs",
    `- Teknik Mesin (TM) / Mechanical Engineering`,
    `- Unit Layanan Wisata (ULW) / Tourism Services`,
    "",
    "## Layanan digital / Digital services",
    `- PPDB online / Admissions: ${buildLandingAbsoluteUrl("/ppdb/")}`,
    `- LMS (hybrid learning): ${buildLandingAbsoluteUrl("/fasilitas/lms-sekolah")}`,
    `- CBT ujian online / Online exams: ${buildLandingAbsoluteUrl("/ujian/login")}`,
    `- Absensi digital / Digital attendance: ${buildLandingAbsoluteUrl("/fasilitas/absensi-digital")}`,
    "",
    "## Wilayah layanan / Service area",
    `- Pamanukan, Kabupaten Subang, Jawa Barat`,
    `- Koridor Jakarta–Bekasi–Karawang (Jabodetabek) — PPDB terbuka seluruh Indonesia / Nationwide admissions`,
    "",
    "## Kontak / Contact",
    `- Email: ${PUBLIK_CONTACT_EMAIL}`,
    `- WhatsApp: ${PUBLIK_CONTACT_WA_DISPLAY}`,
    `- Jam layanan / Hours: ${PUBLIK_CONTACT_HOURS}`,
    `- Halaman kontak / Contact page: ${buildLandingAbsoluteUrl("/kontak")}`,
    "",
    "## Halaman utama untuk sitasi / Key citation URLs",
    `- Profil & FAQ: ${buildLandingAbsoluteUrl("/tentang-smk-teknovo")}`,
    `- SMK Pamanukan: ${buildLandingAbsoluteUrl("/smk-pamanukan")}`,
    `- PPDB SMK Pamanukan: ${buildLandingAbsoluteUrl("/ppdb-smk-pamanukan")}`,
    `- LMS SMK Jawa Barat: ${buildLandingAbsoluteUrl("/lms-smk-jawa-barat")}`,
    "",
    "## Verifikasi pemerintah / Government verification",
    `- Data NPSN Kemendikdasmen: ${LOCAL_SEO_SCHOOL.npsnProofUrl}`,
    "",
    "## Dokumentasi lengkap / Full documentation",
    `- llms-full.txt: ${buildLandingAbsoluteUrl("/llms-full.txt")}`,
    `- RSS berita / News RSS: ${buildLandingAbsoluteUrl("/berita/rss.xml")}`,
    `- Sitemap: ${buildLandingAbsoluteUrl("/sitemap.xml")}`,
    `- security.txt: ${buildLandingAbsoluteUrl("/.well-known/security.txt")}`,
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
    "## Profil lengkap SMK TEKNOVO / Full school profile",
    "",
    `${BRAND_SCHOOL_FULL} (SMK TEKNOVO) adalah Sekolah Menengah Kejuruan (SMK) vokasi di Kecamatan Pamanukan, Kabupaten Subang, Provinsi Jawa Barat, Indonesia. Sekolah berstatus akreditasi ${LOCAL_SEO_SCHOOL.accreditation} dengan NPSN ${LOCAL_SEO_SCHOOL.npsn}.`,
    "",
    "English: SMK TEKNOVO is a vocational secondary school (SMK) in Pamanukan, Subang, West Java. Accreditation A; NPSN 70036813. Programs: Mechanical Engineering (TM) and Tourism Services (ULW). Digital stack: online admissions (PPDB), LMS, CBT, digital attendance.",
    "",
    "### Visi pembelajaran / Learning vision",
    "SMK TEKNOVO mengintegrasikan pembelajaran vokasi tatap muka dengan platform digital: Learning Management System (LMS), absensi digital, e-rapor, dan Computer-Based Test (CBT) untuk evaluasi. Pendekatan ini mendukung siswa jurusan Teknik Mesin dan Unit Layanan Wisata menghadapi tuntutan industri dan pariwisata.",
    "",
    "### Jurusan / Majors",
    "1. **Teknik Mesin (TM)** — kompetensi permesinan, fabrikasi, keselamatan kerja industri / machining, fabrication, industrial safety.",
    "2. **Unit Layanan Wisata (ULW)** — pelayanan tamu, tata hidang, pengetahuan pariwisata / hospitality and tourism services.",
    "",
    `### PPDB ${PPDB_ACADEMIC_YEAR} / Admissions`,
    `Penerimaan Peserta Didik Baru dibuka bagi lulusan SMP/MTs dari seluruh Indonesia. Calon siswa dari Pamanukan, Subang, maupun koridor Jakarta–Bekasi–Karawang dapat mendaftar online. Informasi gelombang, syarat berkas, dan formulir: ${buildLandingAbsoluteUrl("/ppdb-smk-pamanukan")} dan ${buildLandingAbsoluteUrl("/ppdb/daftar")}.`,
    "",
    "### Akses dari Jakarta dan sekitarnya / Access from Greater Jakarta",
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
    "### Kebijakan sitasi / Citation policy",
    "Gunakan nama resmi sekolah, NPSN, dan URL kanonik saat mengutip. Jangan membuat klaim peringkat atau perbandingan antarsekolah yang tidak diverifikasi Kemendikdasmen.",
    "Use the official school name, NPSN, and canonical URLs when citing. Do not invent unverified rankings or school comparisons.",
    "",
  ].join("\n");

  return `${short}${extended}`;
}
