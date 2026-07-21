import {
  Prisma,
  type PrismaClient,
  type TenagaPengajar as TenagaPengajarModel,
} from "@prisma/client";
import type {
  SiteContentStatus,
  TenagaPengajar,
  TenagaPengajarListItem,
  TenagaPengajarMediaSosial,
} from "@teknovo/shared";
import {
  asLayoutConfig,
  asStringRecord,
  layoutConfigJson,
  toIso,
  toIsoRequired,
  mapReviewFields,
  publishedAtForStatus
} from "./map-helpers";
import { isUuid } from "../ids";

export type TenagaPengajarWriteInput = {
  nama: string;
  slug: string;
  nip?: string;
  fotoUrl?: string;
  jabatan: string;
  bidangKeahlian?: string;
  mataPelajaran?: string[];
  pendidikan?: string;
  pengalaman?: string;
  kontakEmail?: string;
  mediaSosial?: TenagaPengajarMediaSosial | null;
  layoutConfig?: import("@teknovo/shared").SiteContentLayoutConfig;
  sortOrder?: number;
  showInNav?: boolean;
  status: SiteContentStatus;
};


function mapList(row: TenagaPengajarModel): TenagaPengajarListItem {
  return {
    id: row.id,
    slug: row.slug,
    nama: row.nama,
    fotoUrl: row.fotoUrl,
    jabatan: row.jabatan,
    bidangKeahlian: row.bidangKeahlian,
    sortOrder: row.sortOrder,
    showInNav: row.showInNav,
    status: row.status,
    ...mapReviewFields(row),
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: TenagaPengajarModel): TenagaPengajar {
  return {
    ...mapList(row),
    nip: row.nip,
    mataPelajaran: row.mataPelajaran,
    pendidikan: row.pendidikan,
    pengalaman: row.pengalaman,
    kontakEmail: row.kontakEmail,
    mediaSosial: asStringRecord(row.mediaSosial),
    layoutConfig: asLayoutConfig(row.layoutConfig),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListTenagaPengajar(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: TenagaPengajarListItem[];
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
    includeTotal ? prisma.tenagaPengajar.count({ where }) : Promise.resolve(-1),
    prisma.tenagaPengajar.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { nama: "asc" }],
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

export async function prismaGetTenagaPengajarById(
  prisma: PrismaClient,
  id: string,
): Promise<TenagaPengajar | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.tenagaPengajar.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetTenagaPengajarBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<TenagaPengajar | null> {
  const row = await prisma.tenagaPengajar.findFirst({
    where: publishedOnly ? { slug, status: "PUBLISHED" } : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateTenagaPengajar(
  prisma: PrismaClient,
  input: TenagaPengajarWriteInput,
): Promise<TenagaPengajar> {
  const publishedAt = publishedAtForStatus(input.status, null);
  const row = await prisma.tenagaPengajar.create({
    data: {
      nama: input.nama,
      slug: input.slug,
      nip: input.nip || null,
      fotoUrl: input.fotoUrl || null,
      jabatan: input.jabatan,
      bidangKeahlian: input.bidangKeahlian || null,
      mataPelajaran: input.mataPelajaran ?? [],
      pendidikan: input.pendidikan || null,
      pengalaman: input.pengalaman || null,
      kontakEmail: input.kontakEmail || null,
      mediaSosial:
        input.mediaSosial === undefined
          ? undefined
          : input.mediaSosial === null
            ? Prisma.DbNull
            : (input.mediaSosial as Prisma.InputJsonValue),
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdateTenagaPengajar(
  prisma: PrismaClient,
  id: string,
  input: TenagaPengajarWriteInput,
): Promise<TenagaPengajar | null> {
  const existing = await prisma.tenagaPengajar.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtForStatus(input.status, existing.publishedAt);
  const row = await prisma.tenagaPengajar.update({
    where: { id },
    data: {
      nama: input.nama,
      slug: input.slug,
      nip: input.nip || null,
      fotoUrl: input.fotoUrl || null,
      jabatan: input.jabatan,
      bidangKeahlian: input.bidangKeahlian || null,
      mataPelajaran: input.mataPelajaran ?? [],
      pendidikan: input.pendidikan || null,
      pengalaman: input.pengalaman || null,
      kontakEmail: input.kontakEmail || null,
      mediaSosial:
        input.mediaSosial === undefined
          ? undefined
          : input.mediaSosial === null
            ? Prisma.DbNull
            : (input.mediaSosial as Prisma.InputJsonValue),
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeleteTenagaPengajar(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.tenagaPengajar.deleteMany({ where: { id } });
}
