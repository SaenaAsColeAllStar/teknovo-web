/**
 * Pure tenant hint extraction (header → subdomain → path). No Platform DB.
 * Safe for Worker typecheck / unit tests.
 */
import type { TenantResolveSource } from "./platform/types";

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "cf",
  "cms",
  "clerk",
  "accounts",
  "storage",
  "r2",
  "localhost",
]);

export function extractTenantHint(input: {
  headers: Headers;
  url: URL;
}): { hint: string | null; source: TenantResolveSource } {
  const headerId = input.headers.get("x-tenant-id")?.trim();
  if (headerId) return { hint: headerId, source: "header-id" };

  const headerSlug = input.headers
    .get("x-tenant-slug")
    ?.trim()
    .toLowerCase();
  if (headerSlug) return { hint: headerSlug, source: "header-slug" };

  const host = (
    input.headers.get("x-forwarded-host") ||
    input.headers.get("host") ||
    input.url.host
  )
    .split(":")[0]
    ?.toLowerCase();

  if (host && host.includes(".")) {
    const sub = host.split(".")[0];
    if (sub && !RESERVED_SUBDOMAINS.has(sub) && sub !== "smkteknovo") {
      return { hint: sub, source: "subdomain" };
    }
  }

  const pathMatch = input.url.pathname.match(/^\/t\/([a-z0-9-]+)(?:\/|$)/i);
  if (pathMatch?.[1]) {
    return { hint: pathMatch[1].toLowerCase(), source: "path" };
  }

  return { hint: null, source: "none" };
}
