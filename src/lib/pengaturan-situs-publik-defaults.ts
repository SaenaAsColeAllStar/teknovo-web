import {
  HOME_FLASH_MARQUEE_ITEMS,
  HOME_FLASH_MARQUEE_LABEL,
} from "@/lib/home-landing-content";

/** ID tetap baris singleton `PengaturanSitusPublik`. */
export const PENGATURAN_SITUS_PUBLIK_ID = "00000000-0000-4000-a000-000000000001" as const;

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
  updatedAt: string | null;
};

export const DEFAULT_PPDB_TAHUN_AJARAN = "Tahun Ajaran 2026/2027";
export const DEFAULT_PPDB_GELOMBANG_1 = "Gelombang 1: 1 Maret – 30 April 2026";
export const DEFAULT_PPDB_GELOMBANG_2 =
  "Gelombang 2: 1 Mei – 30 Juni 2026 (selama kuota jurusan masih tersedia)";
export const DEFAULT_PPDB_JAM_LAYANAN = "Senin–Jumat, 08.00–15.00 WIB";
export const DEFAULT_PPDB_BIAYA_KETERANGAN =
  "Biaya pendaftaran dan administrasi mengikuti keputusan yayasan sekolah. Rincian nominal dan tata cara pembayaran diinformasikan setelah verifikasi berkas awal.";
export const DEFAULT_KONTAK_EMAIL = "info@smateknovo.sch.id";
export const DEFAULT_WHATSAPP_PPDB = "0898-8131-858";

const DEFAULT_LANDING_MARQUEE: LandingMarqueeItem[] = HOME_FLASH_MARQUEE_ITEMS.map((label) => ({
  label,
}));

/** Nilai awal selaras konstanta statis — dipakai seed & fallback bila DB kosong. */
export const PENGATURAN_SITUS_PUBLIK_DEFAULTS: Omit<PengaturanSitusPublikData, "id" | "updatedAt"> = {
  landingMarquee: DEFAULT_LANDING_MARQUEE,
  landingMarqueeLabel: HOME_FLASH_MARQUEE_LABEL,
  ppdbTahunAjaran: DEFAULT_PPDB_TAHUN_AJARAN,
  ppdbGelombang1Label: DEFAULT_PPDB_GELOMBANG_1,
  ppdbGelombang2Label: DEFAULT_PPDB_GELOMBANG_2,
  ppdbJamLayanan: DEFAULT_PPDB_JAM_LAYANAN,
  ppdbBiayaKeterangan: DEFAULT_PPDB_BIAYA_KETERANGAN,
  kontakTelepon: null,
  kontakEmail: DEFAULT_KONTAK_EMAIL,
  kontakAlamat: null,
  whatsappPpdb: DEFAULT_WHATSAPP_PPDB,
  sambutanNamaKepala: null,
  sambutanJabatan: null,
};
