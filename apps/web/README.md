# @teknovo/web — Astro SSG (apex)

**Domain:** `smkteknovo.sch.id`  
**Pages project:** `teknovo-web`  
**www:** Redirect 301 → apex (bukan project terpisah)

## Cloudflare Pages settings

| Setting | Nilai |
|---------|--------|
| **Root directory** | `apps/web` |
| **Build output directory** | `dist` |
| **Build command** | `pnpm install && pnpm build` *(jika Root = `apps/web`)* |
| **Alternative (Root = repo `/`)** | Build: `pnpm install && pnpm --filter @teknovo/web build` · Output: `apps/web/dist` |

### Environment variables (build-time)

| Name | Value |
|------|--------|
| `PUBLIC_API_URL` | `https://cf.smkteknovo.sch.id` |

Astro fetch berita/pengaturan **saat build**. Setelah publish di CMS, API memicu GitHub `rebuild-web` agar Pages di-build ulang.

## Local

```bash
# API harus reachable (local atau production cf.)
PUBLIC_API_URL=http://127.0.0.1:8787 pnpm --filter @teknovo/web dev
# http://localhost:4321
```

## Deploy (CLI)

```bash
PUBLIC_API_URL=https://cf.smkteknovo.sch.id pnpm --filter @teknovo/web deploy
# = astro build + wrangler pages deploy dist --project-name=teknovo-web
```

## Custom domain

1. Pages `teknovo-web` → Custom domains → `smkteknovo.sch.id`
2. Zone Redirect Rule: `www.smkteknovo.sch.id/*` → `https://smkteknovo.sch.id/$1` (301)
