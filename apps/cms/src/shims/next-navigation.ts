import { useLocation, useNavigate } from "react-router-dom";

import { toRealPath, toVirtualDashboardPath } from "./cms-route-path";

type RefreshListener = () => void;
const refreshListeners = new Set<RefreshListener>();

/**
 * Reused Next.js dashboard components call `router.refresh()` to re-fetch
 * server-rendered data. CMS pages fetch client-side, so they subscribe here to
 * re-run their own loader when `refresh()` fires.
 */
export function onRouterRefresh(listener: RefreshListener): () => void {
  refreshListeners.add(listener);
  return () => refreshListeners.delete(listener);
}

/** Shim `usePathname` from `next/navigation` — returns the virtual `/dashboard/...` path. */
export function usePathname(): string {
  const location = useLocation();
  return toVirtualDashboardPath(location.pathname);
}

/** Shim `useRouter` from `next/navigation`. */
export function useRouter() {
  const navigate = useNavigate();
  return {
    push(href: string) {
      navigate(toRealPath(href));
    },
    replace(href: string) {
      navigate(toRealPath(href), { replace: true });
    },
    refresh() {
      refreshListeners.forEach((listener) => listener());
    },
    back() {
      navigate(-1);
    },
    forward() {
      navigate(1);
    },
    prefetch() {
      /* no-op — SPA has no server-rendered routes to prefetch */
    },
  };
}

export function useSearchParams(): URLSearchParams {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}

export function redirect(url: string): never {
  throw new Error(`REDIRECT:${url}`);
}

export function permanentRedirect(url: string): never {
  throw new Error(`REDIRECT:${url}`);
}
