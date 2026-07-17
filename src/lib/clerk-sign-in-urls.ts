/**
 * Path Clerk `<SignIn />` per app (path-based routing).
 * EduOS: tidak ada public SignUp — akun di-provision admin + `clerk:sync-users`.
 * Jangan andalkan satu `NEXT_PUBLIC_CLERK_SIGN_IN_URL` di root `.env` bersama —
 * set lewat `AuthSessionProvider` di layout masing-masing app.
 */

export const CLERK_HOSTED_SIGN_IN = {
  /** `@teknovo/admin` — tanpa basePath */
  console: "/sign-in",
  /** `@teknovo/finance` — segmen `/keuangan` */
  keuangan: "/keuangan/sign-in",
  /**
   * `@teknovo/exams` — path dalam app (Next.js `basePath` `/cbt` → publik `/cbt/sign-in`).
   */
  cbt: "/sign-in",
  /**
   * `@teknovo/messaging` — path dalam app (`basePath` `/wasender` → publik `/wasender/sign-in`).
   */
  wasender: "/sign-in",
} as const;

export const CLERK_AFTER_SIGN_IN = {
  console: "/auth/post-login",
  keuangan: "/auth/post-login",
  cbt: "/auth/cbt-post-login",
  wasender: "/auth/wasender-post-login",
} as const;
