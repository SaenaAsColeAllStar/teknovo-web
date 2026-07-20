/**
 * Tenant resolution middleware (F-38 / Fase 10.2) — Node / PLATFORM_ENABLED only.
 */
import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "./http";
import { isUuid } from "./ids";
import { isPlatformEnabled } from "./platform/config";
import { getPlatformPrisma } from "./platform/client";
import type {
  TenantContext,
  TenantResolveSource,
} from "./platform/types";
import { extractTenantHint } from "./tenant-hint";

export type { TenantContext, TenantResolveSource };
export { extractTenantHint };

type TenantRow = {
  id: string;
  slug: string;
  domain: string | null;
  status: TenantContext["status"];
  minioBucket: string | null;
};

export async function lookupTenant(
  hint: string,
  source: TenantResolveSource,
): Promise<TenantRow | null> {
  const prisma = getPlatformPrisma();
  if (source === "header-id" || isUuid(hint)) {
    return prisma.tenant.findFirst({
      where: {
        OR: [{ id: hint }, { slug: hint }, { domain: hint }],
        NOT: { status: "DELETED" },
      },
    });
  }
  return prisma.tenant.findFirst({
    where: {
      OR: [{ slug: hint }, { domain: hint }],
      NOT: { status: "DELETED" },
    },
  });
}

export function toTenantContext(tenant: TenantRow): TenantContext {
  return {
    id: tenant.id,
    slug: tenant.slug,
    domain: tenant.domain,
    status: tenant.status,
    minioBucket: tenant.minioBucket,
  };
}

/**
 * Attach `tenant` + `tenantSource` when a hint resolves.
 * Missing tenant does not 404 — single-tenant school routes keep working.
 */
export const tenantRouterMiddleware: MiddlewareHandler<AppEnv> = async (
  c,
  next,
) => {
  if (!isPlatformEnabled()) {
    return next();
  }

  const url = new URL(c.req.url);
  const { hint, source } = extractTenantHint({
    headers: c.req.raw.headers,
    url,
  });

  c.set("tenantSource", source);

  if (!hint || source === "none") {
    return next();
  }

  try {
    const tenant = await lookupTenant(hint, source);
    if (tenant) {
      c.set("tenant", toTenantContext(tenant));
    }
  } catch {
    // Platform DB down — do not break school API.
  }

  return next();
};
