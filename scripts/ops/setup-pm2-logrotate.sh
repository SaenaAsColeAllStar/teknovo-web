#!/usr/bin/env bash
# Install / configure pm2-logrotate on the VPS (PRP Fase 9.3).
# Run once on the VPS as the same user that owns PM2:
#   bash scripts/ops/setup-pm2-logrotate.sh
set -euo pipefail

if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found. Install: npm i -g pm2" >&2
  exit 1
fi

pm2 install pm2-logrotate

pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
pm2 set pm2-logrotate:workerInterval 30

echo "pm2-logrotate configured: max 50M × 10 files, daily rotate, compress"
pm2 conf pm2-logrotate || true
