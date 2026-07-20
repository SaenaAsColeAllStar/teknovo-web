import {
  d1CreatePrestasi,
  d1DeletePrestasi,
  d1GetPrestasiById,
  d1ListPrestasi,
  d1UpdatePrestasi,
  type PrestasiWriteInput,
} from "../d1/prestasi-repo";
import {
  prismaCreatePrestasi,
  prismaDeletePrestasi,
  prismaGetPrestasiById,
  prismaListPrestasi,
  prismaUpdatePrestasi,
} from "../prisma/prestasi-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export type { PrestasiWriteInput };

export async function listPrestasi(
  env: RuntimeBindings,
  opts: Parameters<typeof d1ListPrestasi>[1] = {},
) {
  if (hasPrisma(env)) return prismaListPrestasi(env.prisma, opts);
  return d1ListPrestasi(env.DB, opts);
}

export async function getPrestasiById(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaGetPrestasiById(env.prisma, id);
  return d1GetPrestasiById(env.DB, id);
}

export async function createPrestasi(
  env: RuntimeBindings,
  input: PrestasiWriteInput,
) {
  if (hasPrisma(env)) return prismaCreatePrestasi(env.prisma, input);
  return d1CreatePrestasi(env.DB, input);
}

export async function updatePrestasi(
  env: RuntimeBindings,
  id: string,
  input: PrestasiWriteInput,
) {
  if (hasPrisma(env)) return prismaUpdatePrestasi(env.prisma, id, input);
  return d1UpdatePrestasi(env.DB, id, input);
}

export async function deletePrestasi(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaDeletePrestasi(env.prisma, id);
  return d1DeletePrestasi(env.DB, id);
}
