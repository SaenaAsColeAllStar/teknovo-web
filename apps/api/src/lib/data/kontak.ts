import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";
import {
  prismaCreateKontak,
  prismaDeleteKontak,
  prismaGetKontakById,
  prismaGetKontakBySlug,
  prismaListKontak,
  prismaUpdateKontak,
  type KontakWriteInput,
} from "../prisma/kontak-repo";

export type { KontakWriteInput };

function requirePrisma(env: RuntimeBindings) {
  if (!hasPrisma(env)) {
    throw new Error("Prisma is required for kontak");
  }
  return env.prisma;
}

export async function listKontak(
  env: RuntimeBindings,
  opts: Parameters<typeof prismaListKontak>[1] = {},
) {
  return prismaListKontak(requirePrisma(env), opts);
}

export async function getKontakById(env: RuntimeBindings, id: string) {
  return prismaGetKontakById(requirePrisma(env), id);
}

export async function getKontakBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  return prismaGetKontakBySlug(requirePrisma(env), slug, publishedOnly);
}

export async function createKontak(
  env: RuntimeBindings,
  input: KontakWriteInput,
) {
  return prismaCreateKontak(requirePrisma(env), input);
}

export async function updateKontak(
  env: RuntimeBindings,
  id: string,
  input: KontakWriteInput,
) {
  return prismaUpdateKontak(requirePrisma(env), id, input);
}

export async function deleteKontak(env: RuntimeBindings, id: string) {
  return prismaDeleteKontak(requirePrisma(env), id);
}
