import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";
import {
  prismaCreatePengumuman,
  prismaDeletePengumuman,
  prismaGetPengumumanById,
  prismaGetPengumumanBySlug,
  prismaListPengumuman,
  prismaUpdatePengumuman,
  type PengumumanWriteInput,
} from "../prisma/pengumuman-repo";

export type { PengumumanWriteInput };

function requirePrisma(env: RuntimeBindings) {
  if (!hasPrisma(env)) {
    throw new Error("Prisma is required for pengumuman");
  }
  return env.prisma;
}

export async function listPengumuman(
  env: RuntimeBindings,
  opts: Parameters<typeof prismaListPengumuman>[1] = {},
) {
  return prismaListPengumuman(requirePrisma(env), opts);
}

export async function getPengumumanById(env: RuntimeBindings, id: string) {
  return prismaGetPengumumanById(requirePrisma(env), id);
}

export async function getPengumumanBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  return prismaGetPengumumanBySlug(requirePrisma(env), slug, publishedOnly);
}

export async function createPengumuman(
  env: RuntimeBindings,
  input: PengumumanWriteInput,
) {
  return prismaCreatePengumuman(requirePrisma(env), input);
}

export async function updatePengumuman(
  env: RuntimeBindings,
  id: string,
  input: PengumumanWriteInput,
) {
  return prismaUpdatePengumuman(requirePrisma(env), id, input);
}

export async function deletePengumuman(env: RuntimeBindings, id: string) {
  return prismaDeletePengumuman(requirePrisma(env), id);
}
