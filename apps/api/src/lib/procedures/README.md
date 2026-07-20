/**
 * Postgres procedures vs Prisma ORM (Node / VPS path only).
 *
 * Worker + D1 does **not** use stored procedures (SQLite has none).
 *
 * | Operation | Mechanism | Notes |
 * |---|---|---|
 * | site_media upsert | `sp_upsert_site_media` | via `prismaUpsertSiteMedia` |
 * | berita publish (DRAFT→PUBLISHED) | `sp_publish_berita` | create/update + `prismaPublishBerita` |
 * | analytics overview | `fn_get_analytics_overview` | via `prismaAnalyticsOverview` |
 * | berita search | `fn_search_berita` | wrapper ready; no public route yet (P1) |
 * | archive outdated | `sp_archive_outdated` | wrapper ready; no cron yet (P1) |
 * | All other CRUD | Prisma ORM | list/get/create/update/delete repos |
 *
 * Deploy: `pnpm --filter @teknovo/api prisma:procedures`
 * Smoke: `pnpm --filter @teknovo/api prisma:procedures:smoke`
 */
export {};
