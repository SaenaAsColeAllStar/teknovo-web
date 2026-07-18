# Agent notes — teknovo-web

- Package manager: **pnpm** only.
- Never commit `.env.local` or real secrets; use `GANTI_*` in `.env.example`.
- UI: Atlas-inspired — brand `#1313BA`, square corners, flat borders (`#E8E8F8`).
- Deploy via `@opennextjs/cloudflare` + Wrangler (see `wrangler.toml`) **only on Workers Paid**.
- Free Workers cannot host this OpenNext app (3 MiB gzip → 10027; also 10 ms CPU). Without Paid → Node `next start` on VPS/homelab (or Vercel); see `DEPLOY.md`.
- Custom domains + bindings live in `wrangler.toml` (local overrides dashboard).
- Cloudflare Workers Builds: Build `pnpm run build:cf`, Deploy `npx wrangler deploy`. Never use plain `pnpm run build` before wrangler (needs `.open-next/`).
- CMS routes under `/dashboard` require Clerk.
- Auth uses Edge `src/middleware.ts` (not Next.js 16 `proxy.ts` — unsupported by OpenNext yet).
- Public images/videos live on R2 (`R2_PUBLIC_URL`); use `publicAssetUrl()` / `LANDING_MEDIA` / `BRAND_MEDIA`.
- SEO / RSS / llms.txt: server-only module `src/lib/seo/` (`feed`, `schema-dts`). No client SEO widgets.
