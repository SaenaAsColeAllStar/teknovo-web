import { createHmac, timingSafeEqual } from "node:crypto";

import { isRedisLoginPathRotationActive as isRedisModeActive } from "@/lib/login-path-token-mode";

import { CLERK_HOSTED_SIGN_IN } from "@/lib/clerk-sign-in-urls";

/**
 * Path sign-in kanonik konsol (Clerk).
 * Legacy form sekolah: `/dashboard/login` (redirect → `/sign-in`).
 */
export const TEKNOVO_SIGN_IN_PATH = CLERK_HOSTED_SIGN_IN.console;

/** Legacy path form sekolah — masih dikenali untuk redirect. */
export const TEKNOVO_SIGN_IN_LEGACY_FORM_PATH = "/dashboard/login" as const;

/** Legacy console login — diarahkan ke `TEKNOVO_SIGN_IN_PATH`. */
export const TEKNOVO_SIGN_IN_LEGACY_PATH = "/rbac" as const;

const WINDOW_MS = 10 * 60 * 1000;

function getSecret(): string {
  return process.env.TEKNOVO_LOGIN_PATH_SECRET?.trim() || "";
}

function toToken(windowIndex: number, secret: string): string {
  const digest = createHmac("sha256", secret).update(String(windowIndex)).digest("hex");
  return digest.slice(0, 16);
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    return false;
  }
  return timingSafeEqual(ba, bb);
}

/** Pakai URL login publik kanonik (ujian, wa-sender) hanya di production — dev tetap basePath internal. */
function shouldUsePublicDeployLoginPaths(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Normalisasi segmen token dari URL (encoding, kapitalisasi hex, spasi). */
export function normalizeLoginPathToken(raw: string): string {
  try {
    return decodeURIComponent(raw).trim().toLowerCase();
  } catch {
    return raw.trim().toLowerCase();
  }
}

export function isLoginPathRotationEnabled(): boolean {
  return getSecret().length >= 16;
}

/** Mode token Redis sekali pakai aktif (butuh secret + `TEKNOVO_LOGIN_TOKEN_MODE=redis`). */
export function isRedisLoginPathRotationActive(): boolean {
  return isRedisModeActive(isLoginPathRotationEnabled());
}

export function currentLoginPathToken(now = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const windowIndex = Math.floor(now / WINDOW_MS);
  return toToken(windowIndex, secret);
}

export function isValidLoginPathToken(token: string, now = Date.now()): boolean {
  const secret = getSecret();
  if (!secret) {
    return false;
  }

  const normalized = normalizeLoginPathToken(token);
  if (!normalized) {
    return false;
  }

  const currentWindow = Math.floor(now / WINDOW_MS);
  const candidates = [
    toToken(currentWindow, secret),
    toToken(currentWindow - 1, secret),
    toToken(currentWindow + 1, secret),
  ];

  return candidates.some((candidate) => safeEqual(candidate, normalized));
}

/** Clerk `/sign-in` — tanpa rotasi token (topologi form sekolah dihapus). */
export function resolveSignInPath(_now = Date.now()): string {
  return TEKNOVO_SIGN_IN_PATH;
}

/** Normalisasi path login konsol (legacy `/rbac`, `/dashboard/login` → `/sign-in`). */
export function normalizeConsoleSignInPathname(pathname: string): string {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === TEKNOVO_SIGN_IN_LEGACY_PATH || path.startsWith(`${TEKNOVO_SIGN_IN_LEGACY_PATH}/`)) {
    return TEKNOVO_SIGN_IN_PATH;
  }
  if (
    path === TEKNOVO_SIGN_IN_LEGACY_FORM_PATH ||
    path.startsWith(`${TEKNOVO_SIGN_IN_LEGACY_FORM_PATH}/`)
  ) {
    return TEKNOVO_SIGN_IN_PATH;
  }
  return path;
}

export function isConsoleSignInPathname(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === TEKNOVO_SIGN_IN_PATH || path.startsWith(`${TEKNOVO_SIGN_IN_PATH}/`)) {
    return true;
  }
  if (
    path === TEKNOVO_SIGN_IN_LEGACY_FORM_PATH ||
    path.startsWith(`${TEKNOVO_SIGN_IN_LEGACY_FORM_PATH}/`)
  ) {
    return true;
  }
  if (path === TEKNOVO_SIGN_IN_LEGACY_PATH || path.startsWith(`${TEKNOVO_SIGN_IN_LEGACY_PATH}/`)) {
    return true;
  }
  return false;
}

