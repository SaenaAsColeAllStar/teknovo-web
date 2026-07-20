import {
  d1CreateKategori,
  d1DeleteKategori,
  d1ListKategori,
  d1UpdateKategori,
} from "../d1/kategori-repo";
import {
  prismaCreateKategori,
  prismaDeleteKategori,
  prismaListKategori,
  prismaUpdateKategori,
} from "../prisma/kategori-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export async function listKategori(env: RuntimeBindings) {
  if (hasPrisma(env)) return prismaListKategori(env.prisma);
  return d1ListKategori(env.DB);
}

export async function createKategori(
  env: RuntimeBindings,
  input: { nama: string; slug: string; deskripsi?: string },
) {
  if (hasPrisma(env)) return prismaCreateKategori(env.prisma, input);
  return d1CreateKategori(env.DB, input);
}

export async function updateKategori(
  env: RuntimeBindings,
  id: string,
  input: { nama: string; slug: string; deskripsi?: string },
) {
  if (hasPrisma(env)) return prismaUpdateKategori(env.prisma, id, input);
  return d1UpdateKategori(env.DB, id, input);
}

export async function deleteKategori(env: RuntimeBindings, id: string) {
  if (hasPrisma(env)) return prismaDeleteKategori(env.prisma, id);
  return d1DeleteKategori(env.DB, id);
}
