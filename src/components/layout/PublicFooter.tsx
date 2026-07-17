import type { ReactElement } from "react";

import { PublicMarketingFooter } from "@/components/layout/PublicMarketingFooter";

/**
 * Footer situs publik — re-export `PublicMarketingFooter` agar layout tetap stabil
 * saat chrome navbar diubah agen lain.
 */
export function PublicFooter(): ReactElement {
  return <PublicMarketingFooter />;
}
