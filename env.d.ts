/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker bindings declared in wrangler.toml.
 * Kept in-repo because `cloudflare-env.d.ts` (wrangler types) is gitignored.
 * Run `pnpm cf-typegen` locally for the full generated Env + runtime types.
 */
interface CloudflareEnv {
  DB: D1Database;
  CMS_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  NEXT_PUBLIC_APP_URL: string;
  R2_PUBLIC_URL: string;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends CloudflareEnv {}
}
