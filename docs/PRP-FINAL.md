# PRD: Teknovo Platform — API Migration & Infrastructure

**Project:** `teknovo-web`  
**Author:** Saepul Husna  
**Tanggal:** 20 Juli 2026  
**Status:** Draft — Siap Eksekusi

---

## 1. Ringkasan Eksekutif

Migrasi backend dari Cloudflare Workers (D1 + R2) ke **Express + Hono di VPS (aaPanel)** dengan **PostgreSQL (Prisma ORM)** dan **MinIO (S3-compatible storage)**. Frontend tetap di Cloudflare Free (Astro SSG + Vite SPA). Arsitektur dirancang sebagai fondasi **SaaS multi-tenant** untuk ekosistem Teknovo.

---

## 2. Tujuan

1. **Portabilitas** — Lepas dari Cloudflare vendor lock-in untuk layer API
2. **Isolasi** — Setiap project punya database & bucket sendiri
3. **Enterprise-ready** — Stored procedures, full-text search, indexing PostgreSQL
4. **Solo-developer friendly** — 1 codebase, 1 deployment, semua tenant
5. **Zero Trust security** — VPS tidak ekspos port publik

---

## 3. Arsitektur Final

```
Cloudflare (Free)
├── smkteknovo.sch.id     → Astro SSG (apps/web)
├── cms.smkteknovo.sch.id → Vite SPA (apps/cms)
└── api.smkteknovo.sch.id → Cloudflare Tunnel
                              │
VPS (aaPanel)                │
├── cloudflared (tunnel) ◄──┘
├── PM2 Cluster (Express + Hono)
│   └── apps/api/src/index.ts
├── PostgreSQL 16
│   ├── Platform DB (tenants, users)
│   └── Tenant DBs (1 per project)
└── MinIO
    └── 1 bucket per project (teknovo-web, ...)
```

---

## 4. Persyaratan Fungsional

### 4.1 API Layer (Express + Hono)

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-01 | Express sebagai HTTP server, Hono sebagai routing layer via `hono/express` adapter | P0 |
| F-02 | Semua route handler yang sudah ada (`routes/*.ts`) tidak berubah | P0 |
| F-03 | CORS origin dari CMS dan Web domain | P0 |
| F-04 | JSON body parser limit 8MB (support upload) | P0 |
| F-05 | Graceful shutdown — disconnect Prisma & MinIO pada SIGTERM/SIGINT | P0 |
| F-06 | Request ID logging middleware | P1 |
| F-07 | Security headers middleware (CSP, HSTS, dll) | P1 |
| F-08 | Rate limiting (sama seperti saat ini di Worker) | P1 |

### 4.2 Database (PostgreSQL + Prisma)

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-09 | Schema Prisma mencakup semua tabel: `kategori`, `berita`, `artikel_siswa`, `fasilitas`, `ekstrakurikuler`, `prestasi`, `site_media`, `pengaturan` | P0 |
| F-10 | Enum: `BeritaStatus` (DRAFT, PUBLISHED, ARCHIVED), `ArtikelStatus` (DRAFT, REVIEW, PUBLISHED, ARCHIVED), `EkskulKategori` (TEKNOLOGI, OLAHRAGA, AKADEMIK, SENI) | P0 |
| F-11 | Composite indexes: `(status, sort_at)` untuk list queries | P0 |
| F-12 | UUID primary key default | P0 |
| F-13 | Migrations via `prisma migrate deploy` | P0 |
| F-14 | Seed script untuk data awal (kategori default, pengaturan default) | P1 |

### 4.3 Stored Procedures (PostgreSQL)

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-15 | `sp_upsert_site_media(p_media_key, p_label, p_category, p_url, p_updated_by)` — atomic upsert | P0 |
| F-16 | `sp_publish_berita(p_id)` — validasi status DRAFT, set published_at & sort_at | P0 |
| F-17 | `fn_get_analytics_overview()` — aggregasi semua konten untuk dashboard | P0 |
| F-18 | `fn_search_berita(p_query)` — ILIKE + pg_trgm full-text search | P1 |
| F-19 | `sp_archive_outdated(days_threshold)` — auto-archive berita/artikel > 1 tahun | P1 |
| F-20 | Deploy script: `tsx scripts/deploy-stored-procedures.ts` | P0 |

