/** Offset tampilan publik + agregasi DB — menyertakan guru sebelum data digital lengkap. */
export const GURU_PUBLIK_DISPLAY_OFFSET = 13;

export const STRESS_TEST_EMAIL_SUFFIX = "@stress.teknovo.local" as const;

export function deriveGuruBersertifikasi(row: {
  isBersertifikasi: boolean;
  noSertifikatPendidik: string | null;
  bidangStudiSertifikasi: string | null;
  _count?: { guruSertifikasiIndustri: number };
}): boolean {
  if (row.isBersertifikasi) return true;
  if (row.noSertifikatPendidik?.trim()) return true;
  if (row.bidangStudiSertifikasi?.trim()) return true;
  return (row._count?.guruSertifikasiIndustri ?? 0) > 0;
}

export function deriveGuruWaliKelas(row: {
  isWaliKelas: boolean;
  _count?: { waliKelas: number };
}): boolean {
  return row.isWaliKelas || (row._count?.waliKelas ?? 0) > 0;
}
