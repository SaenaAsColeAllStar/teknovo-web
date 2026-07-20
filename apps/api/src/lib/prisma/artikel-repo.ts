import type {
  ArtikelSiswa as ArtikelModel,
  Kategori,
  PrismaClient,
} from "@prisma/client";
import type {
  ArtikelSiswa,
  ArtikelSiswaListItem,
  ArtikelSiswaStatus,
} from "@teknovo/shared";
import { toIso, toIsoRequired } from "./map-helpers";

export type { ArtikelWriteInput } from "../d1/artikel-repo";
import type { ArtikelWriteInput } from "../d1/artikel-repo";

type ArtikelWithKategori = ArtikelModel & {
  kategori: Pick<Kategori, "id" | "nama" | "slug"> | null;
};

const kategoriSelect = { id: true, nama: true, slug: true } as const;

function mapList(row: ArtikelWithKategori): ArtikelSiswaListItem {
  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    ringkasan: row.ringkasan,
    coverUrl: row.coverUrl,
    status: row.status,
    publishedAt: toIso(row.publishedAt),
    submittedAt: toIso(row.submittedAt),
    rejectedReason: row.rejectedReason,
    penulis: {
      id: row.penulisId,
      nama: row.penulisNama ?? "Siswa",
      kelas: row.penulisKelas,
    },
    kategori: row.kategori
      ? {
          id: row.kategori.id,
          nama: row.kategori.nama,
          slug: row.kategori.slug,
        }
      : null,
  };
}

function mapFull(row: ArtikelWithKategori): ArtikelSiswa {
  return {
    ...mapList(row),
    konten: row.konten,
    createdAt: toIsoRequired(row.createdAt),
    updatedAt: toIsoRequired(row.updatedAt),
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    metaKeywords: row.metaKeywords,
    ogImageUrl: row.ogImageUrl,
    canonicalUrl: row.canonicalUrl,
  };
}

export async function prismaListArtikel(
  prisma: PrismaClient,
  opts: {
    status?: ArtikelSiswaStatus;
    mineUserId?: string;
    page?: number;
    limit?: number;
    /** When false, skip COUNT(*) (meta.total = -1). Default true. */
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: ArtikelSiswaListItem[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const skip = (page - 1) * limit;
  const includeTotal = opts.includeTotal !== false;

  const where: {
    status?: ArtikelSiswaStatus;
    penulisId?: string;
  } = {};
  if (opts.status) where.status = opts.status;
  if (opts.mineUserId) where.penulisId = opts.mineUserId;

  const [total, rows] = await Promise.all([
    includeTotal ? prisma.artikelSiswa.count({ where }) : Promise.resolve(-1),
    prisma.artikelSiswa.findMany({
      where,
      include: { kategori: { select: kategoriSelect } },
      orderBy: [{ sortAt: "desc" }, { id: "desc" }],
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

export async function prismaGetArtikelById(
  prisma: PrismaClient,
  id: string,
): Promise<ArtikelSiswa | null> {
  const row = await prisma.artikelSiswa.findUnique({
    where: { id },
    include: { kategori: { select: kategoriSelect } },
  });
  return row ? mapFull(row) : null;
}

export async function prismaGetArtikelBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly = false,
): Promise<ArtikelSiswa | null> {
  const row = await prisma.artikelSiswa.findFirst({
    where: publishedOnly
      ? { slug, status: "PUBLISHED" }
      : { slug },
    include: { kategori: { select: kategoriSelect } },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateArtikel(
  prisma: PrismaClient,
  input: ArtikelWriteInput,
): Promise<ArtikelSiswa> {
  const now = new Date();
  const submittedAt = input.status === "REVIEW" ? now : null;
  const publishedAt = input.status === "PUBLISHED" ? now : null;
  const sortAt = submittedAt ?? now;

  const row = await prisma.artikelSiswa.create({
    data: {
      judul: input.judul,
      slug: input.slug,
      ringkasan: input.ringkasan ?? null,
      konten: input.konten,
      coverUrl: input.coverUrl ?? null,
      status: input.status,
      kategoriId: input.kategoriId ?? null,
      penulisId: input.penulisId,
      penulisNama: input.penulisNama ?? null,
      penulisKelas: input.penulisKelas ?? null,
      rejectedReason: null,
      submittedAt,
      publishedAt,
      sortAt,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      metaKeywords: input.metaKeywords ?? null,
      ogImageUrl: input.ogImageUrl ?? null,
      canonicalUrl: input.canonicalUrl ?? null,
    },
    include: { kategori: { select: kategoriSelect } },
  });
  return mapFull(row);
}

export async function prismaUpdateArtikel(
  prisma: PrismaClient,
  id: string,
  input: ArtikelWriteInput,
): Promise<ArtikelSiswa | null> {
  const existing = await prisma.artikelSiswa.findUnique({ where: { id } });
  if (!existing) return null;

  const now = new Date();
  let submittedAt = existing.submittedAt;
  let publishedAt = existing.publishedAt;
  if (input.status === "REVIEW" && existing.status !== "REVIEW") {
    submittedAt = now;
  }
  if (input.status === "PUBLISHED" && !publishedAt) publishedAt = now;
  const sortAt = submittedAt ?? now;

  const row = await prisma.artikelSiswa.update({
    where: { id },
    data: {
      judul: input.judul,
      slug: input.slug,
      ringkasan: input.ringkasan ?? null,
      konten: input.konten,
      coverUrl: input.coverUrl ?? null,
      status: input.status,
      kategoriId: input.kategoriId ?? null,
      penulisKelas: input.penulisKelas ?? null,
      submittedAt,
      publishedAt,
      sortAt,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      metaKeywords: input.metaKeywords ?? null,
      ogImageUrl: input.ogImageUrl ?? null,
      canonicalUrl: input.canonicalUrl ?? null,
    },
    include: { kategori: { select: kategoriSelect } },
  });
  return mapFull(row);
}

export async function prismaDeleteArtikel(
  prisma: PrismaClient,
  id: string,
): Promise<boolean> {
  try {
    await prisma.artikelSiswa.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function prismaApproveArtikel(
  prisma: PrismaClient,
  id: string,
): Promise<ArtikelSiswa | null> {
  const existing = await prisma.artikelSiswa.findUnique({
    where: { id },
    include: { kategori: { select: kategoriSelect } },
  });
  if (!existing || existing.status !== "REVIEW") return null;

  const now = new Date();
  const sortAt = existing.submittedAt ?? now;
  const row = await prisma.artikelSiswa.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: now,
      rejectedReason: null,
      sortAt,
    },
    include: { kategori: { select: kategoriSelect } },
  });
  return mapFull(row);
}

export async function prismaRejectArtikel(
  prisma: PrismaClient,
  id: string,
  reason?: string,
): Promise<ArtikelSiswa | null> {
  const existing = await prisma.artikelSiswa.findUnique({
    where: { id },
    include: { kategori: { select: kategoriSelect } },
  });
  if (!existing || existing.status !== "REVIEW") return null;

  const now = new Date();
  const sortAt = existing.submittedAt ?? now;
  const row = await prisma.artikelSiswa.update({
    where: { id },
    data: {
      status: "ARCHIVED",
      rejectedReason: reason?.trim() || null,
      sortAt,
    },
    include: { kategori: { select: kategoriSelect } },
  });
  return mapFull(row);
}
