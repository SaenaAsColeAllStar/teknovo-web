"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { CmsRole } from "@/lib/clerk";

type CmsRoleContextValue = {
  role: CmsRole;
  canWrite: boolean;
  canManageSettings: boolean;
};

const CmsRoleContext = createContext<CmsRoleContextValue>({
  role: "viewer",
  canWrite: false,
  canManageSettings: false,
});

export function CmsRoleProvider({
  role,
  canWrite,
  canManageSettings,
  children,
}: CmsRoleContextValue & { children: ReactNode }) {
  return (
    <CmsRoleContext.Provider value={{ role, canWrite, canManageSettings }}>
      {children}
    </CmsRoleContext.Provider>
  );
}

export function useCmsRole(): CmsRoleContextValue {
  return useContext(CmsRoleContext);
}
