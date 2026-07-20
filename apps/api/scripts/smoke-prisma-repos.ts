/**
 * Smoke-test Prisma repos against local Postgres (docker-compose).
 *
 * Usage (from apps/api):
 *   pnpm prisma:generate
 *   pnpm prisma:deploy   # or migrate
 *   pnpm prisma:seed
 *   pnpm exec tsx scripts/smoke-prisma-repos.ts
 */
import "dotenv/config";
import { disconnectPrisma, getPrisma } from "../src/lib/prisma/client";
import {
  prismaAnalyticsOverview,
  prismaCreateBerita,
  prismaCreateKategori,
  prismaDeleteBerita,
  prismaDeleteKategori,
  prismaGetPengaturan,
  prismaListKategori,
  prismaListSiteMedia,
  prismaUsersRepoReady,
} from "../src/lib/prisma";

async function main() {
  const prisma = getPrisma();
  const slug = `smoke-kat-${Date.now()}`;

  const users = await prismaUsersRepoReady(prisma);
  console.log("users-repo:", users.note);

  const sebelum = await prismaListKategori(prisma);
  console.log(`kategori before: ${sebelum.length}`);

  const kat = await prismaCreateKategori(prisma, {
    nama: "Smoke Test",
    slug,
    deskripsi: "temporary",
  });
  console.log("created kategori", kat.id);

  const berita = await prismaCreateBerita(prisma, {
    judul: "Smoke berita",
    slug: `smoke-berita-${Date.now()}`,
    konten: "<p>ok</p>",
    status: "DRAFT",
    kategoriId: kat.id,
  });
  console.log("created berita", berita.id, berita.kategori?.slug);

  const overview = await prismaAnalyticsOverview(prisma);
  console.log("analytics", {
    beritaTotal: overview.beritaTotal,
    kategoriTotal: overview.kategoriTotal,
  });

  const pengaturan = await prismaGetPengaturan(prisma);
  console.log("pengaturan id", pengaturan.id);

  const media = await prismaListSiteMedia(prisma);
  console.log("site_media count", media.length);

  await prismaDeleteBerita(prisma, berita.id);
  await prismaDeleteKategori(prisma, kat.id);
  console.log("cleaned up smoke rows");

  console.log("SMOKE OK");
}

main()
  .catch((err) => {
    console.error("SMOKE FAIL", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
