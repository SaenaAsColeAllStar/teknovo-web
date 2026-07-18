# @teknovo/web — Astro SSG (apex)

**Domain:** `smkteknovo.sch.id`  
**Pages project:** `teknovo-web`  
**www:** Redirect 301 → apex (bukan project terpisah)

## UI parity

Landing memakai **komponen React yang sama** dengan Next `(site)` (`src/components/features/landing`, `PublicMarketingNavbar`, dll.) lewat alias `@` → `src/` + shim `next/link|image|navigation`. Chrome = `PublicSiteLayout`. Token CSS = `globals.css` Atlas (Poppins, `#1313BA`).

## Cloudflare Pages settings

| Setting | Nilai |
|---------|--------|
| **Root directory** | `/` *(disarankan monorepo)* |
| **Build command** | `pnpm install && pnpm --filter @teknovo/web build` |
| **Build output directory** | `apps/web/dist` |

Atau Root `apps/web` + `pnpm install && pnpm build` + output `dist` (butuh workspace hoist dari root).

### Environment variables (build-time)

| Name | Value |
|------|--------|
| `PUBLIC_API_URL` | `https://cf.smkteknovo.sch.id` |
| `PUBLIC_SITE_URL` | `https://smkteknovo.sch.id` |
| `PUBLIC_R2_URL` | `https://r2.ctos.web.id` |

Astro fetch berita **saat build**. Publish CMS → API `rebuild-web` → GitHub Action rebuild Pages.

## Local

```bash
pnpm --filter @teknovo/web dev
# http://localhost:4321
```

## Deploy (CLI)

```bash
# Env produksi ikut .env.production / defaults di astro.config.mjs
pnpm --filter @teknovo/web deploy
```

Atau override eksplisit:

```bash
PUBLIC_API_URL=https://cf.smkteknovo.sch.id \
PUBLIC_SITE_URL=https://smkteknovo.sch.id \
PUBLIC_R2_URL=https://r2.ctos.web.id \
pnpm --filter @teknovo/web deploy
```

`wrangler.toml` di folder ini set `pages_build_output_dir = "dist"` untuk `wrangler pages deploy`.