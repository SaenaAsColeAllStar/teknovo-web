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

/** UI labels — Super Admin / Admin (staff) / Siswa are the primary create targets. */
export const CMS_ROLE_LABEL: Record<CmsRole, string> = {
  admin: "Super Admin",
  editor: "Admin",
  viewer: "Viewer",
  siswa: "Siswa",
};

/** Roles selectable when creating/managing accounts in CMS. */
export const CMS_MANAGEABLE_ROLES = ["admin", "editor", "siswa"] as const;
export type CmsManageableRole = (typeof CMS_MANAGEABLE_ROLES)[number];
