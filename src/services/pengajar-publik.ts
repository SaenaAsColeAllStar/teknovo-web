import { GURU_PUBLIK_DISPLAY_OFFSET } from "@/lib/guru-publik-query";

export type PengajarPublikCard = {
  id: string;
  namaLengkap: string;
  bidang: string;
  isBersertifikasi: boolean;
  isWaliKelas: boolean;
};

export type PengajarPublikSummary = {
  totalAktif: number;
  totalBersertifikasi: number;
  totalWaliKelas: number;
  gurus: PengajarPublikCard[];
};

const EMPTY_SUMMARY: PengajarPublikSummary = {
  totalAktif: GURU_PUBLIK_DISPLAY_OFFSET,
  totalBersertifikasi: GURU_PUBLIK_DISPLAY_OFFSET,
  totalWaliKelas: 0,
  gurus: [],
};

export async function getPengajarPublikSummary(): Promise<PengajarPublikSummary> {
  return EMPTY_SUMMARY;
}
