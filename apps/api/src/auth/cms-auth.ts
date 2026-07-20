import { createClerkClient, verifyToken } from "@clerk/backend";
import {
  parseCmsRole,
  cmsRoleCanWriteContent,
  cmsRoleCanWriteArtikel,
  cmsRoleCanWriteKategori,
  cmsRoleCanUploadMedia,
  cmsRoleCanModerate,
  cmsRoleCanViewModerasi,
  cmsRoleCanAccessBeritaSekolah,
  cmsRoleCanManageSettings,
  cmsRoleCanManageUsers,
  cmsRoleCanManageSiteContent,
  cmsRoleCanManageSiteMedia,
  type CmsRole,
} from "@teknovo/shared";

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
  fullName: string | null;
  email: string | null;
  canWrite: boolean;
  canWriteArtikel: boolean;
  canWriteKategori: boolean;
  canUploadMedia: boolean;
  canModerate: boolean;
  canViewModerasi: boolean;
  canAccessBeritaSekolah: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
  canManageSiteContent: boolean;
  canManageSiteMedia: boolean;
};

function sessionFromRole(
  userId: string,
  role: CmsRole,
  fullName: string | null,
  email: string | null,
): CmsSession {
  return {
    userId,
    role,
    fullName,
    email,
    canWrite: cmsRoleCanWriteContent(role),
    canWriteArtikel: cmsRoleCanWriteArtikel(role),
    canWriteKategori: cmsRoleCanWriteKategori(role),
    canUploadMedia: cmsRoleCanUploadMedia(role),
    canModerate: cmsRoleCanModerate(role),
    canViewModerasi: cmsRoleCanViewModerasi(role),
    canAccessBeritaSekolah: cmsRoleCanAccessBeritaSekolah(role),
    canManageSettings: cmsRoleCanManageSettings(role),
    canManageUsers: cmsRoleCanManageUsers(role),
    canManageSiteContent: cmsRoleCanManageSiteContent(role),
    canManageSiteMedia: cmsRoleCanManageSiteMedia(role),
  };
}

import type { ClerkEnv } from "../lib/http";

export async function resolveCmsSession(
  request: Request,
  env: ClerkEnv,
): Promise<CmsSession | null> {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  if (!token || !env.CLERK_SECRET_KEY) return null;

  try {
    const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });
    const userId = payload.sub;
    if (!userId) return null;

    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
    const user = await clerk.users.getUser(userId);
    const role = parseCmsRole(user.publicMetadata);
    return sessionFromRole(
      userId,
      role,
      user.fullName,
      user.primaryEmailAddress?.emailAddress ?? null,
    );
  } catch {
    return null;
  }
}

export async function requireCmsSession(
  request: Request,
  env: ClerkEnv,
): Promise<CmsSession> {
  const cms = await resolveCmsSession(request, env);
  if (!cms) throw new CmsAuthError("Sesi tidak valid. Masuk ulang.", 401);
  return cms;
}

export async function requireCmsWriter(request: Request, env: ClerkEnv) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canWrite) {
    throw new CmsAuthError(
      "Peran Anda tidak dapat menulis konten berita sekolah.",
      403,
    );
  }
  return cms;
}

export async function requireCmsArtikelWriter(request: Request, env: ClerkEnv) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canWriteArtikel) {
    throw new CmsAuthError("Peran viewer hanya dapat membaca.", 403);
  }
  return cms;
}

export async function requireCmsMediaUploader(request: Request, env: ClerkEnv) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canUploadMedia) {
    throw new CmsAuthError("Peran viewer tidak dapat mengunggah media.", 403);
  }
  return cms;
}

export async function requireCmsModerator(request: Request, env: ClerkEnv) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canModerate) {
    throw new CmsAuthError(
      "Hanya admin yang dapat menyetujui atau menolak artikel siswa.",
      403,
    );
  }
  return cms;
}

export async function requireCmsAdmin(request: Request, env: ClerkEnv) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canManageSettings) {
    throw new CmsAuthError("Hanya admin yang dapat mengakses pengaturan.", 403);
  }
  return cms;
}

/** Super Admin or Admin (`editor`) — invite-only user management. */
export async function requireCmsUserManager(request: Request, env: ClerkEnv) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canManageUsers) {
    throw new CmsAuthError(
      "Hanya Super Admin atau Admin yang dapat mengelola pengguna.",
      403,
    );
  }
  return cms;
}

/** Super Admin or Admin — fasilitas / ekstrakurikuler / prestasi. */
export async function requireCmsSiteContentWriter(
  request: Request,
  env: ClerkEnv,
) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canManageSiteContent) {
    throw new CmsAuthError(
      "Hanya Super Admin atau Admin yang dapat mengelola konten situs.",
      403,
    );
  }
  return cms;
}

/** Super Admin only — landing / brand media registry. */
export async function requireCmsSiteMediaManager(
  request: Request,
  env: ClerkEnv,
) {
  const cms = await requireCmsSession(request, env);
  if (!cms.canManageSiteMedia) {
    throw new CmsAuthError(
      "Hanya Super Admin yang dapat mengubah media situs publik.",
      403,
    );
  }
  return cms;
}
