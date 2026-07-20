# README — teknovo-web

Portal SMK TEKNOVO — **Split Free** di Cloudflare:

| Host | App |
|------|-----|
| `smkteknovo.sch.id` | `apps/web` (Astro SSG) |
| `cf.smkteknovo.sch.id` | `apps/api` (Hono Worker + D1/R2 — current) |
| `cms-api.smkteknovo.sch.id` | `apps/api` (Node Express + Tunnel — cutover target) |
| `cms.smkteknovo.sch.id` | `apps/cms` (Vite + TipTap + Clerk) |
| `www` | 301 → apex |

Detail deploy, secrets, DNS: **[DEPLOY.md](DEPLOY.md)**.

## Quick start

```bash
pnpm install

# API (Worker local)
pnpm dev:api

# CMS (Vite) — copy apps/cms/.env.example → apps/cms/.env
pnpm dev:cms

# Public site (Astro)
pnpm dev:web
```

Legacy Next monolit (referensi UI): `pnpm legacy:dev`.

## Scripts

| Script | Keterangan |
|--------|------------|
| `pnpm dev:api` / `dev:cms` / `dev:web` | Dev Split Free |
| `pnpm build:cms` / `build:web` | Build static |
| `pnpm deploy:api` / `deploy:cms` / `deploy:web` | Deploy ke CF |
| `pnpm d1:migrate:remote` | Migrasi D1 via `apps/api` |
| `pnpm --filter @teknovo/api migrate:d1-to-pg:dry` | Dry-run D1 → Postgres (PRP Fase 7) |
| `pnpm --filter @teknovo/api migrate:d1-to-pg` | Live D1 → Postgres upsert (`--execute`) |

## Docs

- [DEPLOY.md](DEPLOY.md) — Split Free + cutover
- [AGENTS.md](AGENTS.md)
- [docs/CLERK.md](docs/CLERK.md)
- [docs/API.md](docs/API.md)
- [docs/CUTOVER-API-TUNNEL.md](docs/CUTOVER-API-TUNNEL.md) — Worker → Node Tunnel cutover
- [docs/ROLLBACK.md](docs/ROLLBACK.md) — Node Tunnel → Worker rollback
- [docs/PRP-FINAL.md](docs/PRP-FINAL.md) — VPS migration plan (Fase 7 data migrate done; Fase 8 = Tunnel cutover)

OpenNext root (`wrangler.toml`) hanya untuk Workers Paid legacy — jangan deploy ke Free.
