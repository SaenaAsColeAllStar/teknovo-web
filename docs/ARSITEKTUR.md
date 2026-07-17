# Arsitektur — teknovo-web

Portal publik + CMS SMK Teknovo, di-deploy ke **Cloudflare** via `@opennextjs/cloudflare` (Workers runtime + Node.js compat).

## Ringkasan

```
Browser ──► Cloudflare Workers (OpenNext)
              ├── (public)  beranda / berita / tentang / kontak
              ├── (dashboard) CMS — dilindungi Clerk
              └── api/*     webhook Clerk, revalidate, health

Homelab (masa depan)
  services/api-web  ←── API_URL (JSON contract di docs/API.md)
  Postgres / Redis / R2
```

## Route groups

| Group | Path | Auth |
|-------|------|------|
| `(site)` | `/`, `/profil/*`, `/akademik/*`, `/kesiswaan/*`, `/fasilitas/*`, `/berita/*`, `/kontak`, SEO landing, dll. | Publik |
| `(dashboard)` | `/dashboard/*` | Clerk `auth.protect()` |
| Auth UI | `/sign-in`, `/sign-up` | Clerk components |
| API | `/api/webhook/clerk`, `/api/revalidate`, `/api/health` | Secret / stub |

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + Atlas-inspired tokens (`#1313BA`, square corners)
- Clerk (`@clerk/nextjs`)
- TanStack Query, Zod, react-hook-form, TipTap (deps), Sonner
- OpenNext Cloudflare adapter + Wrangler

## Relasi ke monorepo `rtek`

`apps/web` di monorepo tetap ada (nginx path `/`). Repo ini adalah **split** untuk Cloudflare Pages/Workers: marketing + CMS ringan, API konten di homelab.

Brand assets (`public/brand`, hero) disalin dari monorepo. Halaman publik dimigrasi **1:1** dari monorepo `apps/web` (komponen landing + aset `public/media`). Service yang bergantung Postgres diganti fallback/static di CF; konten CMS tetap lewat `API_URL` bila tersedia.
