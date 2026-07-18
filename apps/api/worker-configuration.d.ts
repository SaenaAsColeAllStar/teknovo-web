/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  CMS_BUCKET: R2Bucket;
  R2_PUBLIC_URL: string;
  CMS_ORIGIN: string;
  WEB_ORIGIN: string;
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SECRET?: string;
  GITHUB_REBUILD_TOKEN?: string;
  GITHUB_REPO?: string;
  REBUILD_WEB_SECRET?: string;
}
