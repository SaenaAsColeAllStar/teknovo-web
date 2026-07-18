"use client";

import type { ReactNode } from "react";
import { PublicSiteLayout } from "@/components/layout/PublicSiteLayout";

/** Public chrome — same as Next `(site)/layout`. */
export function PublicChrome({ children }: { children: ReactNode }) {
  return <PublicSiteLayout>{children}</PublicSiteLayout>;
}
