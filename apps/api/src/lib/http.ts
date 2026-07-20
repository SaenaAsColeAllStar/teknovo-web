import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { PrismaClient } from "@prisma/client";
import type { S3Client } from "@aws-sdk/client-s3";
import { CmsAuthError } from "../auth/cms-auth";
import type { TenantContext, TenantResolveSource } from "./platform/types";

/**
 * Node/VPS bindings (PRP Express path — Prisma + MinIO).
 */
export type NodeBindings = {
  prisma: PrismaClient;
  s3: S3Client;
  MINIO_BUCKET: string;
  MINIO_PUBLIC_URL: string;
  CMS_ORIGIN: string;
  WEB_ORIGIN: string;
  ENVIRONMENT?: string;
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SECRET?: string;
  GITHUB_REBUILD_TOKEN?: string;
  GITHUB_REPO?: string;
  REBUILD_WEB_SECRET?: string;
};

/** Worker D1+R2 or Node Prisma+MinIO. */
export type RuntimeBindings = Env | NodeBindings;

/**
 * Shared Hono env — Worker (D1+R2) or Node (Prisma+MinIO).
 * Routes use `lib/data/*` + `hasPrisma` / `hasMinio` rather than touching DB/R2 directly.
 */
export type AppEnv = {
  Bindings: RuntimeBindings;
  Variables: {
    requestId: string;
    /** Set by tenant-router when PLATFORM_ENABLED and a hint resolves. */
    tenant?: TenantContext;
    tenantSource?: TenantResolveSource;
  };
};

/** Alias — Node and Worker share the same route typing after Fase 4. */
export type NodeAppEnv = AppEnv;

/** Minimal Clerk secret surface for auth helpers. */
export type ClerkEnv = {
  CLERK_SECRET_KEY: string;
};

/** GitHub rebuild dispatch env. */
export type RebuildEnv = {
  GITHUB_REBUILD_TOKEN?: string;
  GITHUB_REPO?: string;
  ENVIRONMENT?: string;
};

/** Shared helpers — accept Worker or Node Hono context. */
// Hono Context is invariant on Env; keep helpers loosely typed across runtimes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiContext = Context<any>;

export function okJson<T>(c: ApiContext, data: T, status: ContentfulStatusCode = 200) {
  return c.json({ ok: true as const, data }, status);
}

export function okListJson<T>(
  c: ApiContext,
  data: T[],
  meta: { page: number; limit: number; total: number },
) {
  return c.json({ ok: true as const, data, meta });
}

export function errJson(
  c: ApiContext,
  code: string,
  message: string,
  status: ContentfulStatusCode,
) {
  return c.json({ ok: false as const, error: { code, message } }, status);
}

export function handleApiError(c: ApiContext, err: unknown) {
  if (err instanceof CmsAuthError) {
    return errJson(c, "FORBIDDEN", err.message, err.status);
  }
  const message = err instanceof Error ? err.message : String(err);
  const isUnavailable =
    message.includes("D1") ||
    message.includes("DB") ||
    message.includes("CMS_BUCKET") ||
    message.includes("Prisma") ||
    message.includes("MinIO") ||
    message.includes("S3");
  return errJson(
    c,
    isUnavailable ? "UNAVAILABLE" : "INTERNAL",
    message || "Terjadi kesalahan server.",
    isUnavailable ? 503 : 500,
  );
}
