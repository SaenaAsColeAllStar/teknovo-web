import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppEnv } from "./lib/http";
import { handleApiError } from "./lib/http";
import { mountApiRoutes } from "./lib/mount-api-routes";
import {
  cmsReadLimit,
  cmsWriteLimit,
  hasBearerAuth,
  hookLimit,
  mediaLimit,
  publicReadLimit,
  writeLimit,
} from "./middleware/rate-limit";
import { requestIdMiddleware } from "./middleware/request-id";
import { securityHeadersMiddleware } from "./middleware/security-headers";
import { log } from "./lib/logger";

const app = new Hono<AppEnv>();

app.use("*", requestIdMiddleware);
app.use("*", securityHeadersMiddleware);

app.use("*", async (c, next) => {
  const isProd = (c.env.ENVIRONMENT ?? "production") === "production";
  const allowed = new Set(
    [
      c.env.CMS_ORIGIN,
      c.env.WEB_ORIGIN,
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

  return cors({
    origin: (origin) => (origin && allowed.has(origin) ? origin : ""),
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
    exposeHeaders: [
      "X-Request-Id",
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "Retry-After",
    ],
    maxAge: 86400,
  })(c, next);
});

// Rate limits (CF-Connecting-IP). Per-isolate sliding window — see DEPLOY.md.
app.use("/api/*", async (c, next) => {
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

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "teknovo-cms-api",
    runtime: "worker",
    ts: new Date().toISOString(),
    requestId: c.get("requestId"),
  }),
);

mountApiRoutes(app);

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
      error: { code: "NOT_FOUND", message: "Route tidak ditemukan." },
    },
    404,
  ),
);

export default app;