### 4.4 Storage (MinIO)

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-21 | S3-compatible client via `@aws-sdk/client-s3` | P0 |
| F-22 | 1 bucket per project. Project ini: `teknovo-web` | P0 |
| F-23 | Struktur folder dalam bucket: `cms/uploads/{YYYY}/{MM}/{uuid}-{file}` untuk CMS uploads, `media/landing/` untuk static assets, `brand/` untuk logo & branding | P0 |
| F-24 | Fungsi: `putObject`, `getObject`, `deleteObject`, `listObjects`, `objectUrl` | P0 |
| F-25 | Presigned URL untuk upload dari CMS langsung ke MinIO (optional bypass server) | P2 |
| F-26 | Policy: bucket publik untuk prefix `media/*` dan `brand/*`, privat untuk `cms/uploads/*` | P0 |

### 4.5 Auth (Clerk — Tetap)

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-27 | Clerk backend SDK tetap digunakan — tidak berubah | P0 |
| F-28 | Session verification via `@clerk/backend` — sesuaikan import untuk Node.js (bukan Worker) | P0 |
| F-29 | Role-based access: admin, editor, siswa, viewer — sama seperti sekarang | P0 |

### 4.6 Zero Trust & Deployment

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-30 | Cloudflare Tunnel (cloudflared) untuk akses ke VPS tanpa port terbuka | P0 |
| F-31 | Domain API: `api.smkteknovo.sch.id` → Tunnel → `localhost:8787` | P0 |
| F-32 | PM2 cluster mode dengan `-i max` (semua CPU cores) | P0 |
| F-33 | `ecosystem.config.cjs` — konfigurasi PM2 lengthkap (log rotation, max memory restart) | P0 |
| F-34 | Graceful reload support | P1 |
| F-35 | aaPanel PM2 Manager integration | P1 |

### 4.7 SaaS Platform (Multi-Tenant Foundation)

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-36 | **Platform DB** — tabel: `tenants`, `users`, `tenant_memberships` | P0 (schema only) |
| F-37 | Platform DB menyimpan konfigurasi tiap tenant: `db_url`, `minio_endpoint`, `minio_bucket`, `minio_access_key` (terenkripsi) | P1 |
| F-38 | Tenant Router middleware — extract tenant dari subdomain/domain, lookup Platform DB, inject koneksi ke context | P1 |
| F-39 | Event bus pattern via Redis Pub/Sub untuk event: `tenant.created`, `tenant.deleted` | P2 |
| F-40 | Admin console untuk super admin melihat semua tenant | P2 |

---

## 5. Persyaratan Non-Fungsional

| ID | Persyaratan | Target |
|---|---|---|
| NF-01 | Response time API (p95) | < 200ms |
| NF-02 | Zero-downtime deploy | Reload < 1s |
| NF-03 | Uptime | 99.9% |
| NF-04 | Isolasi tenant | Data antar tenant 100% tidak bisa bocor |
| NF-05 | Memory per instance PM2 | Max 512MB per instance |
| NF-06 | Concurrency support | Support hingga 50 tenant dalam 1 VPS 4GB |

---

## 6. Struktur Folder Final

