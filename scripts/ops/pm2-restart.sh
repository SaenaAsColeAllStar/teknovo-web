#!/usr/bin/env bash
# Graceful reload / restart of teknovo-api (PM2 cluster).
#   bash scripts/ops/pm2-restart.sh          # reload (zero-downtime when possible)
#   bash scripts/ops/pm2-restart.sh hard     # restart (brief disconnect)
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/www/wwwroot/teknovo-web}"
API_DIR="${REPO_ROOT}/apps/api"
MODE="${1:-reload}"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found" >&2
  exit 1
fi

cd "$API_DIR"

case "$MODE" in
  reload)
    pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
    ;;
  hard|restart)
    pm2 restart teknovo-api --update-env || pm2 start ecosystem.config.cjs
    ;;
  stop)
    pm2 stop teknovo-api
    ;;
  *)
    echo "Usage: $0 [reload|hard|stop]" >&2
    exit 1
    ;;
esac

pm2 save || true
pm2 status teknovo-api
