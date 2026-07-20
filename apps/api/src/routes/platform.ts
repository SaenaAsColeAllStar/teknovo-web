/**
 * Platform admin API stubs (Fase 10.3–10.5).
 * Mounted only when PLATFORM_ENABLED=true (Node path). Never on Worker Free.
 */
import { Hono } from "hono";
import { z } from "zod";
import { requireCmsAdmin, CmsAuthError } from "../auth/cms-auth";
import {
  errJson,
  handleApiError,
  okJson,
  okListJson,
  type AppEnv,
} from "../lib/http";
import { getPlatformPrisma } from "../lib/platform/client";
import { isPlatformEnabled } from "../lib/platform/config";
import { encryptSecret, maskSecret, decryptSecret } from "../lib/platform/crypto";
import { getEventBusMode, publishPlatformEvent } from "../lib/platform/events";
import {
  bucketForSlug,
  setupTenantDefaults,
} from "../lib/platform/provision";
import { loadMinioConfig } from "../lib/minio/client";

export const createTenantSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: lowercase kebab-case"),
  name: z.string().min(2).max(120),
  domain: z.string().min(3).max(253).optional().nullable(),
});

export async function requirePlatformAdmin(
  request: Request,
  env: { CLERK_SECRET_KEY: string },
): Promise<{ via: "clerk" | "secret"; userId?: string }> {
  const platformSecret = process.env.PLATFORM_ADMIN_SECRET?.trim();
  const auth = request.headers.get("Authorization");
  if (
    platformSecret &&
    !platformSecret.startsWith("GANTI_") &&
    auth === `Bearer ${platformSecret}`
  ) {
    return { via: "secret" };
  }
  const session = await requireCmsAdmin(request, env);
  return { via: "clerk", userId: session.userId };
}

