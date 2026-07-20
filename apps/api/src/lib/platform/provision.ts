/**
 * Tenant provision / teardown stubs (Fase 10.3–10.5, 10.7).
 * Creates MinIO bucket when possible; Postgres CREATE DATABASE is best-effort
 * (requires CREATEDB). Does not run multi-tenant DNS or live migrate cutover.
 */
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { PrismaClient as ContentPrisma } from "@prisma/client";
import type { Prisma } from "../../generated/platform-client/index.js";
import { getS3Client, loadMinioConfig } from "../minio/client";
import { log } from "../logger";
import { getPlatformPrisma } from "./client";
import { getTenantDbUrlTemplate } from "./config";
import { decryptSecret, encryptSecret } from "./crypto";
import type { PlatformEventPayload } from "./events";

function asJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function bucketForSlug(slug: string): string {
  const safe = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return `teknovo-${safe}`.slice(0, 63);
}

function dbNameForSlug(slug: string): string {
  const safe = slug.replace(/[^a-z0-9_]/gi, "_").toLowerCase();
  return `tenant_${safe}`.slice(0, 63);
}

async function ensurePublicMediaPolicy(bucket: string): Promise<void> {
  const s3 = getS3Client();
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadMediaBrand",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [
          `arn:aws:s3:::${bucket}/media/*`,
          `arn:aws:s3:::${bucket}/brand/*`,
        ],
      },
    ],
  };
  try {
    await s3.send(
      new PutBucketPolicyCommand({
        Bucket: bucket,
        Policy: JSON.stringify(policy),
      }),
    );
  } catch (err) {
    log.warn("platform.bucket.policy", {
      bucket,
      err: err instanceof Error ? err.message : String(err),
    });
  }
}

