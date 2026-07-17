import { AKADEMIK_JURUSAN_ITEMS } from "@/lib/akademik-landing-content";
import { FASILITAS_SLUGS } from "@/lib/fasilitas-landing-content";
import { GURU_PUBLIK_DISPLAY_OFFSET } from "@/lib/guru-publik-query";

export const STATISTIK_PUBLIK_KUNCI = {
  LULUSAN_PT_KERJA_PERCENT: "LULUSAN_PT_KERJA_PERCENT",
} as const;

export type LandingPublicStatItem = {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
};

const SISWA_AKTIF_PUBLIK_OFFSET = 300;
const DEFAULT_EKSTRAKURIKULER_FALLBACK = 30;
const DEFAULT_LULUSAN_PERCENT = 80;
const LULUSAN_PT_KERJA_LABEL = "Lulusan Diterima PTN/Kerja";

const FALLBACK_LANDING_PUBLIC_STATS: LandingPublicStatItem[] = [
  { value: SISWA_AKTIF_PUBLIK_OFFSET, suffix: "", label: "Siswa Aktif" },
  { value: GURU_PUBLIK_DISPLAY_OFFSET, suffix: "", label: "Guru Tersertifikasi" },
  { value: DEFAULT_EKSTRAKURIKULER_FALLBACK, suffix: "", label: "Ekstrakurikuler" },
  { value: AKADEMIK_JURUSAN_ITEMS.length, suffix: "", label: "Jurusan Kejuruan" },
  { value: FASILITAS_SLUGS.length, suffix: "", label: "Fasilitas Digital" },
  { value: DEFAULT_LULUSAN_PERCENT, prefix: "±", suffix: "%", label: LULUSAN_PT_KERJA_LABEL },
];

/** Cloudflare split: statistik beranda memakai fallback publik (DB di homelab). */
export async function getLandingPublicStats(): Promise<LandingPublicStatItem[]> {
  return FALLBACK_LANDING_PUBLIC_STATS;
}
