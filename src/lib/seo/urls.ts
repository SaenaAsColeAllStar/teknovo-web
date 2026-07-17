import { BRAND_LOGO_SRC } from "@/lib/branding";
import { getPublicAppBaseUrl } from "@/lib/public-app-url";

/** Absolute URL from site origin; https URLs pass through (R2 OG images). */
export function buildLandingAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = getPublicAppBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Alias — PPDB/LMS share the same public origin. */
export function buildPpdbAbsoluteUrl(path: string): string {
  return buildLandingAbsoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

export function truncateMetaDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

/** Resolve OG/Twitter image to an absolute URL (R2 or site). */
export function resolveOgImageUrl(imageUrl?: string | null, fallback = BRAND_LOGO_SRC): string {
  if (!imageUrl?.trim()) {
    return buildLandingAbsoluteUrl(fallback);
  }
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return buildLandingAbsoluteUrl(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
}

/** @deprecated Prefer resolveOgImageUrl */
export function resolveBeritaOgImageUrl(imageUrl?: string): string {
  return resolveOgImageUrl(imageUrl);
}
