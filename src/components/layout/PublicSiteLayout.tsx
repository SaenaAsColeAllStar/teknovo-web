import { AppShell, AppShellMain } from "@/vendor/teknovo-ui";
import type { ReactElement, ReactNode } from "react";

import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  PublicMarketingNavbar,
  type PublicMarketingNavbarProps,
} from "@/components/layout/PublicMarketingNavbar";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";

/**
 * Chrome situs publik (navbar + footer) dipakai bersama `apps/web` dan `apps/admissions`.
 * Jangan duplikasi markup atau menu di masing-masing app — ubah `PublicMarketingNavbar` dan `public-site-nav`.
 * Beranda (`/`) otomatis menyembunyikan navbar tiga tingkat; hero memakai `HeroOverlayNav`.
 */
export function PublicSiteLayout({
  children,
  hideNavbar,
}: Readonly<{
  children: ReactNode;
  /** Override: sembunyikan chrome tiga tingkat (default: otomatis di beranda). */
  hideNavbar?: PublicMarketingNavbarProps["hidden"];
}>): ReactElement {
  return (
    <PublicMotionProvider>
      <SmoothScrollProvider>
        <AppShell variant="public">
          <PublicMarketingNavbar hidden={hideNavbar} />
          <AppShellMain>{children}</AppShellMain>
          <PublicFooter />
        </AppShell>
      </SmoothScrollProvider>
    </PublicMotionProvider>
  );
}
