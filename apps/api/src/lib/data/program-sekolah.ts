import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";
import {
  prismaCreateProgramSekolah,
  prismaDeleteProgramSekolah,
  prismaGetProgramSekolahById,
  prismaGetProgramSekolahBySlug,
  prismaListProgramSekolah,
  prismaUpdateProgramSekolah,
  type ProgramSekolahWriteInput,
} from "../prisma/program-sekolah-repo";

export type { ProgramSekolahWriteInput };

function requirePrisma(env: RuntimeBindings) {
  if (!hasPrisma(env)) {
    throw new Error("Prisma is required for program-sekolah");
  }
  return env.prisma;
}

export async function listProgramSekolah(
  env: RuntimeBindings,
  opts: Parameters<typeof prismaListProgramSekolah>[1] = {},
) {
  return prismaListProgramSekolah(requirePrisma(env), opts);
}

export async function getProgramSekolahById(env: RuntimeBindings, id: string) {
  return prismaGetProgramSekolahById(requirePrisma(env), id);
}

export async function getProgramSekolahBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  return prismaGetProgramSekolahBySlug(requirePrisma(env), slug, publishedOnly);
}

export async function createProgramSekolah(
  env: RuntimeBindings,
  input: ProgramSekolahWriteInput,
) {
  return prismaCreateProgramSekolah(requirePrisma(env), input);
}

export async function updateProgramSekolah(
  env: RuntimeBindings,
  id: string,
  input: ProgramSekolahWriteInput,
) {
  return prismaUpdateProgramSekolah(requirePrisma(env), id, input);
}

export async function deleteProgramSekolah(env: RuntimeBindings, id: string) {
  return prismaDeleteProgramSekolah(requirePrisma(env), id);
}
