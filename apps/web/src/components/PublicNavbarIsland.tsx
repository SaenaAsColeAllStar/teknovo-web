"use client";

import type { ReactElement } from "react";

import { PublicMarketingNavbar } from "@/components/layout/PublicMarketingNavbar";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";
import type { PublicSiteNavEntry } from "@/lib/public-site-nav";

/**
 * Astro island for the three-tier marketing navbar.
 * Own LazyMotion boundary — must not wrap the page `<slot />`.
 *
 * Always mount (even when `hidden`) so `--public-nav-bottom` resets on beranda.
 */
export function PublicNavbarIsland({
  hidden,
  pathname,
  mainNav,
}: {
  hidden?: boolean;
  pathname?: string;
  mainNav?: PublicSiteNavEntry[];
}): ReactElement {
  return (
    <PublicMotionProvider>
      <PublicMarketingNavbar
        hidden={hidden}
        pathname={pathname}
        mainNav={mainNav}
      />
    </PublicMotionProvider>
  );
}
