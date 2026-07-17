import type { ReactElement } from "react";

import { BeritaIndexRedirect } from "@/components/features/landing/BeritaIndexRedirect";

/** `/berita` — hash lama & default diarahkan di klien (`BeritaIndexRedirect`). */
export default function BeritaPage(): ReactElement {
  return <BeritaIndexRedirect />;
}
