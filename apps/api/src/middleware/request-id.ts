import type { MiddlewareHandler } from "hono";
import { log } from "../lib/logger";

const HEADER = "X-Request-Id";

/**
 * Assigns X-Request-Id and emits a structured access log (F-06).
 * Works for Worker `AppEnv` and Node `NodeAppEnv`.
 */
export const requestIdMiddleware: MiddlewareHandler<{
  Variables: { requestId: string };
}> = async (c, next) => {
  const incoming = c.req.header(HEADER)?.trim();
  const id =
    incoming && incoming.length <= 128
      ? incoming
      : crypto.randomUUID();
  c.set("requestId", id);
  const started = Date.now();
  await next();
  c.header(HEADER, id);

  const path = new URL(c.req.url).pathname;
  // Skip noisy health probes in access logs (monitoring still gets requestId in JSON body).
  if (path === "/api/health") return;

  log.info("request", {
    requestId: id,
    method: c.req.method,
    path,
    status: c.res.status,
    ms: Date.now() - started,
  });
};
