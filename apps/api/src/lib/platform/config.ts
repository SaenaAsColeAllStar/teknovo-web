/**
 * Platform feature flag + env (PRP Fase 10).
 * Default OFF — single-tenant Worker/Node school path unchanged.
 */
export function isPlatformEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const raw = (env.PLATFORM_ENABLED || "false").trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}

export function getPlatformDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env,
): string {
  return (
    env.PLATFORM_DATABASE_URL ||
    "postgresql://teknovo:teknovo@127.0.0.1:5434/teknovo_platform"
  );
}

export function getRedisUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.REDIS_URL || "redis://127.0.0.1:6379";
}

/** Base URL template for new tenant DBs (`{db}` = `tenant_<slug>`). */
export function getTenantDbUrlTemplate(
  env: NodeJS.ProcessEnv = process.env,
): string {
  return (
    env.TENANT_DB_URL_TEMPLATE ||
    "postgresql://teknovo:teknovo@127.0.0.1:5434/{db}"
  );
}
