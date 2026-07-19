"use client";

/**
 * Re-export Lenis React hook for public-site islands that need `lenis.scrollTo`.
 * Prefer `scrollToPublic` / `getLenis` from `@/lib/lenis-public` when outside the
 * ReactLenis tree (e.g. after View Transition remount races).
 */
export { useLenis } from "lenis/react";
export {
  getLenis,
  scrollToPublic,
  scrollToTopPublic,
  getPublicNavScrollOffsetPx,
  lockLenisScroll,
  publicLenisOptions,
  publicLenisEasing,
  prefersReducedMotion,
  PUBLIC_LENIS_DURATION,
  PUBLIC_LENIS_LERP,
  PUBLIC_NAV_MENU_DURATION,
  PUBLIC_NAV_MENU_EXIT_DURATION,
  PUBLIC_PAGE_TRANSITION_MS,
  PUBLIC_PAGE_TRANSITION_EASE,
} from "@/lib/lenis-public";
