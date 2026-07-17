# Agent notes — teknovo-web

- Package manager: **pnpm** only.
- Never commit `.env.local` or real secrets; use `GANTI_*` in `.env.example`.
- UI: Atlas-inspired — brand `#1313BA`, square corners, flat borders (`#E8E8F8`).
- Deploy via `@opennextjs/cloudflare` + Wrangler (see `wrangler.toml`).
- CMS routes under `/dashboard` require Clerk.
- Auth uses Edge `src/middleware.ts` (not Next.js 16 `proxy.ts` — unsupported by OpenNext yet).
- Public images/videos live on R2 (`R2_PUBLIC_URL`); use `publicAssetUrl()` / `LANDING_MEDIA` / `BRAND_MEDIA`.
- SEO / RSS / llms.txt: server-only module `src/lib/seo/` (`feed`, `schema-dts`). No client SEO widgets.
