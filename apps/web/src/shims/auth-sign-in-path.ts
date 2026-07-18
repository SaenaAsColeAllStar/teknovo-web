/**
 * Astro/public landing shim — static portal paths only (no node:crypto).
 * Mirrors the public constants used by `public-site-footer`.
 */

export const TEKNOVO_SIGN_IN_PATH = "/sign-in" as const;
export const TEKNOVO_TU_SIGN_IN_PATH = "/keuangan/sign-in" as const;
export const TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH = "/wasender/sign-in" as const;
export const TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH = "/cbt/sign-in" as const;

export function resolveSignInPath(_now = Date.now()): string {
  return TEKNOVO_SIGN_IN_PATH;
}

export function resolveTuSignInPath(_now = Date.now()): string {
  return TEKNOVO_TU_SIGN_IN_PATH;
}
