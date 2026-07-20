# VPS ops scripts (PRP Fase 8–9) — run on the aaPanel host.
#
# | Script | Purpose |
# |--------|---------|
# | `bootstrap-vps.sh` | Idempotent: Node, pnpm, PM2, cloudflared, dirs, .env template |
# | `pm2-start.sh` / `pm2-restart.sh` | Start / reload / hard restart API |
# | `setup-pm2-logrotate.sh` | pm2-logrotate: 50MB × 10 files |
# | `backup-pg.sh` | Daily `pg_dump` → gzip |
# | `backup-minio.sh` | Weekly MinIO mirror → tar.gz |
# | `rollback-checklist.sh` | Print api.→cf. rollback steps; optional `--verify-cf` |
#
# Tunnel template: `ops/cloudflared/`
# Cutover: `docs/CUTOVER-API-TUNNEL.md`
# Rollback: `docs/ROLLBACK.md`
# See `DEPLOY.md` § Zero Trust / VPS (Fase 8) and § CI/CD (Fase 9).
