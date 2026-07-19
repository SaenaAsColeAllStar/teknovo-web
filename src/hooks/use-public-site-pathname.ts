"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { toPublicSiteNavPathname } from "@/lib/public-site-path";

const publicAppId = process.env.NEXT_PUBLIC_TEKNOVO_PUBLIC_APP;

const publicSiteAppId =
  publicAppId === "ppdb" || publicAppId === "landing" ? publicAppId : undefined;

/**
 * Pathname for public-site nav active matching.
 *
 * On Astro, `usePathname` SSRs as `"/"` (no window). Pass `ssrPathname` from
 * `Astro.url.pathname` so SSG HTML and View Transition snapshots keep the
 * correct active item instead of flashing Beranda.
 */
export function usePublicSitePathname(ssrPathname?: string): string {
  const routerPathname = usePathname() ?? "/";
  const fromRouter = toPublicSiteNavPathname(routerPathname, publicSiteAppId);
  const fromSsr =
    ssrPathname != null && ssrPathname !== ""
      ? toPublicSiteNavPathname(ssrPathname, publicSiteAppId)
      : null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (fromSsr == null) {
    return fromRouter;
  }

  // Astro shim `getServerSnapshot` is always "/". Prefer the layout path until
  // the live store reports a real non-root path (or we are truly on `/`).
  if (!mounted || (fromRouter === "/" && fromSsr !== "/")) {
    return fromSsr;
  }

  return fromRouter;
}
