import {
  d1CreateBerita,
  d1DeleteBerita,
  d1GetBeritaById,
  d1GetBeritaBySlug,
  d1ListBerita,
  d1UpdateBerita,
  type BeritaWriteInput,
} from "../d1/berita-repo";
import {
  prismaCreateBerita,
  prismaDeleteBerita,
  prismaGetBeritaById,
  prismaGetBeritaBySlug,
  prismaListBerita,
  prismaUpdateBerita,
} from "../prisma/berita-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export type { BeritaWriteInput };

export async function listBerita(
  env: RuntimeBindings,
  opts: Parameters<typeof d1ListBerita>[1] = {},
) {
  if (hasPrisma(env)) return prismaListBerita(env.prisma, opts);
  return d1ListBerita(env.DB, opts);
}

export async function getBeritaById(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaGetBeritaById(env.prisma, id);
  return d1GetBeritaById(env.DB, id);
}

export async function getBeritaBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  if (hasPrisma(env)) {
    return prismaGetBeritaBySlug(env.prisma, slug, publishedOnly);
  }
  return d1GetBeritaBySlug(env.DB, slug, publishedOnly);
}

export async function createBerita(
  env: RuntimeBindings,
  input: BeritaWriteInput,
) {
  if (hasPrisma(env)) return prismaCreateBerita(env.prisma, input);
  return d1CreateBerita(env.DB, input);
}

export async function updateBerita(
  env: RuntimeBindings,
  id: string,
  input: BeritaWriteInput,
) {
  if (hasPrisma(env)) return prismaUpdateBerita(env.prisma, id, input);
  return d1UpdateBerita(env.DB, id, input);
}

export async function deleteBerita(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaDeleteBerita(env.prisma, id);
  return d1DeleteBerita(env.DB, id);
}
