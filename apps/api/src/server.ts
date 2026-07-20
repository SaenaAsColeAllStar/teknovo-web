/**
 * Node/VPS entry — Express-only HTTP server (production path).
 * Routes: native Express routers in `express-routes/*` (Prisma + MinIO).
 * Worker Free path remains Hono in `src/index.ts` + `routes/*` until cutover.
 */
import "dotenv/config";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "node:url";
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
import type { NodeBindings } from "./lib/http";
import { mountExpressApiRoutes } from "./lib/mount-express-routes";
import { log } from "./lib/logger";
import { isPlatformEnabled } from "./lib/platform/config";
import { disconnectPlatformPrisma } from "./lib/platform/client";
import {
  initPlatformEventBus,
  onPlatformEvent,
  shutdownPlatformEventBus,
} from "./lib/platform/events";
import {
  handleTenantCreated,
  handleTenantDeleted,
} from "./lib/platform/provision";
import {
  attachBindings,
  createHealthHandler,
  expressErrorHandler,
  expressNotFound,
  expressRateLimit,
  expressRequestId,
  expressSecurityHeaders,
  expressTenantRouter,
} from "./middleware/express";
import { setRawBody } from "./lib/express-http";

export function buildNodeBindings(): NodeBindings {
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

/** Express application (listen-ready). Used by PM2 / aaPanel / smoke. */
export function createExpressApp(bindings: NodeBindings) {
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
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: [
        "Authorization",
        "Content-Type",
        "X-Request-Id",
        "X-Tenant-Id",
        "X-Tenant-Slug",
        "svix-id",
        "svix-timestamp",
        "svix-signature",
      ],
      exposedHeaders: [
        "X-Request-Id",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "Retry-After",
      ],
      maxAge: 86400,
    }),
  );

  // F-04: JSON body limit 8MB; keep raw buffer for Svix webhook verify.
  expressApp.use(
    express.json({
      limit: "8mb",
      verify: (req, _res, buf) => {
        setRawBody(req as { rawBody?: Buffer }, Buffer.from(buf));
      },
    }),
  );
  expressApp.use(express.raw({ type: "application/octet-stream", limit: "8mb" }));

  expressApp.use(attachBindings(bindings));
  expressApp.use(expressRequestId);
  expressApp.use(expressSecurityHeaders);
  expressApp.use(expressTenantRouter);
  expressApp.use(expressRateLimit);

  expressApp.get("/api/health", createHealthHandler(bindings));

  mountExpressApiRoutes(expressApp);

  expressApp.use(expressNotFound);
  expressApp.use(expressErrorHandler);

  return expressApp;
}

async function main() {
  // 8788 on this VPS — 8787 reserved by teknovo-wa-bridge (aaPanel).
  const port = Number(process.env.PORT || 8788);
  const bindings = buildNodeBindings();
  await ensureBucket(bindings);

  if (isPlatformEnabled()) {
    const mode = await initPlatformEventBus();
    onPlatformEvent("tenant.created", (p) => handleTenantCreated(p));
    onPlatformEvent("tenant.deleted", (p) => handleTenantDeleted(p));
    log.info("platform.enabled", { eventBus: mode });
  }

  const expressApp = createExpressApp(bindings);

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
      await shutdownPlatformEventBus();
      await disconnectPlatformPrisma();
      await disconnectPrisma();
      await destroyS3Client();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

/** Start Node HTTP server (PM2 / aaPanel entry + direct `tsx src/server.ts`). */
export async function startNodeServer() {
  return main();
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  main().catch((err) => {
    console.error("[teknovo-api] failed to start:", err);
    process.exit(1);
  });
}
