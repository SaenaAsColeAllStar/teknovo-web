import { AppShell, AppShellMain } from "@/vendor/teknovo-ui";
import type { ReactElement, ReactNode } from "react";

import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  PublicMarketingNavbar,
  type PublicMarketingNavbarProps,
} from "@/components/layout/PublicMarketingNavbar";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { ClickSpark } from "@/components/ui/click-spark/ClickSpark";

/**
 * Chrome situs publik (navbar + footer) dipakai bersama `apps/web` dan `apps/admissions`.
 * Jangan duplikasi markup atau menu di masing-masing app — ubah `PublicMarketingNavbar` dan `public-site-nav`.
 * Beranda (`/`) otomatis menyembunyikan navbar tiga tingkat; hero memakai `HomeCardNav` (React Bits CardNav).
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
        <ClickSpark
          sparkColor="#1313BA"
          sparkSize={12}
          sparkRadius={24}
          sparkCount={10}
          duration={500}
          easing="ease-out"
          extraScale={1.1}
          className="min-h-screen"
        >
          <AppShell variant="public">
            <PublicMarketingNavbar hidden={hideNavbar} />
            <AppShellMain>{children}</AppShellMain>
            <PublicFooter />
          </AppShell>
        </ClickSpark>
      </SmoothScrollProvider>
    </PublicMotionProvider>
  );
}
