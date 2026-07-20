import type { Berita as BeritaModel, Kategori, PrismaClient } from "@prisma/client";
import type { Berita, BeritaListItem, BeritaStatus } from "@teknovo/shared";
import { toIso, toIsoRequired } from "./map-helpers";

export type { BeritaWriteInput } from "../d1/berita-repo";
import type { BeritaWriteInput } from "../d1/berita-repo";

type BeritaWithKategori = BeritaModel & {
  kategori: Pick<Kategori, "id" | "nama" | "slug"> | null;
};

const kategoriSelect = { id: true, nama: true, slug: true } as const;

function mapList(row: BeritaWithKategori): BeritaListItem {
  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    ringkasan: row.ringkasan,
    coverUrl: row.coverUrl,
    status: row.status,
    publishedAt: toIso(row.publishedAt),
    kategori: row.kategori
      ? {
          id: row.kategori.id,
          nama: row.kategori.nama,
          slug: row.kategori.slug,
        }
      : null,
  };
}

function mapFull(row: BeritaWithKategori): Berita {
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
    penulis: row.penulisId
      ? { id: row.penulisId, nama: row.penulisNama ?? "Editor" }
      : null,
  };
}

export async function prismaListBerita(
  prisma: PrismaClient,
  opts: {
    status?: BeritaStatus;
    page?: number;
    limit?: number;
    /** When false, skip COUNT(*) (meta.total = -1). Default true. */
    includeTotal?: boolean;
  } = {},
): Promise<{ items: BeritaListItem[]; total: number; page: number; limit: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const skip = (page - 1) * limit;
  const includeTotal = opts.includeTotal !== false;
  const where = opts.status ? { status: opts.status } : {};

  const [total, rows] = await Promise.all([
    includeTotal ? prisma.berita.count({ where }) : Promise.resolve(-1),
    prisma.berita.findMany({
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

export async function prismaGetBeritaById(
  prisma: PrismaClient,
  id: string,
): Promise<Berita | null> {
  const row = await prisma.berita.findUnique({
    where: { id },
    include: { kategori: { select: kategoriSelect } },
  });
  return row ? mapFull(row) : null;
}

export async function prismaGetBeritaBySlug(
  prisma: PrismaClient,
  slug: string,
  publishedOnly = false,
): Promise<Berita | null> {
  const row = await prisma.berita.findFirst({
    where: publishedOnly
      ? { slug, status: "PUBLISHED" }
      : { slug },
    include: { kategori: { select: kategoriSelect } },
  });
  return row ? mapFull(row) : null;
}

export async function prismaCreateBerita(
  prisma: PrismaClient,
  input: BeritaWriteInput,
): Promise<Berita> {
  const now = new Date();
  const publishedAt = input.status === "PUBLISHED" ? now : null;
  const sortAt = publishedAt ?? now;

  const row = await prisma.berita.create({
    data: {
      judul: input.judul,
      slug: input.slug,
      ringkasan: input.ringkasan ?? null,
      konten: input.konten,
      coverUrl: input.coverUrl ?? null,
      status: input.status,
      kategoriId: input.kategoriId ?? null,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      metaKeywords: input.metaKeywords ?? null,
      ogImageUrl: input.ogImageUrl ?? null,
      canonicalUrl: input.canonicalUrl ?? null,
      penulisId: input.penulisId ?? null,
      penulisNama: input.penulisNama ?? null,
      publishedAt,
      sortAt,
    },
    include: { kategori: { select: kategoriSelect } },
  });
  return mapFull(row);
}

export async function prismaUpdateBerita(
  prisma: PrismaClient,
  id: string,
  input: BeritaWriteInput,
): Promise<Berita | null> {
  const existing = await prisma.berita.findUnique({ where: { id } });
  if (!existing) return null;

  let publishedAt = existing.publishedAt;
  if (input.status === "PUBLISHED" && !publishedAt) publishedAt = new Date();
  const sortAt = publishedAt ?? existing.createdAt;

  const row = await prisma.berita.update({
    where: { id },
    data: {
      judul: input.judul,
      slug: input.slug,
      ringkasan: input.ringkasan ?? null,
      konten: input.konten,
      coverUrl: input.coverUrl ?? null,
      status: input.status,
      kategoriId: input.kategoriId ?? null,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      metaKeywords: input.metaKeywords ?? null,
      ogImageUrl: input.ogImageUrl ?? null,
      canonicalUrl: input.canonicalUrl ?? null,
      publishedAt,
      sortAt,
    },
    include: { kategori: { select: kategoriSelect } },
  });
  return mapFull(row);
}

export async function prismaDeleteBerita(
  prisma: PrismaClient,
  id: string,
): Promise<boolean> {
  try {
    await prisma.berita.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
