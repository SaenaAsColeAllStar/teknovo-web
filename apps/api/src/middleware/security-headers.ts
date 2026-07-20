import type { MiddlewareHandler } from "hono";

function isProduction(c: { env: unknown }): boolean {
  if (
    typeof c.env === "object" &&
    c.env !== null &&
    "ENVIRONMENT" in c.env &&
    typeof (c.env as { ENVIRONMENT?: unknown }).ENVIRONMENT === "string"
  ) {
    return (c.env as { ENVIRONMENT: string }).ENVIRONMENT === "production";
  }
  // Node entry may not put ENVIRONMENT on every context; read via globalThis.
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  const env = g.process?.env?.ENVIRONMENT ?? g.process?.env?.NODE_ENV;
  return (env ?? "production") === "production";
}

/** Minimal security headers for JSON API (Worker + Node). F-07: CSP, HSTS, etc. */
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
  // HSTS only when serving behind HTTPS (prod Tunnel / CF). Skip local HTTP.
  if (isProduction(c)) {
    c.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
};
