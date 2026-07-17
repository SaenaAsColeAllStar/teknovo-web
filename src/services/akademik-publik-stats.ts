import { AKADEMIK_JURUSAN_ITEMS } from "@/lib/akademik-landing-content";
import {
  getPengajarPublikSummary,
  type PengajarPublikSummary,
} from "@/services/pengajar-publik";

export type AkademikOverviewPublikStats = {
  guruAktif: number;
  guruBersertifikasi: number;
  jurusanAktif: number;
  mataPelajaran: number;
  fromDatabase: boolean;
};

export type AkademikKurikulumPublikStats = {
  mataPelajaran: number;
  kelasAktif: number;
  penugasanGuru: number;
  tahunAjaranKode: string | null;
  fromDatabase: boolean;
};

export type AkademikJurusanPublikStats = {
  jurusanAktif: number;
  fromDatabase: boolean;
};

const FALLBACK_JURUSAN_AKTIF = AKADEMIK_JURUSAN_ITEMS.length;

export async function getAkademikOverviewPublikStats(): Promise<AkademikOverviewPublikStats> {
  return {
    guruAktif: 0,
    guruBersertifikasi: 0,
    jurusanAktif: FALLBACK_JURUSAN_AKTIF,
    mataPelajaran: 0,
    fromDatabase: false,
  };
}

export async function getAkademikKurikulumPublikStats(): Promise<AkademikKurikulumPublikStats> {
  return {
    mataPelajaran: 0,
    kelasAktif: 0,
    penugasanGuru: 0,
    tahunAjaranKode: null,
    fromDatabase: false,
  };
}

export async function getAkademikJurusanPublikStats(): Promise<AkademikJurusanPublikStats> {
  return { jurusanAktif: FALLBACK_JURUSAN_AKTIF, fromDatabase: false };
}

export async function getAkademikPengajarPublikStats(): Promise<PengajarPublikSummary> {
  return getPengajarPublikSummary();
}