/** Login portal Keuangan & TU (`@teknovo/finance`) — Clerk. */
export const TEKNOVO_TU_SIGN_IN_PATH = CLERK_HOSTED_SIGN_IN.keuangan;

/** Legacy form sekolah keuangan. */
export const TEKNOVO_TU_SIGN_IN_LEGACY_FORM_PATH = "/keuangan/login" as const;

/** Legacy TU login — diarahkan ke `TEKNOVO_TU_SIGN_IN_PATH`. */
export const TEKNOVO_TU_SIGN_IN_LEGACY_PATH = "/tata-usaha/login" as const;

/** Alias URL dengan underscore — diarahkan ke `TEKNOVO_TU_SIGN_IN_PATH`. */
export const TEKNOVO_TU_SIGN_IN_LEGACY_UNDERSCORE_PATH = "/tata_usaha/login" as const;

function toTuToken(windowIndex: number, secret: string): string {
  const digest = createHmac("sha256", secret).update(`tu:${String(windowIndex)}`).digest("hex");
  return digest.slice(0, 16);
}

export function currentTuLoginPathToken(now = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const windowIndex = Math.floor(now / WINDOW_MS);
  return toTuToken(windowIndex, secret);
}

export function isValidTuLoginPathToken(token: string, now = Date.now()): boolean {
  const secret = getSecret();
  if (!secret) {
    return false;
  }
  const normalized = normalizeLoginPathToken(token);
  if (!normalized) {
    return false;
  }
  const currentWindow = Math.floor(now / WINDOW_MS);
  const candidates = [
    toTuToken(currentWindow, secret),
    toTuToken(currentWindow - 1, secret),
    toTuToken(currentWindow + 1, secret),
  ];
  return candidates.some((candidate) => safeEqual(candidate, normalized));
}

export function resolveTuSignInPath(_now = Date.now()): string {
  return TEKNOVO_TU_SIGN_IN_PATH;
}

/** Normalisasi path login TU → `/keuangan/sign-in`. */
export function normalizeTuSignInPathname(pathname: string): string {
  const path = pathname.replace(/\/$/, "") || "/";
  for (const legacy of [
    TEKNOVO_TU_SIGN_IN_LEGACY_FORM_PATH,
    TEKNOVO_TU_SIGN_IN_LEGACY_PATH,
    TEKNOVO_TU_SIGN_IN_LEGACY_UNDERSCORE_PATH,
  ]) {
    if (path === legacy || path.startsWith(`${legacy}/`)) {
      return TEKNOVO_TU_SIGN_IN_PATH;
    }
  }
  return path;
}

export function isTuSignInPathname(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === TEKNOVO_TU_SIGN_IN_PATH || path.startsWith(`${TEKNOVO_TU_SIGN_IN_PATH}/`)) {
    return true;
  }
  for (const legacy of [
    TEKNOVO_TU_SIGN_IN_LEGACY_FORM_PATH,
    TEKNOVO_TU_SIGN_IN_LEGACY_PATH,
    TEKNOVO_TU_SIGN_IN_LEGACY_UNDERSCORE_PATH,
  ]) {
    if (path === legacy || path.startsWith(`${legacy}/`)) {
      return true;
    }
  }
  return false;
}

/** Path login publik WA Sender (Clerk). */
export const TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH = "/wasender/sign-in" as const;

/** Path login internal app WA Sender (basePath `/wasender`). */
export const TEKNOVO_WASENDER_SIGN_IN_PATH = CLERK_HOSTED_SIGN_IN.wasender;

/** Legacy form paths. */
export const TEKNOVO_WASENDER_SIGN_IN_LEGACY_PATH = "/wasender/login" as const;
export const TEKNOVO_WASENDER_PUBLIC_LEGACY_SIGN_IN_PATH = "/wa-sender/login" as const;
export const TEKNOVO_WASENDER_SIGN_IN_LEGACY_INNER_PATH = "/login" as const;

function toWasenderToken(windowIndex: number, secret: string): string {
  const digest = createHmac("sha256", secret).update(`wasender:${String(windowIndex)}`).digest("hex");
  return digest.slice(0, 16);
}

export function currentWasenderLoginPathToken(now = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const windowIndex = Math.floor(now / WINDOW_MS);
  return toWasenderToken(windowIndex, secret);
}

