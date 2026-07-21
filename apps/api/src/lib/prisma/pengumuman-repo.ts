import type { Pengumuman as PengumumanModel, PrismaClient } from "@prisma/client";
import type {
  Pengumuman,
  PengumumanListItem,
  PengumumanTipe,
  SiteContentLayoutConfig,
  SiteContentStatus,
} from "@teknovo/shared";
import {
  asLayoutConfig,
  layoutConfigJson,
  mapReviewFields,
  publishedAtForStatus,
  toIso,
  toIsoRequired,
} from "./map-helpers";
import { isUuid } from "../ids";

export type PengumumanWriteInput = {
  judul: string;
  slug: string;
  konten: string;
  tipe?: PengumumanTipe;
  bannerUrl?: string;
  tanggalMulai?: string | null;
  tanggalAkhir?: string | null;
  isSticky?: boolean;
  layoutConfig?: SiteContentLayoutConfig;
  sortOrder?: number;
  status: SiteContentStatus;
};

function parseOptionalDate(value: string | null | undefined): Date | null {
  if (value == null || value === "") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function mapList(row: PengumumanModel): PengumumanListItem {
  return {
    id: row.id,
    slug: row.slug,
    judul: row.judul,
    tipe: row.tipe,
    bannerUrl: row.bannerUrl,
    tanggalMulai: toIso(row.tanggalMulai),
    tanggalAkhir: toIso(row.tanggalAkhir),
    isSticky: row.isSticky,
    sortOrder: row.sortOrder,
    status: row.status,
    ...mapReviewFields(row),
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: PengumumanModel): Pengumuman {
  return {
    ...mapList(row),
    konten: row.konten,
    layoutConfig: asLayoutConfig(row.layoutConfig),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListPengumuman(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: PengumumanListItem[];
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
    includeTotal ? prisma.pengumuman.count({ where }) : Promise.resolve(-1),
    prisma.pengumuman.findMany({
      where,
      orderBy: [
        { isSticky: "desc" },
        { sortOrder: "asc" },
        { updatedAt: "desc" },
      ],
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

export async function prismaGetPengumumanById(
  prisma: PrismaClient,
  id: string,
): Promise<Pengumuman | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.pengumuman.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetPengumumanBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<Pengumuman | null> {
  const row = await prisma.pengumuman.findFirst({
    where: publishedOnly ? { slug, status: "PUBLISHED" } : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreatePengumuman(
  prisma: PrismaClient,
  input: PengumumanWriteInput,
): Promise<Pengumuman> {
  const publishedAt = publishedAtForStatus(input.status, null);
  const row = await prisma.pengumuman.create({
    data: {
      judul: input.judul,
      slug: input.slug,
      konten: input.konten,
      tipe: input.tipe ?? "INFO",
      bannerUrl: input.bannerUrl || null,
      tanggalMulai: parseOptionalDate(input.tanggalMulai),
      tanggalAkhir: parseOptionalDate(input.tanggalAkhir),
      isSticky: input.isSticky === true,
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdatePengumuman(
  prisma: PrismaClient,
  id: string,
  input: PengumumanWriteInput,
): Promise<Pengumuman | null> {
  const existing = await prisma.pengumuman.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtForStatus(input.status, existing.publishedAt);
  const row = await prisma.pengumuman.update({
    where: { id },
    data: {
      judul: input.judul,
      slug: input.slug,
      konten: input.konten,
      tipe: input.tipe ?? "INFO",
      bannerUrl: input.bannerUrl || null,
      tanggalMulai: parseOptionalDate(input.tanggalMulai),
      tanggalAkhir: parseOptionalDate(input.tanggalAkhir),
      isSticky: input.isSticky === true,
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeletePengumuman(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.pengumuman.deleteMany({ where: { id } });
}
