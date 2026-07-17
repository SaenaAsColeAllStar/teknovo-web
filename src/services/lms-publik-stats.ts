export type LmsPublikStats = {
  kontenCount: number;
  tugasAktifCount: number;
};

/** Cloudflare split — LMS stats dari homelab belum di-wire; null = pakai chip statis. */
export async function getLmsPublikStats(): Promise<LmsPublikStats | null> {
  return null;
}
