import {
  PUBLIC_PAGE_TRANSITION_EASE,
  PUBLIC_PAGE_TRANSITION_MS,
} from "@/lib/lenis-public";

/**
 * Light main-content crossfade for ClientRouter navigations.
 * Easing mirrors Lenis programmatic scrolls; Astro disables this under
 * `prefers-reduced-motion: reduce`.
 */
export function publicPageFade() {
  const duration = `${PUBLIC_PAGE_TRANSITION_MS}ms`;
  const pair = {
    old: {
      name: "astroFadeOut",
      duration,
      easing: PUBLIC_PAGE_TRANSITION_EASE,
      fillMode: "both",
    },
    new: {
      name: "astroFadeIn",
      duration,
      easing: PUBLIC_PAGE_TRANSITION_EASE,
      fillMode: "both",
    },
  };
  return { forwards: pair, backwards: pair };
}
