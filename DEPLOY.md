# Deploy — teknovo-web

## Verdict (no Workers Paid)

**Do not deploy this app as a full OpenNext Cloudflare Worker on the Free plan.** It will keep failing with **code 10027** (Worker gzip > 3 MiB). Even if size were fixed, Free **10 ms CPU / request** is too low for Next.js SSR + Clerk + CMS APIs.

**Primary path without Workers Paid:** run **Node `next start`** on a **VPS / Docker / homelab**, keep **R2** for public media (S3 API), and replace **D1 Worker bindings** with **D1 HTTP API** or a normal SQL database.

Workers Paid (~$5/mo, 10 MiB gzip) remains the only practical way to stay on Cloudflare Workers with OpenNext. This doc assumes you will **not** take that path.

---

## Why OpenNext + Workers Free is impossible here

| Constraint | Workers Free | This app |
|------------|--------------|----------|
| Worker size (gzip) | **3 MiB** | OpenNext handler typically **~10–16 MiB raw**; gzip routinely **> 3 MiB** → **10027** |
| CPU / request | **10 ms** | Next SSR + Clerk + TipTap/dashboard APIs need far more |
| Bindings | D1 / R2 native | Only available inside Workers/Pages Functions |

Evidence in-repo:

- Build: `pnpm run build:cf` → `.open-next/` (incl. large `server-functions` handler)
- Runtime: `getCloudflareContext()` in `src/lib/d1.ts` and `src/lib/r2.ts`
- Surface: ~65 App Router pages/routes, Clerk middleware, `/dashboard` CMS, `/api/v1/*` on D1

**Aggressive shrink under 3 MiB gzip:** not remotely feasible for this codebase. Minify is already on; `optimizePackageImports` is best-effort. OpenNext’s own minimal example is often ~2 MiB gzip — this app adds Clerk, TipTap, recharts, framer-motion, sanitize-html, and a full marketing site. Do not spend time chasing Free size limits.

**Static export / `output: 'export'`:** blocked by Clerk, dashboard SSR, Route Handlers, D1/R2, middleware.

**Cloudflare Pages + `@cloudflare/next-on-pages`:** deprecated path, Edge-only, **same Worker size limits**. Not a Free escape hatch.

---

## Options for THIS codebase

### 1. Stay on Cloudflare Free (not full OpenNext) — weak fit

| Approach | Pros | Cons |
|----------|------|------|
| Static marketing on Pages/R2 | Cheap, fast CDN | No Clerk CMS, no D1 APIs on same app |
| Split: static site + CMS elsewhere | Keeps marketing on CF Free | Two deploys, auth/CORS, rewrite data layer |
| Tiny Worker (redirect/proxy only) | Fits 3 MiB | Cannot run this Next app |

Only useful as a **partial** split (see option 5), not as “same app on Free Workers.”

### 2. Vercel Hobby (or similar Next host) — good

| Pros | Cons |
|------|------|
| Native Next.js 16 | No `env.DB` / `env.CMS_BUCKET` |
| Clerk works well | Need R2 **S3 API** + D1 **HTTP** or other DB |
| Free Hobby tier | Limits (bandwidth, cold starts, commercial ToS) |

Concrete binding replacements:

