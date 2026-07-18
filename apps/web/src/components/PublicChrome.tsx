"use client";

import type { ReactNode } from "react";
import { PublicSiteLayout } from "@/components/layout/PublicSiteLayout";

/** Public chrome — same as Next `(site)/layout`. */
export function PublicChrome({
  children,
  hideNavbar,
}: {
  children: ReactNode;
  /** From Astro `url.pathname` — avoid SSR always-`/` pathname snap hiding chrome wrongly. */
  hideNavbar?: boolean;
}) {
  return (
    <PublicSiteLayout hideNavbar={hideNavbar}>{children}</PublicSiteLayout>
  );
}
