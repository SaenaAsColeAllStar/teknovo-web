"use client";

import { navigate } from "astro:transitions/client";
import { useSyncExternalStore } from "react";

/** Astro ClientRouter updates history without always firing `popstate`. */
function subscribe(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  document.addEventListener("astro:after-swap", onStoreChange);
  document.addEventListener("astro:page-load", onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    document.removeEventListener("astro:after-swap", onStoreChange);
    document.removeEventListener("astro:page-load", onStoreChange);
  };
}

function getPathname() {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

/**
 * SSR snapshot must stay "/" (no `window` during Astro SSG). Do not read
 * `window` here — a divergent client snapshot causes hydration errors.
 * Consumers that need the real route in SSG HTML should pass `Astro.url.pathname`
 * (see `usePublicSitePathname(ssrPathname)`).
 */
function getServerSnapshot() {
  return "/";
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getPathname, getServerSnapshot);
}

export function useRouter() {
  return {
    push(href: string) {
      void navigate(href);
    },
    replace(href: string) {
      void navigate(href, { history: "replace" });
    },
    refresh() {
      void navigate(window.location.href, { history: "replace" });
    },
    back() {
      window.history.back();
    },
    prefetch() {},
  };
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}

export function redirect(url: string): never {
  if (typeof window !== "undefined") {
    void navigate(url);
  }
  throw new Error(`REDIRECT:${url}`);
}

export function permanentRedirect(url: string): never {
  if (typeof window !== "undefined") {
    void navigate(url, { history: "replace" });
  }
  throw new Error(`REDIRECT:${url}`);
}
