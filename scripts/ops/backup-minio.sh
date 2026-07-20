#!/usr/bin/env bash
# MinIO weekly mirror backup (PRP Fase 9.4).
# Requires mc (MinIO Client) configured, or AWS CLI compatible with MinIO.
#
# Env:
#   MINIO_ENDPOINT   e.g. http://127.0.0.1:9010
#   MINIO_ACCESS_KEY
#   MINIO_SECRET_KEY
#   MINIO_BUCKET     default teknovo-web
#   BACKUP_DIR       default /www/backup/teknovo/minio
#   RETAIN_DAYS      default 28
#
# Cron example (Sunday 03:30):
#   30 3 * * 0 cd /www/wwwroot/teknovo-web && set -a && . apps/api/.env && set +a && bash scripts/ops/backup-minio.sh >> /www/backup/teknovo/minio-cron.log 2>&1
set -euo pipefail

: "${MINIO_ENDPOINT:?MINIO_ENDPOINT is required}"
: "${MINIO_ACCESS_KEY:?MINIO_ACCESS_KEY is required}"
: "${MINIO_SECRET_KEY:?MINIO_SECRET_KEY is required}"

MINIO_BUCKET="${MINIO_BUCKET:-teknovo-web}"
BACKUP_DIR="${BACKUP_DIR:-/www/backup/teknovo/minio}"
RETAIN_DAYS="${RETAIN_DAYS:-28}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="${BACKUP_DIR}/${STAMP}"

mkdir -p "$OUT_DIR"

if command -v mc >/dev/null 2>&1; then
  ALIAS="teknovo-backup-$$"
  mc alias set "$ALIAS" "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" >/dev/null
  mc mirror --overwrite "${ALIAS}/${MINIO_BUCKET}" "$OUT_DIR"
  mc alias remove "$ALIAS" >/dev/null 2>&1 || true
elif command -v aws >/dev/null 2>&1; then
  export AWS_ACCESS_KEY_ID="$MINIO_ACCESS_KEY"
  export AWS_SECRET_ACCESS_KEY="$MINIO_SECRET_KEY"
  aws --endpoint-url "$MINIO_ENDPOINT" s3 sync "s3://${MINIO_BUCKET}" "$OUT_DIR"
else
  echo "Need MinIO Client (mc) or aws CLI" >&2
  exit 1
fi

# Tar the mirror for retention simplicity
tar -C "$BACKUP_DIR" -czf "${BACKUP_DIR}/minio-${STAMP}.tar.gz" "$STAMP"
rm -rf "$OUT_DIR"

find "$BACKUP_DIR" -type f -name 'minio-*.tar.gz' -mtime "+${RETAIN_DAYS}" -delete || true
echo "Wrote ${BACKUP_DIR}/minio-${STAMP}.tar.gz"
