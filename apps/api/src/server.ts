/**
 * Node/VPS entry — Express HTTP shell + Hono routing (PRP Fase 2).
 * Production Free path remains Worker (`src/index.ts` + wrangler) until cutover.
 */
import "dotenv/config";
import cors from "cors";
import express from "express";
import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import {
  destroyS3Client,
  getMinioConfig,
  getS3Client,
  loadMinioConfig,
} from "./lib/minio/client";
import { disconnectPrisma, getPrisma } from "./lib/prisma/client";
import type { NodeAppEnv, NodeBindings } from "./lib/http";
import { handleApiError } from "./lib/http";
import { log } from "./lib/logger";
import { requestIdMiddleware } from "./middleware/request-id";
import { securityHeadersMiddleware } from "./middleware/security-headers";
import {
  cmsReadLimit,
  cmsWriteLimit,
  hasBearerAuth,
  hookLimit,
  mediaLimit,
  publicReadLimit,
  writeLimit,
} from "./middleware/rate-limit";
import type { ErrorRequestHandler } from "express";

function buildNodeBindings(): NodeBindings {
  const config = loadMinioConfig();
  return {
    prisma: getPrisma(),
    s3: getS3Client(config),
    MINIO_BUCKET: config.bucket,
    MINIO_PUBLIC_URL: config.publicUrl,
    CMS_ORIGIN: process.env.CMS_ORIGIN || "http://localhost:5173",
    WEB_ORIGIN: process.env.WEB_ORIGIN || "http://localhost:4321",
    ENVIRONMENT: process.env.ENVIRONMENT || "development",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    GITHUB_REBUILD_TOKEN: process.env.GITHUB_REBUILD_TOKEN,
    GITHUB_REPO: process.env.GITHUB_REPO,
    REBUILD_WEB_SECRET: process.env.REBUILD_WEB_SECRET,
  };
}

async function ensureBucket(bindings: NodeBindings): Promise<void> {
  const config = getMinioConfig();
  try {
    await bindings.s3.send(new HeadBucketCommand({ Bucket: config.bucket }));
  } catch {
    await bindings.s3.send(new CreateBucketCommand({ Bucket: config.bucket }));
  }

  // Public read for media/* and brand/*; cms/uploads/* stays private (no public Get).
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

  try {
    await bindings.s3.send(
      new PutBucketPolicyCommand({
        Bucket: config.bucket,
        Policy: JSON.stringify(policy),
      }),
    );
  } catch (err) {
    console.warn("[minio] bucket policy skipped:", err);
  }
}

function createNodeHono() {
  const app = new Hono<NodeAppEnv>();

  app.use("*", requestIdMiddleware);
  app.use("*", securityHeadersMiddleware);

  // Prisma + MinIO are injected as Hono Bindings via fetch(req, bindings) below (task 2.6).
  app.use("*", async (c, next) => {
    if (c.req.method === "OPTIONS") return next();
    const path = new URL(c.req.url).pathname;

    if (path.startsWith("/api/v1/hooks") || path.startsWith("/api/webhook")) {
      return hookLimit(c, next);
    }
    if (path.startsWith("/api/cms/media")) {
      return mediaLimit(c, next);
    }
    const authed = hasBearerAuth(c);
    if (c.req.method === "GET" || c.req.method === "HEAD") {
      return (authed ? cmsReadLimit : publicReadLimit)(c, next);
    }
    return (authed ? cmsWriteLimit : writeLimit)(c, next);
  });

  app.get("/api/health", async (c) => {
    const checks: Record<string, "ok" | "error"> = {
      prisma: "error",
      minio: "error",
    };

    try {
      await c.env.prisma.$queryRaw`SELECT 1`;
      checks.prisma = "ok";
    } catch {
      checks.prisma = "error";
    }

    try {
      await c.env.s3.send(
        new HeadBucketCommand({ Bucket: c.env.MINIO_BUCKET }),
      );
      checks.minio = "ok";
    } catch {
      checks.minio = "error";
    }

    const healthy = checks.prisma === "ok" && checks.minio === "ok";
    return c.json(
      {
        ok: healthy,
        service: "teknovo-cms-api",
        runtime: "node",
        ts: new Date().toISOString(),
        requestId: c.get("requestId"),
        checks,
      },
      healthy ? 200 : 503,
    );
  });

  app.onError((err, c) => {
    log.error("unhandled", {
      requestId: c.get("requestId"),
      err: err instanceof Error ? err.message : String(err),
    });
    return handleApiError(c, err);
  });

  app.notFound((c) =>
    c.json(
      {
        ok: false,
        error: {
          code: "NOT_FOUND",
          message:
            "Route tidak ditemukan. Node runtime: Prisma repos ready (Fase 3); route cutover in Fase 4. Worker path still serves D1.",
        },
      },
      404,
    ),
  );

  return app;
}

/** Express-layer errors (body parser 413, malformed JSON, etc.). */
const expressErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
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
  res.status(status === 413 || type === "entity.too.large" ? 413 : status).json({
    ok: false,
    error: { code, message },
  });
};

async function main() {
  const port = Number(process.env.PORT || 8787);
  const bindings = buildNodeBindings();
  await ensureBucket(bindings);

  const honoApp = createNodeHono();
  const expressApp = express();

  // Cloudflare Tunnel / reverse proxy — needed for accurate X-Forwarded-For rate limits.
  expressApp.set("trust proxy", 1);

  const isProd = (bindings.ENVIRONMENT ?? "production") === "production";
  const allowed = new Set(
    [
      bindings.CMS_ORIGIN,
      bindings.WEB_ORIGIN,
      ...(isProd
        ? []
        : [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4321",
            "http://127.0.0.1:4321",
          ]),
    ].filter(Boolean),
  );

  expressApp.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || allowed.has(origin)) cb(null, origin || true);
        else cb(null, false);
      },
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
      exposedHeaders: [
        "X-Request-Id",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "Retry-After",
      ],
      maxAge: 86400,
    }),
  );

  // F-04: JSON body limit 8MB (uploads buffered through API).
  expressApp.use(express.json({ limit: "8mb" }));
  expressApp.use(express.raw({ type: "application/octet-stream", limit: "8mb" }));

  // Pass NodeBindings as Hono env (2nd arg to fetch) — Worker uses CF Bindings instead.
  const listener = getRequestListener((req) => honoApp.fetch(req, bindings));
  expressApp.use((req, res) => {
    void listener(req, res);
  });
  expressApp.use(expressErrorHandler);

  const server = expressApp.listen(port, () => {
    log.info("listening", {
      runtime: "node",
      port,
      cmsOrigin: bindings.CMS_ORIGIN,
      webOrigin: bindings.WEB_ORIGIN,
    });
  });

  const shutdown = async (signal: string) => {
    log.info("shutdown", { signal });
    server.close(async () => {
      await disconnectPrisma();
      await destroyS3Client();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("[teknovo-api] failed to start:", err);
  process.exit(1);
});
