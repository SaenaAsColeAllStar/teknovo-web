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
  publicLenisOptions,
  PUBLIC_LENIS_DURATION,
  PUBLIC_LENIS_LERP,
} from "@/lib/lenis-public";
