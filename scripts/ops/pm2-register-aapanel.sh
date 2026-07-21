#!/usr/bin/env bash
# Ensure teknovo-cms-api runs under user `teknovo` PM2 (/home/teknovo/.pm2).
#
# aaPanel on this VPS tracks PM2 for Run User = teknovo (NOT root /root/.pm2).
# See /www/wwwroot/teknovo/.cursor/rules/teknovo-pm2-aapanel.mdc
#
# Usage (as teknovo — no sudo needed):
#   bash scripts/ops/pm2-register-aapanel.sh
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/www/wwwroot/eduos-teknovo/teknovo-web}"
API_DIR="${REPO_ROOT}/apps/api"
PM2_APP_NAME="${PM2_APP_NAME:-teknovo-cms-api}"
export PM2_HOME="${PM2_HOME:-/home/teknovo/.pm2}"
export TEKNOVO_API_LOG_DIR="${TEKNOVO_API_LOG_DIR:-${REPO_ROOT}/logs/teknovo-cms-api}"
API_PORT="${PORT:-8788}"

if [ "$(id -un)" != "teknovo" ] && [ -z "${ALLOW_NON_TEKNOVO:-}" ]; then
  echo "Run as user teknovo (aaPanel Run User). Current: $(id -un)" >&2
  echo "Or: sudo -u teknovo bash $0" >&2
  exit 1
fi

if [ ! -f "$API_DIR/ecosystem.config.cjs" ]; then
  echo "missing $API_DIR/ecosystem.config.cjs" >&2
  exit 1
fi

mkdir -p "$TEKNOVO_API_LOG_DIR"
cd "$API_DIR"

echo "[1/3] Cleaning legacy names…"
pm2 delete teknovo-api 2>/dev/null || true
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true

echo "[2/3] Starting $PM2_APP_NAME (PM2_HOME=$PM2_HOME)…"
pnpm exec prisma generate >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs
pm2 save

echo "[3/3] Verify…"
sleep 3
pm2 status "$PM2_APP_NAME"
curl -sS "http://127.0.0.1:${API_PORT}/api/health" || true
echo
echo
echo "aaPanel: Website → Node Project → Add Project (if not listed)"
echo "  Project name:  $PM2_APP_NAME"
echo "  Run User:      teknovo   ← wajib (bukan www/root)"
echo "  Run Directory: $API_DIR"
echo "  Startup File:  $API_DIR/pm2-entry.cjs"
echo "  Port:          $API_PORT"
echo "  Do not install node_module: ON"
echo "Then Start from UI, or keep SSH-managed and use PM2 Monitor for user teknovo."
