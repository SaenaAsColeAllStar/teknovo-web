import { Hono } from "hono";
import { cors } from "hono/cors";
import { beritaRoutes } from "./routes/berita";
import { artikelRoutes } from "./routes/artikel";
import { fasilitasRoutes } from "./routes/fasilitas";
import { ekstrakurikulerRoutes } from "./routes/ekstrakurikuler";
import { prestasiRoutes } from "./routes/prestasi";
import { siteMediaRoutes } from "./routes/site-media";
import {
  analyticsRoutes,
  hooksRoutes,
  kategoriRoutes,
  mediaRoutes,
  pengaturanRoutes,
  webhookRoutes,
} from "./routes/misc";
import { usersRoutes } from "./routes/users";
import type { AppEnv } from "./lib/http";
import {
  hookLimit,
  mediaLimit,
  publicReadLimit,
  writeLimit,
} from "./middleware/rate-limit";
import { requestIdMiddleware } from "./middleware/request-id";
import { securityHeadersMiddleware } from "./middleware/security-headers";

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
    exposeHeaders: ["X-Request-Id", "X-RateLimit-Limit", "X-RateLimit-Remaining", "Retry-After"],
    maxAge: 86400,
  })(c, next);
});

// Rate limits (CF-Connecting-IP). Per-isolate sliding window — see DEPLOY.md.
// OPTIONS skipped by method checks below.
app.use("/api/*", async (c, next) => {
  if (c.req.method === "OPTIONS") return next();
  const path = new URL(c.req.url).pathname;

  if (path.startsWith("/api/v1/hooks") || path.startsWith("/api/webhook")) {
    return hookLimit(c, next);
  }
  if (path.startsWith("/api/cms/media")) {
    return mediaLimit(c, next);
  }
  if (c.req.method === "GET" || c.req.method === "HEAD") {
    return publicReadLimit(c, next);
  }
  return writeLimit(c, next);
});

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "teknovo-cms-api",
    ts: new Date().toISOString(),
    requestId: c.get("requestId"),
  }),
);

app.route("/api/v1/berita", beritaRoutes);
app.route("/api/v1/artikel-siswa", artikelRoutes);
app.route("/api/v1/fasilitas", fasilitasRoutes);
app.route("/api/v1/ekstrakurikuler", ekstrakurikulerRoutes);
app.route("/api/v1/prestasi", prestasiRoutes);
app.route("/api/v1/site-media", siteMediaRoutes);
app.route("/api/v1/kategori", kategoriRoutes);
app.route("/api/v1/pengaturan", pengaturanRoutes);
app.route("/api/v1/users", usersRoutes);
app.route("/api/v1/analytics", analyticsRoutes);
app.route("/api/v1/hooks", hooksRoutes);
app.route("/api/cms/media", mediaRoutes);
app.route("/api/webhook", webhookRoutes);

app.notFound((c) =>
  c.json(
    { ok: false, error: { code: "NOT_FOUND", message: "Route tidak ditemukan." } },
    404,
  ),
);

export default app;
