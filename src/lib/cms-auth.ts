import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  parseCmsRole,
  type CmsRole,
  cmsRoleCanWriteContent,
  cmsRoleCanWriteArtikel,
  cmsRoleCanWriteKategori,
  cmsRoleCanUploadMedia,
  cmsRoleCanModerate,
  cmsRoleCanViewModerasi,
  cmsRoleCanAccessBeritaSekolah,
  cmsRoleCanManageSettings,
  cmsRoleCanManageUsers,
} from "@/lib/clerk";

export class CmsAuthError extends Error {
  constructor(
    message: string,
    public status: 401 | 403 = 401,
  ) {
    super(message);
    this.name = "CmsAuthError";
  }
}

export type CmsSession = {
  userId: string;
  role: CmsRole;
  canWrite: boolean;
  canWriteArtikel: boolean;
  canWriteKategori: boolean;
  canUploadMedia: boolean;
  canModerate: boolean;
  canViewModerasi: boolean;
  canAccessBeritaSekolah: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
};

/** Resolve Clerk user + `publicMetadata.role` for dashboard/API guards. */
export async function getCmsSession(): Promise<CmsSession | null> {
  const session = await auth();
  if (!session.userId) return null;

  const user = await currentUser();
  const role = parseCmsRole(user?.publicMetadata);

  return {
    userId: session.userId,
    role,
    canWrite: cmsRoleCanWriteContent(role),
    canWriteArtikel: cmsRoleCanWriteArtikel(role),
    canWriteKategori: cmsRoleCanWriteKategori(role),
    canUploadMedia: cmsRoleCanUploadMedia(role),
    canModerate: cmsRoleCanModerate(role),
    canViewModerasi: cmsRoleCanViewModerasi(role),
    canAccessBeritaSekolah: cmsRoleCanAccessBeritaSekolah(role),
    canManageSettings: cmsRoleCanManageSettings(role),
    canManageUsers: cmsRoleCanManageUsers(role),
  };
}

export async function requireCmsSession(): Promise<CmsSession> {
  const cms = await getCmsSession();
  if (!cms) {
    throw new CmsAuthError("Sesi tidak valid. Masuk ulang.", 401);
  }
  return cms;
}

/** editor | admin — berita sekolah, kategori staff, media delete. */
export async function requireCmsWriter(): Promise<CmsSession> {
  const cms = await requireCmsSession();
  if (!cms.canWrite) {
    throw new CmsAuthError(
      "Peran Anda tidak dapat menulis konten berita sekolah. Minta admin menaikkan peran.",
      403,
    );
  }
  return cms;
}

/** admin | editor | siswa — artikel ekstrakurikuler writes. */
export async function requireCmsArtikelWriter(): Promise<CmsSession> {
  const cms = await requireCmsSession();
  if (!cms.canWriteArtikel) {
    throw new CmsAuthError(
      "Peran viewer hanya dapat membaca. Minta admin menaikkan peran Anda.",
      403,
    );
  }
  return cms;
}

/** admin | editor | siswa — media upload. */
export async function requireCmsMediaUploader(): Promise<CmsSession> {
  const cms = await requireCmsSession();
  if (!cms.canUploadMedia) {
    throw new CmsAuthError(
      "Peran viewer tidak dapat mengunggah media.",
      403,
    );
  }
  return cms;
}

/** admin only — approve/tolak artikel siswa. */
export async function requireCmsModerator(): Promise<CmsSession> {
  const cms = await requireCmsSession();
  if (!cms.canModerate) {
    throw new CmsAuthError(
      "Hanya admin yang dapat menyetujui atau menolak artikel siswa.",
      403,
    );
  }
  return cms;
}

/** admin only — pengaturan (P3). */
export async function requireCmsAdmin(): Promise<CmsSession> {
  const cms = await requireCmsSession();
  if (!cms.canManageSettings) {
    throw new CmsAuthError("Hanya admin yang dapat mengakses pengaturan.", 403);
  }
  return cms;
}

/** Super Admin or Admin (`editor`) — invite-only user management. */
export async function requireCmsUserManager(): Promise<CmsSession> {
  const cms = await requireCmsSession();
  if (!cms.canManageUsers) {
    throw new CmsAuthError(
      "Hanya Super Admin atau Admin yang dapat mengelola pengguna.",
      403,
    );
  }
  return cms;
}

export function cmsAuthErrorResponse(err: unknown): NextResponse {
  if (err instanceof CmsAuthError) {
    return NextResponse.json(
      { ok: false, error: { code: "FORBIDDEN", message: err.message } },
      { status: err.status },
    );
  }
  return NextResponse.json(
    {
      ok: false,
      error: { code: "INTERNAL", message: "Terjadi kesalahan server." },
    },
    { status: 500 },
  );
}
