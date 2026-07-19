# Riwayat keamanan & perbaikan — teknovo-web

Dokumen advisory / Keep-a-Changelog untuk **temuan keamanan, false positive, hardening, dan bug fix** yang berdampak pada keamanan atau keandalan produksi.

| | |
|---|---|
| **Rentang** | 2026-07-18 → 2026-07-19 (era Split Free) |
| **Sumber** | Git history, `CHANGELOG.md`, `DEPLOY.md`, `docs/CLERK.md`, audit internal |
| **CVE** | Tidak ada ID CVE resmi — temuan berlabel internal (`TKN-SEC-*`, `TKN-BUG-*`) |
| **HEAD referensi** | `691ba17` (CHANGELOG) / hardening utama `7784bd3` |

---

## Ringkasan

Setelah monolit OpenNext diganti **Split Free** (Astro + Hono + Vite CMS), tim menjalankan audit keamanan mendalam lalu **rencana remediasi**. Sebagian temuan audit ternyata **false positive** (kontrol sudah ada di `de8696b` / Pages `_headers`). Remediasi nyata terkonsentrasi di `7784bd3` (Svix, Bearer rebuild, DOMPurify, headers API, CORS gate, request ID, retry rebuild, CI `environment: production`).

Secara paralel, beberapa bug produksi berdampak DoS / availability (blank beranda via 429, loop refetch CMS → error **1027**, rate limit Bearer vs publik) diperbaiki di `a1d1f36` … `0d337b7`.

---

## Metodologi

| Lapisan | Arti |
|---------|------|
| **Audit (klaim)** | Temuan dari deep audit / checklist — belum diverifikasi di kode |
| **Verified** | Dikonfirmasi di repo (file, commit, perilaku runtime) |
| **Mitigated** | Diperbaiki atau dikeraskan di commit yang disebut |
| **False positive** | Audit mengklaim celah; verifikasi membuktikan kontrol sudah ada atau skenario tidak valid |
| **Ops residual** | Bukan bug kode; residual risiko operasional / kuota / secret |

Tidak ada inventaris CVE publik. Severity mengikuti skala internal: **Critical / High / Medium / Low / Info**.

---

## Temuan keamanan

| ID | Temuan | Severity | Status | Catatan / commit |
|----|--------|----------|--------|------------------|
| TKN-SEC-01 | Webhook Clerk tanpa verifikasi Svix | High | **Mitigated** | `verifySvixSignature` + `CLERK_WEBHOOK_SECRET` — `7784bd3` |
| TKN-SEC-02 | Hook rebuild web bisa dipicu tanpa Bearer secret | High | **Mitigated** | `POST /api/v1/hooks/rebuild-web` hanya `Authorization: Bearer <REBUILD_WEB_SECRET>` — `7784bd3` |
| TKN-SEC-03 | HTML TipTap (XSS stored) kurang ketat | High | **Mitigated** | `isomorphic-dompurify` allowlist pada write berita/artikel — `7784bd3` (fondasi sanitizer `de8696b`) |
| TKN-SEC-04 | API Worker tanpa security headers | Medium | **Mitigated** | `securityHeadersMiddleware` (nosniff, frame deny, CSP `default-src 'none'`) — `7784bd3` |
| TKN-SEC-05 | CORS localhost terbuka di production | Medium | **Mitigated** | Localhost hanya jika `ENVIRONMENT=development`; prod = `CMS_ORIGIN` + `WEB_ORIGIN` — `7784bd3` |
| TKN-SEC-06 | Editor dapat publish artikel langsung (bypass moderasi) | Medium | **Mitigated** | Hanya `admin` yang boleh set `PUBLISHED`; editor lewat REVIEW/approve — `7784bd3` |
| TKN-SEC-07 | Kurang korelasi log / tracing request | Low | **Mitigated** | `X-Request-Id` + structured logs — `7784bd3` |
| TKN-SEC-08 | Rebuild GitHub gagal sekali tanpa retry | Low | **Mitigated** | Retry di `triggerWebRebuild` — `7784bd3` |
| TKN-SEC-09 | Deploy CI tanpa GitHub Environment gate | Medium | **Mitigated** | Workflows memakai `environment: production` — `7784bd3` |
| TKN-SEC-10 | “Tidak ada rate limiting” | Medium | **False positive** | Rate limit per-IP sudah ada sejak `de8696b`; diperhalus Bearer vs public di `a1d1f36` |
| TKN-SEC-11 | “Pages tanpa CSP / HSTS” | Medium | **False positive** | `apps/web/public/_headers` & `apps/cms/public/_headers` sudah CSP + HSTS sejak hardening awal (`de8696b`) |
| TKN-SEC-12 | “Editor bisa escalate jadi admin” | High | **False positive** | Role matrix + invite-only Clerk; tidak ada jalur self-promote editor→admin di API |
| TKN-SEC-13 | “Tidak ada health endpoint” | Info | **False positive** | `GET /api/health` sudah ada di Worker |
| TKN-SEC-14 | Bot / spam login password | Medium | **Mitigated** (parsial) | Turnstile di form password CMS — `de8696b`; OAuth tetap dilindungi Clerk/Google |
| TKN-SEC-15 | Mock berita stale di path publik | Medium | **Mitigated** | Fallback mock dihapus; cover memakai placeholder 404 — `d43aa18`, `02c9baa` |

