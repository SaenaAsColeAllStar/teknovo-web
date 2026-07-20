import type { PrismaClient } from "@prisma/client";
import type { Kategori } from "@teknovo/shared";
import { isUuid } from "../ids";

function mapKategori(row: {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
}): Kategori {
  return {
    id: row.id,
    nama: row.nama,
    slug: row.slug,
    deskripsi: row.deskripsi,
  };
}

export async function prismaListKategori(
  prisma: PrismaClient,
): Promise<Kategori[]> {
  const rows = await prisma.kategori.findMany({
    orderBy: { nama: "asc" },
  });
  return rows.map(mapKategori);
}

export async function prismaGetKategori(
  prisma: PrismaClient,
  id: string,
): Promise<Kategori | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.kategori.findUnique({ where: { id } });
  return row ? mapKategori(row) : null;
}

export async function prismaCreateKategori(
  prisma: PrismaClient,
  input: { nama: string; slug: string; deskripsi?: string },
): Promise<Kategori> {
  const row = await prisma.kategori.create({
    data: {
      nama: input.nama,
      slug: input.slug,
      deskripsi: input.deskripsi ?? null,
    },
  });
  return mapKategori(row);
}

export async function prismaUpdateKategori(
  prisma: PrismaClient,
  id: string,
  input: { nama: string; slug: string; deskripsi?: string },
): Promise<Kategori | null> {
  const existing = await prisma.kategori.findUnique({ where: { id } });
  if (!existing) return null;
  const row = await prisma.kategori.update({
    where: { id },
    data: {
      nama: input.nama,
      slug: input.slug,
      deskripsi: input.deskripsi ?? null,
    },
  });
  return mapKategori(row);
}

export async function prismaDeleteKategori(
  prisma: PrismaClient,
  id: string,
): Promise<boolean> {
  try {
    await prisma.kategori.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
