# Definition of Done (PRP §13)

Printable checklist: `bash scripts/ops/dod-checklist.sh`.  
Related: [`CUTOVER-API-TUNNEL.md`](CUTOVER-API-TUNNEL.md) (Fase 8 go-live) · [`ROLLBACK.md`](ROLLBACK.md) · [`PRP-FINAL.md`](PRP-FINAL.md) §13.

This document separates **repo / local verified** (engineering) from **production go-live** (operator on VPS + Tunnel + Pages). Worker `cf.` + D1 + R2 remain source of truth until cutover.

---

## 1. Per-task criteria (engineering)

| Criterion | How to verify | Repo status |
|---|---|---|
| Code on `main` | Phases 1–10 + §12 shipped; see `CHANGELOG.md` / `git log` | ✅ |
| Prisma migrate applies | `pnpm --filter @teknovo/api prisma:deploy` against target PG | ✅ tooling; apply per env |
| Stored procedures registered | `pnpm --filter @teknovo/api prisma:procedures` + `prisma:procedures:smoke` | ✅ |
| Endpoints HTTP 200 (CRUD smoke) | `pnpm --filter @teknovo/api smoke:node` (local Express + PG + MinIO) | ✅ local; prod via Tunnel after cutover |
| CORS CMS + Web | Origins from `CMS_ORIGIN` / web origins in `server.ts` / Worker `index.ts` | ✅ code; spot-check browser after cutover |
| Upload MinIO + public URL | Smoke MinIO put/list/delete in `smoke:node`; `minio:ensure-bucket` / `minio:seed` | ✅ local; CMS→Web prod after cutover |
| Clerk session verify | Unauthenticated write → 401/403 in smoke; live login on CMS | ✅ reject path; live session = operator |
| Review before merge | Human review / PR process | ✅ process (ongoing) |

### Local smoke (recommended before cutover)

```bash
# apps/api/.env → DATABASE_URL + MinIO (+ Clerk keys if testing authed routes)
pnpm --filter @teknovo/api prisma:deploy
pnpm --filter @teknovo/api prisma:seed   # optional
pnpm --filter @teknovo/api prisma:procedures
pnpm --filter @teknovo/api prisma:procedures:smoke
pnpm --filter @teknovo/api smoke:node
```

Or: `bash scripts/ops/dod-checklist.sh --smoke-local` (runs `smoke:node` only).

---

## 2. Fase 8 go-live (operator)

Do **not** mark these until Tunnel + client switch are live. Runbook: [`CUTOVER-API-TUNNEL.md`](CUTOVER-API-TUNNEL.md).

| Criterion | Status |
|---|---|
| Smoke GET/POST/PATCH/DELETE via `https://cms-api.smkteknovo.sch.id` | ⬜ after Super Admin Tunnel |
| CMS upload → MinIO → visible on Web | ⬜ after client env switch |
| Cutover downtime &lt; 1 minute | ⬜ (prep Pages builds first) |
| aaPanel + PM2 / health-check green | ⬜ (`pm2 status` + GitHub `health-check.yml`) |
| Repo: cloudflared template, PM2 scripts, cutover + rollback runbooks | ✅ |

Probe helpers:

```bash
bash scripts/ops/dod-checklist.sh --verify-cf      # Worker SoT still healthy
bash scripts/ops/dod-checklist.sh --verify-cms-api # Tunnel Node path (when live)
```

---

## 3. Invariants

- Until Fase 8 cutover completes: production CMS/Web stay on `cf.smkteknovo.sch.id`.
- Do not delete D1 / R2 / Worker while validating Node path.
- Platform SaaS stays off (`PLATFORM_ENABLED=false`) unless intentionally enabled.
- Secrets only in aaPanel env / GitHub Secrets / local `.env` — never commit.

---

## 4. Sign-off

When both §1 (engineering) and §2 (go-live) are satisfied, PRP migration track is **done**.  
If §2 fails: [`ROLLBACK.md`](ROLLBACK.md) · `bash scripts/ops/rollback-checklist.sh`.
