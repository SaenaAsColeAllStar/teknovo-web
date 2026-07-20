import type { Hono } from "hono";
import { beritaRoutes } from "../routes/berita";
import { artikelRoutes } from "../routes/artikel";
import { fasilitasRoutes } from "../routes/fasilitas";
import { ekstrakurikulerRoutes } from "../routes/ekstrakurikuler";
import { prestasiRoutes } from "../routes/prestasi";
import { siteMediaRoutes } from "../routes/site-media";
import {
  analyticsRoutes,
  hooksRoutes,
  kategoriRoutes,
  mediaRoutes,
  pengaturanRoutes,
  webhookRoutes,
} from "../routes/misc";
import { usersRoutes } from "../routes/users";
import type { AppEnv } from "./http";

/** Mount the same `/api/v1/*` + CMS media + webhook routes on Worker and Node. */
export function mountApiRoutes(app: Hono<AppEnv>) {
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
}
