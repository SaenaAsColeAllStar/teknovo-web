import {
  d1DeleteSiteMedia,
  d1GetSiteMedia,
  d1ListSiteMedia,
  d1UpsertSiteMedia,
  SITE_MEDIA_CATALOG,
} from "../d1/site-media-repo";
import {
  prismaDeleteSiteMedia,
  prismaGetSiteMedia,
  prismaListSiteMedia,
  prismaUpsertSiteMedia,
} from "../prisma/site-media-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export { SITE_MEDIA_CATALOG };

export async function listSiteMedia(env: RuntimeBindings) {
  if (hasPrisma(env)) return prismaListSiteMedia(env.prisma);
  return d1ListSiteMedia(env.DB);
}

export async function getSiteMedia(env: RuntimeBindings, mediaKey: string) {
  if (hasPrisma(env)) return prismaGetSiteMedia(env.prisma, mediaKey);
  return d1GetSiteMedia(env.DB, mediaKey);
}

export async function upsertSiteMedia(
  env: RuntimeBindings,
  input: {
    mediaKey: string;
    label: string;
    category: string;
    url: string;
    updatedBy: string;
  },
) {
  if (hasPrisma(env)) return prismaUpsertSiteMedia(env.prisma, input);
  return d1UpsertSiteMedia(env.DB, input);
}

export async function deleteSiteMedia(env: RuntimeBindings, mediaKey: string) {
  if (hasPrisma(env)) return prismaDeleteSiteMedia(env.prisma, mediaKey);
  return d1DeleteSiteMedia(env.DB, mediaKey);
}
