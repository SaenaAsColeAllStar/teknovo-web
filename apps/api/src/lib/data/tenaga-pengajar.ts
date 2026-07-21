import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";
import {
  prismaCreateTenagaPengajar,
  prismaDeleteTenagaPengajar,
  prismaGetTenagaPengajarById,
  prismaGetTenagaPengajarBySlug,
  prismaListTenagaPengajar,
  prismaUpdateTenagaPengajar,
  type TenagaPengajarWriteInput,
} from "../prisma/tenaga-pengajar-repo";

export type { TenagaPengajarWriteInput };

function requirePrisma(env: RuntimeBindings) {
  if (!hasPrisma(env)) {
    throw new Error("Prisma is required for tenaga-pengajar");
  }
  return env.prisma;
}

export async function listTenagaPengajar(
  env: RuntimeBindings,
  opts: Parameters<typeof prismaListTenagaPengajar>[1] = {},
) {
  return prismaListTenagaPengajar(requirePrisma(env), opts);
}

export async function getTenagaPengajarById(env: RuntimeBindings, id: string) {
  return prismaGetTenagaPengajarById(requirePrisma(env), id);
}

export async function getTenagaPengajarBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  return prismaGetTenagaPengajarBySlug(requirePrisma(env), slug, publishedOnly);
}

export async function createTenagaPengajar(
  env: RuntimeBindings,
  input: TenagaPengajarWriteInput,
) {
  return prismaCreateTenagaPengajar(requirePrisma(env), input);
}

export async function updateTenagaPengajar(
  env: RuntimeBindings,
  id: string,
  input: TenagaPengajarWriteInput,
) {
  return prismaUpdateTenagaPengajar(requirePrisma(env), id, input);
}

export async function deleteTenagaPengajar(env: RuntimeBindings, id: string) {
  return prismaDeleteTenagaPengajar(requirePrisma(env), id);
}
