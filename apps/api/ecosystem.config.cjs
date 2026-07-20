/** PM2 cluster config for VPS (PRP F-32/F-33, Fase 8).
 * Paths assume deploy under /www/wwwroot/teknovo-web (override via REPO_ROOT / cwd).
 * Runtime: Node + tsx (same as deploy-api-vps.yml) — no separate dist emit yet
 * (workspace @teknovo/shared + dual Worker/Node tree). Secrets: apps/api/.env via dotenv.
 */
const path = require("node:path");

const logDir =
  process.env.TEKNOVO_API_LOG_DIR ||
  path.join(__dirname, "..", "..", "logs", "teknovo-api");

module.exports = {
  apps: [
    {
      name: "teknovo-api",
      cwd: __dirname,
      // CommonJS bootstrap loads Express `src/server.ts` via tsx (aaPanel-friendly).
      script: "pm2-entry.cjs",
      interpreter: "node",
      // fork + CJS entry (cluster cannot reliably fork TypeScript)
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        ENVIRONMENT: "production",
        // 8787 reserved by teknovo-wa-bridge on this VPS (aaPanel).
        PORT: 8788,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: path.join(logDir, "err.log"),
      out_file: path.join(logDir, "out.log"),
      combine_logs: true,
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 4000,
      min_uptime: "10s",
      listen_timeout: 8000,
      kill_timeout: 8000,
      wait_ready: false,
      shutdown_with_message: true,
      exp_backoff_restart_delay: 100,
    },
  ],
};
