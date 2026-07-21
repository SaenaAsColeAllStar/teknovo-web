import type { Express } from "express";
import { beritaExpressRouter } from "../express-routes/berita";
import { artikelExpressRouter } from "../express-routes/artikel";
import { fasilitasExpressRouter } from "../express-routes/fasilitas";
import { ekstrakurikulerExpressRouter } from "../express-routes/ekstrakurikuler";
import { prestasiExpressRouter } from "../express-routes/prestasi";
import { kurikulumExpressRouter } from "../express-routes/kurikulum";
import { programSekolahExpressRouter } from "../express-routes/program-sekolah";
import { programJurusanExpressRouter } from "../express-routes/program-jurusan";
import { tenagaPengajarExpressRouter } from "../express-routes/tenaga-pengajar";
import { kontakExpressRouter } from "../express-routes/kontak";
import { pengumumanExpressRouter } from "../express-routes/pengumuman";
import { siteMediaExpressRouter } from "../express-routes/site-media";
import {
  analyticsExpressRouter,
  hooksExpressRouter,
  kategoriExpressRouter,
  mediaExpressRouter,
  pengaturanExpressRouter,
  webhookExpressRouter,
} from "../express-routes/misc";
import { usersExpressRouter } from "../express-routes/users";
import { platformExpressRouter } from "../express-routes/platform";
import {
  createSiteContentEntityApprovalRouter,
  siteContentApprovalExpressRouter,
} from "../express-routes/site-content-approval";
import { SITE_CONTENT_ENTITY_PATHS } from "../lib/prisma/site-content-approval";

/** Mount native Express API routers (Node production path — no Hono bridge). */
export function mountExpressApiRoutes(app: Express) {
  app.use("/api/platform", platformExpressRouter);
  app.use("/api/v1/berita", beritaExpressRouter);
  app.use("/api/v1/artikel-siswa", artikelExpressRouter);
  app.use("/api/v1/site-content", siteContentApprovalExpressRouter);
  for (const entity of SITE_CONTENT_ENTITY_PATHS) {
    app.use(`/api/v1/${entity}`, createSiteContentEntityApprovalRouter(entity));
  }
  app.use("/api/v1/fasilitas", fasilitasExpressRouter);
  app.use("/api/v1/ekstrakurikuler", ekstrakurikulerExpressRouter);
  app.use("/api/v1/prestasi", prestasiExpressRouter);
  app.use("/api/v1/kurikulum", kurikulumExpressRouter);
  app.use("/api/v1/program-sekolah", programSekolahExpressRouter);
  app.use("/api/v1/program-jurusan", programJurusanExpressRouter);
  app.use("/api/v1/tenaga-pengajar", tenagaPengajarExpressRouter);
  app.use("/api/v1/kontak", kontakExpressRouter);
  app.use("/api/v1/pengumuman", pengumumanExpressRouter);
  app.use("/api/v1/site-media", siteMediaExpressRouter);
  app.use("/api/v1/kategori", kategoriExpressRouter);
  app.use("/api/v1/pengaturan", pengaturanExpressRouter);
  app.use("/api/v1/users", usersExpressRouter);
  app.use("/api/v1/analytics", analyticsExpressRouter);
  app.use("/api/v1/hooks", hooksExpressRouter);
  app.use("/api/cms/media", mediaExpressRouter);
  app.use("/api/webhook", webhookExpressRouter);
}