```
teknovo-web/
├── apps/
│   ├── api/                          ← Express + Hono (Node.js)
│   │   ├── prisma/
│   │   │   ├── schema.prisma         ← Schema semua model
│   │   │   ├── migrations/           ← Auto-generated
│   │   │   └── seed.ts               ← Seed data default
│   │   ├── src/
│   │   │   ├── auth/                 ← Clerk auth (sama seperti sekarang)
│   │   │   ├── lib/
│   │   │   │   ├── prisma/
│   │   │   │   │   └── client.ts     ← Prisma singleton
│   │   │   │   ├── minio/
│   │   │   │   │   ├── client.ts     ← S3 client singleton
│   │   │   │   │   ├── upload.ts     ← buildUploadKey, putObject, deleteObject
│   │   │   │   │   └── url.ts        ← objectUrl, presignedUrl
│   │   │   │   ├── procedures/
│   │   │   │   │   ├── berita.ts     ← publishBerita, archiveBerita
│   │   │   │   │   ├── analytics.ts  ← getAnalyticsOverview
│   │   │   │   │   └── search.ts     ← searchBerita
│   │   │   │   ├── http.ts           ← AppEnv type, helpers (sama)
│   │   │   │   ├── logger.ts         ← (sama)
│   │   │   │   ├── ids.ts            ← (sama)
│   │   │   │   └── secrets.ts        ← (sama)
│   │   │   ├── middleware/
│   │   │   │   ├── rate-limit.ts     ← Adaptasi untuk Express
│   │   │   │   ├── request-id.ts     ← Adaptasi untuk Express
│   │   │   │   └── security-headers.ts ← Adaptasi untuk Express
│   │   │   ├── routes/               ← TIDAK BERUBAH (file .ts sama)
│   │   │   ├── stored-procedures/    ← SQL files
│   │   │   │   ├── 001_upsert_site_media.sql
│   │   │   │   ├── 002_publish_berita.sql
│   │   │   │   ├── 003_analytics.sql
│   │   │   │   ├── 004_search.sql
│   │   │   │   └── 005_archive_outdated.sql
│   │   │   ├── scripts/
│   │   │   │   └── deploy-stored-procedures.ts
│   │   │   └── index.ts             ← Entry point Express + Hono adapter
│   │   ├── ecosystem.config.cjs      ← PM2 config
│   │   ├── Dockerfile                ← (opsional)
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── cms/                          ← TIDAK BERUBAH (Vite SPA di CF)
│   └── web/                          ← TIDAK BERUBAH (Astro SSG di CF)
├── docker-compose.yml                ← PostgreSQL + MinIO untuk local dev
├── scripts/                          ← (opsional root); migrate/seed hidup di apps/api/scripts/
│   └── …                             ← lihat apps/api/scripts/migrate-d1-to-pg.ts, seed-minio.ts
├── pnpm-workspace.yaml
└── package.json
```

---

## 7. Environment Variables

### `apps/api/.env`

```env
# ── Server ──
PORT=8787
NODE_ENV=production
ENVIRONMENT=production

# ── PostgreSQL ──
DATABASE_URL=postgresql://teknovo:password@localhost:5432/teknovo?schema=public

# ── MinIO ──
MINIO_ENDPOINT=localhost:9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=teknovo-web
MINIO_PUBLIC_URL=https://storage.smkteknovo.sch.id
MINIO_REGION=auto

# ── Clerk Auth ──
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# ── CORS ──
CMS_ORIGIN=https://cms.smkteknovo.sch.id
WEB_ORIGIN=https://smkteknovo.sch.id

# ── Webhook Rebuild ──
REBUILD_WEB_SECRET=your-secret-min-16-char
GITHUB_REBUILD_TOKEN=ghp_xxxxx
GITHUB_REPO=SaenaAsColeAllStar/teknovo-web
```

---

## 8. Dependencies

### Production

```json
{
  "@aws-sdk/client-s3": "^3.700.0",
  "@aws-sdk/s3-request-presigner": "^3.700.0",
  "@clerk/backend": "^2.29.0",
  "@hono/node-server": "^1.13.0",
  "@prisma/client": "^6.0.0",
  "@teknovo/shared": "workspace:*",
  "cors": "^2.8.5",
  "dotenv": "^16.4.0",
  "express": "^5.0.0",
  "hono": "^4.9.0",
  "isomorphic-dompurify": "^2.26.0",
  "zod": "^4.4.3"
}
```

### Dev Dependencies

```json
{
  "@types/cors": "^2.8.17",
  "@types/express": "^5.0.0",
  "@types/node": "^22.0.0",
  "prisma": "^6.0.0",
  "tsx": "^4.19.0",
  "typescript": "^5.7.0",
  "vitest": "^3.2.4"
}
```

