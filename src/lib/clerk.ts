/**
 * Clerk helpers — server/client guards and role checks.
 * Full setup: docs/CLERK.md
 *
 * Role → capabilities (enforced server-side via `src/lib/cms-auth.ts`):
 * - viewer: read dashboard lists / forms (no writes)
 * - editor: berita, kategori, media writes
 * - admin: editor + pengaturan (P3)
 */

export const CLERK_PROTECTED_PREFIXES = ["/dashboard"] as const;

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("GANTI_"),
  );
}

/** Roles synced via Clerk publicMetadata (set by webhook later). */
export type CmsRole = "admin" | "editor" | "viewer";

export function parseCmsRole(meta: unknown): CmsRole {
  if (
    meta &&
    typeof meta === "object" &&
    "role" in meta &&
    typeof (meta as { role: unknown }).role === "string"
  ) {
    const role = (meta as { role: string }).role;
    if (role === "admin" || role === "editor" || role === "viewer") {
      return role;
    }
  }
  return "viewer";
}

export function cmsRoleCanWriteContent(role: CmsRole): boolean {
  return role === "admin" || role === "editor";
}

export function cmsRoleCanManageSettings(role: CmsRole): boolean {
  return role === "admin";
}

export const CMS_ROLE_LABEL: Record<CmsRole, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};
