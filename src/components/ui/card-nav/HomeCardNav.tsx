"use client";

import type { ReactElement } from "react";

import { CardNav } from "@/components/ui/card-nav/CardNav";
import { buildPublicSiteCardNavItems } from "@/components/ui/card-nav/card-nav-items";
import { BRAND_LOGO_SRC, BRAND_SHORT } from "@/lib/branding";
import {
  PUBLIC_SITE_NAV_PPDB_CTA_LABEL,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";

const CARD_NAV_ITEMS = buildPublicSiteCardNavItems();

/**
 * Floating CardNav over the home full-bleed hero.
 * Other routes keep `PublicMarketingNavbar` (three-tier).
 */
export function HomeCardNav(): ReactElement {
  return (
    <CardNav
      logo={BRAND_LOGO_SRC}
      logoAlt={`Lambang ${BRAND_SHORT}`}
      items={CARD_NAV_ITEMS}
      baseColor="#ffffff"
      menuColor="#0B0B2E"
      buttonBgColor="#1313BA"
      buttonTextColor="#ffffff"
      ctaLabel={PUBLIC_SITE_NAV_PPDB_CTA_LABEL}
      ctaHref={PUBLIC_SITE_PPDB_HREF}
      ease="power3.out"
    />
  );
}
