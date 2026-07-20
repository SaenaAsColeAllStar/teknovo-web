# Agent notes — teknovo-web

- Package manager: **pnpm** only (workspaces: `apps/*`, `packages/*`).
- Never commit `.env.local` or real secrets; use `GANTI_*` in `.env.example`.
- UI: Atlas-inspired — brand `#1313BA`, square corners, flat borders (`#E8E8F8`).
- **Production paths** — see `DEPLOY.md` / `docs/CUTOVER-API-TUNNEL.md`
  - `apps/web` Astro → `smkteknovo.sch.id` (Pages)
  - `apps/cms` Vite+TipTap+Clerk → `cms.smkteknovo.sch.id` (Pages)
  - **Node API (cutover target):** Express + Prisma + MinIO → `cms-api.smkteknovo.sch.id` (Tunnel → VPS `:8788`)
  - **Worker Free (current clients until cutover):** Hono → `cf.smkteknovo.sch.id` (D1/R2)
  - `www` → 301 to apex
- Do **not** deploy root OpenNext to Workers Free (3 MiB / 10 ms → 10027).
- Shared types/schemas: `packages/shared`.
- Legacy Next monolit (`src/`, root `wrangler.toml`) = reference until Astro parity; CMS writes go through API (`cf.` now, `cms-api.` after cutover).
- Public media: R2 today; MinIO after Node cutover (`MINIO_PUBLIC_URL`).
- Publish berita/artikel → API `triggerWebRebuild` → GitHub `rebuild-web` workflow.
