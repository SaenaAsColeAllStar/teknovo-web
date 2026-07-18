export const PENGATURAN_SITUS_PUBLIK_ID =
  "00000000-0000-4000-a000-000000000001" as const;

export type LandingMarqueeItem = {
  label: string;
  href?: string;
};

export type PengaturanSitusPublikData = {
  id: string;
  landingMarquee: readonly LandingMarqueeItem[];
  landingMarqueeLabel: string;
  ppdbTahunAjaran: string;
  ppdbGelombang1Label: string;
  ppdbGelombang2Label: string;
  ppdbJamLayanan: string;
  ppdbBiayaKeterangan: string;
  kontakTelepon: string | null;
  kontakEmail: string;
  kontakAlamat: string | null;
  whatsappPpdb: string;
  sambutanNamaKepala: string | null;
  sambutanJabatan: string | null;
  siteTitle: string;
  siteDescription: string;
  defaultOgImageUrl: string;
  googleAnalyticsId: string;
  sosialInstagramUrl: string;
  sosialYoutubeUrl: string;
  sosialFacebookUrl: string;
  sosialTiktokUrl: string;
  updatedAt: string | null;
};

export const PENGATURAN_SITUS_PUBLIK_DEFAULTS: Omit<
  PengaturanSitusPublikData,
  "id" | "updatedAt"
> = {
  landingMarquee: [
    { label: "PPDB dibuka" },
    { label: "Program kejuruan unggulan" },
    { label: "Teknologi & vokasional" },
  ],
  landingMarqueeLabel: "Info",
  ppdbTahunAjaran: "Tahun Ajaran 2026/2027",
  ppdbGelombang1Label: "Gelombang 1: 1 Maret – 30 April 2026",
  ppdbGelombang2Label:
    "Gelombang 2: 1 Mei – 30 Juni 2026 (selama kuota jurusan masih tersedia)",
  ppdbJamLayanan: "Senin–Jumat, 08.00–15.00 WIB",
  ppdbBiayaKeterangan:
    "Biaya pendaftaran dan administrasi mengikuti keputusan yayasan sekolah. Rincian nominal dan tata cara pembayaran diinformasikan setelah verifikasi berkas awal.",
  kontakTelepon: null,
  kontakEmail: "info@smkteknovo.sch.id",
  kontakAlamat: null,
  whatsappPpdb: "0898-8131-858",
  sambutanNamaKepala: null,
  sambutanJabatan: null,
  siteTitle: "SMK TEKNOVO — Teknologi & Vokasional",
  siteDescription:
    "SMK Teknologi dan Vokasional Miftahul Huda Rancasari — program kejuruan, PPDB, berita sekolah, dan layanan digital untuk siswa serta orang tua.",
  defaultOgImageUrl: "",
  googleAnalyticsId: "",
  sosialInstagramUrl: "https://www.instagram.com/smateknovo/",
  sosialYoutubeUrl: "",
  sosialFacebookUrl: "",
  sosialTiktokUrl: "",
};
