import type { ReactElement, ReactNode } from "react";

import { PublicSiteLayout } from "@/components/layout/PublicSiteLayout";

/** Hindari HTML prerender lama (chunk hash beda) setelah deploy — kurangi error navigasi klien. */
export const revalidate = 60;

export default function LandingPublicSiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return <PublicSiteLayout>{children}</PublicSiteLayout>;
}
