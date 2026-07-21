import type {
  ProgramSekolah as ProgramSekolahModel,
  PrismaClient,
} from "@prisma/client";
import type {
  ProgramSekolah,
  ProgramSekolahKategori,
  ProgramSekolahListItem,
  SiteContentStatus,
} from "@teknovo/shared";
import {
  asLayoutConfig,
  layoutConfigJson,
  toIso,
  toIsoRequired,
  mapReviewFields,
  publishedAtForStatus
} from "./map-helpers";
import { isUuid } from "../ids";

export type ProgramSekolahWriteInput = {
  judul: string;
  slug: string;
  deskripsi: string;
  coverUrl?: string;
  ikon?: string;
  kategori: ProgramSekolahKategori;
  highlightItems?: string[];
  layoutConfig?: import("@teknovo/shared").SiteContentLayoutConfig;
  sortOrder?: number;
  showInNav?: boolean;
  status: SiteContentStatus;
};


function mapList(row: ProgramSekolahModel): ProgramSekolahListItem {
  return {
    id: row.id,
    slug: row.slug,
    judul: row.judul,
    deskripsi: row.deskripsi,
    coverUrl: row.coverUrl,
    ikon: row.ikon,
    kategori: row.kategori,
    sortOrder: row.sortOrder,
    showInNav: row.showInNav,
    status: row.status,
    ...mapReviewFields(row),
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: ProgramSekolahModel): ProgramSekolah {
  return {
    ...mapList(row),
    highlightItems: row.highlightItems,
    layoutConfig: asLayoutConfig(row.layoutConfig),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListProgramSekolah(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: ProgramSekolahListItem[];
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
    includeTotal ? prisma.programSekolah.count({ where }) : Promise.resolve(-1),
    prisma.programSekolah.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { judul: "asc" }],
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

export async function prismaGetProgramSekolahById(
  prisma: PrismaClient,
  id: string,
): Promise<ProgramSekolah | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.programSekolah.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetProgramSekolahBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<ProgramSekolah | null> {
  const row = await prisma.programSekolah.findFirst({
    where: publishedOnly ? { slug, status: "PUBLISHED" } : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateProgramSekolah(
  prisma: PrismaClient,
  input: ProgramSekolahWriteInput,
): Promise<ProgramSekolah> {
  const publishedAt = publishedAtForStatus(input.status, null);
  const row = await prisma.programSekolah.create({
    data: {
      judul: input.judul,
      slug: input.slug,
      deskripsi: input.deskripsi,
      coverUrl: input.coverUrl || null,
      ikon: input.ikon || null,
      kategori: input.kategori,
      highlightItems: input.highlightItems ?? [],
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdateProgramSekolah(
  prisma: PrismaClient,
  id: string,
  input: ProgramSekolahWriteInput,
): Promise<ProgramSekolah | null> {
  const existing = await prisma.programSekolah.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtForStatus(input.status, existing.publishedAt);
  const row = await prisma.programSekolah.update({
    where: { id },
    data: {
      judul: input.judul,
      slug: input.slug,
      deskripsi: input.deskripsi,
      coverUrl: input.coverUrl || null,
      ikon: input.ikon || null,
      kategori: input.kategori,
      highlightItems: input.highlightItems ?? [],
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeleteProgramSekolah(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.programSekolah.deleteMany({ where: { id } });
}
