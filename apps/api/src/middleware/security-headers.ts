import type { MiddlewareHandler } from "hono";

/** Minimal security headers for JSON API (Worker + Node). */
export const securityHeadersMiddleware: MiddlewareHandler = async (
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
