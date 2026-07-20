# Changelog

Semua perubahan penting pada [teknovo-web](https://github.com/) dicatat di sini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
dan proyek ini memakai [Semantic Versioning](https://semver.org/) secara informal
(era arsitektur + tanggal, belum ada tag release semver resmi).

Rentang: **2026-07-18** → **2026-07-19** (`4587528` … `0d337b7`).

---

## [Unreleased]

### Added — API route dual-runtime (PRP Fase 4)

- Thin data adapters (`apps/api/src/lib/data/*`): `hasPrisma(env)` → Prisma repos; else D1. Media: `hasMinio(env)` → MinIO S3 SDK; else R2.
- Shared `mountApiRoutes` — Node `server.ts` mounts the same `/api/v1/*`, `/api/cms/media`, `/api/webhook` as Worker.
- `scheduleBackground` for rebuild hooks (Worker `waitUntil` / Node fire-and-forget); Clerk auth accepts Node bindings.
- Smoke: `pnpm --filter @teknovo/api smoke:node` (health + kategori/berita list + MinIO put/list/delete + auth 401). Unit: `runtime.test.ts`.
- Production remains Worker + D1 + R2 until Fase 8 Tunnel cutover.

### Added — API Prisma repos (PRP Fase 3)

- Prisma repository layer mirroring D1 (`apps/api/src/lib/prisma/*`): kategori, berita, artikel, fasilitas, ekstrakurikuler, prestasi, site-media, pengaturan, analytics; users stub (Clerk until Platform DB).
- Barrel `lib/prisma/index.ts`; smoke script `pnpm --filter @teknovo/api prisma:smoke`; map-helper unit tests.
- Worker D1 repos untouched; Node content route cutover deferred to Fase 4.

### Added — API Node foundation (PRP Fase 1–2)

- Dual-runtime API foundation for VPS path (Express + Hono + Prisma + MinIO) **without** removing Worker + D1 + R2 production.
- `docker-compose.yml`: PostgreSQL (`127.0.0.1:5434`) + MinIO (`9010`/`9011`).
- Prisma schema + migration `init_tenant_content` mirroring D1 tables; seed kategori + pengaturan.
- MinIO helpers (`putObject` / `getObject` / `deleteObject` / `listObjects` / `objectUrl`) + bucket ensure script.
- Node entry `apps/api/src/server.ts`: CORS from env, 8MB JSON, request-id access logs, security headers (incl. HSTS in prod), in-memory rate limits + `trust proxy`, Hono/`Express` error handlers, graceful shutdown, `GET /api/health` checks Prisma + MinIO.
- PM2 `ecosystem.config.cjs`; scripts `dev:node`, `prisma:*`, `minio:ensure-bucket`.

### Fix — publik ekskul/prestasi/fasilitas tanpa mock

- `getEkskulPublikCards` / prestasi / fasilitas: API kosong, gagal, atau 429 → `[]` (bukan inventori mock).
- Astro preload data di build untuk hub kesiswaan (pola berita); hero stats dari data nyata.
- Hub fasilitas: empty state jika belum ada baris `PUBLISHED` di D1.

### Performance — D1 list indexes

- Migration `0004_perf_indexes.sql`: composite indexes + `sort_at` on berita/artikel; site-content `(status, sort_order)` indexes.
- List repos ORDER BY indexed `sort_at` (not `COALESCE`); optional `?includeTotal=0`; analytics uses `GROUP BY status`.

---

## [2026-07-19] — Split Free, Astro publik, CMS Vite, API Hono

Milestone utama: meninggalkan monolit OpenNext di Workers Free, memecah deploy
menjadi tiga host, lalu memoles UX publik, auth/CMS, dan keamanan.

### Deploy & dokumentasi — Split Free

- Dokumentasikan jalur Free-tier ketika Workers Paid ditolak (`6d765a0`).
- **Split deploy Free**: apex Astro + `cf.` API Hono + `cms.` Vite (`cfb5161`).
  - `smkteknovo.sch.id` → `apps/web` (Pages)
  - `cf.smkteknovo.sch.id` → `apps/api` (Worker + D1/R2)
  - `cms.smkteknovo.sch.id` → `apps/cms` (Pages)
- Hentikan tracking `node_modules` / cache Astro–Vite di workspace (`cf98bf6`, `8c51718`).
- Konfigurasi produksi Pages apex untuk `smkteknovo.sch.id` (`dd19d59`).
- Dokumentasikan `VITE_API_URL` dengan path `/api` dan alur rebuild (`de4e66d`).
- Dokumentasikan `wrangler d1 migrate remote` untuk D1 produksi (`2c7b9f9`).

### Situs publik (Astro) — port UI & UX

- Port penuh landing Next ke `apps/web` Astro dengan shim `next/*` (`f91c6b1`).
- Navbar publik tiga-tier + container 1280px; parity UI dashboard CMS (`2f34369`).
- Overlay hero nav, site search, spacing section (`8159f2b`).
- Favicon TEKNOVO lokal, four-band sections, Lenis smooth scroll (`f77f5ef`).
- CardNav + ClickSpark di beranda; login marketing mengarah ke CMS (`3b4dfd3`, `27d185b`).
- Perbaikan CWV: defer hero video / RAF, preload, hamburger tablet (`98876fa`).
- Perbaikan hero blank setelah hidrasi island Astro + fotografi LCP WebP (`de8696b`).
- View Transitions + mikro-interaksi nav / Lenis / ClickSpark (`90ed1b6`).
- Perbaikan flicker navbar pada hidrasi; Lenis tidak mengganggu dropdown (`14b2cbb`).
- Polish navigasi publik + SEO artikel + layout 404 (`7784bd3`).
- Perbaikan blank beranda: jangan nest island di bawah `PublicChrome` (`a1d1f36`).
- Cover berita di home dengan placeholder load/error (`02c9baa`).
- Perbaikan blank beranda: preload ekskul di build Astro, hindari fetch async di island (`3d5399b`).

### CMS — fitur, auth, peran

- Manajemen pengguna Super Admin + halaman auth CMS (`3b4dfd3`).
- Shell CMS: navbar tetap + sidenav collapsible; chrome tiga-tier (`27d185b`).
- Invite-only roles (termasuk peer admin), hardening path Clerk (`90ed1b6`).
- Alur verifikasi MFA CMS; normalisasi base URL API (`ea9923d`).
- Refresh UI auth (reset password, layout bersama, modal sukses) (`de4e66d`).
- Perbaikan login Clerk `@clerk/react` v6 + API site-content
  (fasilitas / ekskul / prestasi / media) (`1c626c0`).
- Regroup sidebar: Konten / Profil sekolah (`2c7b9f9`).
- Polish invite, notifikasi, halaman bantuan/dokumentasi (`d43aa18`).
- Perbaikan create-route SPA (`/…/baru`), login “Kembali ke situs”, naikkan rate limit Bearer (`a1d1f36`).
- Stabilkan `getToken` Clerk agar tidak infinite-refetch (kuota Workers Free) (`0d337b7`).

### Keamanan & API

- Hardening awal: Turnstile, CSP headers, rate limits (`de8696b`).
- Hardening lanjutan: verifikasi webhook Svix, rebuild Bearer + retry,
  DOMPurify, security headers/CORS, request ID + structured logs (`7784bd3`).
- Fallback berita publik tanpa mock stale; harden cover media (`d43aa18`).

---

## [2026-07-19] — CMS P3, D1, R2 cutover, batas OpenNext Free

Era monolit Next/OpenNext masih aktif; fokus CMS backend, D1, dan dokumentasi
batas Workers Free (error 10027).

### CMS & konten

- CMS P3: pengaturan, field SEO berita, dashboard analytics (`baf9129`).
- CMS ke Cloudflare D1 `teknovo-article` (bukan API eksternal): binding, migrasi,
  repo, `/api/v1` untuk berita/artikel/kategori/pengaturan/analytics; media tetap R2 (`f4aee78`).

### Infrastruktur & docs (pre-split)

- Skrip migrasi R2 public-CDN untuk cutover akun (`4089e7b`).
- Dokumentasi account id R2 + catatan migrasi di `.env.example` (`8131288`).
- Workers Builds harus memakai `build:cf` agar `.open-next` tersedia (`75b8466`).
- Docs: Workers Paid wajib + custom domain di wrangler (batas 3 MiB Free → 10027) (`6e2edee`).
- Docs: jalur alternatif Free / VPS ketika Paid ditolak (`6d765a0`) — dilanjutkan
  dengan split deploy di era berikutnya.

---

## [2026-07-18] — Bootstrap monolit Next + OpenNext + CMS awal

Proyek dimulai sebagai aplikasi Next.js standalone di Cloudflare (OpenNext),
dengan CMS Clerk dan landing marketing Atlas.

### Inisialisasi & scaffold

- Initial commit Create Next App (`4587528`).
- Scaffold SMK Teknovo: Cloudflare web + Clerk CMS, OpenNext adapter (`d222942`).
- Binding R2 CMS + migrasi middleware ke `proxy.ts` (`bd63926`).
- Migrasi penuh frontend publik monorepo ke standalone Cloudflare (`e0825f0`).
- Perbaikan CI typecheck binding `CMS_BUCKET` + wrangler typegen (`6398353`).
- Revert auth boundary ke Edge `middleware.ts` (OpenNext menolak `proxy.ts`) (`91ef669`).

### Landing publik & media

- Media landing dari R2; SEO publik tersentral (RSS / llms / JSON-LD) (`46568bc`).
- Sign-in kustom + Google SSO selalu tampil; landing & halaman 404/500 branded (`872e686`).
- Restore token warna Atlas setelah refactor marketing (`d840241`).
- Blueprint heroes, restyle profil, feed akademik featured (`3094d79`).
- Hapus panel mega-menu kontak yang stale (`51c6ac4`).

### CMS P1–P2 (masih monolit)

- CRUD berita sekolah + TipTap + fallback API (`9e9b6d8`).
- CMS P1: media library, CRUD kategori, role gates admin|editor|viewer (`c1bdd8f`).
- CMS P2: artikel siswa, antrian moderasi, role siswa (`0e3cb76`).

---

## Catatan organisasi

| Era | Tanggal | Tema |
|-----|---------|------|
| Bootstrap monolit | 2026-07-18 | Next + OpenNext + Clerk CMS + landing Atlas |
| D1 / R2 / Free limits | 2026-07-19 (awal) | Backend D1, cutover R2, dokumentasi batas Free |
| Split Free + polish | 2026-07-19 | `apps/web` Astro, `apps/cms` Vite, `apps/api` Hono; UX, auth, security |

Hash milestone yang sering dirujuk:

| Hash | Makna |
|------|--------|
| `4587528` | Commit pertama |
| `d222942` | Scaffold Teknovo Cloudflare |
| `cfb5161` | Split deploy Free (Astro / Hono / Vite) |
| `f91c6b1` | Port UI landing ke Astro |
| `de8696b` | Perbaikan hero blank + hardening keamanan |
| `7784bd3` | Hardening API keamanan lanjutan |
| `0d337b7` | HEAD — perbaikan infinite refetch CMS |

---

[Unreleased]: #unreleased
[2026-07-19]: #2026-07-19--split-free-astro-publik-cms-vite-api-hono
[2026-07-18]: #2026-07-18--bootstrap-monolit-next--opennext--cms-awal
