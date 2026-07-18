import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  parseCmsRole,
  type CmsRole,
  cmsRoleCanWriteContent,
  cmsRoleCanManageSettings,
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
  canManageSettings: boolean;
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
    canManageSettings: cmsRoleCanManageSettings(role),
  };
}

export async function requireCmsSession(): Promise<CmsSession> {
  const cms = await getCmsSession();
  if (!cms) {
    throw new CmsAuthError("Sesi tidak valid. Masuk ulang.", 401);
  }
  return cms;
}

/** editor | admin — berita, kategori, media writes. */
export async function requireCmsWriter(): Promise<CmsSession> {
  const cms = await requireCmsSession();
  if (!cms.canWrite) {
    throw new CmsAuthError(
      "Peran viewer hanya dapat membaca. Minta admin menaikkan peran Anda.",
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
