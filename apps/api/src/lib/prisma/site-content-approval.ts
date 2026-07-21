import type { PrismaClient, SiteContentStatus } from "@prisma/client";
import { isUuid } from "../ids";

/** URL path segments ↔ Prisma delegate keys. */
export const SITE_CONTENT_ENTITY_MAP = {
  fasilitas: "fasilitas",
  ekstrakurikuler: "ekstrakurikuler",
  prestasi: "prestasi",
  kurikulum: "kurikulum",
  "program-sekolah": "programSekolah",
  "program-jurusan": "programJurusan",
  "tenaga-pengajar": "tenagaPengajar",
  kontak: "kontak",
  pengumuman: "pengumuman",
} as const;

export type SiteContentEntityPath = keyof typeof SITE_CONTENT_ENTITY_MAP;
export type SiteContentPrismaKey =
  (typeof SITE_CONTENT_ENTITY_MAP)[SiteContentEntityPath];

export const SITE_CONTENT_ENTITY_PATHS = Object.keys(
  SITE_CONTENT_ENTITY_MAP,
) as SiteContentEntityPath[];

export function isSiteContentEntityPath(
  value: string,
): value is SiteContentEntityPath {
  return value in SITE_CONTENT_ENTITY_MAP;
}

export type SiteContentApprovalRow = {
  id: string;
  status: SiteContentStatus;
  slug?: string | null;
  title?: string | null;
  name?: string | null;
  judul?: string | null;
  nama?: string | null;
  label?: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNote: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

type Delegate = {
  findUnique: (args: {
    where: { id: string };
  }) => Promise<SiteContentApprovalRow | null>;
  update: (args: {
    where: { id: string };
    data: Record<string, unknown>;
  }) => Promise<SiteContentApprovalRow>;
  findMany: (args: {
    where: { status: SiteContentStatus };
    orderBy: { updatedAt: "desc" };
    take: number;
  }) => Promise<SiteContentApprovalRow[]>;
};

function getDelegate(
  prisma: PrismaClient,
  key: SiteContentPrismaKey,
): Delegate {
  return (prisma as unknown as Record<string, Delegate>)[key];
}

export function displayTitle(row: SiteContentApprovalRow): string {
  return (
    row.title ??
    row.name ??
    row.judul ??
    row.nama ??
    row.label ??
    row.slug ??
    row.id
  );
}

export type SiteContentPendingItem = {
  entity: SiteContentEntityPath;
  id: string;
  title: string;
  slug: string | null;
  status: "PENDING_REVIEW";
  updatedAt: string;
  editPath: string;
};

const EDIT_PATH: Record<SiteContentEntityPath, string> = {
  fasilitas: "/fasilitas",
  ekstrakurikuler: "/ekstrakurikuler",
  prestasi: "/prestasi",
  kurikulum: "/kurikulum",
  "program-sekolah": "/program-sekolah",
  "program-jurusan": "/program-jurusan",
  "tenaga-pengajar": "/tenaga-pengajar",
  kontak: "/kontak",
  pengumuman: "/pengumuman",
};

export async function prismaSubmitSiteContent(
  prisma: PrismaClient,
  entityPath: SiteContentEntityPath,
  id: string,
): Promise<SiteContentApprovalRow | null> {
  if (!isUuid(id)) return null;
  const key = SITE_CONTENT_ENTITY_MAP[entityPath];
  const model = getDelegate(prisma, key);
  const existing = await model.findUnique({ where: { id } });
  if (!existing) return null;
  if (
    existing.status !== "DRAFT" &&
    existing.status !== "REJECTED" &&
    existing.status !== "ARCHIVED"
  ) {
    return null;
  }
  return model.update({
    where: { id },
    data: {
      status: "PENDING_REVIEW",
      reviewNote: null,
      publishedAt: null,
    },
  });
}

export async function prismaApproveSiteContent(
  prisma: PrismaClient,
  entityPath: SiteContentEntityPath,
  id: string,
  reviewerId: string,
): Promise<SiteContentApprovalRow | null> {
  if (!isUuid(id)) return null;
  const key = SITE_CONTENT_ENTITY_MAP[entityPath];
  const model = getDelegate(prisma, key);
  const existing = await model.findUnique({ where: { id } });
  if (!existing) return null;
  if (existing.status !== "PENDING_REVIEW") return null;
  const now = new Date();
  return model.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      reviewedBy: reviewerId,
      reviewedAt: now,
      reviewNote: null,
      publishedAt: now,
    },
  });
}

export async function prismaRejectSiteContent(
  prisma: PrismaClient,
  entityPath: SiteContentEntityPath,
  id: string,
  reviewerId: string,
  note: string,
): Promise<SiteContentApprovalRow | null> {
  if (!isUuid(id)) return null;
  const key = SITE_CONTENT_ENTITY_MAP[entityPath];
  const model = getDelegate(prisma, key);
  const existing = await model.findUnique({ where: { id } });
  if (!existing) return null;
  if (existing.status !== "PENDING_REVIEW") return null;
  const now = new Date();
  return model.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedBy: reviewerId,
      reviewedAt: now,
      reviewNote: note.trim(),
      publishedAt: null,
    },
  });
}

export async function prismaReorderSiteContent(
  prisma: PrismaClient,
  entityPath: SiteContentEntityPath,
  items: { id: string; sortOrder: number }[],
): Promise<{ updated: number }> {
  const key = SITE_CONTENT_ENTITY_MAP[entityPath];
  const model = getDelegate(prisma, key);
  const valid = items.filter((item) => isUuid(item.id));
  if (valid.length === 0) return { updated: 0 };
  await prisma.$transaction(
    valid.map((item) =>
      model.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    ),
  );
  return { updated: valid.length };
}

export async function prismaListPendingSiteContent(
  prisma: PrismaClient,
  limitPerEntity = 50,
): Promise<SiteContentPendingItem[]> {
  const results = await Promise.all(
    SITE_CONTENT_ENTITY_PATHS.map(async (entity) => {
      const key = SITE_CONTENT_ENTITY_MAP[entity];
      const model = getDelegate(prisma, key);
      const rows = await model.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { updatedAt: "desc" },
        take: limitPerEntity,
      });
      return rows.map(
        (row): SiteContentPendingItem => ({
          entity,
          id: row.id,
          title: displayTitle(row),
          slug: row.slug ?? null,
          status: "PENDING_REVIEW",
          updatedAt: row.updatedAt.toISOString(),
          editPath: `${EDIT_PATH[entity]}/${row.id}/edit`,
        }),
      );
    }),
  );
  return results
    .flat()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
