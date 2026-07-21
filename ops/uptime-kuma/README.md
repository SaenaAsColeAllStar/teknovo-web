# Uptime Kuma — teknovo-cms-api

## Start

```bash
cd /www/wwwroot/eduos-teknovo/teknovo-web/ops/uptime-kuma
docker compose up -d
```

UI: `http://<VPS-IP>:3001` (first visit → create admin).

`network_mode: host` so Kuma can hit the API on the host (`127.0.0.1:8788`).

## Monitor to add (Dashboard → Add New Monitor)

| Field | Value |
|--------|--------|
| Monitor Type | **HTTP(s)** |
| Friendly Name | `teknovo-cms-api` |
| URL | `http://127.0.0.1:8788/api/health` |
| Heartbeat Interval | `60` seconds |
| Retries | `2` |
| Accepted Status Codes | `200-299` |
| Keyword (optional) | `"ok":true` |

After Tunnel cutover, add a second monitor:

| Friendly Name | URL |
|---------------|-----|
| `teknovo-cms-api (public)` | `https://cms-api.smkteknovo.sch.id/api/health` |

## Useful

```bash
docker compose -f ops/uptime-kuma/docker-compose.yml logs -f
docker compose -f ops/uptime-kuma/docker-compose.yml restart
```

Data persists in `ops/uptime-kuma/data/` (gitignored if possible). Do not expose port 3001 to the public internet without a reverse proxy + HTTPS (or Cloudflare Access).
