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
 * follows `usePathname` (listens to `astro:after-swap` / `astro:page-load`).
 */
export function PublicChrome({
  children,
  hideNavbar,
  mainNav,
}: {
  children: ReactNode;
  /** From Astro `url.pathname` — avoid SSR always-`/` pathname snap hiding chrome wrongly. */
  hideNavbar?: boolean;
  mainNav?: PublicSiteNavEntry[];
}) {
  return (
    <PublicSiteLayout hideNavbar={hideNavbar} mainNav={mainNav}>
      {children}
    </PublicSiteLayout>
  );
}
