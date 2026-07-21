/**
 * aaPanel / PM2 "Startup File" entry (CommonJS).
 * Loads TypeScript Express entry `src/server.ts` via tsx — same runtime as ecosystem.config.cjs.
 *
 * Prefer SSH/PM2 over aaPanel UI if "Creating Node.js project" hangs:
 *   cd apps/api && pnpm pm2:start
 *   # or: bash scripts/ops/pm2-start.sh
 *
 * aaPanel form (optional):
 *   Run Directory = …/apps/api
 *   Startup File  = pm2-entry.cjs
 */
"use strict";

const { register } = require("tsx/cjs/api");
register();
const { startNodeServer } = require("./src/server.ts");
startNodeServer().catch((err) => {
  console.error("[teknovo-cms-api] failed to start:", err);
  process.exit(1);
});
