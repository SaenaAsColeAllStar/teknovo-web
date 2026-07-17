import { AppShell, AppShellMain } from "@/vendor/teknovo-ui";
import type { ReactElement, ReactNode } from "react";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicMobileDock } from "@/components/layout/PublicMobileDock";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";

/**
 * Chrome situs publik (navbar + footer) dipakai bersama `apps/web` dan `apps/admissions`.
 * Jangan duplikasi markup atau menu di masing-masing app — ubah `PublicNavbar` dan `public-site-nav`.
 */
export function PublicSiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <PublicMotionProvider>
      <AppShell variant="public">
        <PublicNavbar />
        <AppShellMain>{children}</AppShellMain>
        <PublicFooter />
        <PublicMobileDock />
      </AppShell>
    </PublicMotionProvider>
  );
}
