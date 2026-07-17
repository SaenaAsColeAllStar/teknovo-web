"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

import { PublicSectionSubNav } from "@/components/layout/PublicSectionSubNav";
import { FASILITAS_SUB_NAV_ITEMS, getFasilitasSubNavActiveHref } from "@/lib/fasilitas-landing-content";

export function FasilitasSubNav(): ReactElement {
  const pathname = usePathname() ?? "/fasilitas";
  const activeHref = getFasilitasSubNavActiveHref(pathname);

  return (
    <PublicSectionSubNav
      ariaLabel="Navigasi halaman fasilitas"
      items={FASILITAS_SUB_NAV_ITEMS}
      activeHref={activeHref}
    />
  );
}
