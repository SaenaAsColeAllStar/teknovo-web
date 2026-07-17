import { PUBLIC_SITE_MAIN_NAV } from "@/lib/public-site-nav";

export const PROFIL_HERO_EYEBROW = "Profil sekolah" as const;

export type ProfilSubNavItem = {
  id: string;
  label: string;
  href: string;
};

function getProfilNavItems(): readonly ProfilSubNavItem[] {
  for (const entry of PUBLIC_SITE_MAIN_NAV) {
    if (entry.type === "group" && entry.id === "profil") {
      return entry.items.map((item, index) => ({
        id: `profil-${index}`,
        label: item.label,
        href: item.href,
      }));
    }
  }

  throw new Error("Profil nav group missing from PUBLIC_SITE_MAIN_NAV");
}

export const PROFIL_SUB_NAV_ITEMS = getProfilNavItems();

export function getProfilSubNavActiveHref(pathname: string): string {
  let winner = PROFIL_SUB_NAV_ITEMS[0]!.href;
  let winnerLen = -1;

  for (const item of PROFIL_SUB_NAV_ITEMS) {
    const match = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (match && item.href.length > winnerLen) {
      winner = item.href;
      winnerLen = item.href.length;
    }
  }

  return winner;
}
