import { Hono } from "hono";
import { cors } from "hono/cors";
import { beritaRoutes } from "./routes/berita";
import { artikelRoutes } from "./routes/artikel";
import {
  analyticsRoutes,
  hooksRoutes,
  kategoriRoutes,
  mediaRoutes,
  pengaturanRoutes,
  webhookRoutes,
} from "./routes/misc";
import type { AppEnv } from "./lib/http";

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  const allowed = new Set(
    [
      c.env.CMS_ORIGIN,
      c.env.WEB_ORIGIN,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:4321",
      "http://127.0.0.1:4321",
    ].filter(Boolean),
  );

  return cors({
    origin: (origin) => (origin && allowed.has(origin) ? origin : ""),
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })(c, next);
});

app.get("/api/health", (c) =>
  c.json({ ok: true, service: "teknovo-api", ts: new Date().toISOString() }),
);

app.route("/api/v1/berita", beritaRoutes);
app.route("/api/v1/artikel-siswa", artikelRoutes);
app.route("/api/v1/kategori", kategoriRoutes);
app.route("/api/v1/pengaturan", pengaturanRoutes);
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