---

## 9. Konfigurasi PM2

### `apps/api/ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [{
    name: "teknovo-api",
    script: "dist/index.js",
    instances: "max",
    exec_mode: "cluster",
    max_memory_restart: "512M",
    env: {
      NODE_ENV: "production",
      PORT: 8787,
    },
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/www/wwwlogs/teknovo-api/err.log",
    out_file: "/www/wwwlogs/teknovo-api/out.log",
    combine_logs: true,
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 4000,
    min_uptime: "10s",
    listen_timeout: 5000,
    kill_timeout: 5000,
    shutdown_with_message: true,
  }]
};
```

---

## 10. Docker Compose untuk Local Dev

### `docker-compose.yml` (root repo)

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: teknovo
      POSTGRES_USER: teknovo
      POSTGRES_PASSWORD: ${PG_PASSWORD:-teknovo}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U teknovo"]
      interval: 5s

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
    volumes:
      - miniodata:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 5s

volumes:
  pgdata:
  miniodata:
```

---

## 11. Roadmap Eksekusi

### Fase 1: Foundation (Hari 1-2) — P0

| Task | Detail | Output |
|---|---|---|
| 1.1 | Install dependencies Express, Prisma, MinIO SDK | `package.json` updated |
| 1.2 | Setup `prisma/schema.prisma` dengan semua model + enum + indexes | File schema.prisma |
| 1.3 | Generate Prisma migration dan apply ke PostgreSQL | Migration file + DB ready |
| 1.4 | Buat `src/lib/prisma/client.ts` singleton | Prisma client module |
| 1.5 | Buat `src/lib/minio/client.ts` S3 client singleton | MinIO client module |
| 1.6 | Buat `src/lib/minio/upload.ts` — `buildUploadKey`, `putObject`, `deleteObject` | Upload service |
| 1.7 | Buat `src/lib/minio/url.ts` — `objectUrl` | URL generator |
| 1.8 | Update `src/lib/http.ts` — type `AppEnv` untuk Prisma + MinIO | Type definitions |

### Fase 2: Entry Point & Middleware (Hari 3-4) — P0

| Task | Detail | Output | Status |
|---|---|---|---|
| 2.1 | Entry Express + Hono adapter (`src/server.ts`; Worker tetap `src/index.ts`) | Entry point Node | ✅ |
| 2.2 | Setup CORS middleware Express (dari `CMS_ORIGIN` / `WEB_ORIGIN`) | CORS working | ✅ |
| 2.3 | Adaptasi `request-id.ts` + access log | Request ID per request | ✅ |
| 2.4 | Adaptasi `security-headers.ts` (CSP, HSTS prod, dll) | Security headers | ✅ |
| 2.5 | Adaptasi `rate-limit.ts` (memory store; trust proxy) | Rate limiter | ✅ |
| 2.6 | Inject Prisma & MinIO ke Hono Bindings (`fetch(req, bindings)`) | Context binding | ✅ |
| 2.7 | Test health endpoint: `GET /api/health` (Prisma + MinIO checks) | Health check OK | ✅ |

Tambahan Fase 2 (hardening): global `onError` / Express body-parser error handler, graceful shutdown SIGTERM/SIGINT, JSON body limit 8MB.

### Fase 3: Migrasi Database Layer (Hari 5-7) — P0

| Task | Detail | Output | Status |
|---|---|---|---|
| 3.1 | Buat Prisma queries untuk route `kategori`: list, create, update, delete | `prisma/kategori-repo.ts` | ✅ |
| 3.2 | Buat Prisma queries untuk route `berita`: CRUD + list with pagination + filter status | `prisma/berita-repo.ts` | ✅ |
| 3.3 | Buat Prisma queries untuk route `artikel-siswa`: CRUD + filter penulis | `prisma/artikel-repo.ts` | ✅ |
| 3.4 | Buat Prisma queries untuk route `fasilitas`, `ekstrakurikuler`, `prestasi` | Content repos | ✅ |
| 3.5 | Buat Prisma queries untuk `site-media` — list, get, upsert, delete | `prisma/site-media-repo.ts` | ✅ |
| 3.6 | Buat Prisma queries untuk `pengaturan` — get, upsert | `prisma/pengaturan-repo.ts` | ✅ |
| 3.7 | Buat Prisma queries untuk `analytics` — overview aggregation | `prisma/analytics-repo.ts` | ✅ |
| 3.8 | Buat Prisma queries untuk `users` — sync dengan Clerk | `prisma/users-repo.ts` | ✅ stub |

