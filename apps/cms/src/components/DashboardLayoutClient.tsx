import { useUser } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import {
  CMS_ROLE_LABEL,
  cmsRoleCanAccessBeritaSekolah,
  cmsRoleCanManageSettings,
  cmsRoleCanModerate,
  cmsRoleCanUploadMedia,
  cmsRoleCanViewModerasi,
  cmsRoleCanWriteArtikel,
  cmsRoleCanWriteContent,
  cmsRoleCanWriteKategori,
  parseCmsRole,
} from "@teknovo/shared";

import { CmsReadOnlyBanner } from "@/components/dashboard/CmsReadOnlyBanner";
import { CmsRoleProvider } from "@/components/dashboard/CmsRoleProvider";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

/**
 * Client-side counterpart of `src/app/(dashboard)/dashboard/layout.tsx` — the Next.js
 * version resolves the Clerk session + role server-side via `getCmsSession()`; the CMS
 * SPA resolves it from `useUser()` instead, then reuses the same sidebar/banner/provider.
 */
export function DashboardLayoutClient() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-neutral-soft)] text-sm text-[color:var(--color-body)]">
        Memuat sesi…
      </div>
    );
  }

  const role = parseCmsRole(user?.publicMetadata);
  const canWrite = cmsRoleCanWriteContent(role);
  const canWriteArtikel = cmsRoleCanWriteArtikel(role);
  const canWriteKategori = cmsRoleCanWriteKategori(role);
  const canUploadMedia = cmsRoleCanUploadMedia(role);
  const canModerate = cmsRoleCanModerate(role);
  const canViewModerasi = cmsRoleCanViewModerasi(role);
  const canAccessBeritaSekolah = cmsRoleCanAccessBeritaSekolah(role);
  const canManageSettings = cmsRoleCanManageSettings(role);

  return (
    <CmsRoleProvider
      role={role}
      canWrite={canWrite}
      canWriteArtikel={canWriteArtikel}
      canWriteKategori={canWriteKategori}
      canUploadMedia={canUploadMedia}
      canModerate={canModerate}
      canViewModerasi={canViewModerasi}
      canAccessBeritaSekolah={canAccessBeritaSekolah}
      canManageSettings={canManageSettings}
    >
      <div className="flex min-h-screen bg-[color:var(--color-neutral-soft)]">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between gap-4 border-b border-[color:var(--color-border)] bg-white px-6">
            <p className="text-sm font-medium text-[color:var(--color-heading)]">
              Content Management
            </p>
            <p className="text-xs text-[color:var(--color-body-subtle)]">
              Peran:{" "}
              <span className="font-medium text-[color:var(--color-heading)]">
                {CMS_ROLE_LABEL[role]}
              </span>
            </p>
          </header>
          <main className="flex-1 space-y-4 p-6">
            <CmsReadOnlyBanner />
            <Outlet />
          </main>
        </div>
      </div>
    </CmsRoleProvider>
  );
}
