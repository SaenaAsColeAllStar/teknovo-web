/**
 * Derive a Clerk-safe username from email (or an optional preferred handle).
 *
 * Clerk default rules (Dashboard → User & authentication → Username):
 * - 4–64 chars, Latin-based
 * - no reserved specials (^$!.`#+~)
 * - must include a non-digit character
 *
 * CMS create-user does not ask admins for a username; we derive one so
 * `users.createUser` succeeds when Username is required on the instance.
 */
export const CLERK_USERNAME_MIN = 4;
export const CLERK_USERNAME_MAX = 64;

const RESERVED = new Set([
  "admin",
  "administrator",
  "root",
  "system",
  "null",
  "undefined",
  "clerk",
  "api",
  "www",
]);

export function deriveClerkUsername(
  email: string,
  preferred?: string | null,
): string {
  const local = email.trim().split("@")[0] ?? "";
  const raw = (preferred?.trim() || local || "user").toLowerCase();

  let cleaned = raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  if (!cleaned || /^\d+$/.test(cleaned)) {
    cleaned = cleaned ? `u_${cleaned}` : "user";
  }

  if (cleaned.length < CLERK_USERNAME_MIN) {
    cleaned = `${cleaned}_user`.replace(/_+/g, "_");
  }

  if (RESERVED.has(cleaned)) {
    cleaned = `${cleaned}_cms`;
  }

  return cleaned.slice(0, CLERK_USERNAME_MAX).replace(/_+$/g, "") || "user";
}

/** Append a short numeric suffix for uniqueness retries (keeps length ≤ 64). */
export function withClerkUsernameSuffix(base: string, attempt: number): string {
  const suffix = `_${attempt + 1}${Date.now().toString(36).slice(-3)}`;
  const maxBase = CLERK_USERNAME_MAX - suffix.length;
  const trimmed = base.slice(0, Math.max(CLERK_USERNAME_MIN, maxBase));
  return `${trimmed}${suffix}`.slice(0, CLERK_USERNAME_MAX);
}