Catatan Fase 3:
- Repos di `apps/api/src/lib/prisma/*` — mirror API `lib/d1/*` (`prisma*` vs `d1*`); Worker tetap D1.
- Route cutover ke Prisma = **Fase 4** ✅ (Node `server.ts` mounts content routes via adapters).
- Task 3.8: CMS users tetap Clerk (`routes/users.ts`); tidak ada model `User` di tenant schema — `users-repo.ts` hanya probe/stub sampai Platform DB (Fase 10).
- Smoke: `pnpm --filter @teknovo/api prisma:smoke` (butuh Postgres + migrate + seed).

### Fase 4: Route Integration & Testing (Hari 8-9) — P0

| Task | Detail | Output | Status |
|---|---|---|---|
| 4.1 | Update semua route imports — dari d1-repo ke prisma repo | Semua routes pakai Prisma | ✅ dual-runtime |
| 4.2 | Update route handlers MinIO — dari R2 binding ke S3 SDK | Semua upload/download pakai MinIO | ✅ dual-runtime |
| 4.3 | Test POST/PUT upload file → MinIO → simpan URL di PostgreSQL | Upload flow end-to-end | ✅ smoke MinIO |
| 4.4 | Test GET list dengan pagination + filter | List API OK | ✅ |
| 4.5 | Test PATCH update, DELETE soft/hard | CRUD OK | ✅ via adapters + prisma:smoke |
| 4.6 | Test auth Clerk — session verify via `@clerk/backend` Node.js | Auth flow OK | ✅ 401 tanpa Bearer |
| 4.7 | Test CORS dari domain CMS dan Web | Cross-origin OK | ✅ Express CORS (Fase 2) |

Catatan Fase 4:
- Adapter `lib/data/*` + `hasPrisma` / `hasMinio`: Node (`c.env.prisma`) → Prisma/MinIO; Worker → D1/R2.
- `server.ts` mounts the same `/api/v1/*` routes as Worker via `mountApiRoutes`.
- `scheduleBackground` replaces `executionCtx.waitUntil` for Node (fire-and-forget).
- Smoke: `pnpm --filter @teknovo/api smoke:node` (Postgres + MinIO docker). Production DNS/Tunnel cutover = Fase 8+.

### Fase 5: Stored Procedures (Hari 10) — P0

| Task | Detail | Output | Status |
|---|---|---|---|
| 5.1 | Buat `stored-procedures/001_upsert_site_media.sql` | SP upsert | ✅ |
| 5.2 | Buat `stored-procedures/002_publish_berita.sql` | SP publish | ✅ |
| 5.3 | Buat `stored-procedures/003_analytics.sql` | Function analytics | ✅ |
| 5.4 | Buat `stored-procedures/004_search.sql` | Function search (pg_trgm) | ✅ |
| 5.5 | Buat `stored-procedures/005_archive_outdated.sql` | SP archive | ✅ |
| 5.6 | Buat `scripts/deploy-stored-procedures.ts` — baca semua SQL dan execute via Prisma `$executeRaw` | Deploy script | ✅ |
| 5.7 | Buat `lib/procedures/` — wrapper TypeScript untuk setiap SP | Service layer | ✅ |

