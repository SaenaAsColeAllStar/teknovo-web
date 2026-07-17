"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

import { PublicSectionSubNav } from "@/components/layout/PublicSectionSubNav";
import { BERITA_SUB_NAV_ITEMS, getBeritaSubNavActiveHref } from "@/lib/berita-landing-content";

export function BeritaSubNav(): ReactElement {
  const pathname = usePathname() ?? "/berita";
  const activeHref = getBeritaSubNavActiveHref(pathname);

  return (
    <PublicSectionSubNav
      ariaLabel="Navigasi berita dalam kerangka"
      menuAriaLabel="Buka menu berita"
      items={BERITA_SUB_NAV_ITEMS}
      activeHref={activeHref}
    />
  );
}