/** Best-effort CREATE DATABASE via admin connection (same host as PLATFORM / DATABASE). */
async function tryCreateTenantDatabase(dbName: string): Promise<{
  ok: boolean;
  detail: string;
}> {
  const adminUrl =
    process.env.DATABASE_URL ||
    process.env.PLATFORM_DATABASE_URL ||
    "";
  if (!adminUrl) {
    return { ok: false, detail: "No DATABASE_URL for CREATE DATABASE" };
  }
  const prisma = new ContentPrisma({
    datasources: { db: { url: adminUrl } },
  });
  try {
    // Identifier only — slug already sanitized.
    await prisma.$executeRawUnsafe(
      `CREATE DATABASE "${dbName}"`,
    );
    return { ok: true, detail: `created ${dbName}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/already exists/i.test(msg)) {
      return { ok: true, detail: `exists ${dbName}` };
    }
    return { ok: false, detail: msg };
  } finally {
    await prisma.$disconnect();
  }
}

async function tryDropTenantDatabase(dbName: string): Promise<{
  ok: boolean;
  detail: string;
}> {
  const adminUrl =
    process.env.DATABASE_URL ||
    process.env.PLATFORM_DATABASE_URL ||
    "";
  if (!adminUrl) {
    return { ok: false, detail: "No DATABASE_URL for DROP DATABASE" };
  }
  const prisma = new ContentPrisma({
    datasources: { db: { url: adminUrl } },
  });
  try {
    await prisma.$executeRawUnsafe(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbName}' AND pid <> pg_backend_pid()`,
    );
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS "${dbName}"`);
    return { ok: true, detail: `dropped ${dbName}` };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function handleTenantCreated(
  payload: PlatformEventPayload,
): Promise<void> {
  const platform = getPlatformPrisma();
  const tenant = await platform.tenant.findUnique({
    where: { id: payload.tenantId },
  });
  if (!tenant || tenant.status === "DELETED") return;

  const minio = loadMinioConfig();
  const bucket = tenant.minioBucket || bucketForSlug(tenant.slug);
  const dbName = dbNameForSlug(tenant.slug);
  const slugSafe = tenant.slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const resolvedDbUrl = getTenantDbUrlTemplate()
    .replaceAll("{db}", dbName)
    .replaceAll("{slug}", slugSafe);

  const steps: Record<string, unknown> = {
    bucket,
    dbName,
  };

  // MinIO bucket
  const s3 = getS3Client(minio);
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    steps.bucketStatus = "exists";
  } catch {
    try {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
      await ensurePublicMediaPolicy(bucket);
      steps.bucketStatus = "created";
    } catch (err) {
      steps.bucketStatus = "error";
      steps.bucketError = err instanceof Error ? err.message : String(err);
    }
  }

  const dbResult = await tryCreateTenantDatabase(dbName);
  steps.dbStatus = dbResult.ok ? "ok" : "skipped";
  steps.dbDetail = dbResult.detail;

  await platform.tenant.update({
    where: { id: tenant.id },
    data: {
      status:
        dbResult.ok && steps.bucketStatus !== "error" ? "ACTIVE" : "PROVISIONING",
      minioBucket: bucket,
      minioEndpoint: minio.endpoint,
      minioAccessKeyEnc: encryptSecret(minio.accessKey),
      minioSecretKeyEnc: encryptSecret(minio.secretKey),
      dbUrlEnc: encryptSecret(resolvedDbUrl),
      meta: asJson({
        ...(typeof tenant.meta === "object" && tenant.meta !== null
          ? (tenant.meta as object)
          : {}),
        provision: steps,
        provisionedAt: new Date().toISOString(),
      }),
    },
  });

  log.info("platform.tenant.created.handled", {
    tenantId: tenant.id,
    slug: tenant.slug,
    ...steps,
  });
}

export async function handleTenantDeleted(
  payload: PlatformEventPayload,
): Promise<void> {
  const platform = getPlatformPrisma();
  const tenant = await platform.tenant.findUnique({
    where: { id: payload.tenantId },
  });
  if (!tenant) return;

  const bucket = tenant.minioBucket || bucketForSlug(tenant.slug);
  const dbName = dbNameForSlug(tenant.slug);
  const cleanup: Record<string, unknown> = { bucket, dbName };

  // Bucket delete only if empty — foundation stub: leave objects; try empty delete.
  try {
    const s3 = getS3Client();
    await s3.send(new DeleteBucketCommand({ Bucket: bucket }));
    cleanup.bucketStatus = "deleted";
  } catch (err) {
    cleanup.bucketStatus = "skipped";
    cleanup.bucketError = err instanceof Error ? err.message : String(err);
  }

  const drop = await tryDropTenantDatabase(dbName);
  cleanup.dbStatus = drop.ok ? "dropped" : "skipped";
  cleanup.dbDetail = drop.detail;

  await platform.tenant.update({
    where: { id: tenant.id },
    data: {
      status: "DELETED",
      meta: asJson({
        ...(typeof tenant.meta === "object" && tenant.meta !== null
          ? (tenant.meta as object)
          : {}),
        cleanup,
        deletedAt: new Date().toISOString(),
      }),
    },
  });

  log.info("platform.tenant.deleted.handled", {
    tenantId: tenant.id,
    slug: tenant.slug,
    ...cleanup,
  });
}

/** Seed default kategori/pengaturan into tenant DB when reachable (foundation stub). */
export async function setupTenantDefaults(tenantId: string): Promise<{
  ok: boolean;
  detail: string;
}> {
  const platform = getPlatformPrisma();
  const tenant = await platform.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return { ok: false, detail: "Tenant not found" };
  if (!tenant.dbUrlEnc) {
    return { ok: false, detail: "Tenant has no db_url yet — wait for provision" };
  }

  let dbUrl: string;
  try {
    dbUrl = decryptSecret(tenant.dbUrlEnc);
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  }

  const prisma = new ContentPrisma({
    datasources: { db: { url: dbUrl } },
  });
  try {
    await prisma.$queryRaw`SELECT 1`;
    // Foundation: mark setup requested; full migrate+seed of isolated DB is deferred.
    await platform.tenant.update({
      where: { id: tenantId },
      data: {
        meta: asJson({
          ...(typeof tenant.meta === "object" && tenant.meta !== null
            ? (tenant.meta as object)
            : {}),
          setup: {
            status: "stub",
            note: "Apply tenant prisma migrate + seed against tenant db_url in a later phase",
            at: new Date().toISOString(),
          },
        }),
      },
    });
    return {
      ok: true,
      detail:
        "Setup stub recorded. Run prisma migrate deploy + seed against tenant DATABASE_URL when ready.",
    };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  } finally {
    await prisma.$disconnect();
  }
}

export { bucketForSlug, dbNameForSlug };