Catatan Fase 5:
- SQL di `apps/api/src/stored-procedures/` (Postgres only). **D1/Worker tidak punya stored procedures** — repos D1 tetap ORM/SQL biasa.
- Deploy: `pnpm --filter @teknovo/api prisma:procedures` → smoke `prisma:procedures:smoke`.
- Wired ke Prisma repos: `prismaUpsertSiteMedia`, `prismaAnalyticsOverview`, publish path di create/update berita + `prismaPublishBerita`.
- P1 siap wrapper, belum ada route/cron: `fn_search_berita` (`searchBerita`), `sp_archive_outdated` (`prismaArchiveOutdated`).
- Ops lain (list/get/CRUD rutin) tetap Prisma Client ORM.

| Procedure / function | Dipakai untuk |
|---|---|
| `sp_upsert_site_media` | Atomic upsert `site_media` |
| `sp_publish_berita` | Validasi + DRAFT→PUBLISHED (`published_at`, `sort_at`) |
| `fn_get_analytics_overview` | Aggregasi dashboard CMS |
| `fn_search_berita` | ILIKE + `pg_trgm` (belum di-expose ke route) |
| `sp_archive_outdated` | Archive konten published > N hari (belum cron) |

### Fase 6: MinIO Bucket Setup & Seed (Hari 11) — P0

| Task | Detail | Output | Status |
|---|---|---|---|
| 6.1 | Buat bucket `teknovo-web` via script setup | Bucket ready | ✅ |
| 6.2 | Set bucket policy: public read untuk `media/*`, `brand/*` | Policy applied | ✅ |
| 6.3 | Buat `scripts/seed-minio.ts` — upload landing assets ke MinIO | All assets seeded | ✅ |
| 6.4 | Update `site-media-repo.ts` — default path mengarah ke MinIO URL | Site media pointing ke MinIO | ✅ |

Catatan Fase 6:
- `pnpm --filter @teknovo/api minio:ensure-bucket` — create `MINIO_BUCKET` (default `teknovo-web`) + public-read `media/*` / `brand/*` (`cms/uploads/*` tetap privat).
- `pnpm --filter @teknovo/api minio:seed` — upload catalog + landing keys dari `SEED_SRC` (default R2 CDN); placeholder `.webp` jika gagal; upsert `site_media` ke MinIO public URLs.
- Script di `apps/api/scripts/` (bukan root `scripts/`) agar sejajar dengan `ensure-minio-bucket` / package scripts.
- `catalogDefaultUrl` / `siteMediaCatalogWithMinioUrls` di Prisma repo (Node only). Worker tetap relative `defaultPath` + `R2_PUBLIC_URL` via `publicObjectUrl`.

### Fase 7: Data Migration (Hari 12-13) — P0

| Task | Detail | Output | Status |
|---|---|---|---|
| 7.1 | Buat `scripts/migrate-d1-to-pg.ts` — export data dari D1 via API, insert ke PostgreSQL | Data migrated | ✅ |
| 7.2 | Transform `cover_url`, `file_url` — ganti domain R2 dengan MinIO public URL | URLs updated | ✅ |
| 7.3 | Transform `site_media` dari D1 ke MinIO + PostgreSQL | Site media migrated | ✅ |
| 7.4 | Validasi: jumlah record sama, URL bisa diakses | Integrity OK | ✅ |
| 7.5 | Rollback plan: jika gagal, kembalikan ke Worker dengan D1 dan R2 | Rollback script ready | ✅ |

Catatan Fase 7:
- Script di `apps/api/scripts/migrate-d1-to-pg.ts` (sejajar Fase 5–6). PRP tree `scripts/` di root = alias konsep; package scripts di `@teknovo/api`.
- `pnpm --filter @teknovo/api migrate:d1-to-pg:dry` — default aman (no writes). Live: `migrate:d1-to-pg` (= `--execute`).
- Sumber: `wrangler d1 execute --remote|--local --json`, atau `--from-json` / `--dump-json`.
- Tabel: `kategori`, `berita`, `artikel_siswa`, `fasilitas`, `ekstrakurikuler`, `prestasi`, `site_media`, `pengaturan`. Upsert idempotent by `id` / `media_key`.
- Rewrite: `R2_PUBLIC_URL` → `MINIO_PUBLIC_URL` pada `cover_url`, `file_url`, `preview_url`, `og_image_url`, `site_media.url`, HTML `konten`, string fields di `pengaturan.payload`.
- Validasi setelah `--execute`: row counts (PG ≥ D1), sample slugs, orphan `kategori_id` report; optional `--check-urls` HEAD.
- **Rollback:** D1+R2 tetap SoT sampai Fase 8; jangan hapus D1. Ulangi dry-run/execute setelah perbaikan.
- **DNS belum diganti** — production tetap `cf.smkteknovo.sch.id` (Worker).

