import {
  PUBLIC_PAGE_TRANSITION_EASE,
  PUBLIC_PAGE_TRANSITION_MS,
} from "@/lib/lenis-public";

/**
 * Light main-content crossfade for ClientRouter navigations.
 * Easing mirrors Lenis programmatic scrolls; Astro disables this under
 * `prefers-reduced-motion: reduce`.
 *
 * Avoid `fillMode: "both"` on the *new* frame: if a transition is skipped
 * (tab hidden / bfcache) before keyframes run, `both` leaves the live DOM at
 * opacity 0 → blank main with footer still visible (footer is outside the
 * named `public-page-main` group).
 */
export function publicPageFade() {
  const duration = `${PUBLIC_PAGE_TRANSITION_MS}ms`;
  const pair = {
    old: {
      name: "astroFadeOut",
      duration,
      easing: PUBLIC_PAGE_TRANSITION_EASE,
      fillMode: "forwards",
    },
    new: {
      name: "astroFadeIn",
      duration,
      easing: PUBLIC_PAGE_TRANSITION_EASE,
      // `forwards` only — do not apply 0% (opacity:0) before the animation starts.
      fillMode: "forwards",
    },
  };
  return { forwards: pair, backwards: pair };
}
