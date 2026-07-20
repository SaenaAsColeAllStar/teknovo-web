import type {
  Ekstrakurikuler as EkstrakurikulerModel,
  PrismaClient,
} from "@prisma/client";
import type {
  Ekstrakurikuler,
  EkstrakurikulerListItem,
  SiteContentStatus,
} from "@teknovo/shared";
import { asStringArray, toIso, toIsoRequired } from "./map-helpers";
import { isUuid } from "../ids";

export type { EkstrakurikulerWriteInput } from "../d1/ekstrakurikuler-repo";
import type { EkstrakurikulerWriteInput } from "../d1/ekstrakurikuler-repo";

function publishedAtFor(
  status: SiteContentStatus,
  previous: Date | null,
): Date | null {
  if (status === "PUBLISHED") return previous ?? new Date();
  if (status === "DRAFT") return null;
  return previous;
}

function mapList(row: EkstrakurikulerModel): EkstrakurikulerListItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    detail: row.detail,
    kategori: row.kategori,
    previewUrl: row.previewUrl,
    sortOrder: row.sortOrder,
    status: row.status,
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: EkstrakurikulerModel): Ekstrakurikuler {
  return {
    ...mapList(row),
    fullDescription: row.fullDescription,
    relatedAchievements: asStringArray(row.relatedAchievementsJson),
    jadwalRingkas: row.jadwalRingkas,
    lokasiLatihan: row.lokasiLatihan,
    pembinaNama: row.pembinaNama,
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListEkstrakurikuler(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: EkstrakurikulerListItem[];
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
    includeTotal
      ? prisma.ekstrakurikuler.count({ where })
      : Promise.resolve(-1),
    prisma.ekstrakurikuler.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
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

export async function prismaGetEkstrakurikulerById(
  prisma: PrismaClient,
  id: string,
): Promise<Ekstrakurikuler | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.ekstrakurikuler.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetEkstrakurikulerBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<Ekstrakurikuler | null> {
  const row = await prisma.ekstrakurikuler.findFirst({
    where: publishedOnly
      ? { slug, status: "PUBLISHED" }
      : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaListEkstrakurikulerFull(
  prisma: PrismaClient,
  status: SiteContentStatus = "PUBLISHED",
): Promise<Ekstrakurikuler[]> {
  const rows = await prisma.ekstrakurikuler.findMany({
    where: { status },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(mapFull);
}

export async function prismaCreateEkstrakurikuler(
  prisma: PrismaClient,
  input: EkstrakurikulerWriteInput,
): Promise<Ekstrakurikuler> {
  const publishedAt = publishedAtFor(input.status, null);
  const row = await prisma.ekstrakurikuler.create({
    data: {
      slug: input.slug,
      name: input.name,
      detail: input.detail,
      fullDescription: input.fullDescription,
      kategori: input.kategori,
      previewUrl: input.previewUrl || null,
      relatedAchievementsJson: input.relatedAchievements ?? [],
      jadwalRingkas: input.jadwalRingkas || null,
      lokasiLatihan: input.lokasiLatihan || null,
      pembinaNama: input.pembinaNama || null,
      sortOrder: input.sortOrder ?? 0,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdateEkstrakurikuler(
  prisma: PrismaClient,
  id: string,
  input: EkstrakurikulerWriteInput,
): Promise<Ekstrakurikuler | null> {
  const existing = await prisma.ekstrakurikuler.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtFor(input.status, existing.publishedAt);
  const row = await prisma.ekstrakurikuler.update({
    where: { id },
    data: {
      slug: input.slug,
      name: input.name,
      detail: input.detail,
      fullDescription: input.fullDescription,
      kategori: input.kategori,
      previewUrl: input.previewUrl || null,
      relatedAchievementsJson: input.relatedAchievements ?? [],
      jadwalRingkas: input.jadwalRingkas || null,
      lokasiLatihan: input.lokasiLatihan || null,
      pembinaNama: input.pembinaNama || null,
      sortOrder: input.sortOrder ?? 0,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeleteEkstrakurikuler(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.ekstrakurikuler.deleteMany({ where: { id } });
}
