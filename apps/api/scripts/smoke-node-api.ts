/**
 * Smoke-test Node API (Express entry) against local Postgres + MinIO.
 *
 * Prerequisites:
 *   apps/api/.env with DATABASE_URL + MinIO
 *   pnpm --filter @teknovo/api prisma:deploy
 *   pnpm --filter @teknovo/api prisma:seed
 *   pnpm --filter @teknovo/api minio:ensure-bucket   # optional; server also ensures
 *
 * Run:
 *   pnpm --filter @teknovo/api smoke:node
 */
import "dotenv/config";
import type { AddressInfo } from "node:net";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import {
  buildNodeBindings,
  createExpressApp,
} from "../src/server";
import { disconnectPrisma } from "../src/lib/prisma/client";
import { destroyS3Client } from "../src/lib/minio/client";

async function ensureBucket(bindings: ReturnType<typeof buildNodeBindings>) {
  try {
    await bindings.s3.send(
      new HeadBucketCommand({ Bucket: bindings.MINIO_BUCKET }),
    );
  } catch {
    const { CreateBucketCommand } = await import("@aws-sdk/client-s3");
    await bindings.s3.send(
      new CreateBucketCommand({ Bucket: bindings.MINIO_BUCKET }),
    );
  }
}

async function main() {
  const bindings = buildNodeBindings();
  await ensureBucket(bindings);
  const app = createExpressApp(bindings);

  const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;
  const base = `http://127.0.0.1:${port}`;

  try {
    const health = await fetch(`${base}/api/health`);
    const healthJson = (await health.json()) as {
      ok: boolean;
      runtime?: string;
      checks?: Record<string, string>;
    };
    console.log("health", health.status, healthJson);
    if (health.status !== 200 || !healthJson.ok) {
      throw new Error("health check failed");
    }
    if (healthJson.runtime !== "node") {
      throw new Error(`expected runtime=node, got ${healthJson.runtime}`);
    }

    const listKat = await fetch(`${base}/api/v1/kategori`);
    const listJson = (await listKat.json()) as {
      ok: boolean;
      data?: unknown[];
    };
    console.log("GET /api/v1/kategori", listKat.status, {
      ok: listJson.ok,
      count: Array.isArray(listJson.data) ? listJson.data.length : null,
    });
    if (listKat.status !== 200 || !listJson.ok) {
      throw new Error("kategori list failed");
    }

    const listBerita = await fetch(
      `${base}/api/v1/berita?status=PUBLISHED&limit=5`,
    );
    const beritaJson = (await listBerita.json()) as {
      ok: boolean;
      data?: unknown[];
      meta?: { total: number };
    };
    console.log("GET /api/v1/berita?status=PUBLISHED", listBerita.status, {
      ok: beritaJson.ok,
      count: Array.isArray(beritaJson.data) ? beritaJson.data.length : null,
      total: beritaJson.meta?.total,
    });
    if (listBerita.status !== 200 || !beritaJson.ok) {
      throw new Error("berita list failed");
    }

    // Unauthorized write must fail without Clerk session.
    const createAttempt = await fetch(`${base}/api/v1/kategori`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: "Smoke",
        slug: `smoke-${Date.now()}`,
      }),
    });
    console.log("POST /api/v1/kategori (no auth)", createAttempt.status);
    if (createAttempt.status !== 401 && createAttempt.status !== 403) {
      throw new Error(
        `expected 401/403 without Clerk, got ${createAttempt.status}`,
      );
    }

    // MinIO media list also requires auth.
    const mediaAttempt = await fetch(`${base}/api/cms/media`);
    console.log("GET /api/cms/media (no auth)", mediaAttempt.status);
    if (mediaAttempt.status !== 401 && mediaAttempt.status !== 403) {
      throw new Error(
        `expected 401/403 for media without auth, got ${mediaAttempt.status}`,
      );
    }

    // Direct MinIO put/list/delete (auth is route-level; storage path is separate).
    const { putCmsUpload, listCmsUploads, deleteCmsUpload } = await import(
      "../src/media/cms-media"
    );
    const blob = new Blob([Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])], {
      type: "image/png",
    });
    const uploaded = await putCmsUpload(
      bindings,
      blob,
      "smoke-test.png",
      "image/png",
    );
    console.log("minio put", uploaded.key, uploaded.url);
    if (!uploaded.key.startsWith("cms/uploads/")) {
      throw new Error("unexpected upload key prefix");
    }

    const listed = await listCmsUploads(bindings, { limit: 50 });
    const found = listed.objects.some((o) => o.key === uploaded.key);
    console.log("minio list contains upload", found);
    if (!found) throw new Error("uploaded object missing from list");

    await deleteCmsUpload(bindings, uploaded.key);
    console.log("minio delete ok");

    console.log("SMOKE NODE API OK");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

main()
  .catch((err) => {
    console.error("SMOKE NODE API FAIL", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
    await destroyS3Client();
  });
