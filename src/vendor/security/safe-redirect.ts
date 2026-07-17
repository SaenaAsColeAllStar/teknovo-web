export type SafeRedirectOptions = {
  fallback?: string;
  baseUrl?: string;
};

const DEV_LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().split(":")[0] ?? hostname.toLowerCase();
}

function getAllowedRedirectHosts(): string[] {
  const raw = process.env.ALLOWED_HOSTS ?? process.env.ALLOWED_REDIRECTS ?? "";
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function isHostnameAllowedForRedirect(hostname: string, allowedHosts: string[]): boolean {
  const host = normalizeHostname(hostname);
  for (const entry of allowedHosts) {
    if (host === entry || host.endsWith(`.${entry}`)) return true;
  }
  return false;
}

export function safeRedirect(
  raw: string | null | undefined,
  options: SafeRedirectOptions = {},
): string | null {
  const value = raw?.trim();
  if (!value) return null;
  if (value.startsWith("//")) return null;
  if (/^\s*javascript:/i.test(value) || /^\s*data:/i.test(value)) return null;
  if (value.startsWith("/")) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    const allowed = getAllowedRedirectHosts();
    if (allowed.length > 0) {
      return isHostnameAllowedForRedirect(parsed.hostname, allowed) ? parsed.toString() : null;
    }
    if (process.env.NODE_ENV !== "production" && DEV_LOCAL_HOSTS.has(normalizeHostname(parsed.hostname))) {
      return parsed.toString();
    }
    if (options.baseUrl) {
      const baseOrigin = new URL(options.baseUrl).origin;
      return parsed.origin === baseOrigin ? parsed.toString() : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function safeRedirectOrFallback(
  raw: string | null | undefined,
  options: SafeRedirectOptions = {},
): string {
  return safeRedirect(raw, options) ?? options.fallback ?? "/";
}