### Fase 8: Zero Trust Setup & VPS Deploy (Hari 14) — P0

| Task | Detail | Output | Status |
|---|---|---|---|
| 8.1 | Install cloudflared di VPS, login Cloudflare | Tunnel authenticated | ⬜ ops (script ready) |
| 8.2 | Buat tunnel `teknovo-api`, konfigurasi ingress | Tunnel active | ⬜ ops (template ready) |
| 8.3 | DNS: `api.smkteknovo.sch.id` CNAME ke tunnel | Domain pointing | ⬜ ops (canonical; not `cms-api`) |
| 8.4 | Install PM2 global + pm2-logrotate | PM2 ready | ✅ scripts |
| 8.5 | Setup aaPanel reverse proxy (jika tidak pakai tunnel) | Proxy OK | ⏭ skip if Tunnel |
| 8.6 | Jalankan API via PM2 (`tsx` + cluster; bukan `dist/` emit) | API running | ✅ ecosystem + scripts |
| 8.7 | Test semua endpoint dari public internet via Tunnel | All endpoints OK | ⬜ after live Tunnel |

Catatan Fase 8:
- **Hostname:** `api.smkteknovo.sch.id` (F-31 / arsitektur). Checklist draft `cms-api.` = optional alias only.
- **Repo artifacts:** `ops/cloudflared/config.yml.example` + README; `scripts/ops/bootstrap-vps.sh`, `pm2-start.sh`, `pm2-restart.sh`; cutover `docs/CUTOVER-API-TUNNEL.md`; `DEPLOY.md` § Zero Trust.
- **Runtime:** PM2 cluster menjalankan `src/server.ts` via `tsx` (sama `deploy-api-vps.yml`). Emit `dist/` ditunda — dual Worker/Node + workspace `@teknovo/shared`.
- **Tidak** membuat tunnel/DNS live dari CI tanpa kredensial VPS; Super Admin menyelesaikan 8.1–8.3 + 8.7 di server.
- **Cutover:** Node di belakang Tunnel **paralel** dengan Worker `cf.`; ganti `VITE_API_URL` / `PUBLIC_API_URL` hanya saat siap; rollback → `cf.`.
- aaPanel reverse proxy (8.5) hanya jika Tunnel tidak dipakai.

### Fase 9: CI/CD & Monitoring (Hari 15) — P1

| Task | Detail | Output | Status |
|---|---|---|---|
| 9.1 | Buat GitHub Action: build + deploy ke VPS via SSH | CI/CD pipeline | ✅ |
| 9.2 | Setup deploy hook: `POST /api/v1/hooks/rebuild-web` trigger deploy script | Auto-deploy | ✅ |
| 9.3 | Setup pm2-logrotate — max 10 file, 50MB per file | Log management | ✅ |
| 9.4 | Setup backup cron: PostgreSQL dump harian + MinIO backup mingguan | Backup system | ✅ |
| 9.5 | Setup monitoring: `pm2 monit` + health check endpoint monitoring | Monitoring | ✅ |

