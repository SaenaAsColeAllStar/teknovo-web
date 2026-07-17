/**
 * URL publik aplikasi (tanpa trailing slash) — untuk tautan di email (reset password, dll.).
 */
export function getPublicAppBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "";
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
