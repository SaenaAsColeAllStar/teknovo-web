import type { PrismaClient } from "@prisma/client";
import type { SiteMediaItem } from "@teknovo/shared";
import { toIsoRequired } from "../prisma/map-helpers";

type SiteMediaRow = {
  media_key: string;
  label: string;
  category: string;
  url: string;
  updated_at: Date;
  updated_by: string | null;
};

/** Call `sp_upsert_site_media` — atomic upsert (Postgres Node path only). */
export async function upsertSiteMedia(
  prisma: PrismaClient,
  input: {
    mediaKey: string;
    label: string;
    category: string;
    url: string;
    updatedBy?: string | null;
  },
): Promise<SiteMediaItem> {
  const rows = await prisma.$queryRaw<SiteMediaRow[]>`
    SELECT * FROM sp_upsert_site_media(
      ${input.mediaKey},
      ${input.label},
      ${input.category},
      ${input.url},
      ${input.updatedBy ?? null}
    )
  `;
  const row = rows[0];
  if (!row) {
    throw new Error(`sp_upsert_site_media returned no row for ${input.mediaKey}`);
  }
  return {
    mediaKey: row.media_key,
    label: row.label,
    category: row.category,
    url: row.url,
    updatedAt: toIsoRequired(row.updated_at),
    updatedBy: row.updated_by,
  };
}
