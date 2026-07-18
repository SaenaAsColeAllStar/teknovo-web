/** CMS roles — Clerk publicMetadata.role */
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

export function cmsRoleCanWriteContent(role: CmsRole): boolean {
  return role === "admin" || role === "editor";
}

export function cmsRoleCanWriteArtikel(role: CmsRole): boolean {
  return role === "admin" || role === "editor" || role === "siswa";
}

export function cmsRoleCanWriteKategori(role: CmsRole): boolean {
  return role === "admin" || role === "editor" || role === "siswa";
}

export function cmsRoleCanUploadMedia(role: CmsRole): boolean {
  return role === "admin" || role === "editor" || role === "siswa";
}

export function cmsRoleCanModerate(role: CmsRole): boolean {
  return role === "admin";
}

export function cmsRoleCanViewModerasi(role: CmsRole): boolean {
  return role === "admin" || role === "editor";
}

export function cmsRoleCanAccessBeritaSekolah(role: CmsRole): boolean {
  return role !== "siswa";
}

export function cmsRoleCanManageSettings(role: CmsRole): boolean {
  return role === "admin";
}

/**
 * Super Admin + Admin may CRUD fasilitas / ekstrakurikuler / prestasi.
 * Same matrix as berita writers (`admin` | `editor`).
 */
export function cmsRoleCanManageSiteContent(role: CmsRole): boolean {
  return role === "admin" || role === "editor";
}

/**
 * Super Admin only — replace public landing / brand media used by `apps/web`.
 */
export function cmsRoleCanManageSiteMedia(role: CmsRole): boolean {
  return role === "admin";
}

/**
 * Invite-only CMS: Super Admin (`admin`) and Admin (`editor`) may manage users.
 * Siswa / viewer / public cannot create accounts.
 */
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

/**
 * @deprecated Prefer `cmsAssignableRoles(actor)`.
 * Kept for older UI that listed create targets without actor context.
 */
export const CMS_MANAGEABLE_ROLES = [
  "admin",
  "editor",
  "siswa",
  "viewer",
] as const;
export type CmsManageableRole = (typeof CMS_MANAGEABLE_ROLES)[number];
