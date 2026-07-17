import { AKADEMIK_JURUSAN_ITEMS } from "@/lib/akademik-landing-content";
import { getJurusanPublikDeskripsi } from "@/lib/program-sekolah-content";

export type JurusanPublikCard = {
  kode: string;
  nama: string;
  deskripsi: string;
};

const FALLBACK_KODE_BY_SLUG: Record<string, string> = {
  "teknik-mesin": "TM",
  "unit-layanan-wisata": "ULW",
  TM: "TM",
  ULW: "ULW",
};

function fallbackJurusanCards(): JurusanPublikCard[] {
  return AKADEMIK_JURUSAN_ITEMS.map((item) => {
    const kode = FALLBACK_KODE_BY_SLUG[item.id] ?? item.id.toUpperCase().replace(/-/g, "_");
    return {
      kode,
      nama: item.title,
      deskripsi: getJurusanPublikDeskripsi(kode),
    };
  });
}

export async function getJurusanPublikCards(): Promise<JurusanPublikCard[]> {
  return fallbackJurusanCards();
}

export const getJurusanPublik = getJurusanPublikCards;
