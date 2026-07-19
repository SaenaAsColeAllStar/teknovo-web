/**
 * Persistent Lenis ↔ ClientRouter coordinator.
 *
 * Lives outside React islands: PublicChrome remounts on every swap, so
 * SmoothScrollProvider listeners can miss `astro:before-preparation` /
 * `astro:after-swap`. This module script runs once and stays registered.
 *
 * Strategy (avoid double-jank with View Transition fade):
 * - before-preparation: stop Lenis inertia on the outgoing page
 * - after-swap / page-load: resize + immediate scroll to top (or hash)
 *   — smooth scroll-to-top would fight the opacity fade
 */
import { getLenis, prefersReducedMotion } from "@/lib/lenis-public";

const FLAG = "__teknovoLenisPageNav" as const;

declare global {
  interface Window {
    [FLAG]?: true;
  }
}

function scrollToRouteTarget(immediate: boolean): void {
  const lenis = getLenis();
  const hash = window.location.hash;

  if (hash.length > 1) {
    try {
      const el = document.querySelector(hash);
      if (el instanceof HTMLElement) {
        if (lenis && !prefersReducedMotion()) {
          lenis.scrollTo(el, { immediate });
        } else {
          el.scrollIntoView({ behavior: "auto", block: "start" });
        }
        return;
      }
    } catch {
      /* invalid hash selector */
    }
  }

  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(0, { immediate });
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

function syncAfterSwap(): void {
  const run = (attempt: number) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.resize();
      lenis.start();
      scrollToRouteTarget(true);
      return;
    }
    // ReactLenis may hydrate a frame or two after after-swap
    if (attempt < 12) {
      window.requestAnimationFrame(() => run(attempt + 1));
      return;
    }
    scrollToRouteTarget(true);
  };
  run(0);
}

function onBeforePreparation(): void {
  if (prefersReducedMotion()) return;
  getLenis()?.stop();
}

if (typeof window !== "undefined" && !window[FLAG]) {
  window[FLAG] = true;
  document.addEventListener("astro:before-preparation", onBeforePreparation);
  document.addEventListener("astro:after-swap", syncAfterSwap);
  document.addEventListener("astro:page-load", syncAfterSwap);
}
