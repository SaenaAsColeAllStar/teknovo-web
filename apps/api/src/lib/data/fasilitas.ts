import {
  d1CreateFasilitas,
  d1DeleteFasilitas,
  d1GetFasilitasById,
  d1GetFasilitasBySlug,
  d1ListFasilitas,
  d1UpdateFasilitas,
  type FasilitasWriteInput,
} from "../d1/fasilitas-repo";
import {
  prismaCreateFasilitas,
  prismaDeleteFasilitas,
  prismaGetFasilitasById,
  prismaGetFasilitasBySlug,
  prismaListFasilitas,
  prismaUpdateFasilitas,
} from "../prisma/fasilitas-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export type { FasilitasWriteInput };

export async function listFasilitas(
  env: RuntimeBindings,
  opts: Parameters<typeof d1ListFasilitas>[1] = {},
) {
  if (hasPrisma(env)) return prismaListFasilitas(env.prisma, opts);
  return d1ListFasilitas(env.DB, opts);
}

export async function getFasilitasById(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaGetFasilitasById(env.prisma, id);
  return d1GetFasilitasById(env.DB, id);
}

export async function getFasilitasBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  if (hasPrisma(env)) {
    return prismaGetFasilitasBySlug(env.prisma, slug, publishedOnly);
  }
  return d1GetFasilitasBySlug(env.DB, slug, publishedOnly);
}

export async function createFasilitas(
  env: RuntimeBindings,
  input: FasilitasWriteInput,
) {
  if (hasPrisma(env)) return prismaCreateFasilitas(env.prisma, input);
  return d1CreateFasilitas(env.DB, input);
}

export async function updateFasilitas(
  env: RuntimeBindings,
  id: string,
  input: FasilitasWriteInput,
) {
  if (hasPrisma(env)) return prismaUpdateFasilitas(env.prisma, id, input);
  return d1UpdateFasilitas(env.DB, id, input);
}

export async function deleteFasilitas(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaDeleteFasilitas(env.prisma, id);
  return d1DeleteFasilitas(env.DB, id);
}
