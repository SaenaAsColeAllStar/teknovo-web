#!/usr/bin/env bash
# Idempotent VPS bootstrap for Node API + PM2 + cloudflared (PRP Fase 8).
#
# Usage (on the aaPanel host, as the app user or with sudo where needed):
#   bash scripts/ops/bootstrap-vps.sh
#   REPO_ROOT=/www/wwwroot/teknovo-web bash scripts/ops/bootstrap-vps.sh
#
# Does NOT:
#   - create Cloudflare tunnels or DNS records
#   - write production secrets (copies .env.example → .env only if missing)
#   - start the API (run scripts/ops/pm2-start.sh after editing .env)
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/www/wwwroot/teknovo-web}"
API_DIR="${REPO_ROOT}/apps/api"
LOG_DIR="${LOG_DIR:-/www/wwwlogs/teknovo-api}"
NODE_MAJOR="${NODE_MAJOR:-22}"

log() { printf '[bootstrap-vps] %s\n' "$*"; }
warn() { printf '[bootstrap-vps] WARN: %s\n' "$*" >&2; }

need_sudo() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    warn "need root for: $*"
    return 1
  fi
}

# ── Node.js (nodesource) ──────────────────────────────────────────────
ensure_node() {
  if command -v node >/dev/null 2>&1; then
    local major
    major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
    if [ "$major" -ge 20 ]; then
      log "Node $(node -v) OK"
      return 0
    fi
    warn "Node $(node -v) < 20 — attempting upgrade via nodesource"
  fi

  if command -v apt-get >/dev/null 2>&1; then
    need_sudo apt-get update -y
    need_sudo apt-get install -y ca-certificates curl gnupg
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | need_sudo bash -
    need_sudo apt-get install -y nodejs
  else
    warn "apt-get not found — install Node ${NODE_MAJOR}+ manually"
    return 1
  fi
  log "Node $(node -v)"
}

# ── pnpm via corepack ─────────────────────────────────────────────────
ensure_pnpm() {
  if command -v corepack >/dev/null 2>&1; then
    need_sudo corepack enable || true
    corepack prepare pnpm@latest --activate 2>/dev/null || true
  fi
  if ! command -v pnpm >/dev/null 2>&1; then
    need_sudo npm install -g pnpm
  fi
  log "pnpm $(pnpm -v)"
}

# ── PM2 ────────────────────────────────────────────────────────────────
ensure_pm2() {
  if ! command -v pm2 >/dev/null 2>&1; then
    need_sudo npm install -g pm2
  fi
  log "pm2 $(pm2 -v)"
  # Startup hook (may prompt / need root) — best-effort
  if [ "$(id -u)" -eq 0 ]; then
    pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
  else
    pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>/dev/null | tail -n 1 | bash || true
  fi
}

# ── cloudflared ────────────────────────────────────────────────────────
ensure_cloudflared() {
  if command -v cloudflared >/dev/null 2>&1; then
    log "cloudflared $(cloudflared --version 2>&1 | head -1)"
    return 0
  fi
  if command -v apt-get >/dev/null 2>&1; then
    need_sudo mkdir -p --mode=0755 /usr/share/keyrings
    curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
      | need_sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
    echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" \
      | need_sudo tee /etc/apt/sources.list.d/cloudflared.list >/dev/null
    need_sudo apt-get update -y
    need_sudo apt-get install -y cloudflared
    log "cloudflared installed"
  else
    warn "install cloudflared manually — see ops/cloudflared/README.md"
  fi
}

# ── dirs + env template ────────────────────────────────────────────────
ensure_layout() {
  need_sudo mkdir -p "$LOG_DIR"
  if [ -d "$REPO_ROOT" ]; then
    need_sudo chown -R "$(whoami):$(whoami)" "$LOG_DIR" 2>/dev/null || true
  fi

  if [ ! -d "$API_DIR" ]; then
    warn "API dir missing: $API_DIR — clone/rsync the monorepo first"
    return 0
  fi

  if [ ! -f "$API_DIR/.env" ] && [ -f "$API_DIR/.env.example" ]; then
    cp "$API_DIR/.env.example" "$API_DIR/.env"
    log "Created $API_DIR/.env from .env.example — EDIT secrets before start"
  elif [ -f "$API_DIR/.env" ]; then
    log ".env already present (left untouched)"
  fi

  if [ -d "$REPO_ROOT/ops/cloudflared" ]; then
    need_sudo mkdir -p /etc/cloudflared
    if [ ! -f /etc/cloudflared/config.yml ] && [ -f "$REPO_ROOT/ops/cloudflared/config.yml.example" ]; then
      need_sudo cp "$REPO_ROOT/ops/cloudflared/config.yml.example" /etc/cloudflared/config.yml.example
      log "Copied cloudflared example → /etc/cloudflared/config.yml.example"
    fi
  fi
}

# ── optional deps install ──────────────────────────────────────────────
ensure_deps() {
  if [ ! -f "$REPO_ROOT/package.json" ]; then
    return 0
  fi
  log "pnpm install @teknovo/api..."
  (
    cd "$REPO_ROOT"
    export CI=1
    pnpm install --frozen-lockfile --filter @teknovo/api... || pnpm install --filter @teknovo/api...
    cd apps/api
    pnpm exec prisma generate || true
  )
}

main() {
  log "REPO_ROOT=$REPO_ROOT"
  ensure_node
  ensure_pnpm
  ensure_pm2
  ensure_cloudflared
  ensure_layout
  ensure_deps

  cat <<EOF

Next steps:
  1. Edit $API_DIR/.env (DATABASE_URL, MinIO, Clerk, CORS production origins)
  2. Tunnel: see ops/cloudflared/README.md (create teknovo-api + DNS api → cfargotunnel)
  3. bash scripts/ops/setup-pm2-logrotate.sh
  4. bash scripts/ops/pm2-start.sh
  5. Cutover when ready: docs/CUTOVER-API-TUNNEL.md
  Do NOT point CMS/Web at api. until Phase B of the cutover runbook.

EOF
}

main "$@"
