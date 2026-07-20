import {
  d1GetPengaturan,
  d1UpsertPengaturan,
} from "../d1/pengaturan-repo";
import {
  prismaGetPengaturan,
  prismaUpsertPengaturan,
} from "../prisma/pengaturan-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export async function getPengaturan(env: RuntimeBindings) {
  if (hasPrisma(env)) return prismaGetPengaturan(env.prisma);
  return d1GetPengaturan(env.DB);
}

export async function upsertPengaturan(
  env: RuntimeBindings,
  input: Parameters<typeof d1UpsertPengaturan>[1],
) {
  if (hasPrisma(env)) return prismaUpsertPengaturan(env.prisma, input);
  return d1UpsertPengaturan(env.DB, input);
}
