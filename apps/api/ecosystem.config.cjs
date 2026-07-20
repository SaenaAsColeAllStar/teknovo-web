/** PM2 cluster config for VPS (PRP F-32/F-33). Paths assume deploy under /www/wwwroot/teknovo-web. */
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
        PORT: 8787,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/www/wwwlogs/teknovo-api/err.log",
      out_file: "/www/wwwlogs/teknovo-api/out.log",
      combine_logs: true,
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 4000,
      min_uptime: "10s",
      listen_timeout: 5000,
      kill_timeout: 5000,
      shutdown_with_message: true,
    },
  ],
};
