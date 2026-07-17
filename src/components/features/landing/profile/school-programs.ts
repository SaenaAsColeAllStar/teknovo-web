import { PROGRAM_SEKOLAH_PEMBINAAN_ITEMS } from "@/lib/program-sekolah-content";

export type SchoolProgramCard = {
  title: string;
  description: string;
  coverSrc: string;
};

/** Kartu program unggulan untuk halaman profil program sekolah. */
export const SCHOOL_PROGRAMS: readonly SchoolProgramCard[] = PROGRAM_SEKOLAH_PEMBINAAN_ITEMS.map(
  (item) => ({
    title: item.title,
    description: item.description,
    coverSrc: item.coverSrc,
  }),
);
