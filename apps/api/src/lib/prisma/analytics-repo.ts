import type { PrismaClient } from "@prisma/client";
import type { CmsAnalyticsOverview } from "@teknovo/shared";
import { getAnalyticsOverview } from "../procedures/analytics";
import { SITE_CONTENT_ENTITY_PATHS, SITE_CONTENT_ENTITY_MAP } from "./site-content-approval";

const MONTH_FMT = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  year: "numeric",
});

/** Overview via `fn_get_analytics_overview` + live Prisma aggregates. */
export async function prismaAnalyticsOverview(
  prisma: PrismaClient,
): Promise<CmsAnalyticsOverview> {
  const base = await getAnalyticsOverview(prisma);

  const pendingCounts = await Promise.all(
    SITE_CONTENT_ENTITY_PATHS.map(async (entity) => {
      const key = SITE_CONTENT_ENTITY_MAP[entity];
      const model = (prisma as unknown as Record<string, { count: (args: { where: { status: string } }) => Promise<number> }>)[key];
      if (!model?.count) return 0;
      try {
        return await model.count({ where: { status: "PENDING_REVIEW" } });
      } catch {
        return 0;
      }
    }),
  );
  const siteContentPending = pendingCounts.reduce((a, b) => a + b, 0);

  let pengumumanTotal = 0;
  try {
    pengumumanTotal = await prisma.pengumuman.count();
  } catch {
    pengumumanTotal = 0;
  }

  const since = new Date();
  since.setUTCMonth(since.getUTCMonth() - 5);
  since.setUTCDate(1);
  since.setUTCHours(0, 0, 0, 0);

  const beritaRecent = await prisma.berita.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, judul: true, status: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  const monthBuckets = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setUTCMonth(d.getUTCMonth() - i, 1);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    monthBuckets.set(key, 0);
  }
  for (const row of beritaRecent) {
    const d = row.createdAt;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    if (monthBuckets.has(key)) {
      monthBuckets.set(key, (monthBuckets.get(key) ?? 0) + 1);
    }
  }

  const beritaPerBulan = Array.from(monthBuckets.entries()).map(([key, jumlah]) => {
    const [y, m] = key.split("-").map(Number);
    const label = MONTH_FMT.format(new Date(Date.UTC(y, m - 1, 1)));
    return { bulan: label, jumlah };
  });

  const artikelRecent = await prisma.artikelSiswa.findMany({
    select: { judul: true, status: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 8,
  });

  const recentActivity = [
    ...beritaRecent.slice(0, 6).map((b) => ({
      type: "berita",
      label: `${b.status}: ${b.judul}`,
      time: b.updatedAt.toISOString(),
    })),
    ...artikelRecent.map((a) => ({
      type: "artikel",
      label: `${a.status}: ${a.judul}`,
      time: a.updatedAt.toISOString(),
    })),
  ]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 10);

  return {
    ...base,
    siteContentPending,
    pengumumanTotal,
    beritaPerBulan,
    recentActivity,
  };
}
