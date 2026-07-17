import { normalizePublicSitePathname } from "@/lib/public-site-path";
import type { PublicSiteNavEntry, PublicSiteNavGroup, PublicSiteNavLink } from "@/lib/public-site-nav";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

/** Path menu untuk perbandingan aktif (tanpa hash/query). */
export function publicNavHrefBase(href: string): string {
  const raw = href.trim();
  if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    return raw;
  }
  const pathOnly = raw.split("#")[0]?.split("?")[0] ?? raw;
  return normalizePublicSitePathname(pathOnly);
}

/** Cocokkan pathname situs publik dengan href menu (termasuk `/ppdb/`). */
export function publicNavPathMatches(pathname: string, href: string): boolean {
  const base = publicNavHrefBase(href);
  if (!base || base.startsWith("mailto:") || base.startsWith("tel:")) {
    return false;
  }
  const path = normalizePublicSitePathname(pathname);
  if (base === "/") {
    return path === "/";
  }
  const normalized = base.endsWith("/") ? base.slice(0, -1) : base;
  return path === normalized || path.startsWith(`${normalized}/`);
}

export function isPublicSitePpdbCtaActive(pathname: string): boolean {
  return publicNavPathMatches(pathname, PUBLIC_SITE_PPDB_HREF);
}

export function isPublicSiteNavLinkActive(pathname: string, entry: PublicSiteNavLink): boolean {
  return publicNavPathMatches(pathname, entry.href);
}

const PUBLIC_SITE_NAV_GROUP_PREFIX: Record<PublicSiteNavGroup["id"], string> = {
  profil: "/profil",
  akademik: "/akademik",
  kesiswaan: "/kesiswaan",
  fasilitas: "/fasilitas",
  berita: "/berita",
};

export function isPublicSiteNavGroupActive(pathname: string, entry: PublicSiteNavGroup): boolean {
  if (entry.items.some((item) => publicNavPathMatches(pathname, item.href))) {
    return true;
  }
  return publicNavPathMatches(pathname, PUBLIC_SITE_NAV_GROUP_PREFIX[entry.id]);
}

export function isPublicSiteNavEntryActive(pathname: string, entry: PublicSiteNavEntry): boolean {
  if (entry.type === "link") {
    return isPublicSiteNavLinkActive(pathname, entry);
  }
  return isPublicSiteNavGroupActive(pathname, entry);
}
