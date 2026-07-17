import { LANDING_MEDIA } from "@/lib/public-media-paths";

const EKSTRAKURIKULER_COVER_BY_SLUG: Record<string, string> = {
  blogger: LANDING_MEDIA.kegiatan.ekstraBloggerClubJpg,
  codingclub: LANDING_MEDIA.kegiatan.ekstraCodingClubJpg,
  futsal: LANDING_MEDIA.kegiatan.ekstraFutsalJpg,
  paskibra: LANDING_MEDIA.kegiatan.ekstraPaskibrakaJpg,
  pencaksilat: LANDING_MEDIA.kegiatan.ekstraPencakSilatJpg,
  pramuka: LANDING_MEDIA.kegiatan.ekstraPramukaJpg,
};

export function resolveEkstrakurikulerCoverSrc(slug: string): string {
  return EKSTRAKURIKULER_COVER_BY_SLUG[slug] ?? LANDING_MEDIA.misc.aktivitasUmumJpg;
}

export function resolveOsisCoverSrc(): string {
  return LANDING_MEDIA.kegiatan.ekstraOsisJpg;
}
