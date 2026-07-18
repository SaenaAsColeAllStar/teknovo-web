export const KONTAK_PAGE_TITLE = "Kontak SMK TEKNOVO Pamanukan Subang" as const;

export const KONTAK_PAGE_LEDE =
  "Kunjungi SMK TEKNOVO di Jl. Rancasari RT 05 RW 03, Pamanukan, Kabupaten Subang, Jawa Barat. Buka peta lokasi atau kirim pertanyaan melalui formulir. Tim Humas dan Tata Usaha membantu informasi PPDB, jadwal kunjungan, dan layanan sekolah—tanpa menggantikan pengumuman resmi di portal PPDB." as const;

export const KONTAK_HERO_EYEBROW = "Lokasi & layanan" as const;

/** Module 1 — formulir kontak */
export const KONTAK_FORM_HEADLINE = "Ada pertanyaan? Hubungi kami" as const;

export const KONTAK_FORM_LEDE =
  "Isi formulir di bawah. Pesan akan dibuka di aplikasi email Anda menuju Tata Usaha / Humas. Untuk PPDB mendesak, gunakan WhatsApp resmi sekolah." as const;

export const KONTAK_FORM_SUBMIT_LABEL = "Kirim pesan" as const;

export const KONTAK_FORM_FIELDS = {
  name: { label: "Nama", placeholder: "Nama lengkap Anda", required: true },
  email: { label: "Email", placeholder: "nama@email.com", required: true },
  phone: { label: "Telepon / WhatsApp", placeholder: "08xx xxxx xxxx", required: false },
  subject: { label: "Subjek", placeholder: "Mis. Jadwal kunjungan, PPDB, info jurusan", required: true },
  message: {
    label: "Pesan",
    placeholder: "Tulis pertanyaan atau pesan Anda di sini…",
    required: true,
  },
} as const;

/** Module 2 — FAQ */
export const KONTAK_FAQ_EYEBROW = "FAQ" as const;

export const KONTAK_FAQ_TITLE = "Masih ada pertanyaan?" as const;

export const KONTAK_FAQ_LEDE =
  "Jawaban singkat seputar lokasi, jam layanan, PPDB, dan cara menghubungi SMK TEKNOVO. Detail resmi tetap mengikuti portal PPDB dan pengumuman sekolah." as const;

export type KontakFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const KONTAK_FAQ_ITEMS: readonly KontakFaqItem[] = [
  {
    id: "lokasi",
    question: "Di mana alamat SMK TEKNOVO?",
    answer:
      "SMK TEKNOVO (SMK Teknologi & Vokasional Miftahul Huda Rancasari) berada di Jl. Rancasari RT 05 RW 03, Rancasari, Pamanukan, Kabupaten Subang, Jawa Barat 41254. Gunakan peta di halaman ini atau buka tautan Google Maps untuk petunjuk arah.",
  },
  {
    id: "jam-layanan",
    question: "Kapan jam layanan Tata Usaha / kunjungan?",
    answer:
      "Layanan Tata Usaha dan konsultasi tatap muka: Senin–Jumat, 08.00–15.00 WIB. Di luar jam tersebut, hubungi WhatsApp resmi sekolah atau kirim email; respons mengikuti hari kerja.",
  },
  {
    id: "ppdb",
    question: "Bagaimana cara mendaftar PPDB?",
    answer:
      "PPDB dibuka bagi lulusan SMP/MTs melalui portal PPDB resmi dan WhatsApp PPDB. Siapkan data calon siswa, kontak orang tua, minat jurusan (Teknik Mesin atau Unit Layanan Wisata), serta berkas wajib (akta, ijazah SD, ijazah/SKL SMP). Lihat halaman PPDB untuk jadwal gelombang dan syarat terkini.",
  },
  {
    id: "kontak-resmi",
    question: "Saluran kontak resmi apa saja?",
    answer:
      "Email: info@smateknovo.sch.id. WhatsApp resmi: 0898-8131-858. Formulir di halaman ini membuka aplikasi email di perangkat Anda. Hindari saluran tidak resmi di luar situs dan akun sosial yang tercantum di footer.",
  },
  {
    id: "jurusan",
    question: "Jurusan apa saja yang dibuka?",
    answer:
      "Tersedia dua program kejuruan: Teknik Mesin (TM) dan Unit Layanan Wisata (ULW). Penempatan mengikuti kuota, minat, dan hasil seleksi sesuai kebijakan PPDB tahun berjalan.",
  },
  {
    id: "kunjungan",
    question: "Bolehkah berkunjung atau tur fasilitas?",
    answer:
      "Ya. Jadwalkan kunjungan melalui formulir kontak, email, atau WhatsApp resmi agar tim Humas / Tata Usaha dapat menyiapkan waktu. Kunjungan di luar jam operasional perlu konfirmasi terlebih dahulu.",
  },
] as const;

/** Module 3 — buletin */
export const KONTAK_NEWSLETTER_EYEBROW = "Buletin" as const;

export const KONTAK_NEWSLETTER_TITLE = "Ikuti kabar sekolah" as const;

export const KONTAK_NEWSLETTER_LEDE =
  "Daftarkan email untuk menerima ringkasan berita, pengumuman, dan informasi kegiatan SMK TEKNOVO." as const;

export const KONTAK_NEWSLETTER_EMAIL_PLACEHOLDER = "Alamat email Anda" as const;

export const KONTAK_NEWSLETTER_MAIL_SUBJECT = "Daftar buletin SMK TEKNOVO" as const;
