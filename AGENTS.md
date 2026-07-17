# Agent notes — teknovo-web

- Package manager: **pnpm** only.
- Never commit `.env.local` or real secrets; use `GANTI_*` in `.env.example`.
- UI: Atlas-inspired — brand `#1313BA`, square corners, flat borders (`#E8E8F8`).
- Deploy via `@opennextjs/cloudflare` + Wrangler (see `wrangler.toml`).
- CMS routes under `/dashboard` require Clerk.
