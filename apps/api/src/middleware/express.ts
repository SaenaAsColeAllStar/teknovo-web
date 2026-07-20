/**
 * Express middleware for the Node/VPS entry (Express-only production path).
 * Hono middleware twins remain in sibling files for the Worker (`index.ts`).
 */
import type { ErrorRequestHandler, RequestHandler } from "express";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import type { NodeBindings } from "../lib/http";
import { log } from "../lib/logger";
import { isPlatformEnabled } from "../lib/platform/config";
import { getEventBusMode } from "../lib/platform/events";
import {
  extractTenantHint,
  lookupTenant,
  toTenantContext,
} from "../lib/tenant-router";

const REQUEST_ID_HEADER = "X-Request-Id";

export type ExpressLocals = {
  requestId: string;
  tenant?: ReturnType<typeof toTenantContext>;
  tenantSource?: string;
  bindings?: NodeBindings;
};

declare global {
  namespace Express {
    interface Locals extends ExpressLocals {}
  }
}

export const expressRequestId: RequestHandler = (req, res, next) => {
  const incoming = req.get(REQUEST_ID_HEADER)?.trim();
  const id =
    incoming && incoming.length <= 128 ? incoming : crypto.randomUUID();
  res.locals.requestId = id;
  res.setHeader(REQUEST_ID_HEADER, id);
  next();
};

export const expressSecurityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  );
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  const env =
    process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? "production";
  if (env === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  next();
};

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5_000;

function clientIp(req: { ip?: string; headers: Record<string, unknown> }): string {
  const cf = String(req.headers["cf-connecting-ip"] ?? "").trim();
  if (cf) return cf;
  const xffRaw = req.headers["x-forwarded-for"];
  const xff = String(Array.isArray(xffRaw) ? xffRaw[0] : xffRaw ?? "")
    .split(",")[0]
    ?.trim();
  if (xff) return xff;
  return req.ip || "unknown";
}

function hasBearerAuth(req: { get: (n: string) => string | undefined }): boolean {
  const auth = req.get("Authorization")?.trim() ?? "";
  return /^Bearer\s+\S+/i.test(auth);
}

function pruneIfNeeded(): void {
  if (buckets.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size <= MAX_KEYS) return;
  const keys = [...buckets.keys()].slice(0, Math.floor(buckets.size / 2));
  for (const key of keys) buckets.delete(key);
}

function checkLimit(
  prefix: string,
  limit: number,
  windowMs: number,
  req: Parameters<RequestHandler>[0],
  res: Parameters<RequestHandler>[1],
): boolean {
  const now = Date.now();
  const ip = clientIp(req);
  const key = `${prefix}:${ip}`;
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
    pruneIfNeeded();
  }
  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));
  if (bucket.count > limit) {
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: `Terlalu banyak permintaan. Coba lagi dalam ${retryAfterSec} detik.`,
      },
    });
    return false;
  }
  return true;
}

/** Same buckets/limits as Worker Hono rate-limit middleware. */
export const expressRateLimit: RequestHandler = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
    return;
  }
  const path = req.path;
  let ok = true;
  if (path.startsWith("/api/v1/hooks") || path.startsWith("/api/webhook")) {
    ok = checkLimit("hook", 5, 60_000, req, res);
  } else if (path.startsWith("/api/cms/media")) {
    ok = checkLimit("media", 20, 60_000, req, res);
  } else {
    const authed = hasBearerAuth(req);
    if (req.method === "GET" || req.method === "HEAD") {
      ok = checkLimit(authed ? "cms-get" : "get", authed ? 600 : 120, 60_000, req, res);
    } else {
      ok = checkLimit(
        authed ? "cms-write" : "write",
        authed ? 120 : 40,
        60_000,
        req,
        res,
      );
    }
  }
  if (ok) next();
};

export const expressTenantRouter: RequestHandler = async (req, res, next) => {
  if (!isPlatformEnabled()) {
    next();
    return;
  }
  try {
    const url = new URL(
      `${req.protocol}://${req.get("host") || "127.0.0.1"}${req.originalUrl}`,
    );
    const headerMap = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const item of value) headerMap.append(key, item);
      } else {
        headerMap.set(key, value);
      }
    }
    const { hint, source } = extractTenantHint({
      headers: headerMap,
      url,
    });
    res.locals.tenantSource = source;
    if (hint && source !== "none") {
      const tenant = await lookupTenant(hint, source);
      if (tenant) {
        res.locals.tenant = toTenantContext(tenant);
      }
    }
  } catch {
    // Platform DB down — do not break school API.
  }
  next();
};

/** Inject NodeBindings + tenant vars into Hono via AsyncLocalStorage-free locals on req. */
export function attachBindings(bindings: NodeBindings): RequestHandler {
  return (_req, res, next) => {
    res.locals.bindings = bindings;
    next();
  };
}

export function createHealthHandler(bindings: NodeBindings): RequestHandler {
  return async (_req, res) => {
    const checks: Record<string, "ok" | "error" | "off"> = {
      prisma: "error",
      minio: "error",
      platform: "off",
      redis: "off",
    };

    try {
      await bindings.prisma.$queryRaw`SELECT 1`;
      checks.prisma = "ok";
    } catch {
      checks.prisma = "error";
    }

    try {
      await bindings.s3.send(
        new HeadBucketCommand({ Bucket: bindings.MINIO_BUCKET }),
      );
      checks.minio = "ok";
    } catch {
      checks.minio = "error";
    }

    if (isPlatformEnabled()) {
      try {
        const { getPlatformPrisma } = await import("../lib/platform/client");
        await getPlatformPrisma().$queryRaw`SELECT 1`;
        checks.platform = "ok";
      } catch {
        checks.platform = "error";
      }
      const bus = getEventBusMode();
      checks.redis = bus === "redis" ? "ok" : bus === "memory" ? "ok" : "error";
    }

    const healthy = checks.prisma === "ok" && checks.minio === "ok";
    res.status(healthy ? 200 : 503).json({
      ok: healthy,
      service: "teknovo-cms-api",
      runtime: "node",
      platformEnabled: isPlatformEnabled(),
      ts: new Date().toISOString(),
      requestId: res.locals.requestId,
      tenant: res.locals.tenant ?? null,
      checks,
    });
  };
}

export const expressNotFound: RequestHandler = (_req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: "NOT_FOUND",
      message: "Route tidak ditemukan.",
    },
  });
};

/** Express-layer errors (body parser 413, malformed JSON, etc.). */
export const expressErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  const status =
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : typeof err === "object" &&
          err !== null &&
          "statusCode" in err &&
          typeof (err as { statusCode: unknown }).statusCode === "number"
        ? (err as { statusCode: number }).statusCode
        : 500;
  const type =
    typeof err === "object" && err !== null && "type" in err
      ? String((err as { type: unknown }).type)
      : "";
  const code =
    status === 413 || type === "entity.too.large"
      ? "PAYLOAD_TOO_LARGE"
      : status === 400
        ? "BAD_REQUEST"
        : "INTERNAL";
  const message =
    err instanceof Error ? err.message : "Terjadi kesalahan server.";
  log.error("express", { code, status, err: message });
  res
    .status(status === 413 || type === "entity.too.large" ? 413 : status)
    .json({
      ok: false,
      error: { code, message },
    });
};
