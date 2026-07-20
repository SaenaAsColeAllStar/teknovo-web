#!/usr/bin/env bash
# Start teknovo-api under PM2 (cluster). Idempotent: reload if already running.
#   bash scripts/ops/pm2-start.sh
#   REPO_ROOT=/www/wwwroot/teknovo-web bash scripts/ops/pm2-start.sh
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/www/wwwroot/eduos-teknovo/teknovo-web}"
API_DIR="${REPO_ROOT}/apps/api"
LOG_DIR="${LOG_DIR:-${REPO_ROOT}/logs/teknovo-api}"
# Prefer aaPanel path when writable (production VPS).
if [ -z "${TEKNOVO_API_LOG_DIR:-}" ] && [ -d /www/wwwlogs ] && [ -w /www/wwwlogs ]; then
  LOG_DIR="/www/wwwlogs/teknovo-api"
fi
export TEKNOVO_API_LOG_DIR="${TEKNOVO_API_LOG_DIR:-$LOG_DIR}"
# Node API listens on 8788 (8787 often taken by teknovo-wa-bridge).
API_PORT="${PORT:-8788}"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found — run scripts/ops/bootstrap-vps.sh first" >&2
  exit 1
fi

if [ ! -f "$API_DIR/ecosystem.config.cjs" ]; then
  echo "missing $API_DIR/ecosystem.config.cjs" >&2
  exit 1
fi

mkdir -p "$LOG_DIR"
cd "$API_DIR"

if [ ! -f .env ]; then
  echo "missing apps/api/.env — copy from .env.example and fill secrets" >&2
  exit 1
fi

pnpm exec prisma generate >/dev/null
pnpm exec prisma migrate deploy || true

if pm2 describe teknovo-api >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi

pm2 save || true
pm2 status teknovo-api
echo "Health: curl -sS http://127.0.0.1:${API_PORT}/api/health"
