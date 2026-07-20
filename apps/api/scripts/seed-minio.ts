/**
 * Seed MinIO bucket with landing/brand assets and optionally upsert site_media rows.
 *
 * - Ensures bucket + public-read policy for media/* and brand/* (same as minio:ensure-bucket)
 * - Downloads objects from SEED_SRC (default: R2 public CDN) or writes tiny placeholders
 * - Upserts Postgres `site_media` catalog defaults to MinIO public URLs when DATABASE_URL is set
 *
 * Usage: pnpm --filter @teknovo/api minio:seed
 *
 * Env:
 *   MINIO_*           — see .env.example
 *   SEED_SRC          — HTTPS base for source objects (default https://r2.ctos.web.id)
 *   SEED_SKIP_DB=1    — upload objects only; skip site_media upsert
 *   SEED_CATALOG_ONLY=1 — only SITE_MEDIA_CATALOG keys (skip extra landing keys)
 */
import "dotenv/config";
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import {
  destroyS3Client,
  getS3Client,
  loadMinioConfig,
} from "../src/lib/minio/client";
import { putObject } from "../src/lib/minio/upload";
import { objectUrl } from "../src/lib/minio/url";
import {
  SITE_MEDIA_CATALOG,
  catalogDefaultUrl,
} from "../src/lib/prisma/site-media-repo";

/** Extra landing/brand keys beyond the CMS catalog (parity with migrate-r2 script). */
const EXTRA_LANDING_KEYS = [
  "brand/404-teknovo.webp",
  "media/shared/404-teknovo.webp",
  "media/landing/404-hero.webp",
  "media/landing/hero/greeting.webp",
  "media/landing/hero/slide-thumb-01.webp",
  "media/landing/hero/slide-thumb-02.webp",
  "media/landing/hero/slide-thumb-03.webp",
  "media/landing/kegiatan/ekstra-pramuka.webp",
  "media/landing/profil/sejarah-sekolah.webp",
  "media/landing/ppdb/hero.webp",
  "media/landing/misc/aktivitas-umum.webp",
  "media/landing/berita/cover-ppdb-2026.webp",
  "media/landing/berita/cover-lab-komputer.webp",
  "media/landing/berita/cover-lms-online.webp",
  "media/landing/berita/cover-cbt-online.webp",
  "media/landing/berita/cover-akreditasi-a.webp",
  "media/landing/berita/cover-jurusan-tm.webp",
  "media/landing/berita/cover-jurusan-ulw.webp",
  "media/landing/berita/cover-profil-smk-teknovo.webp",
  "media/landing/berita/cover-memilih-smk-vokasi.webp",
  "media/landing/berita/cover-tm-prospek-kerja.webp",
  "media/landing/berita/cover-ulw-pariwisata.webp",
  "media/landing/berita/cover-pkl-industri.webp",
  "media/landing/berita/cover-lms-hybrid.webp",
  "media/landing/berita/cover-cbt-terintegrasi.webp",
  "media/landing/berita/cover-lab-bengkel.webp",
  "media/landing/berita/cover-ekstrakurikuler.webp",
  "media/landing/berita/cover-ppdb-panduan.webp",
  "media/landing/berita/cover-akreditasi-calon-siswa.webp",
  "media/landing/berita/cover-visi-teknovo.webp",
  "media/landing/akademik/jurusan-teknik-mesin.webp",
  "media/landing/akademik/jurusan-ulw.webp",
  "media/landing/akademik/pkl-kompetensi-industri.webp",
  "media/landing/navbar/profil.webp",
  "media/landing/navbar/akademik.webp",
  "media/landing/navbar/kesiswaan.webp",
  "media/landing/navbar/fasilitas.webp",
  "media/landing/navbar/berita.webp",
] as const;

/** Minimal 1×1 lossy WebP placeholder when CDN download fails. */
const PLACEHOLDER_WEBP = Buffer.from(
  "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
  "base64",
);

