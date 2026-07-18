import type { CardNavItem } from "@/components/ui/card-nav/CardNav";
import {
  PUBLIC_SITE_MAIN_NAV,
  type PublicSiteNavGroup,
} from "@/lib/public-site-nav";

/** Atlas-ish dark navy cards (not purple). */
const CARD_COLORS = [
  { bgColor: "#0B0B2E", textColor: "#ffffff" },
  { bgColor: "#12123A", textColor: "#ffffff" },
  { bgColor: "#1A1A4A", textColor: "#ffffff" },
] as const;

function navGroup(
  id: PublicSiteNavGroup["id"],
): PublicSiteNavGroup | undefined {
  const entry = PUBLIC_SITE_MAIN_NAV.find(
    (item): item is PublicSiteNavGroup =>
      item.type === "group" && item.id === id,
  );
  return entry;
}

function toLinks(
  items: readonly { label: string; href: string }[],
  ariaPrefix: string,
) {
  return items.map((item) => ({
    label: item.label,
    href: item.href,
    ariaLabel: `${ariaPrefix}: ${item.label}`,
  }));
}

/**
 * Three CardNav panels mapped from `PUBLIC_SITE_MAIN_NAV`:
 * Profil · Akademik · Kesiswaan / Fasilitas / Berita (+ Kontak).
 */
export function buildPublicSiteCardNavItems(): CardNavItem[] {
  const profil = navGroup("profil");
  const akademik = navGroup("akademik");
  const kesiswaan = navGroup("kesiswaan");
  const fasilitas = navGroup("fasilitas");
  const berita = navGroup("berita");
  const kontak = PUBLIC_SITE_MAIN_NAV.find(
    (item) => item.type === "link" && item.href === "/kontak",
  );

  const thirdLinks = [
    ...(kesiswaan?.items.slice(0, 2) ?? []),
    ...(fasilitas?.items.slice(0, 2) ?? []),
    ...(berita?.items.slice(0, 1) ?? []),
    ...(kontak?.type === "link"
      ? [{ label: kontak.label, href: kontak.href }]
      : []),
  ];

  return [
    {
      label: profil?.label ?? "Profil",
      ...CARD_COLORS[0],
      links: toLinks(profil?.items ?? [], "Profil"),
    },
    {
      label: akademik?.label ?? "Akademik",
      ...CARD_COLORS[1],
      links: toLinks(akademik?.items ?? [], "Akademik"),
    },
    {
      label: "Sekolah",
      ...CARD_COLORS[2],
      links: toLinks(thirdLinks, "Sekolah"),
    },
  ];
}
