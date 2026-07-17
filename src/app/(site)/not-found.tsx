import type { Metadata } from "next";
import type { ReactElement } from "react";

import { TeknovoNotFoundPage } from "@/components/errors/TeknovoNotFoundPage";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: false },
};

/** 404 dari rute `(site)` — tutupi chrome `PublicSiteLayout` agar satu layar penuh. */
export default function SiteNotFound(): ReactElement {
  return <TeknovoNotFoundPage app="landing" escapePublicChrome />;
}
