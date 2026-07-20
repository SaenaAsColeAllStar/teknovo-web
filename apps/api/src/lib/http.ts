import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { PrismaClient } from "@prisma/client";
import type { S3Client } from "@aws-sdk/client-s3";
import { CmsAuthError } from "../auth/cms-auth";

/** Cloudflare Worker bindings (production Free path — D1 + R2). */
export type AppEnv = {
  Bindings: Env;
  Variables: {
    requestId: string;
  };
};

/**
 * Node/VPS bindings (PRP Express path — Prisma + MinIO).
 * Kept separate so Worker `AppEnv` / routes stay typed against D1 until Fase 3–4.
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

export type NodeAppEnv = {
  Bindings: NodeBindings;
  Variables: {
    requestId: string;
  };
};

export function okJson<T>(c: Context<AppEnv>, data: T, status: ContentfulStatusCode = 200) {
  return c.json({ ok: true as const, data }, status);
}

export function okListJson<T>(
  c: Context<AppEnv>,
  data: T[],
  meta: { page: number; limit: number; total: number },
) {
  return c.json({ ok: true as const, data, meta });
}

export function errJson(
  c: Context<AppEnv>,
  code: string,
  message: string,
  status: ContentfulStatusCode,
) {
  return c.json({ ok: false as const, error: { code, message } }, status);
}

export function handleApiError(c: Context<AppEnv>, err: unknown) {
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