Catatan Fase 9:
- **CI** (`.github/workflows/ci.yml`): PR/push — `@teknovo/shared` tests; API `typecheck` + `typecheck:node` + unit tests; CMS Vite build; Astro build with offline `PUBLIC_API_URL` (no live content dependency).
- **Worker/Pages deploys** remain primary until Fase 8 cutover. Missing `CLOUDFLARE_*` secrets → build/typecheck still run, deploy **skipped** with warning (job green).
- **VPS deploy** (`.github/workflows/deploy-api-vps.yml`): rsync + `pm2 reload`; requires `VPS_HOST`/`VPS_USER`/`VPS_SSH_KEY`. Auto on push only if `vars.ENABLE_VPS_DEPLOY=true`; otherwise `workflow_dispatch`. Does **not** replace `deploy-api.yml`.
- **9.2** already implemented: CMS publish + `POST /api/v1/hooks/rebuild-web` → `repository_dispatch` → `rebuild-web.yml`.
- **Ops scripts** (`scripts/ops/`): `setup-pm2-logrotate.sh` (50M×10), `backup-pg.sh`, `backup-minio.sh` — run on VPS after Fase 8; cron examples in script headers.
- **Health:** `health-check.yml` cron `*/15` curls `GET /api/health` (default `cf.smkteknovo.sch.id`). Override with `vars.HEALTH_CHECK_URL` after Tunnel (`api.`). Lightweight — no paid SaaS. VPS: `pm2 monit`.
- **Tidak** memaksa Fase 8 DNS cutover.

### Fase 10: SaaS Platform Foundation (Hari 16-20) — P1/P2

| Task | Detail | Output |
|---|---|---|
| 10.1 | Buat Platform DB schema: `tenants`, `users`, `tenant_memberships` | Platform schema |
| 10.2 | Buat `lib/tenant-router.ts` — middleware extract domain, lookup tenant, inject context | Tenant router |
| 10.3 | Buat endpoint `POST /api/platform/tenants` — create tenant (DB + bucket + migrate) | Tenant provisioning |
| 10.4 | Buat endpoint `DELETE /api/platform/tenants/:id` — delete tenant (backup + cleanup) | Tenant deletion |
| 10.5 | Buat `POST /api/platform/tenants/:id/setup` — seed data default per tenant | Tenant setup |
| 10.6 | Setup Redis (via docker) untuk event bus | Redis active |
| 10.7 | Implement event: `tenant.created` → auto create DB & bucket | Event-driven |
| 10.8 | Buat admin console sederhana (bisa di CMS yang sudah ada) | Admin UI |

---

## 12. Rollback Plan

| Skenario | Tindakan |
|---|---|
| API error setelah deploy | `pm2 restart teknovo-api` atau rollback ke commit sebelumnya |
| Data migrasi gagal | Kembalikan ke Worker D1 + R2, perbaiki script, ulang migrasi |
| MinIO connection issue | Fallback: upload via API (buffer di memory sementara) |
| Cloudflare Tunnel down | Buka sementara port VPS dengan firewall restrict IP Cloudflare |
| Semua gagal | `wrangler deploy` — kembalikan ke Worker (kode lama masih ada) |

---

## 13. Definisi Selesai (Definition of Done)

Untuk setiap task:
- [ ] Code sudah di-commit ke branch `main`
- [ ] Prisma migration sudah apply tanpa error
- [x] Stored procedures sudah terdaftar di PostgreSQL
- [ ] Endpoint di-test via Postman/curl dengan response 200
- [ ] CORS dari CMS domain dan Web domain berfungsi
- [ ] Upload file ke MinIO sukses, URL bisa diakses publik
- [ ] Auth Clerk memverifikasi session dengan benar
- [ ] Review bersama sebelum merge

Untuk Fase 8 (Go Live):
- [ ] Smoke test semua route: GET, POST, PATCH, DELETE *(via Tunnel setelah Super Admin setup)*
- [ ] Upload file real dari CMS → MinIO → tampil di Web
- [ ] Downtime < 1 menit saat cutover dari Worker ke Express
- [ ] Monitoring dashboard (aaPanel + PM2) menunjukkan semua hijau
- [x] Repo: cloudflared template, bootstrap/PM2 scripts, cutover runbook committed

---

## 14. Appenidix: TypeScript Config

### `apps/api/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 15. Appendix: Referensi

- [Hono Express Adapter](https://hono.dev/docs/getting-started/nodejs#express)
- [Prisma PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- [AWS SDK S3 untuk MinIO](https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [PM2 Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)

---

**End of PRD.** Siap di-copy-paste ke Cursor agent sebagai konteks utama.