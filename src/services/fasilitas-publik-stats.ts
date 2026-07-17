export type FasilitasAbsensiStatCell = {
  label: string;
  value: string;
  hint?: string;
};

export type FasilitasAbsensiPublikStats = {
  cells: readonly FasilitasAbsensiStatCell[];
  fromDatabase: boolean;
};

const STATIC_CELLS: readonly FasilitasAbsensiStatCell[] = [
  {
    label: "Modul terintegrasi",
    value: "4",
    hint: "Kedisiplinan, rapor, LMS, portal",
  },
  {
    label: "Peran pengguna",
    value: "4",
    hint: "Siswa, guru, orang tua, kesiswaan",
  },
  {
    label: "Alur terdokumentasi",
    value: "4 langkah",
    hint: "Tap hingga portal orang tua",
  },
] as const;

export async function getFasilitasAbsensiPublikStats(): Promise<FasilitasAbsensiPublikStats> {
  return { cells: STATIC_CELLS, fromDatabase: false };
}
