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

- [DEPLOY.md](DEPLOY.md) — **Workers Paid vs free-tier / VPS path** (baca jika kena error 10027)
- [ARSITEKTUR.md](docs/ARSITEKTUR.md)
- [API.md](docs/API.md) — kontrak homelab api-web
- [CLERK.md](docs/CLERK.md)

## Deploy notes

**Tanpa Workers Paid:** OpenNext ke Cloudflare Free **tidak bisa** (code **10027** + limit CPU 10 ms). Ikuti **[DEPLOY.md](DEPLOY.md)** — rekomendasi: Node `pnpm build && pnpm start` di VPS/homelab, R2 via S3 API, D1 via HTTP API atau DB lain.

**Dengan Workers Paid** (path OpenNext saat ini):

1. Upgrade Workers Paid, lalu set secrets/vars (Clerk, `R2_PUBLIC_URL`, `REVALIDATE_SECRET`, dll.).
2. Binding R2: `CMS_BUCKET` → bucket `teknovo`; D1: `DB` → `teknovo-article` (lihat `wrangler.toml`).
3. CI GitHub: `.github/workflows/deploy.yml` membutuhkan `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, dan Clerk secrets.

### Workers Free vs Paid (size + CPU)

| Plan | Gzipped Worker size | CPU / request |
|------|---------------------|---------------|
| Workers Free | **3 MiB** | **10 ms** |
| Workers Paid | **10 MiB** | up to minutes |

`build:cf` can succeed while deploy fails with:

> Your Worker exceeded the size limit of 3 MiB. Please upgrade to a paid plan… **[code: 10027]**

Raw `.open-next/server-functions/default/handler.mjs` is often ~10–16 MiB uncompressed; the platform enforces the **gzipped** limit. Limits: [Workers platform limits](https://developers.cloudflare.com/workers/platform/limits/#worker-size).

Minify / `optimizePackageImports` will **not** fit this app under Free 3 MiB. Without Paid, use the Node/Vercel path in `DEPLOY.md` — do not keep retrying `wrangler deploy` on Free.

### Custom domain + bindings (`wrangler.toml` wins)

`npx wrangler deploy` applies **local** `wrangler.toml` and can **remove** dashboard-only Domains & Routes / rename bindings.

This repo pins:

| Setting | Value |
|---------|--------|
| Custom domains | `smkteknovo.sch.id`, `www.smkteknovo.sch.id` (`custom_domain = true`) |
| R2 binding | `CMS_BUCKET` → bucket `teknovo` |
| D1 binding | `DB` → `teknovo-article` |
| Observability | `enabled = true` |

App code depends on binding names `CMS_BUCKET` and `DB`. If the dashboard shows aliases (`r2teknovo`, `D1Teknovo`), rename those bindings to match — or accept that the next deploy replaces them with the wrangler names.

### Workers Builds (dashboard Cloudflare)

**Wajib** set di **Workers → Settings → Build** (Workers Builds tidak membaca `[build]` di `wrangler.toml`):

| Setting | Nilai |
|---------|--------|
| Build command | `pnpm run build:cf` |
| Deploy command | `npx wrangler deploy` |

- `build:cf` = `cf-typegen` + `opennextjs-cloudflare build` → menghasilkan `.open-next/` (termasuk compiled OpenNext config).
- **Jangan** pakai `pnpm run build` lalu `wrangler deploy` — itu hanya `next build`. Deploy lalu gagal dengan: *Could not find compiled Open Next config, did you run the build command?*
- Jangan pakai `pnpm run deploy` sebagai Deploy command jika Build step sudah menjalankan `build:cf` (akan build dua kali). Pakai `npx wrangler deploy` saja.
- Alternatif resmi OpenNext (satu langkah di Deploy): build `npx opennextjs-cloudflare build`, deploy `npx opennextjs-cloudflare deploy`.

Setelah ubah setting di dashboard, trigger ulang deploy.

**Auth boundary:** pakai `src/middleware.ts` (Edge), bukan `proxy.ts`. OpenNext Cloudflare belum mendukung Node.js middleware / `proxy.ts` (error: *Node.js middleware is not currently supported*).
