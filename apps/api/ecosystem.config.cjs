/** PM2 cluster config for VPS (PRP F-32/F-33, Fase 8).
 * Paths assume deploy under /www/wwwroot/teknovo-web (override via REPO_ROOT / cwd).
 * Runtime: Node + tsx (same as deploy-api-vps.yml) — no separate dist emit yet
 * (workspace @teknovo/shared + dual Worker/Node tree). Secrets: apps/api/.env via dotenv.
 */
const path = require("node:path");

const logDir = process.env.TEKNOVO_API_LOG_DIR || "/www/wwwlogs/teknovo-api";

module.exports = {
  apps: [
    {
      name: "teknovo-api",
      cwd: __dirname,
      script: "src/server.ts",
      interpreter: "node",
      interpreter_args: "--import tsx",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        ENVIRONMENT: "production",
        PORT: 8787,
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
