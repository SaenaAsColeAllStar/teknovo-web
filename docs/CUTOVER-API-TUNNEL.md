# Cutover runbook — Worker (`cf.`) → Node API Tunnel (`api.`)

**Goal:** Switch CMS + Astro from `cf.smkteknovo.sch.id` (Worker + D1 + R2) to `cms-api.smkteknovo.sch.id` (VPS Node + Postgres + MinIO via Cloudflare Tunnel) with downtime under ~1 minute and a clear rollback.

**Prerequisites:** Fase 7 data migration validated; Fase 8 Tunnel + PM2 healthy on VPS; Fase 9 health check / optional VPS deploy ready.

---

## Phase A — Parallel (no client cutover)

Worker remains the production SoT for CMS/Web. Tunnel only proves the Node stack.

1. **VPS bootstrap** (once):
   ```bash
   bash scripts/ops/bootstrap-vps.sh
   # place secrets: apps/api/.env (from .env.example — never commit)
   bash scripts/ops/setup-pm2-logrotate.sh
   ```
2. **Postgres + MinIO** on VPS; `prisma migrate deploy` + procedures + MinIO bucket/seed as needed.
3. **Migrate D1 → PG** (if not already): `pnpm --filter @teknovo/api migrate:d1-to-pg -- --remote`
3b. **Copy R2 objects → MinIO** (URLs alone are not enough):  
    `pnpm --filter @teknovo/api migrate:r2-objects:dry` then  
    `pnpm --filter @teknovo/api migrate:r2-objects -- --from-pg --check`  
    Use `--public-cms-uploads` if public Astro must GET `cms/uploads/*` anonymously (same as current R2 CDN).
4. **Start API:**
   ```bash
   cd /www/wwwroot/teknovo-web/apps/api   # or $VPS_PATH/apps/api
   pnpm pm2:start    # or: bash scripts/ops/pm2-start.sh
   curl -sS http://127.0.0.1:8788/api/health
   ```
5. **Tunnel:** follow `ops/cloudflared/README.md` — create `teknovo-api`, DNS CNAME `api` → `<uuid>.cfargotunnel.com`, SSL Full.
6. **Smoke Tunnel only** (CMS/Web still on `cf.`):
   ```bash
   curl -sS https://cms-api.smkteknovo.sch.id/api/health
   curl -sS https://cms-api.smkteknovo.sch.id/api/v1/kategori
   # POST/PATCH with Clerk JWT as needed
   ```
7. Leave `deploy-api.yml` (Worker) and `cf.` domain active.

---

## Phase B — Cutover (switch clients)

Do during a quiet window. Have rollback commands ready.

| Step | Action |
|------|--------|
| B1 | Freeze CMS writes briefly (or accept dual-write risk — prefer freeze). |
| B2 | Final migrate delta: `migrate:d1-to-pg -- --remote` then `migrate:r2-objects -- --from-pg` (idempotent). |
| B3 | Confirm Tunnel health + PM2 `online`. |
| B4 | **CMS Pages** env: `VITE_API_URL=https://cms-api.smkteknovo.sch.id/api` → rebuild/redeploy `teknovo-cms`. |
| B5 | **Web Pages** env: `PUBLIC_API_URL=https://cms-api.smkteknovo.sch.id` (host only) → rebuild Astro (`rebuild-web` or `deploy`). |
| B6 | GitHub: set `HEALTH_CHECK_URL=https://cms-api.smkteknovo.sch.id/api/health`. |
| B7 | Clerk webhook URL → `https://cms-api.smkteknovo.sch.id/api/webhook/clerk` (when ready). |
| B8 | Smoke: CMS login, list, publish, media upload → MinIO URL on public site. |
| B9 | Optional: enable `ENABLE_VPS_DEPLOY=true` + `VPS_*` secrets; keep Worker deploy until stable. |

**CORS on Node `.env`:** `CMS_ORIGIN=https://cms.smkteknovo.sch.id`, `WEB_ORIGIN=https://smkteknovo.sch.id`, `ENVIRONMENT=production`.

---

## Phase C — Rollback → `cf.`

**Full runbook:** [`ROLLBACK.md`](ROLLBACK.md) (decision tree, data plane, Platform flag, Tunnel disable, CI secrets). Quick path:

1. Revert CMS: `VITE_API_URL=https://cf.smkteknovo.sch.id/api` → redeploy CMS.
2. Revert Web: `PUBLIC_API_URL=https://cf.smkteknovo.sch.id` → rebuild web.
3. Revert `HEALTH_CHECK_URL` (or unset → default `cf.`).
4. Revert Clerk webhook to `https://cf.smkteknovo.sch.id/api/webhook/clerk`.
5. Do **not** delete Tunnel or VPS — fix offline; Worker + D1 + R2 remain SoT until you cut over again.

```bash
bash scripts/ops/rollback-checklist.sh --verify-cf
```

Emergency origin without Tunnel (PRP rollback): temporarily allow Cloudflare IPs only on VPS firewall — prefer restoring Tunnel instead.

---

## Checklist (Definition of Done — Fase 8 go-live)

- [ ] `GET/POST/PATCH/DELETE` smoke via `https://cms-api.smkteknovo.sch.id`
- [ ] CMS upload → MinIO → visible on web
- [ ] Cutover downtime &lt; 1 minute (env rebuild is the long pole — prep builds)
- [ ] `pm2 status` + health-check workflow green
- [ ] Rollback to `cf.` verified once in staging or dry rehearsal
