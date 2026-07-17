import {
  isPublicSitePpdbCtaActive,
  publicNavPathMatches,
} from "@/lib/public-site-nav-active";
import {
  PUBLIC_SITE_MAIN_NAV,
  PUBLIC_SITE_NAV_PPDB_CTA_LABEL,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";

export type PublicMobileDockTabId = "beranda" | "fasilitas" | "akademik" | "prestasi" | "kesiswaan";

export type PublicMobileDockTab = {
  id: PublicMobileDockTabId;
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

export const PUBLIC_SITE_MOBILE_DOCK_PPDB = {
  label: PUBLIC_SITE_NAV_PPDB_CTA_LABEL,
  href: PUBLIC_SITE_PPDB_HREF,
  isActive: isPublicSitePpdbCtaActive,
} as const;

function groupHref(id: "fasilitas" | "akademik" | "kesiswaan"): string {
  const group = PUBLIC_SITE_MAIN_NAV.find((entry) => entry.type === "group" && entry.id === id);
  if (!group || group.type !== "group") {
    throw new Error(`Grup navigasi mobile dock tidak ditemukan: ${id}`);
  }
  return group.items[0]?.href ?? `/${id}`;
}

function kesiswaanItemHref(label: string): string {
  const group = PUBLIC_SITE_MAIN_NAV.find((entry) => entry.type === "group" && entry.id === "kesiswaan");
  if (!group || group.type !== "group") {
    return "/kesiswaan/prestasi";
  }
  return group.items.find((item) => item.label === label)?.href ?? "/kesiswaan/prestasi";
}

/** Tab dock mobile — selaras menu desktop; PPDB sebagai pill tengah terpisah. */
export const PUBLIC_SITE_MOBILE_DOCK_TABS: readonly PublicMobileDockTab[] = [
  {
    id: "beranda",
    label: "Beranda",
    href: "/",
    isActive: (pathname) => publicNavPathMatches(pathname, "/"),
  },
  {
    id: "fasilitas",
    label: "Fasilitas",
    href: groupHref("fasilitas"),
    isActive: (pathname) => publicNavPathMatches(pathname, "/fasilitas"),
  },
  {
    id: "akademik",
    label: "Akademik",
    href: groupHref("akademik"),
    isActive: (pathname) => publicNavPathMatches(pathname, "/akademik"),
  },
  {
    id: "prestasi",
    label: "Prestasi",
    href: kesiswaanItemHref("Prestasi"),
    isActive: (pathname) => publicNavPathMatches(pathname, "/kesiswaan/prestasi"),
  },
  {
    id: "kesiswaan",
    label: "Kesiswaan",
    href: groupHref("kesiswaan"),
    isActive: (pathname) =>
      publicNavPathMatches(pathname, "/kesiswaan") && !publicNavPathMatches(pathname, "/kesiswaan/prestasi"),
  },
] as const;
