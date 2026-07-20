#!/usr/bin/env bash
# Print (and optionally verify) PRP §13 Definition of Done.
# Does NOT change Pages env, Clerk, DNS, or VPS — operator dashboards only.
#
# Usage:
#   bash scripts/ops/dod-checklist.sh
#   bash scripts/ops/dod-checklist.sh --verify-cf
#   bash scripts/ops/dod-checklist.sh --verify-cms-api
#   bash scripts/ops/dod-checklist.sh --smoke-local
#
# Full runbook: docs/DEFINITION-OF-DONE.md

set -euo pipefail

VERIFY_CF=0
VERIFY_CMS_API=0
SMOKE_LOCAL=0

for arg in "$@"; do
  case "$arg" in
    --verify-cf) VERIFY_CF=1 ;;
    --verify-cms-api) VERIFY_CMS_API=1 ;;
    --smoke-local) SMOKE_LOCAL=1 ;;
    -h|--help)
      sed -n '2,14p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CF_HEALTH="https://cf.smkteknovo.sch.id/api/health"
CMS_API_HEALTH="https://cms-api.smkteknovo.sch.id/api/health"

cat <<'EOF'
=== Definition of Done (PRP §13) ===
Runbook: docs/DEFINITION-OF-DONE.md

--- Per-task (engineering) ---
[x] Code on branch main (Fase 1–10 + §12)
[x] Prisma migrate tooling (apply per env: prisma:deploy)
[x] Stored procedures registered + smoke (prisma:procedures*)
[x] Endpoint smoke local (pnpm --filter @teknovo/api smoke:node)
[x] CORS origins coded for CMS + Web (+ localhost non-prod)
[x] MinIO upload path smoke (put/list/delete in smoke:node)
[x] Clerk: unauthenticated writes rejected (401/403); live login = operator
[x] Review-before-merge process

--- Fase 8 go-live (operator) ---
[ ] Smoke GET/POST/PATCH/DELETE via https://cms-api.smkteknovo.sch.id
[ ] CMS upload → MinIO → visible on Web
[ ] Cutover downtime < 1 minute
[ ] aaPanel + PM2 + health-check workflow green
[x] Repo: cloudflared / PM2 / cutover + rollback runbooks

Local smokes:
  pnpm --filter @teknovo/api prisma:procedures:smoke
  pnpm --filter @teknovo/api smoke:node

Probes:
  Worker SoT:  https://cf.smkteknovo.sch.id/api/health
  Tunnel Node: https://cms-api.smkteknovo.sch.id/api/health

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
    -H "User-Agent: teknovo-dod-checklist/1.0" \
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
    echo "FAIL: expected ok:true in body" >&2
    rm -f "$body"
    return 1
  fi
  rm -f "$body"
  echo "OK"
}

fail=0

if [ "$VERIFY_CF" -eq 1 ]; then
  probe "Worker (cf.) health" "$CF_HEALTH" || fail=1
fi

if [ "$VERIFY_CMS_API" -eq 1 ]; then
  probe "Tunnel Node (cms-api.) health" "$CMS_API_HEALTH" || fail=1
fi

if [ "$SMOKE_LOCAL" -eq 1 ]; then
  echo "--- Local smoke:node ---"
  (cd "$ROOT" && pnpm --filter @teknovo/api smoke:node) || fail=1
fi

if [ "$fail" -ne 0 ]; then
  exit 1
fi
