/**
 * Smoke-test Postgres stored procedures (after `pnpm prisma:procedures`).
 *
 * Usage (from apps/api):
 *   pnpm prisma:deploy && pnpm prisma:procedures
 *   pnpm prisma:procedures:smoke
 */
import "dotenv/config";
import { disconnectPrisma, getPrisma } from "../src/lib/prisma/client";
import {
  prismaArchiveOutdated,
  prismaCreateBerita,
  prismaCreateKategori,
  prismaDeleteBerita,
  prismaDeleteKategori,
  prismaGetBeritaById,
  prismaPublishBerita,
  prismaUpsertSiteMedia,
} from "../src/lib/prisma";
import { getAnalyticsOverview } from "../src/lib/procedures/analytics";
import { searchBerita } from "../src/lib/procedures/search";

async function main() {
  const prisma = getPrisma();
  const stamp = Date.now();

  // 1) upsert site media
  const media = await prismaUpsertSiteMedia(prisma, {
    mediaKey: `smoke.proc.${stamp}`,
    label: "Smoke Proc",
    category: "landing",
    url: `https://example.test/smoke-${stamp}.jpg`,
    updatedBy: "smoke",
  });
  if (media.mediaKey !== `smoke.proc.${stamp}`) {
    throw new Error("upsert site media key mismatch");
  }
  console.log("sp_upsert_site_media OK", media.mediaKey);

  // 2) publish berita
  const kat = await prismaCreateKategori(prisma, {
    nama: "Smoke Proc Kat",
    slug: `smoke-proc-kat-${stamp}`,
  });
  const draft = await prismaCreateBerita(prisma, {
    judul: `Smoke Proc Berita ${stamp}`,
    slug: `smoke-proc-berita-${stamp}`,
    ringkasan: "cari kata unik smokeprocxyz",
    konten: "<p>ok</p>",
    status: "DRAFT",
    kategoriId: kat.id,
  });
  const published = await prismaPublishBerita(prisma, draft.id);
  if (!published || published.status !== "PUBLISHED" || !published.publishedAt) {
    throw new Error("publish berita failed");
  }
  console.log("sp_publish_berita OK", published.id, published.status);

  // 3) analytics
  const overview = await getAnalyticsOverview(prisma);
  if (overview.beritaPublished < 1 || overview.kategoriTotal < 1) {
    throw new Error("analytics overview unexpected");
  }
  console.log("fn_get_analytics_overview OK", {
    beritaPublished: overview.beritaPublished,
    kategoriTotal: overview.kategoriTotal,
  });

  // 4) search (pg_trgm)
  const hits = await searchBerita(prisma, "smokeprocxyz", 10);
  if (!hits.some((h) => h.id === published.id)) {
    throw new Error("search did not find published berita");
  }
  console.log("fn_search_berita OK", hits.length, "hit(s)");

  // 5) archive outdated — use huge threshold so nothing recent is archived
  const archived = await prismaArchiveOutdated(prisma, 36500);
  console.log("sp_archive_outdated OK", archived);

  // confirm still published (threshold too high)
  const still = await prismaGetBeritaById(prisma, published.id);
  if (!still || still.status !== "PUBLISHED") {
    throw new Error("archive unexpectedly changed recent berita");
  }

  // cleanup
  await prisma.siteMedia.deleteMany({
    where: { mediaKey: `smoke.proc.${stamp}` },
  });
  await prismaDeleteBerita(prisma, draft.id);
  await prismaDeleteKategori(prisma, kat.id);

  console.log("PROCEDURES SMOKE OK");
}

main()
  .catch((err) => {
    console.error("PROCEDURES SMOKE FAIL", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