---

## Riwayat bug fix penting

Bug di bawah ini **bukan advisory CVE**, tetapi berdampak keamanan (DoS kuota), integritas konten, atau auth UX.

| ID | Masalah | Dampak | Status | Commit |
|----|---------|--------|--------|--------|
| TKN-BUG-01 | Async ekskul di dalam island `client:load` → fetch loop → **429** → island suspend | Blank beranda / dead UI (nav motion mati) | Fixed | `3d5399b` (juga nesting island `a1d1f36`) |
| TKN-BUG-02 | `getToken` Clerk di deps `useEffect` → infinite refetch CMS | Habis kuota Workers Free **100k/hari** → Cloudflare **1027** | Fixed | `0d337b7` |
| TKN-BUG-03 | Rate limit GET sama untuk anonim & Bearer CMS | Dashboard & publik saling “makan” kuota; false 429 | Fixed | `a1d1f36` (bucket terpisah; ceiling Bearer lebih tinggi) |
| TKN-BUG-04 | Mock berita / cover rusak di home | Konten palsu / icon browser flash (integritas & UX) | Fixed | `d43aa18`, `02c9baa` |
| TKN-BUG-05 | Deploy CMS `dist` tanpa `VITE_CLERK_PUBLISHABLE_KEY` | Auth CMS mati (“belum dikonfigurasi”) | Documented / process | Catatan di `DEPLOY.md`; CI `deploy-cms.yml` |
| TKN-BUG-06 | Alur invite email/WhatsApp & accept invitation | Akses staff / onboarding role | Shipped | `90ed1b6`, `d43aa18` (+ MFA verify `ea9923d`) |
| TKN-BUG-07 | Flicker navbar SSR pathname; Lenis vs dropdown / VT | UX; bukan celah auth | Fixed | `14b2cbb`, polish `7784bd3` |
| TKN-BUG-08 | Hero blank setelah hidrasi island (LazyMotion / opacity) | Availability beranda | Fixed | `de8696b` |

---

## Hardening yang sudah diterapkan

### API Worker (`apps/api`) — terutama `7784bd3`, fondasi `de8696b`

- **Svix** — verifikasi signature webhook Clerk (`svix-id` / timestamp / signature).
- **Rebuild** — Bearer-only + secret min. 16 karakter; retry dispatch GitHub.
- **Sanitize** — `isomorphic-dompurify` allowlist pada write konten TipTap.
- **Headers** — nosniff, `X-Frame-Options: DENY`, CSP ketat untuk JSON API.
- **CORS** — gate localhost berdasarkan `ENVIRONMENT`.
- **Rate limits** — sliding window per isolate / `CF-Connecting-IP` (hooks, media, public GET, CMS Bearer GET/write).
- **Observability** — `requestIdMiddleware`, logger terstruktur.
- **Artikel** — editor tidak boleh set `PUBLISHED` langsung.

### Pages (Astro + CMS)

- `public/_headers`: CSP, HSTS (`max-age=31536000; includeSubDomains; preload`), frame deny, Permissions-Policy.
- Turnstile pada password sign-in CMS (siteverify di Worker terpisah).

### CI / secrets

- Workflows `deploy-api`, `deploy-cms`, `rebuild-web` → `environment: production`.
- Secrets: `CLERK_*`, `GITHUB_REBUILD_TOKEN`, `REBUILD_WEB_SECRET`, `VITE_CLERK_PUBLISHABLE_KEY` (lihat `DEPLOY.md`).

