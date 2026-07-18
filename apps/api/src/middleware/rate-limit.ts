import type { MiddlewareHandler } from "hono";

import { errJson, type AppEnv } from "../lib/http";

type Bucket = { count: number; resetAt: number };

/** Isolate-local counters — fine for Workers Free; resets on cold start. */
const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5_000;

export type RateLimitOptions = {
  /** Max requests in the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Prefix so GET vs write share different counters. */
  prefix: string;
};

function clientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  const cf = c.req.header("CF-Connecting-IP")?.trim();
  if (cf) return cf;
  const xff = c.req.header("X-Forwarded-For")?.split(",")[0]?.trim();
  if (xff) return xff;
  return "unknown";
}

function pruneIfNeeded(): void {
  if (buckets.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size <= MAX_KEYS) return;
  // Drop oldest half if still over cap (cold-start churn).
  const keys = [...buckets.keys()].slice(0, Math.floor(buckets.size / 2));
  for (const key of keys) buckets.delete(key);
}

/**
 * Simple sliding-window rate limit keyed by CF-Connecting-IP.
 * Returns 429 JSON when exceeded.
 */
export function rateLimit(opts: RateLimitOptions): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const now = Date.now();
    const ip = clientIp(c);
    const key = `${opts.prefix}:${ip}`;
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + opts.windowMs };
      buckets.set(key, bucket);
      pruneIfNeeded();
    }

    bucket.count += 1;
    const remaining = Math.max(0, opts.limit - bucket.count);
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    c.header("X-RateLimit-Limit", String(opts.limit));
    c.header("X-RateLimit-Remaining", String(remaining));
    c.header("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > opts.limit) {
      c.header("Retry-After", String(retryAfterSec));
      return errJson(
        c,
        "RATE_LIMITED",
        `Terlalu banyak permintaan. Coba lagi dalam ${retryAfterSec} detik.`,
        429,
      );
    }

    return next();
  };
}

/** Public reads (berita, kategori, artikel published, health). */
export const publicReadLimit = rateLimit({
  prefix: "get",
  limit: 120,
  windowMs: 60_000,
});

/** Authenticated CMS writes, analytics, webhooks. */
export const writeLimit = rateLimit({
  prefix: "write",
  limit: 40,
  windowMs: 60_000,
});

/** Media upload / delete — heavier on R2. */
export const mediaLimit = rateLimit({
  prefix: "media",
  limit: 20,
  windowMs: 60_000,
});

/** Rebuild / sensitive hooks. */
export const hookLimit = rateLimit({
  prefix: "hook",
  limit: 5,
  windowMs: 60_000,
});
