export type KesiswaanHubPublikStats = {
  ekskulAktif: number;
  anggotaEkskul: number;
  prestasiTerverifikasi: number;
  fromDatabase: boolean;
};

export type KesiswaanEkstraPublikStats = {
  unitCount: number;
  kategoriCount: number;
  prestasiCount: number;
  anggotaEkskul: number;
  siswaDiEkskul: number;
  fromDatabase: boolean;
};

export type KesiswaanPrestasiPublikStats = {
  totalTerverifikasi: number;
  fromDatabase: boolean;
};

const FALLBACK_EKSKUL_AKTIF = 5;

const EMPTY_HUB: KesiswaanHubPublikStats = {
  ekskulAktif: FALLBACK_EKSKUL_AKTIF,
  anggotaEkskul: 0,
  prestasiTerverifikasi: 0,
  fromDatabase: false,
};

const EMPTY_EKSTRA: KesiswaanEkstraPublikStats = {
  unitCount: FALLBACK_EKSKUL_AKTIF,
  kategoriCount: 4,
  prestasiCount: 0,
  anggotaEkskul: 0,
  siswaDiEkskul: 0,
  fromDatabase: false,
};

const EMPTY_PRESTASI: KesiswaanPrestasiPublikStats = {
  totalTerverifikasi: 0,
  fromDatabase: false,
};

export async function getKesiswaanHubPublikStats(): Promise<KesiswaanHubPublikStats> {
  return EMPTY_HUB;
}

export async function getKesiswaanEkstraPublikStats(): Promise<KesiswaanEkstraPublikStats> {
  return EMPTY_EKSTRA;
}

export async function getKesiswaanPrestasiPublikStats(): Promise<KesiswaanPrestasiPublikStats> {
  return EMPTY_PRESTASI;
}
