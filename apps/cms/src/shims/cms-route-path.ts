/**
 * The reused Next.js dashboard components (`DashboardSidebar`, `BeritaForm`, …) all
 * assume routes live under `/dashboard/...`. The CMS SPA mounts the same pages at the
 * root (`/`, `/berita`, `/berita/:id/edit`, …) instead. These helpers translate
 * between the two so shimmed `next/link` and `next/navigation` can reuse the
 * unmodified components without rewriting their hrefs.
 */
const DASHBOARD_PREFIX = "/dashboard";

/** Real SPA pathname → virtual Next.js dashboard pathname (for `usePathname()` consumers). */
export function toVirtualDashboardPath(pathname: string): string {
  if (pathname === "/") return DASHBOARD_PREFIX;
  return `${DASHBOARD_PREFIX}${pathname}`;
}

/** Virtual Next.js dashboard href (e.g. `/dashboard/berita`) → real SPA route (e.g. `/berita`). */
export function toRealPath(href: string): string {
  if (href === DASHBOARD_PREFIX) return "/";
  if (href.startsWith(`${DASHBOARD_PREFIX}/`)) {
    return href.slice(DASHBOARD_PREFIX.length);
  }
  return href;
}
