import type { PrismaClient } from "@prisma/client";
import type { SiteMediaItem } from "@teknovo/shared";
import { loadMinioConfig } from "../minio/client";
import { objectUrl } from "../minio/url";
import { upsertSiteMedia as spUpsertSiteMedia } from "../procedures/site-media";
import { toIsoRequired } from "./map-helpers";
import {
  SITE_MEDIA_CATALOG,
  type SiteMediaCatalogEntry,
} from "../d1/site-media-repo";

/** Re-export catalog so Node path can share the same keys as D1/R2. */
export { SITE_MEDIA_CATALOG };
export type { SiteMediaCatalogEntry };

/**
 * Resolve a catalog `defaultPath` to the MinIO public URL (Node/VPS).
 * Worker/R2 continues to use `publicObjectUrl(env, path)` — do not call this on Worker.
 */
export function catalogDefaultUrl(
  defaultPath: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  return objectUrl(defaultPath, loadMinioConfig(env));
}

/** Catalog entries with MinIO public URLs for local/VPS defaults. */
export function siteMediaCatalogWithMinioUrls(
  env: NodeJS.ProcessEnv = process.env,
): Array<SiteMediaCatalogEntry & { defaultUrl: string }> {
  return SITE_MEDIA_CATALOG.map((entry) => ({
    ...entry,
    defaultUrl: catalogDefaultUrl(entry.defaultPath, env),
  }));
}

function mapRow(row: {
  mediaKey: string;
  label: string;
  category: string;
  url: string;
  updatedAt: Date;
  updatedBy: string | null;
}): SiteMediaItem {
  return {
    mediaKey: row.mediaKey,
    label: row.label,
    category: row.category,
    url: row.url,
    updatedAt: toIsoRequired(row.updatedAt),
    updatedBy: row.updatedBy,
  };
}

export async function prismaListSiteMedia(
  prisma: PrismaClient,
): Promise<SiteMediaItem[]> {
  const rows = await prisma.siteMedia.findMany({
    orderBy: [{ category: "asc" }, { label: "asc" }],
  });
  return rows.map(mapRow);
}

export async function prismaGetSiteMedia(
  prisma: PrismaClient,
  mediaKey: string,
): Promise<SiteMediaItem | null> {
  const row = await prisma.siteMedia.findUnique({ where: { mediaKey } });
  return row ? mapRow(row) : null;
}

/** Upsert via `sp_upsert_site_media` (atomic). */
export async function prismaUpsertSiteMedia(
  prisma: PrismaClient,
  input: {
    mediaKey: string;
    label: string;
    category: string;
    url: string;
    updatedBy?: string | null;
  },
): Promise<SiteMediaItem> {
  return spUpsertSiteMedia(prisma, input);
}

export async function prismaDeleteSiteMedia(
  prisma: PrismaClient,
  mediaKey: string,
): Promise<void> {
  await prisma.siteMedia.deleteMany({ where: { mediaKey } });
}
