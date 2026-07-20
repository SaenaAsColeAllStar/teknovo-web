import {
  d1ApproveArtikel,
  d1CreateArtikel,
  d1DeleteArtikel,
  d1GetArtikelById,
  d1GetArtikelBySlug,
  d1ListArtikel,
  d1RejectArtikel,
  d1UpdateArtikel,
  type ArtikelWriteInput,
} from "../d1/artikel-repo";
import {
  prismaApproveArtikel,
  prismaCreateArtikel,
  prismaDeleteArtikel,
  prismaGetArtikelById,
  prismaGetArtikelBySlug,
  prismaListArtikel,
  prismaRejectArtikel,
  prismaUpdateArtikel,
} from "../prisma/artikel-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export type { ArtikelWriteInput };

export async function listArtikel(
  env: RuntimeBindings,
  opts: Parameters<typeof d1ListArtikel>[1] = {},
) {
  if (hasPrisma(env)) return prismaListArtikel(env.prisma, opts);
  return d1ListArtikel(env.DB, opts);
}

export async function getArtikelById(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaGetArtikelById(env.prisma, id);
  return d1GetArtikelById(env.DB, id);
}

export async function getArtikelBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  if (hasPrisma(env)) {
    return prismaGetArtikelBySlug(env.prisma, slug, publishedOnly);
  }
  return d1GetArtikelBySlug(env.DB, slug, publishedOnly);
}

export async function createArtikel(
  env: RuntimeBindings,
  input: ArtikelWriteInput,
) {
  if (hasPrisma(env)) return prismaCreateArtikel(env.prisma, input);
  return d1CreateArtikel(env.DB, input);
}

export async function updateArtikel(
  env: RuntimeBindings,
  id: string,
  input: ArtikelWriteInput,
) {
  if (hasPrisma(env)) return prismaUpdateArtikel(env.prisma, id, input);
  return d1UpdateArtikel(env.DB, id, input);
}

export async function deleteArtikel(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaDeleteArtikel(env.prisma, id);
  return d1DeleteArtikel(env.DB, id);
}

export async function approveArtikel(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaApproveArtikel(env.prisma, id);
  return d1ApproveArtikel(env.DB, id);
}

export async function rejectArtikel(
  env: RuntimeBindings,
  id: string,
  reason?: string,
) {
  if (hasPrisma(env)) return prismaRejectArtikel(env.prisma, id, reason);
  return d1RejectArtikel(env.DB, id, reason);
}
