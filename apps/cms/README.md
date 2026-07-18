# @teknovo/cms — Vite + TipTap + Clerk

**Domain:** `cms.smkteknovo.sch.id`

## UI parity with the Next.js dashboard

The CMS is a Vite SPA, but it does **not** re-implement the dashboard UI. Instead it
reuses the real dashboard components from the legacy Next.js monolith
(`src/app/(dashboard)/dashboard`, `src/components/dashboard`) via Vite aliases straight
to repo `src/` — the same strategy `apps/web` uses for the public site. This keeps the
CMS pixel-identical to the reference dashboard (Atlas tokens, `DashboardSidebar`,
`BeritaForm`, `MediaLibrary`, `ModerasiQueue`, `DashboardAnalytics`, …) without
duplicating markup.

Because those components assume a Next.js runtime, `vite.config.ts` aliases a handful
of Next/Clerk-server-only modules to small shims under `src/shims/`:

| Alias | Shim | Why |
|---|---|---|
| `next/link` | `next-link.tsx` | Renders a `react-router-dom` `Link`; rewrites `/dashboard/...` hrefs to real SPA routes (`/...`). |
| `next/navigation` | `next-navigation.ts` | `usePathname`/`useRouter` backed by `react-router-dom`; `usePathname()` returns the *virtual* `/dashboard/...` path so unmodified nav active-state logic keeps working. `router.refresh()` is a pub/sub event CMS pages subscribe to instead of a full reload. |
| `@clerk/nextjs` | `clerk-nextjs.ts` | Re-exports `useAuth`/`UserButton` from `@clerk/clerk-react`. |
| `@/lib/cms-revalidate` | `cms-revalidate.ts` | No-ops — the Cloudflare API already triggers the `rebuild-web` GitHub Action after publish/approve. |
| — | `patch-cms-media-fetch.ts` | Patches `window.fetch` so `MediaLibrary`'s relative `fetch("/api/cms/media")` calls hit the absolute API origin with a Clerk bearer token attached (cross-origin, unlike the Next.js monolith's same-origin cookie session). |

`@` still aliases to repo `src/` (after the shims above, which must win first), and
`@teknovo/shared` resolves to `packages/shared/src`.

Role/session resolution (`getCmsSession()` in the Next app) is server-only, so
`DashboardLayoutClient` recomputes it client-side from `useUser()` + `parseCmsRole` /
`cmsRoleCan*` (`@teknovo/shared`) and feeds the same `CmsRoleProvider` the dashboard
uses.

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
| `VITE_API_URL` | `https://cf.smkteknovo.sch.id/api` |
| `VITE_R2_PUBLIC_URL` | `https://r2.ctos.web.id` |

`VITE_API_URL` must include the `/api` prefix — the Cloudflare Worker mounts routes at
`/api/v1/...` (see `apps/api/src/index.ts`), matching the Next.js `api-client`'s
`${EXTERNAL_API_URL}/v1/...` request shape.

SPA fallback: `public/_redirects` → `/*` → `/index.html` (200).

## Local

```bash
cp apps/cms/.env.example apps/cms/.env
# VITE_CLERK_PUBLISHABLE_KEY=...
# VITE_API_URL=http://127.0.0.1:8787/api
pnpm --filter @teknovo/cms dev   # http://localhost:5173
```

## Deploy (CLI)

```bash
pnpm --filter @teknovo/cms deploy
# = vite build + wrangler pages deploy dist --project-name=teknovo-cms
```

## Clerk

Tambahkan domain `cms.smkteknovo.sch.id` di Clerk Dashboard. Auth hanya di CMS
(bukan apex):

| Path | Halaman |
|------|---------|
| `/sign-in` | Login dua kolom (custom `useSignIn` + OAuth) |
| `/sign-up` | Daftar (Clerk `<SignUp />`) |
| `/forgot-password` | Reset kata sandi (full-bleed dua kolom) |
| `/sso-callback` | Callback OAuth untuk `signIn.sso()` |

Setelah masuk, redirect ke `/` (dashboard CMS).

### Roles

Role di `user.publicMetadata.role`:

| Metadata | Label UI | Capabilitas utama |
|----------|----------|-------------------|
| `admin` | Super Admin | Semua + moderasi approve + pengaturan + **kelola pengguna** |
| `editor` | Admin | CRUD berita/artikel, lihat moderasi (tanpa approve) |
| `siswa` | Siswa | Artikel milik sendiri, kategori, media |
| `viewer` | Viewer | Baca saja (default jika metadata kosong) |

## Pengguna

Halaman `/pengguna` (nav: **Pengguna**, virtual path `/dashboard/pengguna`) — hanya Super Admin
(`canManageSettings` / `role === "admin"`). UI: `PenggunaPage` → `PenggunaManager`; API via
`fetchCmsUsers` / `createCmsUser` / `updateCmsUser` / `deleteCmsUser` → `GET|POST|PATCH|DELETE /api/v1/users`.

Tambah akun: email wajib, nama & password opsional (password ≥8 → `users.createUser`; kosong →
undangan Clerk). Bisa ubah peran dan hapus akun (konfirmasi; tidak bisa hapus diri sendiri).
