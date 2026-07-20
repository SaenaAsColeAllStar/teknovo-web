# VPS ops scripts (PRP Fase 9) — run on the aaPanel host after Fase 8.
#
# | Script | Purpose |
# |--------|---------|
# | `setup-pm2-logrotate.sh` | pm2-logrotate: 50MB × 10 files |
# | `backup-pg.sh` | Daily `pg_dump` → gzip |
# | `backup-minio.sh` | Weekly MinIO mirror → tar.gz |
#
# See `DEPLOY.md` § CI/CD & Monitoring (Fase 9).
