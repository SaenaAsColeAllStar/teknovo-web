import type { Fasilitas as FasilitasModel, PrismaClient } from "@prisma/client";
import type {
  Fasilitas,
  FasilitasListItem,
  SiteContentStatus,
} from "@teknovo/shared";
import {
  asExtras,
  asLayoutConfig,
  asStringArray,
  layoutConfigJson,
  toIso,
  toIsoRequired,
  mapReviewFields,
  publishedAtForStatus
} from "./map-helpers";
import { isUuid } from "../ids";

export type { FasilitasWriteInput } from "../d1/fasilitas-repo";
import type { FasilitasWriteInput } from "../d1/fasilitas-repo";


function mapList(row: FasilitasModel): FasilitasListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    navLabel: row.navLabel,
    description: row.description,
    coverUrl: row.coverUrl,
    sortOrder: row.sortOrder,
    showInNav: row.showInNav,
    status: row.status,
    ...mapReviewFields(row),
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: FasilitasModel): Fasilitas {
  return {
    ...mapList(row),
    highlights: asStringArray(row.highlightsJson),
    paragraphs: asStringArray(row.paragraphsJson),
    extras: asExtras(row.extrasJson),
    layoutConfig: asLayoutConfig(row.layoutConfig),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListFasilitas(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: FasilitasListItem[];
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
    includeTotal ? prisma.fasilitas.count({ where }) : Promise.resolve(-1),
    prisma.fasilitas.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
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

export async function prismaGetFasilitasById(
  prisma: PrismaClient,
  id: string,
): Promise<Fasilitas | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.fasilitas.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetFasilitasBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<Fasilitas | null> {
  const row = await prisma.fasilitas.findFirst({
    where: publishedOnly
      ? { slug, status: "PUBLISHED" }
      : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateFasilitas(
  prisma: PrismaClient,
  input: FasilitasWriteInput,
): Promise<Fasilitas> {
  const publishedAt = publishedAtForStatus(input.status, null);
  const row = await prisma.fasilitas.create({
    data: {
      slug: input.slug,
      title: input.title,
      navLabel: input.navLabel,
      description: input.description,
      coverUrl: input.coverUrl || null,
      highlightsJson: input.highlights ?? [],
      paragraphsJson: input.paragraphs ?? [],
      extrasJson: input.extras ?? {},
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdateFasilitas(
  prisma: PrismaClient,
  id: string,
  input: FasilitasWriteInput,
): Promise<Fasilitas | null> {
  const existing = await prisma.fasilitas.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtForStatus(input.status, existing.publishedAt);
  const row = await prisma.fasilitas.update({
    where: { id },
    data: {
      slug: input.slug,
      title: input.title,
      navLabel: input.navLabel,
      description: input.description,
      coverUrl: input.coverUrl || null,
      highlightsJson: input.highlights ?? [],
      paragraphsJson: input.paragraphs ?? [],
      extrasJson: input.extras ?? {},
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeleteFasilitas(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.fasilitas.deleteMany({ where: { id } });
}
