"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { CmsRole } from "@/lib/clerk";

type CmsRoleContextValue = {
  role: CmsRole;
  canWrite: boolean;
  canWriteArtikel: boolean;
  canWriteKategori: boolean;
  canUploadMedia: boolean;
  canModerate: boolean;
  canViewModerasi: boolean;
  canAccessBeritaSekolah: boolean;
  canManageSettings: boolean;
};

const CmsRoleContext = createContext<CmsRoleContextValue>({
  role: "viewer",
  canWrite: false,
  canWriteArtikel: false,
  canWriteKategori: false,
  canUploadMedia: false,
  canModerate: false,
  canViewModerasi: false,
  canAccessBeritaSekolah: true,
  canManageSettings: false,
});

export function CmsRoleProvider({
  role,
  canWrite,
  canWriteArtikel,
  canWriteKategori,
  canUploadMedia,
  canModerate,
  canViewModerasi,
  canAccessBeritaSekolah,
  canManageSettings,
  children,
}: CmsRoleContextValue & { children: ReactNode }) {
  return (
    <CmsRoleContext.Provider
      value={{
        role,
        canWrite,
        canWriteArtikel,
        canWriteKategori,
        canUploadMedia,
        canModerate,
        canViewModerasi,
        canAccessBeritaSekolah,
        canManageSettings,
      }}
    >
      {children}
    </CmsRoleContext.Provider>
  );
}

export function useCmsRole(): CmsRoleContextValue {
  return useContext(CmsRoleContext);
}
