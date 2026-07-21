import type {
  ProgramJurusan as ProgramJurusanModel,
  PrismaClient,
} from "@prisma/client";
import type {
  ProgramJurusan,
  ProgramJurusanListItem,
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

export type ProgramJurusanWriteInput = {
  nama: string;
  slug: string;
  singkatan: string;
  deskripsi: string;
  coverUrl?: string;
  ikon?: string;
  prospekKerja?: string[];
  kompetensiDasar?: string[];
  fasilitas?: string[];
  jumlahSiswa?: number | null;
  linkPendaftaran?: string;
  layoutConfig?: import("@teknovo/shared").SiteContentLayoutConfig;
  sortOrder?: number;
  showInNav?: boolean;
  status: SiteContentStatus;
};


function mapList(row: ProgramJurusanModel): ProgramJurusanListItem {
  return {
    id: row.id,
    slug: row.slug,
    nama: row.nama,
    singkatan: row.singkatan,
    deskripsi: row.deskripsi,
    coverUrl: row.coverUrl,
    ikon: row.ikon,
    sortOrder: row.sortOrder,
    showInNav: row.showInNav,
    status: row.status,
    ...mapReviewFields(row),
    publishedAt: toIso(row.publishedAt),
  };
}

function mapFull(row: ProgramJurusanModel): ProgramJurusan {
  return {
    ...mapList(row),
    prospekKerja: row.prospekKerja,
    kompetensiDasar: row.kompetensiDasar,
    fasilitas: row.fasilitas,
    jumlahSiswa: row.jumlahSiswa,
    linkPendaftaran: row.linkPendaftaran,
    layoutConfig: asLayoutConfig(row.layoutConfig),
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
  };
}

export async function prismaListProgramJurusan(
  prisma: PrismaClient,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: ProgramJurusanListItem[];
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
    includeTotal ? prisma.programJurusan.count({ where }) : Promise.resolve(-1),
    prisma.programJurusan.findMany({
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

export async function prismaGetProgramJurusanById(
  prisma: PrismaClient,
  id: string,
): Promise<ProgramJurusan | null> {
  if (!isUuid(id)) return null;
  const row = await prisma.programJurusan.findUnique({ where: { id } });
  return row ? mapFull(row) : null;
}

export async function prismaGetProgramJurusanBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly: boolean,
): Promise<ProgramJurusan | null> {
  const row = await prisma.programJurusan.findFirst({
    where: publishedOnly ? { slug, status: "PUBLISHED" } : { slug },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateProgramJurusan(
  prisma: PrismaClient,
  input: ProgramJurusanWriteInput,
): Promise<ProgramJurusan> {
  const publishedAt = publishedAtForStatus(input.status, null);
  const row = await prisma.programJurusan.create({
    data: {
      nama: input.nama,
      slug: input.slug,
      singkatan: input.singkatan,
      deskripsi: input.deskripsi,
      coverUrl: input.coverUrl || null,
      ikon: input.ikon || null,
      prospekKerja: input.prospekKerja ?? [],
      kompetensiDasar: input.kompetensiDasar ?? [],
      fasilitas: input.fasilitas ?? [],
      jumlahSiswa: input.jumlahSiswa ?? null,
      linkPendaftaran: input.linkPendaftaran || null,
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaUpdateProgramJurusan(
  prisma: PrismaClient,
  id: string,
  input: ProgramJurusanWriteInput,
): Promise<ProgramJurusan | null> {
  const existing = await prisma.programJurusan.findUnique({ where: { id } });
  if (!existing) return null;
  const publishedAt = publishedAtForStatus(input.status, existing.publishedAt);
  const row = await prisma.programJurusan.update({
    where: { id },
    data: {
      nama: input.nama,
      slug: input.slug,
      singkatan: input.singkatan,
      deskripsi: input.deskripsi,
      coverUrl: input.coverUrl || null,
      ikon: input.ikon || null,
      prospekKerja: input.prospekKerja ?? [],
      kompetensiDasar: input.kompetensiDasar ?? [],
      fasilitas: input.fasilitas ?? [],
      jumlahSiswa: input.jumlahSiswa ?? null,
      linkPendaftaran: input.linkPendaftaran || null,
      layoutConfig: layoutConfigJson(input.layoutConfig),
      sortOrder: input.sortOrder ?? 0,
      showInNav: input.showInNav !== false,
      status: input.status,
      publishedAt,
    },
  });
  return mapFull(row);
}

export async function prismaDeleteProgramJurusan(
  prisma: PrismaClient,
  id: string,
): Promise<void> {
  await prisma.programJurusan.deleteMany({ where: { id } });
}
