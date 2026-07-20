import "dotenv/config";
import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
} from "@teknovo/shared";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_KATEGORI = [
  {
    nama: "Berita Sekolah",
    slug: "berita-sekolah",
    deskripsi: "Pengumuman dan berita kegiatan sekolah",
  },
  {
    nama: "Prestasi",
    slug: "prestasi",
    deskripsi: "Capaian siswa dan lembaga",
  },
  {
    nama: "PPDB",
    slug: "ppdb",
    deskripsi: "Informasi penerimaan peserta didik baru",
  },
] as const;

async function main() {
  for (const k of DEFAULT_KATEGORI) {
    await prisma.kategori.upsert({
      where: { slug: k.slug },
      create: {
        nama: k.nama,
        slug: k.slug,
        deskripsi: k.deskripsi,
      },
      update: {
        nama: k.nama,
        deskripsi: k.deskripsi,
      },
    });
  }

  const payload = {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  };

  await prisma.pengaturan.upsert({
    where: { id: PENGATURAN_SITUS_PUBLIK_ID },
    create: {
      id: PENGATURAN_SITUS_PUBLIK_ID,
      payload,
    },
    update: {
      payload,
    },
  });

  console.log(
    `Seed OK: ${DEFAULT_KATEGORI.length} kategori + pengaturan situs publik`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
