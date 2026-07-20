import {
  d1CreateEkstrakurikuler,
  d1DeleteEkstrakurikuler,
  d1GetEkstrakurikulerById,
  d1GetEkstrakurikulerBySlug,
  d1ListEkstrakurikuler,
  d1ListEkstrakurikulerFull,
  d1UpdateEkstrakurikuler,
  type EkstrakurikulerWriteInput,
} from "../d1/ekstrakurikuler-repo";
import {
  prismaCreateEkstrakurikuler,
  prismaDeleteEkstrakurikuler,
  prismaGetEkstrakurikulerById,
  prismaGetEkstrakurikulerBySlug,
  prismaListEkstrakurikuler,
  prismaListEkstrakurikulerFull,
  prismaUpdateEkstrakurikuler,
} from "../prisma/ekstrakurikuler-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export type { EkstrakurikulerWriteInput };

export async function listEkstrakurikuler(
  env: RuntimeBindings,
  opts: Parameters<typeof d1ListEkstrakurikuler>[1] = {},
) {
  if (hasPrisma(env)) return prismaListEkstrakurikuler(env.prisma, opts);
  return d1ListEkstrakurikuler(env.DB, opts);
}

export async function listEkstrakurikulerFull(
  env: RuntimeBindings,
  status: Parameters<typeof d1ListEkstrakurikulerFull>[1] = "PUBLISHED",
) {
  if (hasPrisma(env)) {
    return prismaListEkstrakurikulerFull(env.prisma, status);
  }
  return d1ListEkstrakurikulerFull(env.DB, status);
}

export async function getEkstrakurikulerById(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaGetEkstrakurikulerById(env.prisma, id);
  return d1GetEkstrakurikulerById(env.DB, id);
}

export async function getEkstrakurikulerBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  if (hasPrisma(env)) {
    return prismaGetEkstrakurikulerBySlug(env.prisma, slug, publishedOnly);
  }
  return d1GetEkstrakurikulerBySlug(env.DB, slug, publishedOnly);
}

export async function createEkstrakurikuler(
  env: RuntimeBindings,
  input: EkstrakurikulerWriteInput,
) {
  if (hasPrisma(env)) return prismaCreateEkstrakurikuler(env.prisma, input);
  return d1CreateEkstrakurikuler(env.DB, input);
}

export async function updateEkstrakurikuler(
  env: RuntimeBindings,
  id: string,
  input: EkstrakurikulerWriteInput,
) {
  if (hasPrisma(env)) return prismaUpdateEkstrakurikuler(env.prisma, id, input);
  return d1UpdateEkstrakurikuler(env.DB, id, input);
}

export async function deleteEkstrakurikuler(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaDeleteEkstrakurikuler(env.prisma, id);
  return d1DeleteEkstrakurikuler(env.DB, id);
}
