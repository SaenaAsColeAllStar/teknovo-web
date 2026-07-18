import { useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  CMS_ROLE_LABEL,
  cmsRoleCanAccessBeritaSekolah,
  cmsRoleCanManageSettings,
  cmsRoleCanManageUsers,
  cmsRoleCanManageSiteContent,
  cmsRoleCanManageSiteMedia,
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
import { cn } from "@/lib/utils";

import { CmsApplicationNavbar } from "./CmsApplicationNavbar";
import { CmsApplicationSidenav } from "./CmsApplicationSidenav";

/**
 * Client-side counterpart of `src/app/(dashboard)/dashboard/layout.tsx` — the Next.js
 * version resolves the Clerk session + role server-side via `getCmsSession()`; the CMS
 * SPA resolves it from `useUser()` instead, then reuses the same sidebar/banner/provider.
 *
 * Shell chrome: fixed three-bar `CmsApplicationNavbar` + collapsible sidebar.
 */
export function DashboardLayoutClient() {
  const { user, isLoaded } = useUser();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Close drawer after navigation on small screens only.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setSidebarOpen(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

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
  const canManageUsers = cmsRoleCanManageUsers(role);
  const canManageSiteContent = cmsRoleCanManageSiteContent(role);
  const canManageSiteMedia = cmsRoleCanManageSiteMedia(role);

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
      canManageUsers={canManageUsers}
      canManageSiteContent={canManageSiteContent}
      canManageSiteMedia={canManageSiteMedia}
    >
      <div className="min-h-screen bg-[color:var(--color-neutral-soft)]">
        <CmsApplicationNavbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            style={{ top: "var(--cms-nav-height, 8.5rem)" }}
            aria-label="Tutup menu"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        {/*
          Sidebar is always `position: fixed` with locked `w-60` so it never
          stretches with main content or scrolls with the page shell.
          Main column offsets with padding-left on lg when the drawer is open.
        */}
        <div
          className={cn(
            "min-h-screen",
            sidebarOpen && "lg:pl-60",
          )}
          style={{ paddingTop: "var(--cms-nav-height, 8.5rem)" }}
        >
          <div
            className={cn(
              "z-40 w-60 shrink-0 transition-transform duration-200",
              "fixed left-0 top-[var(--cms-nav-height,8.5rem)]",
              "h-[calc(100dvh-var(--cms-nav-height,8.5rem))] h-[calc(100vh-var(--cms-nav-height,8.5rem))]",
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full pointer-events-none lg:hidden",
            )}
          >
            <CmsApplicationSidenav
              className="h-full max-h-full w-60"
              onNavigate={() => {
                if (
                  typeof window !== "undefined" &&
                  window.matchMedia("(max-width: 1023px)").matches
                ) {
                  setSidebarOpen(false);
                }
              }}
            />
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <main className="flex-1 space-y-4 overflow-x-clip p-6">
              <p className="sr-only">
                Peran: {CMS_ROLE_LABEL[role]}
              </p>
              <CmsReadOnlyBanner />
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </CmsRoleProvider>
  );
}
