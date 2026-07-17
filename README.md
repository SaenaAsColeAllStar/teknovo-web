# teknovo-web

Portal publik + CMS SMK Teknovo untuk **Cloudflare** (`@opennextjs/cloudflare`).

Split dari monorepo [`rtek`](https://github.com/SaenaAsColeAllStar) `apps/web` — lihat `docs/ARSITEKTUR.md`.

## Quick start

```bash
pnpm install
cp .env.example .env.local
# isi Clerk keys (docs/CLERK.md)
pnpm dev
```

- Publik: http://localhost:3000  
- CMS: http://localhost:3000/dashboard (login via `/sign-in`)

## Scripts

| Script | Keterangan |
|--------|------------|
| `pnpm dev` | Next.js local |
| `pnpm build` | Next production build |
| `pnpm build:cf` | OpenNext Cloudflare build |
| `pnpm preview` | Build + Wrangler local preview |
| `pnpm deploy` | Build + deploy ke Cloudflare Workers |

## Docs

- [ARSITEKTUR.md](docs/ARSITEKTUR.md)
- [API.md](docs/API.md) — kontrak homelab api-web
- [CLERK.md](docs/CLERK.md)

## Deploy notes

1. Cloudflare account + Workers (OpenNext memakai Workers, bukan Pages legacy `next-on-pages`).
2. Set secrets/vars (Clerk, `API_URL`, `REVALIDATE_SECRET`).
3. CI: `.github/workflows/deploy.yml` membutuhkan `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, dan Clerk secrets.
4. Opsional: R2 bucket untuk incremental cache (`wrangler.toml`).
