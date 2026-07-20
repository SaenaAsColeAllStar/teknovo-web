/**
 * Platform admin Express routers (Node only when PLATFORM_ENABLED).
 * Worker Free never mounts these.
 */
import { Router } from "express";
import { z } from "zod";
import { CmsAuthError } from "../auth/cms-auth";
import { getPlatformPrisma } from "../lib/platform/client";
import { isPlatformEnabled } from "../lib/platform/config";
import { encryptSecret } from "../lib/platform/crypto";
import { getEventBusMode, publishPlatformEvent } from "../lib/platform/events";
import {
  bucketForSlug,
  setupTenantDefaults,
} from "../lib/platform/provision";
import { loadMinioConfig } from "../lib/minio/client";
import {
  createTenantSchema,
  publicTenant,
  requirePlatformAdmin,
} from "../routes/platform";
import {
  asyncHandler,
  exErr,
  exHandleError,
  exOk,
  exOkList,
  getBindings,
  p,
  toWebRequest,
} from "../lib/express-http";

export const platformExpressRouter = Router();

platformExpressRouter.get("/status", (_req, res) => {
  exOk(res, {
    enabled: isPlatformEnabled(),
    eventBus: getEventBusMode(),
    note: isPlatformEnabled()
      ? "Platform foundation active (Node only)."
      : "Set PLATFORM_ENABLED=true on Node API to enable multi-tenant stubs.",
  });
});

platformExpressRouter.use((req, res, next) => {
  if (req.path === "/status") {
    next();
    return;
  }
  if (!isPlatformEnabled()) {
    exErr(
      res,
      "PLATFORM_DISABLED",
      "Platform API disabled. Set PLATFORM_ENABLED=true.",
      404,
    );
    return;
  }
  next();
});

platformExpressRouter.get(
  "/tenants",
  asyncHandler(async (req, res) => {
    try {
      await requirePlatformAdmin(toWebRequest(req), getBindings(res));
      const prisma = getPlatformPrisma();
      const rows = await prisma.tenant.findMany({
        where: { NOT: { status: "DELETED" } },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      exOkList(res, rows.map(publicTenant), {
        page: 1,
        limit: 100,
        total: rows.length,
      });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

platformExpressRouter.get(
  "/tenants/:id",
  asyncHandler(async (req, res) => {
    try {
      await requirePlatformAdmin(toWebRequest(req), getBindings(res));
      const prisma = getPlatformPrisma();
      const row = await prisma.tenant.findFirst({
        where: {
          OR: [{ id: p(req, "id") }, { slug: p(req, "id") }],
          NOT: { status: "DELETED" },
        },
      });
      if (!row) {
        exErr(res, "NOT_FOUND", "Tenant tidak ditemukan.", 404);
        return;
      }
      exOk(res, publicTenant(row));
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

platformExpressRouter.post(
  "/tenants",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const actor = await requirePlatformAdmin(toWebRequest(req), env);
      const body = createTenantSchema.parse(req.body);
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
        exErr(res, "CONFLICT", "Slug atau domain sudah dipakai.", 409);
        return;
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
      exOk(res, publicTenant(fresh), 201);
    } catch (err) {
      if (err instanceof z.ZodError) {
        exErr(res, "VALIDATION", err.issues[0]?.message ?? "Invalid body", 400);
        return;
      }
      exHandleError(res, err);
    }
  }),
);

platformExpressRouter.delete(
  "/tenants/:id",
  asyncHandler(async (req, res) => {
    try {
      await requirePlatformAdmin(toWebRequest(req), getBindings(res));
      const prisma = getPlatformPrisma();
      const row = await prisma.tenant.findFirst({
        where: {
          OR: [{ id: p(req, "id") }, { slug: p(req, "id") }],
          NOT: { status: "DELETED" },
        },
      });
      if (!row) {
        exErr(res, "NOT_FOUND", "Tenant tidak ditemukan.", 404);
        return;
      }

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
      exOk(res, publicTenant(fresh));
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

platformExpressRouter.post(
  "/tenants/:id/setup",
  asyncHandler(async (req, res) => {
    try {
      await requirePlatformAdmin(toWebRequest(req), getBindings(res));
      const prisma = getPlatformPrisma();
      const row = await prisma.tenant.findFirst({
        where: {
          OR: [{ id: p(req, "id") }, { slug: p(req, "id") }],
          NOT: { status: "DELETED" },
        },
      });
      if (!row) {
        exErr(res, "NOT_FOUND", "Tenant tidak ditemukan.", 404);
        return;
      }

      const result = await setupTenantDefaults(row.id);
      if (!result.ok) {
        exErr(res, "SETUP_FAILED", result.detail, 503);
        return;
      }
      const fresh = await prisma.tenant.findUniqueOrThrow({
        where: { id: row.id },
      });
      exOk(res, { tenant: publicTenant(fresh), setup: result });
    } catch (err) {
      if (err instanceof CmsAuthError) {
        exHandleError(res, err);
        return;
      }
      exHandleError(res, err);
    }
  }),
);
