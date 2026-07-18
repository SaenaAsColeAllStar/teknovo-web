/**
 * Clerk helpers — server/client guards and role checks.
 * Full setup: docs/CLERK.md
 *
 * Role → capabilities (enforced server-side via `src/lib/cms-auth.ts`):
 * - viewer: read dashboard lists / forms (no writes)
 * - editor: berita sekolah, kategori, media writes (no moderasi approve, no settings)
 * - admin: editor + moderasi approve/reject + pengaturan (P3)
 * - siswa: artikel milik sendiri (ekskul), view/tambah kategori, upload media;
 *          no berita sekolah, no delete media library all, no settings, no moderasi
 */

export const CLERK_PROTECTED_PREFIXES = ["/dashboard"] as const;

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("GANTI_"),
  );
}

/** Roles synced via Clerk publicMetadata (set by webhook later). */
export type CmsRole = "admin" | "editor" | "viewer" | "siswa";

export function parseCmsRole(meta: unknown): CmsRole {
  if (
    meta &&
    typeof meta === "object" &&
    "role" in meta &&
    typeof (meta as { role: unknown }).role === "string"
  ) {
    const role = (meta as { role: string }).role;
    if (
      role === "admin" ||
      role === "editor" ||
      role === "viewer" ||
      role === "siswa"
    ) {
      return role;
    }
  }
  return "viewer";
}

/** Berita sekolah + full media delete — staff writers only. */
export function cmsRoleCanWriteContent(role: CmsRole): boolean {
  return role === "admin" || role === "editor";
}

/** Artikel ekstrakurikuler / siswa channel. */
export function cmsRoleCanWriteArtikel(role: CmsRole): boolean {
  return role === "admin" || role === "editor" || role === "siswa";
}

/** View + tambah kategori (matrix: Admin & Siswa). */
export function cmsRoleCanWriteKategori(role: CmsRole): boolean {
  return role === "admin" || role === "editor" || role === "siswa";
}

/** Upload to CMS media library. */
export function cmsRoleCanUploadMedia(role: CmsRole): boolean {
  return role === "admin" || role === "editor" || role === "siswa";
}

/** Approve / tolak artikel siswa — Super Admin (`admin`) only. */
export function cmsRoleCanModerate(role: CmsRole): boolean {
  return role === "admin";
}

/** View moderasi queue (admin approve; editor may browse). */
export function cmsRoleCanViewModerasi(role: CmsRole): boolean {
  return role === "admin" || role === "editor";
}

/** Berita sekolah nav / lists — not for siswa submitters. */
export function cmsRoleCanAccessBeritaSekolah(role: CmsRole): boolean {
  return role !== "siswa";
}

export function cmsRoleCanManageSettings(role: CmsRole): boolean {
  return role === "admin";
}

/** Invite-only user management: Super Admin + Admin (`editor`). */
export function cmsRoleCanManageUsers(role: CmsRole): boolean {
  return role === "admin" || role === "editor";
}

/**
 * Roles that `actor` may assign when inviting / creating / patching users.
 * Super Admin (`admin`) may invite other Super Admins; Admin (`editor`) → Siswa only.
 */
export function cmsAssignableRoles(actor: CmsRole): readonly CmsRole[] {
  if (actor === "admin") return ["admin", "editor", "siswa", "viewer"] as const;
  if (actor === "editor") return ["siswa"] as const;
  return [] as const;
}

export function cmsRoleCanAssignRole(
  actor: CmsRole,
  targetRole: CmsRole,
): boolean {
  return (cmsAssignableRoles(actor) as readonly string[]).includes(targetRole);
}

/** UI labels — Super Admin / Admin (staff) / Siswa are the primary create targets. */
export const CMS_ROLE_LABEL: Record<CmsRole, string> = {
  admin: "Super Admin",
  editor: "Admin",
  viewer: "Viewer",
  siswa: "Siswa",
};

/** @deprecated Prefer `cmsAssignableRoles(actor)`. */
export const CMS_MANAGEABLE_ROLES = [
  "admin",
  "editor",
  "siswa",
  "viewer",
] as const;
export type CmsManageableRole = (typeof CMS_MANAGEABLE_ROLES)[number];
