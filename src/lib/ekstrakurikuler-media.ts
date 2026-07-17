import { LANDING_MEDIA } from "@/lib/public-media-paths";

const EKSTRAKURIKULER_COVER_BY_SLUG: Record<string, string> = {
  blogger: LANDING_MEDIA.kegiatan.ekstraBloggerClubWebp,
  codingclub: LANDING_MEDIA.kegiatan.ekstraCodingClubWebp,
  futsal: LANDING_MEDIA.kegiatan.ekstraFutsalWebp,
  paskibra: LANDING_MEDIA.kegiatan.ekstraPaskibrakaWebp,
  pencaksilat: LANDING_MEDIA.kegiatan.ekstraPencakSilatWebp,
  pramuka: LANDING_MEDIA.kegiatan.ekstraPramukaWebp,
};

export function resolveEkstrakurikulerCoverSrc(slug: string): string {
  return EKSTRAKURIKULER_COVER_BY_SLUG[slug] ?? LANDING_MEDIA.misc.aktivitasUmumWebp;
}

export function resolveOsisCoverSrc(): string {
  return LANDING_MEDIA.kegiatan.ekstraOsisWebp;
}
