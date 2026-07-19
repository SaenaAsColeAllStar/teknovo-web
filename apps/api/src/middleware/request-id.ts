import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "../lib/http";

const HEADER = "X-Request-Id";

export const requestIdMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const incoming = c.req.header(HEADER)?.trim();
  const id =
    incoming && incoming.length <= 128
      ? incoming
      : crypto.randomUUID();
  c.set("requestId", id);
  await next();
  c.header(HEADER, id);
};
