# README — teknovo-web

Portal SMK TEKNOVO — **Split Free** di Cloudflare:

| Host | App |
|------|-----|
| `smkteknovo.sch.id` | `apps/web` (Astro SSG) |
| `cf.smkteknovo.sch.id` | `apps/api` (Hono Worker + D1/R2) |
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

## Docs

- [DEPLOY.md](DEPLOY.md) — Split Free + cutover
- [AGENTS.md](AGENTS.md)
- [docs/CLERK.md](docs/CLERK.md)
- [docs/API.md](docs/API.md)

OpenNext root (`wrangler.toml`) hanya untuk Workers Paid legacy — jangan deploy ke Free.