export function isValidWasenderLoginPathToken(token: string, now = Date.now()): boolean {
  const secret = getSecret();
  if (!secret) {
    return false;
  }
  const normalized = normalizeLoginPathToken(token);
  if (!normalized) {
    return false;
  }
  const currentWindow = Math.floor(now / WINDOW_MS);
  const candidates = [
    toWasenderToken(currentWindow, secret),
    toWasenderToken(currentWindow - 1, secret),
    toWasenderToken(currentWindow + 1, secret),
  ];
  return candidates.some((candidate) => safeEqual(candidate, normalized));
}

/**
 * Path login untuk redirect di dalam app WA Sender (basePath `/wasender`).
 * Kanonik Clerk: `/sign-in`.
 */
export function resolveWasenderAppLocalSignInPath(_now = Date.now()): string {
  return CLERK_HOSTED_SIGN_IN.wasender;
}

export function resolveWasenderSignInPath(_now = Date.now()): string {
  if (shouldUsePublicDeployLoginPaths()) {
    // Publik: `/wasender/sign-in` (nginx basePath) — bukan `/wa-sender/login` lama.
    return `${getWasenderAppBasePath() || "/wasender"}${CLERK_HOSTED_SIGN_IN.wasender}`;
  }
  return `${getWasenderAppBasePath()}${CLERK_HOSTED_SIGN_IN.wasender}`;
}

/** Prefix deploy WA Sender dari env (mis. `/wasender`). */
export function getWasenderAppBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_TEKNOVO_WA_SENDER_BASE_PATH?.trim();
  if (!raw || raw === "/") {
    return "";
  }
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return normalized.replace(/\/$/, "");
}

/** Path dalam app tanpa prefix deploy — untuk bandingkan dengan `TEKNOVO_WASENDER_SIGN_IN_PATH`. */
export function stripWasenderDeployPrefix(pathname: string): string {
  const prefix = getWasenderAppBasePath();
  const path = pathname.replace(/\/$/, "") || "/";
  if (prefix && path.startsWith(prefix)) {
    const rest = path.slice(prefix.length) || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return path;
}

/** Normalisasi path login WA Sender → `/wasender/sign-in`. */
export function normalizeWasenderSignInPathname(pathname: string): string {
  const path = pathname.replace(/\/$/, "") || "/";
  const inner = stripWasenderDeployPrefix(path);
  if (
    inner === TEKNOVO_WASENDER_SIGN_IN_PATH ||
    inner.startsWith(`${TEKNOVO_WASENDER_SIGN_IN_PATH}/`) ||
    inner === TEKNOVO_WASENDER_SIGN_IN_LEGACY_INNER_PATH ||
    inner.startsWith(`${TEKNOVO_WASENDER_SIGN_IN_LEGACY_INNER_PATH}/`)
  ) {
    return TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH;
  }
  if (
    path === TEKNOVO_WASENDER_SIGN_IN_LEGACY_PATH ||
    path.startsWith(`${TEKNOVO_WASENDER_SIGN_IN_LEGACY_PATH}/`) ||
    path === TEKNOVO_WASENDER_PUBLIC_LEGACY_SIGN_IN_PATH ||
    path.startsWith(`${TEKNOVO_WASENDER_PUBLIC_LEGACY_SIGN_IN_PATH}/`)
  ) {
    return TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH;
  }
  return path;
}

export function isWasenderSignInPathname(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const normalized = normalizeWasenderSignInPathname(path);
  if (
    normalized === TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH ||
    normalized.startsWith(`${TEKNOVO_WASENDER_PUBLIC_SIGN_IN_PATH}/`)
  ) {
    return true;
  }
  const inner = stripWasenderDeployPrefix(path);
  return (
    inner === "/sign-in" ||
    inner.startsWith("/sign-in/") ||
    inner === "/login" ||
    inner.startsWith("/login/")
  );
}

/** Path relatif login WA Sender dengan prefix deploy (untuk `signOut` di klien, dev). */
export function getWasenderSignInCallbackPath(): string {
  if (shouldUsePublicDeployLoginPaths()) {
    return `${getWasenderAppBasePath() || "/wasender"}${CLERK_HOSTED_SIGN_IN.wasender}`;
  }
  return `${getWasenderAppBasePath()}${CLERK_HOSTED_SIGN_IN.wasender}`;
}

/** Path login publik CBT (Clerk). */
export const TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH = "/cbt/sign-in" as const;

/** Path login internal app CBT (basePath `/cbt`). */
export const TEKNOVO_CBT_SIGN_IN_PATH = CLERK_HOSTED_SIGN_IN.cbt;

/** Legacy form paths. */
export const TEKNOVO_CBT_SIGN_IN_LEGACY_PATH = "/cbt/login" as const;
export const TEKNOVO_CBT_PUBLIC_LEGACY_SIGN_IN_PATH = "/ujian/login" as const;
export const TEKNOVO_CBT_SIGN_IN_LEGACY_INNER_PATH = "/login" as const;

function toCbtToken(windowIndex: number, secret: string): string {
  const digest = createHmac("sha256", secret).update(`cbt:${String(windowIndex)}`).digest("hex");
  return digest.slice(0, 16);
}

export function currentCbtLoginPathToken(now = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const windowIndex = Math.floor(now / WINDOW_MS);
  return toCbtToken(windowIndex, secret);
}

export function isValidCbtLoginPathToken(token: string, now = Date.now()): boolean {
  const secret = getSecret();
  if (!secret) {
    return false;
  }
  const normalized = normalizeLoginPathToken(token);
  if (!normalized) {
    return false;
  }
  const currentWindow = Math.floor(now / WINDOW_MS);
  const candidates = [
    toCbtToken(currentWindow, secret),
    toCbtToken(currentWindow - 1, secret),
    toCbtToken(currentWindow + 1, secret),
  ];
  return candidates.some((candidate) => safeEqual(candidate, normalized));
}

/**
 * Path login untuk redirect di dalam app CBT (basePath `/cbt`).
 * Kanonik Clerk: `/sign-in` — jangan prepend `/cbt` (Next.js `redirect` menambah basePath).
 */
export function resolveCbtAppLocalSignInPath(_now = Date.now()): string {
  return CLERK_HOSTED_SIGN_IN.cbt;
}

export function resolveCbtSignInPath(_now = Date.now()): string {
  if (shouldUsePublicDeployLoginPaths()) {
    return `${getCbtAppBasePath() || "/cbt"}${CLERK_HOSTED_SIGN_IN.cbt}`;
  }
  return `${getCbtAppBasePath()}${CLERK_HOSTED_SIGN_IN.cbt}`;
}

/** Prefix deploy CBT dari env (mis. `/cbt`). */
export function getCbtAppBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_TEKNOVO_CBT_BASE_PATH?.trim();
  if (!raw || raw === "/") {
    return "";
  }
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return normalized.replace(/\/$/, "");
}

