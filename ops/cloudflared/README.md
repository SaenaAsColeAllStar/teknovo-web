# Cloudflare Tunnel — `teknovo-api`

Expose the Node API on the VPS (`127.0.0.1:8787`) at **`api.smkteknovo.sch.id`** without opening inbound ports. Worker `cf.smkteknovo.sch.id` stays live until cutover (`docs/CUTOVER-API-TUNNEL.md`).

## Hostname

| Hostname | Role |
|----------|------|
| `api.smkteknovo.sch.id` | **Canonical** (PRP F-31 / architecture) |
| `cms-api.smkteknovo.sch.id` | Optional alias only — not required |
| `cf.smkteknovo.sch.id` | Current production Worker — keep until cutover |

## DNS

After `cloudflared tunnel create teknovo-api` (or dashboard Create Tunnel):

```bash
# Creates CNAME api → <TUNNEL_UUID>.cfargotunnel.com (proxied / orange-cloud)
cloudflared tunnel route dns teknovo-api api.smkteknovo.sch.id
```

Manual DNS (Cloudflare dashboard → DNS → Records):

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `api` | `<TUNNEL_UUID>.cfargotunnel.com` | Proxied (orange) |

Do **not** point `api` at the VPS public IP. Tunnel requires the `*.cfargotunnel.com` target.

## SSL / TLS

- Zone SSL/TLS mode: **Full** (or Full strict if origin has a trusted cert — Tunnel origins are usually HTTP localhost, so **Full** is fine).
- Certificate for `api.smkteknovo.sch.id` is issued by Cloudflare edge (Universal SSL). No Let's Encrypt on the VPS for this hostname.
- Multi-level subdomains (e.g. `a.b.example.com`) need Advanced Certificate Manager; `api.` is single-level — Universal SSL covers it.

## Install on VPS (Debian/Ubuntu)

```bash
# From repo (idempotent bootstrap also installs cloudflared):
bash scripts/ops/bootstrap-vps.sh

# Or apt (current Cloudflare package docs):
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
  | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" \
  | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install -y cloudflared
```

### Locally-managed tunnel

```bash
cloudflared tunnel login
cloudflared tunnel create teknovo-api
# copy credentials JSON path from output into config.yml
sudo cp /path/to/repo/ops/cloudflared/config.yml.example /etc/cloudflared/config.yml
# edit tunnel UUID + credentials-file
cloudflared tunnel route dns teknovo-api api.smkteknovo.sch.id
cloudflared tunnel ingress validate --config /etc/cloudflared/config.yml
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

### Remotely-managed (token)

1. Zero Trust / Networking → Tunnels → Create → name `teknovo-api`.
2. Copy install token; on VPS: `sudo cloudflared service install <TOKEN>`.
3. Published application: hostname `api.smkteknovo.sch.id` → `http://127.0.0.1:8787`.

Never commit `*.json` credentials, `cert.pem`, or `TUNNEL_TOKEN`.

## Validate (parallel to Worker)

```bash
# Local origin (on VPS)
curl -sS http://127.0.0.1:8787/api/health

# Via Tunnel (after DNS propagates) — Worker still serves cf.
curl -sS https://api.smkteknovo.sch.id/api/health
```

Expect Node health: `"runtime":"node"` with Prisma/MinIO checks. Keep CMS/Web on `cf.` until cutover runbook step 4.
