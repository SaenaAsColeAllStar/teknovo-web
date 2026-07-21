import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";
import {
  prismaCreateProgramJurusan,
  prismaDeleteProgramJurusan,
  prismaGetProgramJurusanById,
  prismaGetProgramJurusanBySlug,
  prismaListProgramJurusan,
  prismaUpdateProgramJurusan,
  type ProgramJurusanWriteInput,
} from "../prisma/program-jurusan-repo";

export type { ProgramJurusanWriteInput };

function requirePrisma(env: RuntimeBindings) {
  if (!hasPrisma(env)) {
    throw new Error("Prisma is required for program-jurusan");
  }
  return env.prisma;
}

export async function listProgramJurusan(
  env: RuntimeBindings,
  opts: Parameters<typeof prismaListProgramJurusan>[1] = {},
) {
  return prismaListProgramJurusan(requirePrisma(env), opts);
}

export async function getProgramJurusanById(env: RuntimeBindings, id: string) {
  return prismaGetProgramJurusanById(requirePrisma(env), id);
}

export async function getProgramJurusanBySlug(
  env: RuntimeBindings,
  slug: string,
  publishedOnly = false,
) {
  return prismaGetProgramJurusanBySlug(requirePrisma(env), slug, publishedOnly);
}

export async function createProgramJurusan(
  env: RuntimeBindings,
  input: ProgramJurusanWriteInput,
) {
  return prismaCreateProgramJurusan(requirePrisma(env), input);
}

export async function updateProgramJurusan(
  env: RuntimeBindings,
  id: string,
  input: ProgramJurusanWriteInput,
) {
  return prismaUpdateProgramJurusan(requirePrisma(env), id, input);
}

export async function deleteProgramJurusan(env: RuntimeBindings, id: string) {
  return prismaDeleteProgramJurusan(requirePrisma(env), id);
}
