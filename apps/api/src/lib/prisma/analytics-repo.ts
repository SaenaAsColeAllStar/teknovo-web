import type { PrismaClient } from "@prisma/client";
import type { CmsAnalyticsOverview } from "@teknovo/shared";

export async function prismaAnalyticsOverview(
  prisma: PrismaClient,
): Promise<CmsAnalyticsOverview> {
  const [beritaGroups, artikelGroups, kategoriTotal] = await Promise.all([
    prisma.berita.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.artikelSiswa.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.kategori.count(),
  ]);

  const beritaByStatus = new Map(
    beritaGroups.map((g) => [g.status, g._count._all]),
  );
  const artikelByStatus = new Map(
    artikelGroups.map((g) => [g.status, g._count._all]),
  );

  const beritaPublished = beritaByStatus.get("PUBLISHED") ?? 0;
  const beritaDraft = beritaByStatus.get("DRAFT") ?? 0;
  const beritaArchived = beritaByStatus.get("ARCHIVED") ?? 0;
  const beritaTotal = beritaPublished + beritaDraft + beritaArchived;

  const artikelPublished = artikelByStatus.get("PUBLISHED") ?? 0;
  const artikelReview = artikelByStatus.get("REVIEW") ?? 0;
  const artikelTotal = [...artikelByStatus.values()].reduce((a, b) => a + b, 0);

  return {
    beritaTotal,
    beritaPublished,
    beritaDraft,
    beritaArchived,
    artikelTotal,
    artikelReview,
    artikelPublished,
    kategoriTotal,
    source: "api",
  };
}
