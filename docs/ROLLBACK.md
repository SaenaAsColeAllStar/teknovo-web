# Rollback runbook — Node Tunnel (`api.`) → Worker (`cf.`)

**Goal:** Restore production CMS + public web to the Free Worker stack (`cf.smkteknovo.sch.id` + D1 + R2) when the VPS Node path (`cms-api.smkteknovo.sch.id` + Postgres + MinIO via Cloudflare Tunnel) fails after cutover — or when a bad deploy / migrate / platform flag needs an immediate undo.

**Companion:** Forward cutover is [`CUTOVER-API-TUNNEL.md`](CUTOVER-API-TUNNEL.md). Deploy overview: [`../DEPLOY.md`](../DEPLOY.md).

**Invariant:** Keep Worker `teknovo-cms-api` deployed and D1 + R2 intact until the Node path is proven stable. Do **not** delete D1 databases, R2 buckets, or the Worker custom domain as part of cutover.

---

## Decision tree (pick one path)

| Severity | Symptom | Path |
|----------|---------|------|
| **R0 — Soft** | Node process crash / bad deploy; Tunnel + Postgres OK | [§1 Soft API](#1-soft-api--pm2--git-on-vps) — stay on `api.` |
| **R1 — Client** | MinIO / Postgres / Tunnel broken after cutover; clients on `api.` | [§2 Full client rollback](#2-full-client-rollback--apito-cf) |
| **R2 — Data** | D1→PG migrate wrong / incomplete; production still on `cf.` **or** after failed cutover | [§3 Data plane](#3-data-plane--postgresminio-vs-d1r2) |
| **R3 — Tunnel only** | `api.` unreachable; clients still on `cf.` (parallel phase) | [§4 Tunnel / DNS](#4-tunnel--dns--disable-or-emergency-origin) — fix Tunnel; no client flip |
| **R4 — Platform** | SaaS / multi-tenant misbehaving | [§5 Platform SaaS flag off](#5-platform-saas-flag-off) |
| **R5 — Nuclear** | Unknown failure; need known-good Worker ASAP | [§2](#2-full-client-rollback--apito-cf) then [§6 Worker redeploy](#6-worker-redeploy-nuclear) |

Printable checklist: `bash scripts/ops/rollback-checklist.sh` (see §8).

---

## Target URLs (copy/paste)

| Role | Production Worker (`cf.`) | Node Tunnel (`api.`) |
|------|---------------------------|----------------------|
| CMS Pages env | `VITE_API_URL=https://cf.smkteknovo.sch.id/api` | `VITE_API_URL=https://cms-api.smkteknovo.sch.id/api` |
| Web Pages env | `PUBLIC_API_URL=https://cf.smkteknovo.sch.id` | `PUBLIC_API_URL=https://cms-api.smkteknovo.sch.id` |
| Health (CI var) | unset → default `https://cf.smkteknovo.sch.id/api/health` | `HEALTH_CHECK_URL=https://cms-api.smkteknovo.sch.id/api/health` |
| Clerk webhook | `https://cf.smkteknovo.sch.id/api/webhook/clerk` | `https://cms-api.smkteknovo.sch.id/api/webhook/clerk` |
| Rebuild hook | `https://cf.smkteknovo.sch.id/api/v1/hooks/rebuild-web` | same path on `cms-api.` |

CMS env must include `/api`. Web env is **host only** (no `/api` suffix).

---

## 1. Soft API — PM2 / git on VPS

Use when clients already (or still) talk to `api.` and the issue is process/code, not data/DNS.

```bash
# On VPS
cd /www/wwwroot/teknovo-web   # or $VPS_PATH
bash scripts/ops/pm2-restart.sh
# or:
pnpm --filter @teknovo/api pm2:restart
pm2 logs teknovo-api --lines 100
curl -sS http://127.0.0.1:8788/api/health
curl -sS https://cms-api.smkteknovo.sch.id/api/health
```

Bad deploy via `deploy-api-vps.yml`:

1. Identify last good commit (`git log` on VPS or GitHub).
2. `git fetch && git checkout <good-sha>` on the VPS monorepo path (or re-run VPS deploy workflow against that ref).
3. `pnpm install --frozen-lockfile` if deps changed; `bash scripts/ops/pm2-restart.sh`.
4. Confirm health JSON includes `"ok":true` and Node runtime checks.

If health stays red → escalate to **§2**.

---

## 2. Full client rollback — `api.` → `cf.`

Do during a quiet window. **Order matters:** restore clients before relying on Node again. Keep Tunnel/PM2 running for offline debugging.

### 2.1 Freeze writes (recommended)

- Ask editors to pause CMS publishes for ~5–10 minutes, **or**
- Accept that CMS writes after freeze may exist only on Postgres/MinIO and will **not** appear on D1/R2 until a reverse migrate (out of scope; prefer freeze).

### 2.2 CMS Pages → Worker

Cloudflare Pages → project `teknovo-cms` → Settings → Environment variables (Production + Preview):

```text
VITE_API_URL=https://cf.smkteknovo.sch.id/api
```

Rebuild + redeploy (GitHub `deploy-cms.yml`, Pages rebuild, or local build **with** the env baked in — Vite inlines at build time).

### 2.3 Web Pages → Worker

Pages project `teknovo-web`:

```text
PUBLIC_API_URL=https://cf.smkteknovo.sch.id
```

Trigger Astro rebuild (`rebuild-web` / `deploy-web` / push). Confirm public lists load from D1.

### 2.4 Health check / CI

GitHub → Settings → Variables (repo or `production` environment):

- Set `HEALTH_CHECK_URL=https://cf.smkteknovo.sch.id/api/health`, **or**
- **Delete / unset** `HEALTH_CHECK_URL` so `health-check.yml` uses its default `cf.` URL.

Optional: disable auto VPS deploys while unstable:

```text
ENABLE_VPS_DEPLOY=false   # repo/environment variable
```

Keep `CLOUDFLARE_*` secrets — Worker deploys must keep working.

### 2.5 Clerk webhook

Clerk Dashboard → Webhooks → endpoint URL:

```text
https://cf.smkteknovo.sch.id/api/webhook/clerk
```

Signing secret stays the same Worker `CLERK_WEBHOOK_SECRET` (Svix). Send a test event; expect **2xx**. Node may keep the same secret in `apps/api/.env` for later re-cutover — no need to rotate unless compromised.

### 2.6 Smoke (must pass)

```bash
curl -sS https://cf.smkteknovo.sch.id/api/health
curl -sS https://cf.smkteknovo.sch.id/api/v1/kategori
# CMS: login, list berita, open media (R2 URLs)
# Web: published berita/artikel pages render
```

Optional: run `bash scripts/ops/rollback-checklist.sh --verify-cf`.

### 2.7 Leave VPS alone

- Do **not** delete Tunnel, DNS CNAME `api`, Postgres, MinIO, or PM2.
- Fix offline; re-enter [`CUTOVER-API-TUNNEL.md`](CUTOVER-API-TUNNEL.md) Phase B when ready.

---

## 3. Data plane — Postgres/MinIO vs D1/R2

### 3.1 Before cutover (production still on `cf.`)

| Situation | Action |
|-----------|--------|
| Migrate dry-run / execute looks wrong | **Ignore Postgres.** Fix script; re-run `migrate:d1-to-pg:dry` then `--execute`. D1+R2 remain SoT. |
| MinIO seed incomplete | Re-run `minio:ensure-bucket` / `minio:seed`; Worker still serves R2. |
| Accidental PG truncate | Restore from `backup-pg.sh` dump if any; else re-migrate from D1. |

**Never** wipe D1 or R2 to “match” a broken PG import.

### 3.2 After cutover (clients on `api.`)

| Situation | Action |
|-----------|--------|
| PG/MinIO unhealthy | **§2 full client rollback** first (clients → `cf.` / D1 / R2). |
| Content written only on Node after cutover | Those rows live in Postgres/MinIO only. After §2 they disappear from CMS until re-migrated or manually recreated. Prefer short freeze windows. |
| Need Node again later | Final delta: `pnpm --filter @teknovo/api migrate:d1-to-pg -- --remote` (idempotent upserts) before Phase B again. |

### 3.3 MinIO connection failure (stay on Node temporarily)

If cutover already happened and MinIO flaps but API process is up:

1. Prefer restore MinIO / disk / credentials — not a long-term in-memory buffer in production.
2. PRP soft fallback (dev/emergency): uploads buffered in API memory — **not** durable; use only to unblock one operator action, then §2 if MinIO stays down.
3. Public media on Web may 404 for MinIO URLs; after §2, R2 URLs from D1 `site_media` work again.

### 3.4 Backups (VPS)

```bash
bash scripts/ops/backup-pg.sh      # before risky migrate/rollback experiments
bash scripts/ops/backup-minio.sh
```

---

## 4. Tunnel / DNS — disable or emergency origin

### 4.1 Clients still on `cf.` (Phase A parallel)

Tunnel down is **non-urgent**. Restart cloudflared / recreate route per `ops/cloudflared/README.md`. No CMS/Web env change.

```bash
# Typical on VPS (adjust unit name)
sudo systemctl restart cloudflared
# or: cloudflared tunnel run teknovo-api
curl -sS https://cms-api.smkteknovo.sch.id/api/health
```

### 4.2 Clients already on `api.`

1. Prefer fix Tunnel (above).
2. If Tunnel cannot recover quickly → **§2** (clients → `cf.`).
3. **Emergency origin (last resort, PRP):** temporarily publish Node on a firewall-restricted port (Cloudflare IP ranges only) **or** aaPanel reverse proxy — then still aim to restore Tunnel. Do **not** leave the API world-open.

### 4.3 Disabling Tunnel / DNS (optional after stable rollback)

Only after §2 smoke is green and you want to stop accidental use of `api.`:

1. Cloudflare Zero Trust → Tunnels → pause/stop `teknovo-api`, **or** remove public hostname `cms-api.smkteknovo.sch.id`.
2. Optionally delete DNS CNAME `api` (can recreate later).
3. Optional: `pm2 stop teknovo-api` (keeps code on disk).

Do **not** remove Worker domain `cf.` or Pages custom domains.

---

## 5. Platform SaaS flag off

Platform control plane is Node-only and **off by default**. If enabled in production and misbehaving:

**VPS `apps/api/.env`:**

```bash
PLATFORM_ENABLED=false
# optional: comment REDIS_URL / PLATFORM_DATABASE_URL if unused
```

```bash
bash scripts/ops/pm2-restart.sh
curl -sS https://cms-api.smkteknovo.sch.id/api/platform/status   # expect disabled / flag off
```

**CMS Pages:** unset or set `VITE_PLATFORM_ENABLED` empty/false → rebuild CMS (hides `/platform` nav).

School content routes and Worker Free path are independent of this flag. Platform DB `teknovo_platform` can remain; no need to drop it for rollback.

---

## 6. Worker redeploy (nuclear)

If `cf.` itself returns errors (bad Worker deploy), restore Worker code — independent of Tunnel:

```bash
# From laptop with CLOUDFLARE_* credentials (or GitHub deploy-api.yml)
cd apps/api
npx wrangler deploy
# Confirm custom domain cf.smkteknovo.sch.id still attached
curl -sS https://cf.smkteknovo.sch.id/api/health
```

D1 migrations: only re-apply if schema drift caused the outage; prefer known-good Worker commit first. R2 bindings unchanged.

Then ensure CMS/Web env still point at `cf.` (§2.2–2.3).

---

## 7. Health checks & CI secrets matrix

| Knob | During Node cutover | After rollback to Worker |
|------|---------------------|--------------------------|
| `vars.HEALTH_CHECK_URL` | `https://cms-api.smkteknovo.sch.id/api/health` | unset or `https://cf.smkteknovo.sch.id/api/health` |
| `vars.ENABLE_VPS_DEPLOY` | `true` only when stable | `false` while debugging VPS |
| `secrets.CLOUDFLARE_*` | keep | **keep** (Worker deploys) |
| `secrets.VPS_*` | keep | keep (no need to delete) |
| `deploy-api.yml` | keep enabled | primary API deploy path |
| `deploy-api-vps.yml` | optional | pause auto; `workflow_dispatch` OK |
| Clerk webhook URL | `api.…/api/webhook/clerk` | `cf.…/api/webhook/clerk` |

Manual health probe:

```bash
gh workflow run health-check.yml -f url=https://cf.smkteknovo.sch.id/api/health
```

---

## 8. Operator checklist script

```bash
# Print ordered steps (no side effects)
bash scripts/ops/rollback-checklist.sh

# Also curl Worker + optional Tunnel health
bash scripts/ops/rollback-checklist.sh --verify-cf
bash scripts/ops/rollback-checklist.sh --verify-cf --verify-api
```

The script does **not** change Pages env, Clerk, or DNS — those stay manual in dashboards.

---

## 9. Post-rollback review

- [ ] CMS + Web smoke on `cf.` passed
- [ ] Clerk webhook test event → Worker 2xx
- [ ] `health-check.yml` green against `cf.`
- [ ] Root cause noted (PM2, migrate, MinIO, Tunnel, platform flag, bad commit)
- [ ] VPS backups still scheduled (`backup-pg.sh` / `backup-minio.sh`) if Node will return
- [ ] Re-cutover only via [`CUTOVER-API-TUNNEL.md`](CUTOVER-API-TUNNEL.md) Phase A→B after fix

---

## Related

- [`CUTOVER-API-TUNNEL.md`](CUTOVER-API-TUNNEL.md) — forward cutover + short Phase C
- [`CLERK.md`](CLERK.md) — webhook + Svix
- [`../DEPLOY.md`](../DEPLOY.md) — env vars, secrets, Zero Trust
- [`../ops/cloudflared/README.md`](../ops/cloudflared/README.md) — Tunnel
- [`../scripts/ops/README.md`](../scripts/ops/README.md) — PM2 / backup scripts
- [`PRP-FINAL.md`](PRP-FINAL.md) §12 — checklist pointer
