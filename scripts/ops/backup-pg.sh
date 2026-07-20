#!/usr/bin/env bash
# PostgreSQL daily dump (PRP Fase 9.4).
# Env: DATABASE_URL (required), BACKUP_DIR (default /www/backup/teknovo/pg), RETAIN_DAYS (default 14)
# Cron example (VPS):
#   15 2 * * * cd /www/wwwroot/teknovo-web && set -a && . apps/api/.env && set +a && bash scripts/ops/backup-pg.sh >> /www/backup/teknovo/pg-cron.log 2>&1
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"

BACKUP_DIR="${BACKUP_DIR:-/www/backup/teknovo/pg}"
RETAIN_DAYS="${RETAIN_DAYS:-14}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="${BACKUP_DIR}/teknovo-${STAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

if command -v pg_dump >/dev/null 2>&1; then
  pg_dump --no-owner --no-acl "$DATABASE_URL" | gzip -c >"$OUT"
else
  echo "pg_dump not found" >&2
  exit 1
fi

find "$BACKUP_DIR" -type f -name 'teknovo-*.sql.gz' -mtime "+${RETAIN_DAYS}" -delete || true
echo "Wrote $OUT ($(du -h "$OUT" | awk '{print $1}'))"
