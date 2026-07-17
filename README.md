# teknovo-web

Portal publik + CMS SMK Teknovo untuk **Cloudflare** (`@opennextjs/cloudflare`).

Split dari monorepo [`rtek`](https://github.com/SaenaAsColeAllStar) `apps/web` — lihat `docs/ARSITEKTUR.md`.

**Public UI** dimigrasi 1:1 dari `apps/web` (hero, navbar, SEO landing, berita, akademik, kesiswaan, fasilitas, profil). CMS Clerk `/dashboard` tetap. Data dinamis berita/statistik memakai fallback lokal hingga `API_URL` (homelab) siap.

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
2. Set secrets/vars di Workers (Clerk, `R2_PUBLIC_URL`, `REVALIDATE_SECRET`, dll.).
3. Binding R2: `CMS_BUCKET` → bucket `teknovo` (lihat `wrangler.toml`).
4. CI GitHub: `.github/workflows/deploy.yml` membutuhkan `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, dan Clerk secrets.

### Workers Builds (dashboard Cloudflare)

Jangan pakai `pnpm run build` — itu hanya `next build` dan **tidak** menghasilkan `.open-next/`.

Di **Workers → Settings → Build**:

| Setting | Nilai |
|---------|--------|
| Build command | `pnpm run build:cf` |
| Deploy command | `npx wrangler deploy` |

Alternatif resmi OpenNext: build `npx opennextjs-cloudflare build`, deploy `npx opennextjs-cloudflare deploy`.

Setelah ubah setting, trigger ulang deploy.
