import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "../lib/http";

/** Minimal security headers for a JSON API Worker. */
export const securityHeadersMiddleware: MiddlewareHandler<AppEnv> = async (
  c,
  next,
) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "no-referrer");
  c.header(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  );
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
};
