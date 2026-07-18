# @teknovo/cms — Vite + TipTap + Clerk

**Domain:** `cms.smkteknovo.sch.id`  
**Pages project:** `    `

## Cloudflare Pages settings

| Setting | Nilai |
|---------|--------|
| **Root directory** | `apps/cms` |
| **Build output directory** | `dist` |
| **Build command** | `pnpm install && pnpm build` *(jika Root = `apps/cms`)* |
| **Alternative (Root = repo `/`)** | Build: `pnpm install && pnpm --filter @teknovo/cms build` · Output: `apps/cms/dist` |

### Environment variables (Pages → Settings → Environment variables)

| Name | Value |
|------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_…` / `pk_test_…` |
| `VITE_API_URL` | `https://cf.smkteknovo.sch.id` |

SPA fallback: `public/_redirects` → `/*` → `/index.html` (200).

## Local

```bash
cp apps/cms/.env.example apps/cms/.env
# VITE_CLERK_PUBLISHABLE_KEY=...
# VITE_API_URL=http://127.0.0.1:8787
pnpm --filter @teknovo/cms dev   # http://localhost:5173
```

## Deploy (CLI)

```bash
pnpm --filter @teknovo/cms deploy
# = vite build + wrangler pages deploy dist --project-name=teknovo-cms
```

## Clerk

Tambahkan domain `cms.smkteknovo.sch.id` di Clerk Dashboard. Sign-in hanya di CMS (bukan apex).
