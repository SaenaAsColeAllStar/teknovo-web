import type { MiddlewareHandler } from "hono";

const HEADER = "X-Request-Id";

/** Works for Worker `AppEnv` and Node `NodeAppEnv` (shared `requestId` variable). */
export const requestIdMiddleware: MiddlewareHandler<{
  Variables: { requestId: string };
}> = async (c, next) => {
  const incoming = c.req.header(HEADER)?.trim();
  const id =
    incoming && incoming.length <= 128
      ? incoming
      : crypto.randomUUID();
  c.set("requestId", id);
  await next();
  c.header(HEADER, id);
};