function mimeFor(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

async function ensureBucket(): Promise<void> {
  const config = loadMinioConfig();
  const s3 = getS3Client(config);

  try {
    await s3.send(new HeadBucketCommand({ Bucket: config.bucket }));
    console.log(`Bucket exists: ${config.bucket}`);
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: config.bucket }));
    console.log(`Created bucket: ${config.bucket}`);
  }

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadMediaBrand",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [
          `arn:aws:s3:::${config.bucket}/media/*`,
          `arn:aws:s3:::${config.bucket}/brand/*`,
        ],
      },
    ],
  };

  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: config.bucket,
      Policy: JSON.stringify(policy),
    }),
  );
  console.log("Applied public-read policy for media/* and brand/*");
}

async function fetchOrPlaceholder(
  srcBase: string,
  key: string,
): Promise<{ body: Buffer; contentType: string; source: "cdn" | "placeholder" }> {
  const contentType = mimeFor(key);
  const url = `${srcBase.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error("empty body");
    return { body: buf, contentType, source: "cdn" };
  } catch {
    if (!key.toLowerCase().endsWith(".webp")) {
      // Non-webp extras (e.g. mp4) — skip rather than wrong mime placeholder
      throw new Error(`download failed and no placeholder for ${key}`);
    }
    return { body: PLACEHOLDER_WEBP, contentType: "image/webp", source: "placeholder" };
  }
}

async function upsertSiteMediaRows(): Promise<number> {
  if (!process.env.DATABASE_URL) {
    console.log("Skipping site_media upsert (DATABASE_URL unset)");
    return 0;
  }
  if ((process.env.SEED_SKIP_DB || "").trim() === "1") {
    console.log("Skipping site_media upsert (SEED_SKIP_DB=1)");
    return 0;
  }

  const prisma = new PrismaClient();
  let count = 0;
  try {
    for (const entry of SITE_MEDIA_CATALOG) {
      const url = catalogDefaultUrl(entry.defaultPath);
      await prisma.siteMedia.upsert({
        where: { mediaKey: entry.mediaKey },
        create: {
          mediaKey: entry.mediaKey,
          label: entry.label,
          category: entry.category,
          url,
          updatedBy: "seed-minio",
        },
        update: {
          label: entry.label,
          category: entry.category,
          url,
          updatedBy: "seed-minio",
        },
      });
      count += 1;
    }
    console.log(`Upserted ${count} site_media rows → MinIO public URLs`);
  } finally {
    await prisma.$disconnect();
  }
  return count;
}

async function main() {
  const config = loadMinioConfig();
  const srcBase = process.env.SEED_SRC || "https://r2.ctos.web.id";
  const catalogOnly = (process.env.SEED_CATALOG_ONLY || "").trim() === "1";

  await ensureBucket();
  console.log(`Public URL base: ${config.publicUrl}`);
  console.log(`Seed source: ${srcBase}`);

  const catalogKeys = SITE_MEDIA_CATALOG.map((e) => e.defaultPath);
  const keys = catalogOnly
    ? catalogKeys
    : [...new Set([...catalogKeys, ...EXTRA_LANDING_KEYS])];

  let uploaded = 0;
  let placeholders = 0;
  let skipped = 0;

  for (const key of keys) {
    try {
      const { body, contentType, source } = await fetchOrPlaceholder(srcBase, key);
      const put = await putObject(key, body, { contentType });
      if (source === "placeholder") {
        placeholders += 1;
        console.log(`  placeholder ${put.key}`);
      } else {
        uploaded += 1;
        console.log(`  ok ${put.key}`);
      }
    } catch (err) {
      skipped += 1;
      console.warn(
        `  skip ${key}:`,
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  const dbRows = await upsertSiteMediaRows();

  // Smoke: HEAD/GET one catalog object via public URL
  const sample = SITE_MEDIA_CATALOG[0];
  if (sample) {
    const sampleUrl = objectUrl(sample.defaultPath, config);
    const check = await fetch(sampleUrl, { method: "GET" });
    console.log(
      `Public read check: ${sampleUrl} → ${check.status} ${check.ok ? "OK" : "FAIL"}`,
    );
    if (!check.ok) {
      throw new Error(`Public read failed for ${sampleUrl} (${check.status})`);
    }
  }

  console.log(
    `Done. cdn=${uploaded} placeholder=${placeholders} skipped=${skipped} site_media=${dbRows}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await destroyS3Client();
  });
