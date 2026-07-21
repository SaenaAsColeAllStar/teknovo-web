import { Prisma, type Kurikulum as KurikulumModel, type PrismaClient } from "@prisma/client";
import type {
  Kurikulum,
  KurikulumListItem,
  SiteContentStatus,
} from "@teknovo/shared";
import {
  asJsonUnknown,
  asLayoutConfig,
  layoutConfigJson,
  toIso,
  toIsoRequired,
  mapReviewFields,
  publishedAtForStatus
} from "./map-helpers";
import { isUuid } from "../ids";

export type KurikulumWriteInput = {
  judul: string;
  slug: string;
  deskripsi: string;
  coverUrl?: string;
  dokumenUrl?: string;
  tahunAjaran: string;
  jurusan?: string[];
  strukturKurikulum?: unknown | null;
  layoutConfig?: import("@teknovo/shared").SiteContentLayoutConfig;
  sortOrder?: number;
  showInNav?: boolean;
  status: SiteContentStatus;
};


function mapList(row: KurikulumModel): KurikulumListItem {
  return {
    id: row.id,
    slug: row.slug,
    judul: row.judul,
    deskripsi: row.deskripsi,
    coverUrl: row.coverUrl,
    tahunAjaran: row.tahunAjaran,
    sortOrder: row.sortOrder,
    showInNav: row.showInNav,
    status: row.status,
    ...mapReviewFields(row),
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: KurikulumModel): Kurikulum {
  return {
    ...mapList(row),
    dokumenUrl: row.dokumenUrl,
    jurusan: row.jurusan,
    strukturKurikulum: asJsonUnknown(row.strukturKurikulum),
    layoutConfig: asLayoutConfig(row.layoutConfig),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListKurikulum(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: KurikulumListItem[];
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
    includeTotal ? prisma.kurikulum.count({ where }) : Promise.resolve(-1),
    prisma.kurikulum.findMany({
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

export async function prismaGetKurikulumById(
  prisma: PrismaClient,
  id: string,
): Promise<Kurikulum | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.kurikulum.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetKurikulumBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<Kurikulum | null> {
  const row = await prisma.kurikulum.findFirst({
    where: publishedOnly ? { slug, status: "PUBLISHED" } : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateKurikulum(
  prisma: PrismaClient,
  input: KurikulumWriteInput,
): Promise<Kurikulum> {
  const publishedAt = publishedAtForStatus(input.status, null);
  const row = await prisma.kurikulum.create({
    data: {
      judul: input.judul,
      slug: input.slug,
      deskripsi: input.deskripsi,
      coverUrl: input.coverUrl || null,
      dokumenUrl: input.dokumenUrl || null,
      tahunAjaran: input.tahunAjaran,
      jurusan: input.jurusan ?? [],
      strukturKurikulum:
        input.strukturKurikulum === undefined
          ? undefined
          : (input.strukturKurikulum as Prisma.InputJsonValue),
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdateKurikulum(
  prisma: PrismaClient,
  id: string,
  input: KurikulumWriteInput,
): Promise<Kurikulum | null> {
  const existing = await prisma.kurikulum.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtForStatus(input.status, existing.publishedAt);
  const row = await prisma.kurikulum.update({
    where: { id },
    data: {
      judul: input.judul,
      slug: input.slug,
      deskripsi: input.deskripsi,
      coverUrl: input.coverUrl || null,
      dokumenUrl: input.dokumenUrl || null,
      tahunAjaran: input.tahunAjaran,
      jurusan: input.jurusan ?? [],
      strukturKurikulum:
        input.strukturKurikulum === undefined
          ? undefined
          : input.strukturKurikulum === null
            ? Prisma.DbNull
            : (input.strukturKurikulum as Prisma.InputJsonValue),
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeleteKurikulum(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.kurikulum.deleteMany({ where: { id } });
}
