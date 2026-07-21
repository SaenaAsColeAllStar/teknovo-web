import {
  Prisma,
  type Kontak as KontakModel,
  type PrismaClient,
} from "@prisma/client";
import type {
  Kontak,
  KontakJamOperasional,
  KontakListItem,
  KontakMediaSosial,
  SiteContentStatus,
} from "@teknovo/shared";
import {
  asJamOperasional,
  asLayoutConfig,
  asStringRecord,
  layoutConfigJson,
  toIso,
  toIsoRequired,
  mapReviewFields,
  publishedAtForStatus
} from "./map-helpers";
import { isUuid } from "../ids";

export type KontakWriteInput = {
  label: string;
  slug: string;
  alamatLengkap: string;
  telepon?: string[];
  email?: string[];
  whatsapp?: string;
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  jamOperasional?: KontakJamOperasional[] | null;
  mediaSosial?: KontakMediaSosial | null;
  layoutConfig?: import("@teknovo/shared").SiteContentLayoutConfig;
  sortOrder?: number;
  showInNav?: boolean;
  status: SiteContentStatus;
};


function mapList(row: KontakModel): KontakListItem {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    alamatLengkap: row.alamatLengkap,
    telepon: row.telepon,
    email: row.email,
    whatsapp: row.whatsapp,
    sortOrder: row.sortOrder,
    showInNav: row.showInNav,
    status: row.status,
    ...mapReviewFields(row),
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: KontakModel): Kontak {
  return {
    ...mapList(row),
    googleMapsUrl: row.googleMapsUrl,
    googleMapsEmbed: row.googleMapsEmbed,
    jamOperasional: asJamOperasional(row.jamOperasional),
    mediaSosial: asStringRecord(row.mediaSosial),
    layoutConfig: asLayoutConfig(row.layoutConfig),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

function jamJson(
  value: KontakJamOperasional[] | null | undefined,
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (value == null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

function mediaJson(
  value: KontakMediaSosial | null | undefined,
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (value == null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

export async function prismaListKontak(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: KontakListItem[];
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
    includeTotal ? prisma.kontak.count({ where }) : Promise.resolve(-1),
    prisma.kontak.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
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

export async function prismaGetKontakById(
  prisma: PrismaClient,
  id: string,
): Promise<Kontak | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.kontak.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetKontakBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<Kontak | null> {
  const row = await prisma.kontak.findFirst({
    where: publishedOnly ? { slug, status: "PUBLISHED" } : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateKontak(
  prisma: PrismaClient,
  input: KontakWriteInput,
): Promise<Kontak> {
  const publishedAt = publishedAtForStatus(input.status, null);
  const row = await prisma.kontak.create({
    data: {
      label: input.label,
      slug: input.slug,
      alamatLengkap: input.alamatLengkap,
      telepon: input.telepon ?? [],
      email: input.email ?? [],
      whatsapp: input.whatsapp || null,
      googleMapsUrl: input.googleMapsUrl || null,
      googleMapsEmbed: input.googleMapsEmbed || null,
      jamOperasional: jamJson(input.jamOperasional),
      mediaSosial: mediaJson(input.mediaSosial),
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdateKontak(
  prisma: PrismaClient,
  id: string,
  input: KontakWriteInput,
): Promise<Kontak | null> {
  const existing = await prisma.kontak.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtForStatus(input.status, existing.publishedAt);
  const row = await prisma.kontak.update({
    where: { id },
    data: {
      label: input.label,
      slug: input.slug,
      alamatLengkap: input.alamatLengkap,
      telepon: input.telepon ?? [],
      email: input.email ?? [],
      whatsapp: input.whatsapp || null,
      googleMapsUrl: input.googleMapsUrl || null,
      googleMapsEmbed: input.googleMapsEmbed || null,
      jamOperasional: jamJson(input.jamOperasional),
      mediaSosial: mediaJson(input.mediaSosial),
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeleteKontak(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.kontak.deleteMany({ where: { id } });
}
