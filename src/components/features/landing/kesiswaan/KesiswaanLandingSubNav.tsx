"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

import { PublicSectionSubNav } from "@/components/layout/PublicSectionSubNav";
import { KESISWAAN_PUBLIC_HUB_HREF, KESISWAAN_SUBNAV_ITEMS } from "@/lib/kesiswaan-landing-content";

function isKesiswaanSubnavItemActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) {
    return pathname === href || (href === KESISWAAN_PUBLIC_HUB_HREF && pathname === "/kesiswaan/beranda");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getKesiswaanSubNavActiveHref(pathname: string): string | null {
  let winner: string | null = null;
  let winnerLen = -1;
  for (const item of KESISWAAN_SUBNAV_ITEMS) {
    const match = isKesiswaanSubnavItemActive(pathname, item.href, item.exact);
    if (match && item.href.length > winnerLen) {
      winner = item.href;
      winnerLen = item.href.length;
    }
  }
  return winner;
}

export function KesiswaanLandingSubNav(): ReactElement {
  const pathname = usePathname() ?? KESISWAAN_PUBLIC_HUB_HREF;
  const activeHref = getKesiswaanSubNavActiveHref(pathname);

  return (
    <PublicSectionSubNav
      ariaLabel="Navigasi kesiswaan dalam kerangka"
      menuAriaLabel="Buka menu kesiswaan"
      items={KESISWAAN_SUBNAV_ITEMS}
      activeHref={activeHref}
    />
  );
}
