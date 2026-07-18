"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getPathname() {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getPathname, () => "/");
}

export function useRouter() {
  return {
    push(href: string) {
      window.location.assign(href);
    },
    replace(href: string) {
      window.location.replace(href);
    },
    refresh() {
      window.location.reload();
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
    window.location.assign(url);
  }
  throw new Error(`REDIRECT:${url}`);
}

export function permanentRedirect(url: string): never {
  if (typeof window !== "undefined") {
    window.location.replace(url);
  }
  throw new Error(`REDIRECT:${url}`);
}