- **R2:** use `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_ACCOUNT_ID` (already sketched in `.env.example`) via S3-compatible client; keep `R2_PUBLIC_URL` for reads.
- **D1:** [D1 HTTP API](https://developers.cloudflare.com/api/resources/d1/) with account API token, **or** migrate to Postgres/SQLite/Turso and change `src/lib/d1/*` repos.

### 3. Self-host / VPS / Docker — **recommended**

| Pros | Cons |
|------|------|
| Matches existing homelab notes in `docs/ARSITEKTUR.md` / `docs/API.md` | You operate the host |
| Full Node CPU/memory; no 10027 | Need HTTPS (Caddy/nginx) + process manager |
| Same R2 public CDN can stay on Cloudflare | Same D1/R2 binding rewrite as Vercel |
| One process: `pnpm build && pnpm start` | DNS cutover from Workers custom domains |

This is the cheapest **complete** path if you already have a VPS/homelab, and the least surprising long-term target given the monorepo split.

### 4. Shrink under 3 MiB gzip — **no**

Not a viable plan for this app. See table above.

### 5. Marketing on CF Free + `/dashboard` elsewhere — optional later

| Pros | Cons |
|------|------|
| Public pages stay on CF edge/static | Large refactor (two apps or rewrite proxy) |
| Heavy CMS leaves Free Workers | Duplicate env, Clerk domains, revalidation |

Only worth it after a working Node/Vercel CMS host exists.

---

## Primary recommendation: Node self-host (VPS / Docker / homelab)

Keep Cloudflare for **DNS + R2 public assets**. Move the **Next.js app** off Workers.

### What breaks today (must change)

| Today (Workers) | Without Workers bindings |
|-----------------|---------------------------|
| `env.DB` via `getDb()` | D1 HTTP API **or** Postgres/SQLite + new client |
| `env.CMS_BUCKET` via `getCmsBucket()` | R2 S3 API (`PutObject` / `DeleteObject` / `List`) |
| `getCloudflareContext()` | Remove OpenNext-only context from Node path |
| `wrangler.toml` custom domains | Point `smkteknovo.sch.id` / `www` A/CNAME to VPS (or tunnel) |
| `pnpm build:cf` + `wrangler deploy` | `pnpm build` + `pnpm start` (or Docker) |
| GitHub `deploy.yml` (Wrangler) | Replace with SSH/Docker/Coolify/etc. |

Reads via `R2_PUBLIC_URL` / `publicAssetUrl()` can stay as-is (HTTP CDN).

### Numbered next steps

1. **Provision a host** — small VPS (1–2 GB RAM) or existing homelab Docker; install Node 22 + pnpm (or use a Node 22 image).
2. **Build & run Node** — `pnpm install`, copy `.env.example` → `.env.local`, set Clerk + `NEXT_PUBLIC_APP_URL` to the public URL, then:
   ```bash
   pnpm build
   pnpm start
   ```
3. **Put HTTPS in front** — Caddy/nginx/Traefik reverse-proxy to port 3000; obtain certs for `www.smkteknovo.sch.id` (and apex).
4. **R2 without bindings** — create R2 API tokens; set `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`. Implement S3 upload/list/delete in place of `getCmsBucket()` (today only Workers binding works).
5. **Database without bindings** — pick one:
   - **A (least data move):** call [Cloudflare D1 HTTP API](https://developers.cloudflare.com/api/resources/d1/) from Node with an API token; keep `teknovo-article`.
   - **B (cleaner ops):** migrate schema from `migrations/` to Postgres/SQLite on the VPS; rewrite `src/lib/d1/*` repos.
6. **Clerk** — add the production domain in Clerk Dashboard; keep webhook URL pointing at `https://www…/api/webhook/clerk`.
7. **DNS cutover** — remove reliance on Workers custom domains in `wrangler.toml` for production traffic; point the zone to the VPS (or Cloudflare Tunnel to homelab). Leave R2 custom domain (`r2.ctos.web.id`) unchanged.
8. **Stop CF Workers Builds / OpenNext CI** for this app — or leave it disabled until/unless you upgrade to Workers Paid.
9. **Optional:** set `API_URL` to a separate homelab `api-web` later (`docs/API.md`); not required if `/api/v1/*` stays in this Next process.

### Minimal env delta (Node host)

```bash
NEXT_PUBLIC_APP_URL=https://www.smkteknovo.sch.id
# Clerk — same keys as today
R2_PUBLIC_URL=https://r2.ctos.web.id
R2_BUCKET_NAME=teknovo
R2_ACCOUNT_ID=…
R2_ACCESS_KEY_ID=…          # required once binding is removed
R2_SECRET_ACCESS_KEY=…
# D1 HTTP or new DATABASE_URL — after code adapter exists
REVALIDATE_SECRET=…
```

Until steps 4–5 are coded, `pnpm start` will serve marketing/Clerk UI, but **CMS media upload and D1-backed `/api/v1/*` will error** (`getCloudflareContext` / missing bindings).

---

## If you later accept Workers Paid

1. Upgrade: [Workers plans](https://dash.cloudflare.com/?to=/:account/workers/plans)
2. Workers Builds: Build `pnpm run build:cf`, Deploy `npx wrangler deploy`
3. Keep `wrangler.toml` bindings `DB` + `CMS_BUCKET` and custom domains

That path needs **no** D1/R2 adapter rewrite.

---

## Quick decision tree

```
Must avoid Workers Paid?
├─ Yes → Node self-host (primary) or Vercel Hobby
│         └─ Rewrite D1 + R2 bindings (HTTP/S3 or new DB)
└─ No  → Workers Paid + OpenNext (current wrangler.toml)
```

Do **not** expect Cloudflare Free Workers to host this OpenNext app.
