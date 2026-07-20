import type { Prestasi as PrestasiModel, PrismaClient } from "@prisma/client";
import type {
  Prestasi,
  PrestasiListItem,
  SiteContentStatus,
} from "@teknovo/shared";
import {
  parseDateOnly,
  toDateOnly,
  toIso,
  toIsoRequired,
} from "./map-helpers";

export type { PrestasiWriteInput } from "../d1/prestasi-repo";
import type { PrestasiWriteInput } from "../d1/prestasi-repo";

function publishedAtFor(
  status: SiteContentStatus,
  previous: Date | null,
): Date | null {
  if (status === "PUBLISHED") return previous ?? new Date();
  if (status === "DRAFT") return null;
  return previous;
}

function mapList(row: PrestasiModel): PrestasiListItem {
  return {
    id: row.id,
    judul: row.judul,
    penyelenggara: row.penyelenggara,
    tanggalIso: toDateOnly(row.tanggalIso),
    siswaLabel: row.siswaLabel,
    ringkasan: row.ringkasan,
    fileUrl: row.fileUrl,
    sortOrder: row.sortOrder,
    status: row.status,
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: PrestasiModel): Prestasi {
  return {
    ...mapList(row),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListPrestasi(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: PrestasiListItem[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 50));
  const skip = (page - 1) * limit;
  const includeTotal = opts.includeTotal !== false;
  const where = opts.status ? { status: opts.status } : {};

  const [total, rows] = await Promise.all([
    includeTotal ? prisma.prestasi.count({ where }) : Promise.resolve(-1),
    prisma.prestasi.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { tanggalIso: "desc" }],
      take: limit,
      skip,
    }),
  ]);

  return {
    items: rows.map(mapList),
    total,
    page,
    limit,
  };
}

export async function prismaGetPrestasiById(
  prisma: PrismaClient,
  id: string,
): Promise<Prestasi | null> {
  const row = await prisma.prestasi.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaCreatePrestasi(
  prisma: PrismaClient,
  input: PrestasiWriteInput,
): Promise<Prestasi> {
  const publishedAt = publishedAtFor(input.status, null);
  const row = await prisma.prestasi.create({
    data: {
      judul: input.judul,
      penyelenggara: input.penyelenggara,
      tanggalIso: parseDateOnly(input.tanggalIso),
      siswaLabel: input.siswaLabel,
      ringkasan: input.ringkasan,
      fileUrl: input.fileUrl,
      sortOrder: input.sortOrder ?? 0,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdatePrestasi(
  prisma: PrismaClient,
  id: string,
  input: PrestasiWriteInput,
): Promise<Prestasi | null> {
  const existing = await prisma.prestasi.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtFor(input.status, existing.publishedAt);
  const row = await prisma.prestasi.update({
    where: { id },
    data: {
      judul: input.judul,
      penyelenggara: input.penyelenggara,
      tanggalIso: parseDateOnly(input.tanggalIso),
      siswaLabel: input.siswaLabel,
      ringkasan: input.ringkasan,
      fileUrl: input.fileUrl,
      sortOrder: input.sortOrder ?? 0,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeletePrestasi(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.prestasi.deleteMany({ where: { id } });
}
