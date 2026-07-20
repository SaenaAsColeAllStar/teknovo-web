/** Prisma repository layer (Node/VPS) — mirrors `lib/d1/*` for dual-runtime. */

export { getPrisma, disconnectPrisma } from "./client";

export {
  prismaListKategori,
  prismaGetKategori,
  prismaCreateKategori,
  prismaUpdateKategori,
  prismaDeleteKategori,
} from "./kategori-repo";

export {
  prismaListBerita,
  prismaGetBeritaById,
  prismaGetBeritaBySlug,
  prismaCreateBerita,
  prismaUpdateBerita,
  prismaDeleteBerita,
  prismaPublishBerita,
  prismaArchiveOutdated,
} from "./berita-repo";
export type { BeritaWriteInput } from "./berita-repo";

export {
  prismaListArtikel,
  prismaGetArtikelById,
  prismaGetArtikelBySlug,
  prismaCreateArtikel,
  prismaUpdateArtikel,
  prismaDeleteArtikel,
  prismaApproveArtikel,
  prismaRejectArtikel,
} from "./artikel-repo";
export type { ArtikelWriteInput } from "./artikel-repo";

export {
  prismaListFasilitas,
  prismaGetFasilitasById,
  prismaGetFasilitasBySlug,
  prismaCreateFasilitas,
  prismaUpdateFasilitas,
  prismaDeleteFasilitas,
} from "./fasilitas-repo";
export type { FasilitasWriteInput } from "./fasilitas-repo";

export {
  prismaListEkstrakurikuler,
  prismaGetEkstrakurikulerById,
  prismaGetEkstrakurikulerBySlug,
  prismaListEkstrakurikulerFull,
  prismaCreateEkstrakurikuler,
  prismaUpdateEkstrakurikuler,
  prismaDeleteEkstrakurikuler,
} from "./ekstrakurikuler-repo";
export type { EkstrakurikulerWriteInput } from "./ekstrakurikuler-repo";

export {
  prismaListPrestasi,
  prismaGetPrestasiById,
  prismaCreatePrestasi,
  prismaUpdatePrestasi,
  prismaDeletePrestasi,
} from "./prestasi-repo";
export type { PrestasiWriteInput } from "./prestasi-repo";

export {
  SITE_MEDIA_CATALOG,
  catalogDefaultUrl,
  siteMediaCatalogWithMinioUrls,
  prismaListSiteMedia,
  prismaGetSiteMedia,
  prismaUpsertSiteMedia,
  prismaDeleteSiteMedia,
} from "./site-media-repo";
export type { SiteMediaCatalogEntry } from "./site-media-repo";

export {
  prismaGetPengaturan,
  prismaUpsertPengaturan,
} from "./pengaturan-repo";

export { prismaAnalyticsOverview } from "./analytics-repo";

export { prismaUsersRepoReady } from "./users-repo";
export type { CmsUserSyncStub } from "./users-repo";
