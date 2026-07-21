import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";
import {
  prismaCreateKurikulum,
  prismaDeleteKurikulum,
  prismaGetKurikulumById,
  prismaGetKurikulumBySlug,
  prismaListKurikulum,
  prismaUpdateKurikulum,
  type KurikulumWriteInput,
} from "../prisma/kurikulum-repo";

export type { KurikulumWriteInput };

function requirePrisma(env: RuntimeBindings) {
  if (!hasPrisma(env)) {
    throw new Error("Prisma is required for kurikulum");
  }
  return env.prisma;
}

export async function listKurikulum(
  env: RuntimeBindings,
  opts: Parameters<typeof prismaListKurikulum>[1] = {},
) {
  return prismaListKurikulum(requirePrisma(env), opts);
}

export async function getKurikulumById(env: RuntimeBindings, id: string) {
  return prismaGetKurikulumById(requirePrisma(env), id);
}

export async function getKurikulumBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  return prismaGetKurikulumBySlug(requirePrisma(env), slug, publishedOnly);
}

export async function createKurikulum(
  env: RuntimeBindings,
  input: KurikulumWriteInput,
) {
  return prismaCreateKurikulum(requirePrisma(env), input);
}

export async function updateKurikulum(
  env: RuntimeBindings,
  id: string,
  input: KurikulumWriteInput,
) {
  return prismaUpdateKurikulum(requirePrisma(env), id, input);
}

export async function deleteKurikulum(env: RuntimeBindings, id: string) {
  return prismaDeleteKurikulum(requirePrisma(env), id);
}
