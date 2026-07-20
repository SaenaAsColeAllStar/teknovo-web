#!/usr/bin/env bash
# Print (and optionally verify) the api. → cf. rollback checklist.
# Does NOT change Pages env, Clerk, DNS, or VPS — operator dashboards only.
#
# Usage:
#   bash scripts/ops/rollback-checklist.sh
#   bash scripts/ops/rollback-checklist.sh --verify-cf
#   bash scripts/ops/rollback-checklist.sh --verify-cf --verify-api
#
# Full runbook: docs/ROLLBACK.md

set -euo pipefail

VERIFY_CF=0
VERIFY_API=0

for arg in "$@"; do
  case "$arg" in
    --verify-cf) VERIFY_CF=1 ;;
    --verify-api) VERIFY_API=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

CF_HEALTH="https://cf.smkteknovo.sch.id/api/health"
CF_KATEGORI="https://cf.smkteknovo.sch.id/api/v1/kategori"
API_HEALTH="https://cms-api.smkteknovo.sch.id/api/health"

cat <<'EOF'
=== Rollback checklist (cms-api. → cf.) ===
Runbook: docs/ROLLBACK.md

[ ] 1. Soft fix first?  pm2-restart / git checkout good SHA on VPS (ROLLBACK §1)
[ ] 2. Freeze CMS writes (optional but recommended)
[ ] 3. CMS Pages:  VITE_API_URL=https://cf.smkteknovo.sch.id/api  → rebuild
[ ] 4. Web Pages:  PUBLIC_API_URL=https://cf.smkteknovo.sch.id     → rebuild
[ ] 5. GitHub var: unset HEALTH_CHECK_URL  (or set to cf. …/api/health)
[ ] 6. GitHub var: ENABLE_VPS_DEPLOY=false while debugging (optional)
[ ] 7. Clerk webhook → https://cf.smkteknovo.sch.id/api/webhook/clerk
[ ] 8. Platform off: PLATFORM_ENABLED=false + pm2 restart (if it was on)
[ ] 9. Smoke CMS login / list / media (R2) + public web
[ ]10. Do NOT delete D1, R2, Worker domain, or VPS data
[ ]11. Optional later: pause Tunnel / stop PM2 (ROLLBACK §4.3)

Env targets:
  CMS  VITE_API_URL=https://cf.smkteknovo.sch.id/api
  Web  PUBLIC_API_URL=https://cf.smkteknovo.sch.id
  Health default  https://cf.smkteknovo.sch.id/api/health

EOF

probe() {
  local label="$1" url="$2"
  echo "--- Probe: $label ---"
  echo "GET $url"
  local body http
  body="$(mktemp)"
  http="$(curl -sS -o "$body" -w "%{http_code}" \
    --connect-timeout 10 --max-time 30 \
    -H "Accept: application/json" \
    -H "User-Agent: teknovo-rollback-checklist/1.0" \
    "$url" || true)"
  echo "HTTP $http"
  head -c 2000 "$body" || true
  echo
  if [ "$http" != "200" ]; then
    echo "FAIL: expected HTTP 200" >&2
    rm -f "$body"
    return 1
  fi
  if ! grep -q '"ok"[[:space:]]*:[[:space:]]*true' "$body" 2>/dev/null; then
    # kategori list is not a health payload — only require ok:true for /api/health
    if [[ "$url" == *"/api/health"* ]]; then
      echo "FAIL: health JSON missing ok:true" >&2
      rm -f "$body"
      return 1
    fi
  fi
  rm -f "$body"
  echo "OK"
  echo
}

if [ "$VERIFY_CF" -eq 1 ]; then
  probe "Worker health" "$CF_HEALTH"
  probe "Worker kategori" "$CF_KATEGORI"
fi

if [ "$VERIFY_API" -eq 1 ]; then
  echo "(Tunnel probe is informational during rollback — clients should use cf.)"
  probe "Tunnel health" "$API_HEALTH" || echo "WARN: api. unhealthy (expected if Tunnel paused)"
fi

echo "Done. Complete dashboard steps in docs/ROLLBACK.md §2–§7."
