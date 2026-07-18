# Agent notes — teknovo-web

- Package manager: **pnpm** only (workspaces: `apps/*`, `packages/*`).
- Never commit `.env.local` or real secrets; use `GANTI_*` in `.env.example`.
- UI: Atlas-inspired — brand `#1313BA`, square corners, flat borders (`#E8E8F8`).
- **Production Free path (preferred):** Split deploy — see `DEPLOY.md`
  - `apps/web` Astro → `smkteknovo.sch.id` (Pages)
  - `apps/api` Hono → `cf.smkteknovo.sch.id` (Worker + D1/R2)
  - `apps/cms` Vite+TipTap+Clerk → `cms.smkteknovo.sch.id` (Pages)
  - `www` → 301 to apex
- Do **not** deploy root OpenNext to Workers Free (3 MiB / 10 ms → 10027).
- Shared types/schemas: `packages/shared`.
- Legacy Next monolit (`src/`, root `wrangler.toml`) = reference until Astro parity; CMS writes go through `cf.` API.
- Public media: R2 (`R2_PUBLIC_URL`).
- Publish berita/artikel → API `triggerWebRebuild` → GitHub `rebuild-web` workflow.