export function stripCbtDeployPrefix(pathname: string): string {
  const prefix = getCbtAppBasePath();
  const path = pathname.replace(/\/$/, "") || "/";
  if (prefix && path.startsWith(prefix)) {
    const rest = path.slice(prefix.length) || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return path;
}

/** Normalisasi path login CBT → `/cbt/sign-in`. */
export function normalizeCbtSignInPathname(pathname: string): string {
  const path = pathname.replace(/\/$/, "") || "/";
  const inner = stripCbtDeployPrefix(path);
  if (
    inner === TEKNOVO_CBT_SIGN_IN_PATH ||
    inner.startsWith(`${TEKNOVO_CBT_SIGN_IN_PATH}/`) ||
    inner === TEKNOVO_CBT_SIGN_IN_LEGACY_INNER_PATH ||
    inner.startsWith(`${TEKNOVO_CBT_SIGN_IN_LEGACY_INNER_PATH}/`)
  ) {
    return TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH;
  }
  if (
    path === TEKNOVO_CBT_SIGN_IN_LEGACY_PATH ||
    path.startsWith(`${TEKNOVO_CBT_SIGN_IN_LEGACY_PATH}/`) ||
    path === TEKNOVO_CBT_PUBLIC_LEGACY_SIGN_IN_PATH ||
    path.startsWith(`${TEKNOVO_CBT_PUBLIC_LEGACY_SIGN_IN_PATH}/`)
  ) {
    return TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH;
  }
  return path;
}

export function isCbtSignInPathname(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const normalized = normalizeCbtSignInPathname(path);
  if (
    normalized === TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH ||
    normalized.startsWith(`${TEKNOVO_CBT_PUBLIC_SIGN_IN_PATH}/`)
  ) {
    return true;
  }
  const inner = stripCbtDeployPrefix(path);
  return (
    inner === "/sign-in" ||
    inner.startsWith("/sign-in/") ||
    inner === "/login" ||
    inner.startsWith("/login/")
  );
}

export function getCbtSignInCallbackPath(): string {
  if (shouldUsePublicDeployLoginPaths()) {
    return `${getCbtAppBasePath() || "/cbt"}${CLERK_HOSTED_SIGN_IN.cbt}`;
  }
  return `${getCbtAppBasePath()}${CLERK_HOSTED_SIGN_IN.cbt}`;
}
