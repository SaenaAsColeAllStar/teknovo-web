"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

import { PublicSectionSubNav } from "@/components/layout/PublicSectionSubNav";
import { getProfilSubNavActiveHref, PROFIL_SUB_NAV_ITEMS } from "@/lib/profil-landing-content";

export function ProfilSubNav(): ReactElement {
  const pathname = usePathname() ?? "/profil/sambutan";
  const activeHref = getProfilSubNavActiveHref(pathname);

  return (
    <PublicSectionSubNav
      ariaLabel="Navigasi halaman profil sekolah"
      items={PROFIL_SUB_NAV_ITEMS}
      activeHref={activeHref}
    />
  );
}
