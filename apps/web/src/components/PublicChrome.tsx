"use client";

import type { ReactNode } from "react";
import { PublicSiteLayout } from "@/components/layout/PublicSiteLayout";
import type { PublicSiteNavEntry } from "@/lib/public-site-nav";

/**
 * Public chrome — same as Next `(site)/layout`.
 *
 * Astro View Transitions: this island remounts on each client navigation
 * (do not `transition:persist` — it wraps page slot children). Lenis /
 * ClickSpark / nested page islands re-init cleanly on remount. Active nav
 * uses `pathname` from Astro during SSG/hydration, then live `usePathname`
 * after mount (`astro:after-swap` / `astro:page-load`).
 */
export function PublicChrome({
  children,
  hideNavbar,
  pathname,
  mainNav,
}: {
  children: ReactNode;
  /** From Astro `url.pathname` — avoid SSR always-`/` pathname snap hiding chrome wrongly. */
  hideNavbar?: boolean;
  /** From Astro `url.pathname` — correct active nav in SSG / View Transition snapshots. */
  pathname?: string;
  mainNav?: PublicSiteNavEntry[];
}) {
  return (
    <PublicSiteLayout
      hideNavbar={hideNavbar}
      pathname={pathname}
      mainNav={mainNav}
    >
      {children}
    </PublicSiteLayout>
  );
}
