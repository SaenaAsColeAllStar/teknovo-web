export type PublicSiteAppId = "landing" | "ppdb";

/** Prefiks path yang dilayani app lain (bukan client router landing/ppdb). */
const LANDING_CROSS_APP_PREFIXES = [
  "/ppdb",
  "/rbac",
  "/auth",
  "/super-admin",
  "/admin-sekolah",
  "/admin/",
  "/tata-usaha",
  "/tata_usaha",
  "/guru",
  "/siswa",
  "/kurikulum",
  "/wasender",
  "/cbt",
  "/register",
  "/lupa-password",
  "/atur-ulang-password",
  "/api/",
] as const;

/**
 * Apakah `href` boleh pakai `<Link>` (SPA) di app publik saat ini?
 * Lintas app (landing ↔ ppdb, menu ke console) tetap `<a>` (muatan dokumen penuh).
 */
export function shouldUsePublicSiteClientNavigation(
  href: string,
  appId: PublicSiteAppId | undefined,
): boolean {
  const raw = href.trim();
  if (!raw || raw.startsWith("#")) {
    return false;
  }
  if (raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    return false;
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return false;
  }

  const pathOnly = raw.split("#")[0]?.split("?")[0] ?? raw;

  if (appId === "ppdb") {
    return pathOnly === "/ppdb" || pathOnly.startsWith("/ppdb/");
  }

  if (appId === "landing") {
    if (pathOnly === "/ppdb" || pathOnly.startsWith("/ppdb/")) {
      return false;
    }
    if (LANDING_CROSS_APP_PREFIXES.some((prefix) => pathOnly.startsWith(prefix))) {
      return false;
    }
    return pathOnly.startsWith("/");
  }

  return false;
}

export function normalizePublicSitePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  if (pathname === "/ppdb") return "/ppdb/";
  return pathname;
}

/**
 * Pathname untuk matching menu navbar — selaras URL publik (termasuk prefiks `/ppdb`
 * saat router internal sudah di-strip middleware).
 */
export function toPublicSiteNavPathname(
  routerPathname: string,
  appId: PublicSiteAppId | undefined,
): string {
  const routerPath = normalizePublicSitePathname(routerPathname);

  if (appId !== "ppdb") {
    return routerPath;
  }

  if (routerPath === "/") {
    return "/ppdb/";
  }
  if (routerPath === "/ppdb" || routerPath.startsWith("/ppdb/")) {
    return routerPath;
  }

  return normalizePublicSitePathname(`/ppdb${routerPath}`);
}

export function resolvePublicSitePathname(
  routerPathname: string,
  browserPathname: string | null,
  appId: PublicSiteAppId | undefined,
): string {
  const fromRouter = toPublicSiteNavPathname(routerPathname, appId);

  if (typeof window === "undefined" || !browserPathname) {
    return fromRouter;
  }

  const fromBrowser = toPublicSiteNavPathname(browserPathname, appId);
  if (fromBrowser !== fromRouter && appId === "ppdb") {
    return fromBrowser;
  }

  return fromRouter;
}
