import type { ReactNode } from "react";

import { CmsReadOnlyBanner } from "@/components/dashboard/CmsReadOnlyBanner";
import { CmsRoleProvider } from "@/components/dashboard/CmsRoleProvider";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getCmsSession } from "@/lib/cms-auth";
import { CMS_ROLE_LABEL } from "@/lib/clerk";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getCmsSession();
  const role = session?.role ?? "viewer";
  const canWrite = session?.canWrite ?? false;
  const canManageSettings = session?.canManageSettings ?? false;

  return (
    <CmsRoleProvider
      role={role}
      canWrite={canWrite}
      canManageSettings={canManageSettings}
    >
      <div className="flex min-h-screen bg-[color:var(--color-neutral-soft)]">
        <DashboardSidebar canManageSettings={canManageSettings} />
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
            {children}
          </main>
        </div>
      </div>
    </CmsRoleProvider>
  );
}
