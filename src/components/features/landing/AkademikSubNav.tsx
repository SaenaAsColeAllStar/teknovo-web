"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

import { PublicSectionSubNav } from "@/components/layout/PublicSectionSubNav";
import { AKADEMIK_SUB_NAV_ITEMS, getAkademikSubNavActiveHref } from "@/lib/akademik-landing-content";

export function AkademikSubNav(): ReactElement {
  const pathname = usePathname() ?? "/akademik";
  const activeHref = getAkademikSubNavActiveHref(pathname);

  return (
    <PublicSectionSubNav
      ariaLabel="Navigasi akademik dalam kerangka"
      menuAriaLabel="Buka menu akademik"
      items={AKADEMIK_SUB_NAV_ITEMS}
      activeHref={activeHref}
    />
  );
}
