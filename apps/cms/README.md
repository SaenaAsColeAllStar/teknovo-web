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

Project: **`teknovo-cms`** (bukan `teknovo-web`).

| Name | Value |
|------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_…` / `pk_test_…` |
| `VITE_API_URL` | `https://cf.smkteknovo.sch.id/api` |
| `VITE_R2_PUBLIC_URL` | `https://r2.ctos.web.id` |
| `VITE_TURNSTILE_SITEKEY` | Turnstile sitekey (public) |
| `VITE_TURNSTILE_SITEVERIFY_URL` | `https://turnstile-siteverify-teknovo-web.fajarnugrahayusman-06.workers.dev` |

**Preferred:** `VITE_API_URL`. Host with or without `/api` is fine
(`https://cf.smkteknovo.sch.id` or `https://cf.smkteknovo.sch.id/api`) —
Vite + `api-client` normalize once to `…/api` (no `/api/api`).

**Fallback:** if Pages only has `PUBLIC_API_URL` (Astro naming), the CMS build
also accepts it. Prefer renaming to `VITE_API_URL` for clarity.

**Not for this project:** Astro’s `PUBLIC_API_URL` on **teknovo-web** must be
host-only (`https://cf.smkteknovo.sch.id`, no `/api`).

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
(bukan apex). **CMS adalah invite-only** — tidak ada daftar publik.

| Path | Halaman |
|------|---------|
| `/sign-in` | Login dua kolom (custom `useSignInSignal` + OAuth) |
| `/sign-up` | Redirect → `/sign-in?message=invite-only` (pendaftaran ditutup) |
| `/forgot-password` | Minta kode reset (full-bleed dua kolom) |
| `/reset-password` | Buat kata sandi baru setelah verifikasi kode |
| `/sso-callback` | Callback OAuth untuk `signIn.sso()` — **sign-in only** (bukan sign-up) |

Setelah masuk, redirect ke `/` (dashboard CMS).

### Kebijakan akses (invite-only)

| Actor | Metadata `role` | Dapat mengundang / membuat |
|-------|-----------------|----------------------------|
| **Super Admin** | `admin` | Super Admin (`admin`), Admin (`editor`), Siswa (`siswa`), Viewer (`viewer`) |
| **Admin** | `editor` | **Hanya** Siswa (`siswa`) |
| Siswa / Viewer / publik | — | Tidak ada sign-up |

- Google OAuth & password login **OK** untuk user yang sudah diundang / dibuat.
- Bootstrap Super Admin pertama (atau recovery):
  ```bash
  node --env-file=.env.local scripts/bootstrap-super-admin.mjs diegocole234@gmail.com
  ```
  Script meng-set `publicMetadata.role = "admin"` jika user sudah ada, atau mengirim undangan Clerk dengan role `admin` jika belum. Alternatif: Clerk Dashboard → User → Public metadata `{ "role": "admin" }`.
- API `POST|PATCH /api/v1/users`: Super Admin boleh assign `admin`; Admin hanya `siswa`. Super Admin terakhir tidak dapat diturunkan/dihapus.
- Editor tidak dapat mengubah peran diri sendiri atau mengelola akun non-siswa.

### Clerk Dashboard (wajib untuk menutup daftar publik)

1. **Configure → Restrictions** (atau *User & authentication → Restrictions*)
   - Disable **Sign-up** / public registrations (atau set *Allowlist* / *Invitations only*).
2. **Configure → SSO connections → Google**
   - Enable Google for **sign-in**. Prefer blocking new accounts via OAuth if the
     dashboard offers “sign in only” / disable “sign up with Google”.
3. Invitations: CMS memakai Clerk Backend `invitations.createInvitation`
   (`notify: true`, `redirectUrl` = `CMS_ORIGIN/sign-in`, `expiresInDays`) bila
   form Pengguna dikirim tanpa password; atau `users.createUser` bila password ≥8
   diisi. Setelah sukses, UI menampilkan **salin tautan** + **Kirim via WhatsApp**
   (deep-link `wa.me`, tanpa Twilio). Kirim ulang = revoke + create undangan baru.
4. **Email delivery checklist (Clerk Dashboard)**
   - Emails / templates: invitation template enabled
   - Production instance (dev emails often delayed or Dashboard-only)
   - Allowed redirect: `https://cms.smkteknovo.sch.id/sign-in`
   - Email address identifier enabled; public sign-up restricted
   - If email lambat: bagikan `invitation.url` lewat salin/WhatsApp; cek spam 1–2 menit

### Google OAuth (wajib untuk tombol Google)

Custom sign-in memakai Future API lewat `useSignInSignal()` (`@clerk/clerk-react/experimental`)
dan `signIn.sso({ strategy: "oauth_google", … })` — **sign-in**, bukan sign-up. Jika tombol Google masih gagal setelah deploy
kode ini, sisa masalah hampir selalu **konfigurasi Clerk + Google Cloud**, bukan UI:

1. **Clerk Dashboard → Configure → SSO connections → Google**
   - Enable Google.
   - Prefer *custom credentials* (bukan Clerk shared/development client) untuk production.
   - Paste **Client ID** + **Client secret** dari Google Cloud (Web application).
2. **Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client (Web)**
   - Authorized JavaScript origins: `https://cms.smkteknovo.sch.id`, `https://clerk.smkteknovo.sch.id`
   - Authorized redirect URIs (Clerk Frontend API):
     - `https://clerk.smkteknovo.sch.id/v1/oauth_callback`
     - (jika masih pakai `.clerk.accounts.dev` di staging) `https://<instance>.clerk.accounts.dev/v1/oauth_callback`
