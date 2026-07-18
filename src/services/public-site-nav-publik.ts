import type {
  PublicSiteNavEntry,
  PublicSiteNavGroup,
} from "@/lib/public-site-nav";
import { PUBLIC_SITE_MAIN_NAV } from "@/lib/public-site-nav";
import { getFasilitasNavLeaves } from "@/services/fasilitas-publik";

let cachedNav: PublicSiteNavEntry[] | null = null;

/**
 * Build main nav with fasilitas children from API (fallback: static nav).
 * Cached per build process.
 */
export async function getPublicSiteMainNav(): Promise<
  readonly PublicSiteNavEntry[]
> {
  if (cachedNav) return cachedNav;

  const fasilitasLeaves = await getFasilitasNavLeaves();
  const next = PUBLIC_SITE_MAIN_NAV.map((entry) => {
    if (entry.type !== "group" || entry.id !== "fasilitas") return entry;
    const group: PublicSiteNavGroup = {
      ...entry,
      items: fasilitasLeaves,
    };
    return group;
  });

  cachedNav = next;
  return next;
}
