/**
 * URL publik app Keuangan (TU) & validasi callback login lintas app.
 */

import { resolveTuSignInPath, TEKNOVO_TU_SIGN_IN_PATH } from "@/lib/auth-sign-in-path";
import { safeRedirect } from "@/vendor/security/safe-redirect";

function normalizeBase(raw: string | undefined): string {
  let base = raw?.trim().replace(/\/$/, "") ?? "";
  // Legacy deploy pakai subpath /keuangan — nginx produksi tidak punya prefix itu.
  if (base.endsWith("/keuangan")) {
    base = base.slice(0, -"/keuangan".length);
  }
  return base;
}

/** Origin publik app keuangan (mis. `https://smkteknovo.sch.id` atau dev `http://127.0.0.1:3005`). */
export function getKeuanganPublicOrigin(): string {
  const fromEnv = normalizeBase(process.env.NEXT_PUBLIC_TEKNOVO_KEUANGAN_URL);
  if (fromEnv) {
    return fromEnv;
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://127.0.0.1:3005";
  }
  return "";
}

/** Origin console untuk redirect peran non-TU & proxy API internal. */
export function getConsolePublicOrigin(): string {
  const fromEnv = normalizeBase(process.env.NEXT_PUBLIC_TEKNOVO_CONSOLE_ORIGIN);
  if (fromEnv) {
    return fromEnv;
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://127.0.0.1:3002";
  }
  return "";
}

/** Path relatif modul keuangan (sama di console & app keuangan bila satu domain). */
export function keuanganAppPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = getKeuanganPublicOrigin();
  if (!origin) {
    return p;
  }
  return `${origin}${p}`;
}

export const KEUANGAN_HUB_PATH = "/tata-usaha/keuangan-spp" as const;

/** Hub acara kegiatan — post-login role BENDAHARA. */
export const BENDAHARA_ACARA_HUB_PATH = "/tata-usaha/kas-sekolah/acara" as const;

/** Hub utama setelah login keuangan (TU, Admin Sekolah, Kepala Sekolah). */
export function getKeuanganHubUrl(): string {
  return keuanganAppPath(KEUANGAN_HUB_PATH);
}

/**
 * Tautan langsung ke hub keuangan dari konsol — sesi Auth.js shared cookie (tanpa re-login).
 * Sama domain production: `/tata-usaha/keuangan-spp`.
 */
export function getKeuanganDirectHubUrl(): string {
  return KEUANGAN_HUB_PATH;
}

/** URL login TU lengkap (origin + path + token rotasi). */
export function buildTuPublicSignInUrl(search = "", hash = "", now = Date.now()): string {
  const loginPath = resolveTuSignInPath(now);
  const base = getKeuanganPublicOrigin();
  if (base) {
    return `${base}${loginPath}${search}${hash}`;
  }
  return `${loginPath}${search}${hash}`;
}

/** Origin situs utama (sama untuk konsol & keuangan di production). */
export function getSitePublicOrigin(): string {
  return getConsolePublicOrigin() || getKeuanganPublicOrigin();
}

/**
 * Validasi `callbackUrl` dari query login — path internal keuangan atau origin keuangan.
 */
export function resolveKeuanganAuthCallbackUrl(raw: string | undefined | null): string | null {
  const value = safeRedirect(raw);
  if (!value) {
    return null;
  }
  if (value.startsWith("/")) {
    if (
      value.startsWith(TEKNOVO_TU_SIGN_IN_PATH) ||
      value.startsWith("/tata-usaha/login") ||
      value.startsWith("/tata-usaha/keuangan") ||
      value.startsWith("/tata-usaha/kas-sekolah")
    ) {
      return value;
    }
    return null;
  }
  try {
    const parsed = new URL(value);
    const allowed = getKeuanganPublicOrigin();
    if (!allowed) {
      return null;
    }
    const allowedOrigin = new URL(allowed).origin;
    if (parsed.origin !== allowedOrigin) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
