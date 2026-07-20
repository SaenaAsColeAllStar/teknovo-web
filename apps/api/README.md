# @teknovo/api — Hono Worker (+ Node/VPS foundation)

**Domain (production Free):** `cf.smkteknovo.sch.id`  
**Project name:** `teknovo-cms-api` (Workers, bukan Pages)

> **PRP migration:** Node runtime (Express + Prisma + MinIO) is being built in parallel.
> Production traffic stays on Worker + D1 + R2 until cutover. See `docs/PRP-FINAL.md`.

## Cloudflare dashboard (Workers Builds) / Wrangler

| Setting | Nilai |
|---------|--------|
| **Root directory** | `apps/api` |
| **Build output directory** | _(tidak dipakai)_ — Worker di-bundle dari `src/index.ts` |
| **Build command** | _(kosong atau `pnpm install` di monorepo root)_ |
| **Deploy command** | `npx wrangler deploy` |
| **Wrangler config** | `apps/api/wrangler.toml` |

Worker **tidak** punya folder `dist` seperti Pages. Entry: `main = "src/index.ts"`.

## Local — Worker (production path)

```bash
# dari repo root
pnpm install
cp apps/api/.dev.vars.example apps/api/.dev.vars   # isi CLERK_SECRET_KEY
pnpm --filter @teknovo/api d1:migrate:local
pnpm --filter @teknovo/api dev   # http://127.0.0.1:8787
```

Health: `GET http://127.0.0.1:8787/api/health`

## Local — Node + Postgres + MinIO (PRP path)

```bash
pnpm docker:up
cp apps/api/.env.example apps/api/.env
pnpm --filter @teknovo/api prisma:generate
pnpm --filter @teknovo/api prisma:deploy   # or prisma:migrate for new migrations
pnpm --filter @teknovo/api prisma:seed
pnpm --filter @teknovo/api minio:ensure-bucket
pnpm --filter @teknovo/api dev:node        # http://127.0.0.1:8787
```

Node health reports Prisma + MinIO: `GET /api/health` → `{ runtime: "node", checks: { prisma, minio } }`.

Content CRUD routes on Node land in PRP Fase 3–4; until then Worker serves them.

## Deploy

```bash
cd apps/api
npx wrangler secret put CLERK_SECRET_KEY
npx wrangler secret put CLERK_WEBHOOK_SECRET
npx wrangler secret put GITHUB_REBUILD_TOKEN
# Apply any pending D1 migrations before/after deploy (creates site_media, article SEO columns, etc.)
pnpm d1:migrate:remote
pnpm deploy
```

### D1 migrations

| File | Purpose |
|------|---------|
| `migrations/0001_init.sql` | Core tables (`berita`, `artikel_siswa`, …) |
| `migrations/0002_site_content.sql` | Fasilitas / ekskul / prestasi / site_media |
| `migrations/0003_article_seo.sql` | SEO columns on `artikel_siswa` + `meta_keywords` on `berita` |
| `migrations/0004_perf_indexes.sql` | Composite indexes + `sort_at` on berita/artikel (list ORDER BY) |

Local: `pnpm --filter @teknovo/api d1:migrate:local`  
Remote: `pnpm --filter @teknovo/api d1:migrate:remote`

**List API notes:** `limit` capped at 100. Pass `?includeTotal=0` to skip the COUNT(*) round-trip (`meta.total` = `-1`). Lists order by indexed `sort_at` (berita/artikel) or `(status, sort_order)` composites (site content).

## Bindings (sudah di wrangler.toml)

- `DB` → D1 `teknovo-article`
- `CMS_BUCKET` → R2 `teknovo`
- vars: `R2_PUBLIC_URL`, `CMS_ORIGIN`, `WEB_ORIGIN`, `ENVIRONMENT=production`

Local: set `ENVIRONMENT=development` in `.dev.vars` for localhost CORS.

## Tests

```bash
pnpm --filter @teknovo/api test
pnpm --filter @teknovo/api typecheck
pnpm --filter @teknovo/api typecheck:node
```
