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
pnpm --filter @teknovo/api minio:seed          # landing/brand → MinIO + site_media URLs
pnpm --filter @teknovo/api dev:node        # http://127.0.0.1:8787
```

Node health reports Prisma + MinIO: `GET /api/health` → `{ runtime: "node", checks: { prisma, minio } }`.

### MinIO bucket & seed (PRP Fase 6)

```bash
pnpm --filter @teknovo/api minio:ensure-bucket   # bucket teknovo-web + public-read media/* brand/*
pnpm --filter @teknovo/api minio:seed            # upload landing assets; upsert site_media → MinIO URLs
```

- Source objects: `SEED_SRC` (default `https://r2.ctos.web.id`); missing `.webp` → tiny placeholder.
- `SEED_CATALOG_ONLY=1` — only `SITE_MEDIA_CATALOG` keys.
- `SEED_SKIP_DB=1` — objects only (no Postgres upsert).
- Worker/R2 path unchanged; catalog still stores relative `defaultPath`.

### D1 → Postgres migration (PRP Fase 7)

Copy content from Cloudflare D1 into local/VPS Postgres and rewrite R2 public URLs → `MINIO_PUBLIC_URL`. **Dry-run is the default**; live writes need `--execute`.

```bash
# Plan only (remote D1 → transform preview; no PG writes)
pnpm --filter @teknovo/api migrate:d1-to-pg:dry -- --remote

# Live upsert (idempotent by id / media_key)
pnpm --filter @teknovo/api migrate:d1-to-pg -- --remote

# Local wrangler D1, or offline dump
pnpm --filter @teknovo/api migrate:d1-to-pg:dry -- --local
pnpm --filter @teknovo/api migrate:d1-to-pg:dry -- --remote --dump-json /tmp/d1-export.json
pnpm --filter @teknovo/api migrate:d1-to-pg -- --from-json /tmp/d1-export.json
```

| Flag / env | Meaning |
|------------|---------|
| *(default)* | Dry-run — export + rewrite plan, no writes |
| `--execute` / `migrate:d1-to-pg` | Upsert into Postgres |
| `--remote` / `--local` | `wrangler d1 execute --json` source |
| `--from-json` / `--dump-json` | Offline export / import |
| `R2_PUBLIC_URL` | Source CDN base (default `https://r2.ctos.web.id`) |
| `MINIO_PUBLIC_URL` | Target public base for `cover_url` / `file_url` / `site_media.url` / HTML `konten` |

**Rollback:** keep production on Worker + D1 + R2 until Fase 8 DNS cutover. Do not delete D1. Re-run dry-run / execute after fixes (upserts are idempotent). If Postgres is wrong, leave Worker live and fix/re-import the VPS DB only.

**Auth note:** if remote D1 fails with wrangler `7403`/`1027`, run `wrangler login` or use `--from-json` / `--local`.

Production traffic stays on Worker until Fase 8 Tunnel cutover.

## VPS / Cloudflare Tunnel (PRP Fase 8)

Production clients stay on `cf.smkteknovo.sch.id` until cutover. Parallel hostname: **`api.smkteknovo.sch.id`**.

| Artifact | Path |
|----------|------|
| Tunnel config template | `ops/cloudflared/config.yml.example` |
| DNS / SSL notes | `ops/cloudflared/README.md` |
| Cutover + rollback | `docs/CUTOVER-API-TUNNEL.md` |
| VPS bootstrap | `scripts/ops/bootstrap-vps.sh` |
| PM2 start / reload | `scripts/ops/pm2-start.sh`, `pm2-restart.sh` |

```bash
# On VPS after repo sync
bash scripts/ops/bootstrap-vps.sh
# edit apps/api/.env
bash scripts/ops/pm2-start.sh
pnpm --filter @teknovo/api pm2:reload   # after code deploy
```

Never commit tunnel credentials JSON or `TUNNEL_TOKEN`.

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

## CI / VPS ops (PRP Fase 9)

- GitHub **CI** runs the commands above on every PR/push (`ci.yml`).
- Production Free path still uses Worker deploy (`deploy-api.yml`). Optional Node path: `deploy-api-vps.yml` after Fase 8 (see `DEPLOY.md`).
- On VPS: `bash scripts/ops/setup-pm2-logrotate.sh`, cron `backup-pg.sh` / `backup-minio.sh`.
- Health probe: `GET /api/health` (Worker or Node); monitored by `health-check.yml`.