3. **Clerk Dashboard → Domains**
   - **Application / primary app URL:** `https://cms.smkteknovo.sch.id` (bukan `auth.smkteknovo.sch.id` — DNS itu belum ada; FAPI `environment.display_config.home_url` masih bisa menunjuk ke `auth.` sampai diperbaiki di Dashboard).
   - Frontend API CNAME: `clerk.smkteknovo.sch.id` → `frontend-api.clerk.services` (DNS-only / sesuai instruksi Clerk).
   - Accounts Portal CNAME: `accounts.smkteknovo.sch.id` → `accounts.clerk.services`.
   - Allowed redirect URLs include:
     - `https://cms.smkteknovo.sch.id`
     - `https://cms.smkteknovo.sch.id/sso-callback`
     - `https://cms.smkteknovo.sch.id/`
   - **Allowed origins** (CORS untuk FAPI): `https://cms.smkteknovo.sch.id` (+ `http://localhost:5173` / `http://127.0.0.1:5173` untuk `pnpm --filter @teknovo/cms dev`).
4. Error klasik `401 invalid_client` / “OAuth client was not found” = Client ID salah, secret
   mismatch, atau redirect URI di GCP tidak tepat sama dengan `…/v1/oauth_callback` di atas.

App-side paths yang harus ada (sudah di SPA): `/sign-in`, `/sso-callback`, redirect sukses `/`.

### ClerkJS `Failed to fetch` pada `/v1/client/sign_ins`

1. **CSP** — `apps/cms/public/_headers` harus mengizinkan FAPI di `connect-src` / `script-src` / `frame-src` (`https://clerk.smkteknovo.sch.id`, plus `wss://…`, Accounts Portal, Turnstile, telemetry). Redeploy Pages setelah ubah `_headers`.
2. **DNS / SSL** — `dig clerk.smkteknovo.sch.id CNAME` → `frontend-api.clerk.services.`; `curl -I https://clerk.smkteknovo.sch.id/v1/client` → 200.
3. **CORS** — dari browser origin CMS, preflight OPTIONS harus mengembalikan `access-control-allow-origin: https://cms.smkteknovo.sch.id` + `access-control-allow-methods` (cek Allowed origins di Dashboard).
4. **Publishable key** — `VITE_CLERK_PUBLISHABLE_KEY` production harus decode ke `clerk.smkteknovo.sch.id$` (bukan instance `.clerk.accounts.dev` lama).

### Turnstile (password sign-in)

Password login di `SignInForm` menampilkan widget Turnstile dan memverifikasi token ke
Worker siteverify **sebelum** `signIn.password(...)`. Google OAuth **tidak** melewati
Turnstile di sisi form — tombol Google memanggil `signIn.sso()` langsung; bot protection
untuk OAuth tetap di Clerk/Google. Secret Turnstile hanya ada di Worker
`turnstile-siteverify-teknovo-web` (`TURNSTILE_SECRET_KEY`), bukan di Pages env.

### Roles

Role di `user.publicMetadata.role`:

| Metadata | Label UI | Capabilitas utama |
|----------|----------|-------------------|
| `admin` | Super Admin | Semua + moderasi approve + pengaturan + **kelola pengguna** (Super Admin/Admin/Siswa/Viewer) |
| `editor` | Admin | CRUD berita/artikel, lihat moderasi (tanpa approve), **undang Siswa** |
| `siswa` | Siswa | Artikel milik sendiri, kategori, media |
| `viewer` | Viewer | Baca saja (default jika metadata kosong) |

## Pengguna

Halaman `/pengguna` (nav: **Pengguna**, virtual path `/dashboard/pengguna`) — Super Admin
dan Admin (`canManageUsers` / `role === "admin" | "editor"`). UI: `PenggunaPage` →
`PenggunaManager`; API via `fetchCmsUsers` / `createCmsUser` / `updateCmsUser` /
`deleteCmsUser` → `GET|POST|PATCH|DELETE /api/v1/users`.

Tambah akun: email wajib, nama & password opsional (password ≥8 → `users.createUser`
dengan **username otomatis** dari local-part email; kosong → undangan Clerk). Opsi peran
mengikuti aktor (lihat matriks di atas). Ubah peran / hapus: Super Admin penuh (kecuali
diri sendiri); Admin hanya akun Siswa.

### Buat user — penyebab error umum

| Pesan Clerk / API | Artinya | Perbaikan |
|-------------------|---------|-----------|
| `["username"] data doesn't match user requirements…` | Instance Clerk **mewajibkan username**, tapi request lama tidak mengirimnya | Sudah diperbaiki di API (derive username). Pastikan Dashboard → **User & authentication → Username** enabled (required atau optional). |
| `Password has been found in an online data breach…` | Password **login akun baru** ada di Have I Been Pwned | **Bukan** password database/D1. Pakai password unik yang lebih kuat, atau kosongkan field → undangan email. Jangan matikan breach check. |
| Email already exists / Conflict | Email sudah ada di Clerk | Pakai email lain, atau kelola user yang sudah ada. |

Password di form Pengguna **tidak** diisi dari `.env` / secret API — admin mengetik sendiri (atau kosong = invite).

#### Clerk Dashboard (selaras dengan create-user)

1. **User & authentication → Email address** — enabled (required untuk CMS).
2. **User & authentication → Username** — enabled jika ingin username; CMS selalu mengirim username turunan email saat `createUser`. Jika Username **disabled** total, API akan retry tanpa username.
3. **User & authentication → Password** — enabled; biarkan **Breach password protection** ON.
4. Restrictions: sign-up publik tetap ditutup (invite-only).