export function publicTenant(row: {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  status: string;
  minioEndpoint: string | null;
  minioBucket: string | null;
  minioAccessKeyEnc: string | null;
  dbUrlEnc: string | null;
  meta: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  let dbHost: string | null = null;
  if (row.dbUrlEnc) {
    try {
      const url = decryptSecret(row.dbUrlEnc);
      dbHost = url.replace(/:[^:@]+@/, ":****@");
    } catch {
      dbHost = "(encrypted)";
    }
  }
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    domain: row.domain,
    status: row.status,
    minioEndpoint: row.minioEndpoint,
    minioBucket: row.minioBucket,
    minioAccessKey: maskSecret(
      row.minioAccessKeyEnc
        ? (() => {
            try {
              return decryptSecret(row.minioAccessKeyEnc);
            } catch {
              return null;
            }
          })()
        : null,
    ),
    dbUrl: dbHost,
    meta: row.meta,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const platformRoutes = new Hono<AppEnv>();

platformRoutes.get("/status", (c) => {
  return okJson(c, {
    enabled: isPlatformEnabled(),
    eventBus: getEventBusMode(),
    note: isPlatformEnabled()
      ? "Platform foundation active (Node only)."
      : "Set PLATFORM_ENABLED=true on Node API to enable multi-tenant stubs.",
  });
});

platformRoutes.use("*", async (c, next) => {
  if (!isPlatformEnabled()) {
    return errJson(
      c,
      "PLATFORM_DISABLED",
      "Platform API disabled. Set PLATFORM_ENABLED=true.",
      404,
    );
  }
  return next();
});

platformRoutes.get("/tenants", async (c) => {
  try {
    await requirePlatformAdmin(c.req.raw, c.env);
    const prisma = getPlatformPrisma();
    const rows = await prisma.tenant.findMany({
      where: { NOT: { status: "DELETED" } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return okListJson(
      c,
      rows.map(publicTenant),
      { page: 1, limit: 100, total: rows.length },
    );
  } catch (err) {
    return handleApiError(c, err);
  }
});

platformRoutes.get("/tenants/:id", async (c) => {
  try {
    await requirePlatformAdmin(c.req.raw, c.env);
    const prisma = getPlatformPrisma();
    const row = await prisma.tenant.findFirst({
      where: {
        OR: [{ id: c.req.param("id") }, { slug: c.req.param("id") }],
        NOT: { status: "DELETED" },
      },
    });
    if (!row) return errJson(c, "NOT_FOUND", "Tenant tidak ditemukan.", 404);
    return okJson(c, publicTenant(row));
  } catch (err) {
    return handleApiError(c, err);
  }
});

/** 10.3 — create tenant row + emit tenant.created (DB/bucket via event handler). */
platformRoutes.post("/tenants", async (c) => {
  try {
    const actor = await requirePlatformAdmin(c.req.raw, c.env);
    const body = createTenantSchema.parse(await c.req.json());
    const prisma = getPlatformPrisma();
    const minio = loadMinioConfig();
    const bucket = bucketForSlug(body.slug);

    const existing = await prisma.tenant.findFirst({
      where: {
        OR: [
          { slug: body.slug },
          ...(body.domain ? [{ domain: body.domain }] : []),
        ],
        NOT: { status: "DELETED" as const },
      },
    });
    if (existing) {
      return errJson(c, "CONFLICT", "Slug atau domain sudah dipakai.", 409);
    }

    const row = await prisma.tenant.create({
      data: {
        slug: body.slug,
        name: body.name,
        domain: body.domain ?? null,
        status: "PROVISIONING",
        minioEndpoint: minio.endpoint,
        minioBucket: bucket,
        minioAccessKeyEnc: encryptSecret(minio.accessKey),
        minioSecretKeyEnc: encryptSecret(minio.secretKey),
        meta: {
          createdBy: actor.via === "clerk" ? actor.userId : "platform-secret",
        },
      },
    });

    await publishPlatformEvent("tenant.created", {
      tenantId: row.id,
      slug: row.slug,
      at: new Date().toISOString(),
      meta: { bucket },
    });

    const fresh = await prisma.tenant.findUniqueOrThrow({
      where: { id: row.id },
    });
    return okJson(c, publicTenant(fresh), 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return errJson(c, "VALIDATION", err.issues[0]?.message ?? "Invalid body", 400);
    }
    return handleApiError(c, err);
  }
});

/** 10.4 — soft-delete + emit tenant.deleted (backup/cleanup via event handler). */
platformRoutes.delete("/tenants/:id", async (c) => {
  try {
    await requirePlatformAdmin(c.req.raw, c.env);
    const prisma = getPlatformPrisma();
    const row = await prisma.tenant.findFirst({
      where: {
        OR: [{ id: c.req.param("id") }, { slug: c.req.param("id") }],
        NOT: { status: "DELETED" },
      },
    });
    if (!row) return errJson(c, "NOT_FOUND", "Tenant tidak ditemukan.", 404);

    await prisma.tenant.update({
      where: { id: row.id },
      data: {
        status: "DELETING",
        meta: {
          ...(typeof row.meta === "object" && row.meta !== null
            ? (row.meta as object)
            : {}),
          backupNote:
            "Foundation stub: take pg_dump of tenant DB + MinIO mirror before hard cleanup.",
          deleteRequestedAt: new Date().toISOString(),
        },
      },
    });

    await publishPlatformEvent("tenant.deleted", {
      tenantId: row.id,
      slug: row.slug,
      at: new Date().toISOString(),
    });

    const fresh = await prisma.tenant.findUniqueOrThrow({
      where: { id: row.id },
    });
    return okJson(c, publicTenant(fresh));
  } catch (err) {
    return handleApiError(c, err);
  }
});

/** 10.5 — seed defaults stub per tenant. */
platformRoutes.post("/tenants/:id/setup", async (c) => {
  try {
    await requirePlatformAdmin(c.req.raw, c.env);
    const prisma = getPlatformPrisma();
    const row = await prisma.tenant.findFirst({
      where: {
        OR: [{ id: c.req.param("id") }, { slug: c.req.param("id") }],
        NOT: { status: "DELETED" },
      },
    });
    if (!row) return errJson(c, "NOT_FOUND", "Tenant tidak ditemukan.", 404);

    const result = await setupTenantDefaults(row.id);
    if (!result.ok) {
      return errJson(c, "SETUP_FAILED", result.detail, 503);
    }
    const fresh = await prisma.tenant.findUniqueOrThrow({
      where: { id: row.id },
    });
    return okJson(c, { tenant: publicTenant(fresh), setup: result });
  } catch (err) {
    if (err instanceof CmsAuthError) return handleApiError(c, err);
    return handleApiError(c, err);
  }
});