### Auth / roles

- Invite-only CMS roles (`90ed1b6`); MFA verify flow (`ea9923d`).
- Dokumentasi Clerk: `docs/CLERK.md`.

---

## Risiko residual / follow-up ops

| Area | Risiko | Tindak lanjut |
|------|--------|----------------|
| **Workers Free kuota** | 100k req/hari → **1027** jika client looping atau scrape agresif | Monitor Metrics; hindari refetch loop; pertimbangkan **Workers Paid** jika traffic naik |
| **Rate limit isolate-local** | Counter reset cold start; bukan cluster-global | Cukup untuk Free; Paid / Durable Object / gateway jika perlu global |
| **Cache purge token** | Purge edge cache Pages setelah publish masih manual / bergantung rebuild Astro | Opsional: token purge Cloudflare bila butuh invalidasi instan tanpa full rebuild |
| **GitHub secrets & Environment** | PAT rebuild + API token berdaya tinggi | Pastikan Environment `production` + reviewers; rotate PAT berkala |
| **`GITHUB_REBUILD_TOKEN` unset** | Publish menulis D1 tapi situs publik tidak rebuild (silent) | Verifikasi `wrangler secret list`; jalankan `rebuild-web.yml` manual jika perlu |
| **Unpublish / arsip TEST berita** | Konten uji masih bisa tampil di build publik jika status `PUBLISHED` | Audit D1: unpublish/arsip artikel & berita TEST sebelum go-live konten |
| **Clerk webhook ack-only** | Signature verified tetapi belum sync produk penuh | Implement sync user/role bila dibutuhkan |
| **OpenNext monolit** | Deploy ke Free → **10027** (3 MiB) | Jangan deploy; tetap Split Free (`DEPLOY.md`) |

---

## Timeline singkat (hash penting)

| Hash | Tanggal | Makna keamanan / reliability |
|------|---------|------------------------------|
| `de8696b` | 2026-07-19 | Hardening awal: Turnstile, Pages CSP/HSTS, rate limits, sanitizer dasar |
| `90ed1b6` | 2026-07-19 | Invite-only roles, path Clerk hardening |
| `ea9923d` | 2026-07-19 | MFA verify CMS |
| `7784bd3` | 2026-07-19 | Hardening API lanjutan (Svix, Bearer rebuild, DOMPurify, headers, CORS, request ID, CI env) |
| `d43aa18` | 2026-07-19 | Invite polish; hapus mock berita stale |
| `14b2cbb` | 2026-07-19 | Navbar flicker / Lenis |
| `a1d1f36` | 2026-07-19 | Blank beranda nesting; naikkan & pisah rate limit Bearer |
| `02c9baa` | 2026-07-19 | Cover berita placeholder load/error |
| `3d5399b` | 2026-07-19 | Preload ekskul; hentikan fetch async di island (anti-429) |
| `0d337b7` | 2026-07-19 | Stop infinite refetch CMS (anti-1027) |
| `691ba17` | 2026-07-19 | CHANGELOG proyek (referensi histori) |

---

## Referensi

- [`CHANGELOG.md`](../CHANGELOG.md) — riwayat fitur & keamanan per era
- [`DEPLOY.md`](../DEPLOY.md) — secrets, rate limits, CSP Pages, kuota Free / 1027
- [`docs/CLERK.md`](./CLERK.md) — domain Clerk, webhook, CORS FAPI
- [`apps/api/README.md`](../apps/api/README.md) — health, local CORS
- [`apps/cms/README.md`](../apps/cms/README.md) — Turnstile, CSP CMS
- Kode kunci: `apps/api/src/lib/svix-verify.ts`, `sanitize-html.ts`, `rebuild-web.ts`, `middleware/rate-limit.ts`, `middleware/security-headers.ts`

---

## Cara menambah entri baru

1. Verifikasi di kode / commit — jangan tulis CVE palsu.
2. Tambah baris di tabel **Temuan** atau **Bug fix** dengan ID `TKN-SEC-*` / `TKN-BUG-*`.
3. Tautkan hash commit; update **Timeline** jika milestone.
4. Jika audit klaim ulang kontrol yang sudah ada, tandai **False positive** dan jelaskan bukti.

_Dokumen ini dibuat 2026-07-19. Perbarui saat ada remediasi atau temuan verified baru._
