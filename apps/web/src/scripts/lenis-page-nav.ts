/**
 * Persistent Lenis ↔ ClientRouter coordinator + View Transition failsafe.
 *
 * Lives outside React islands: chrome islands remount on every swap, so
 * SmoothScrollProvider listeners can miss `astro:before-preparation` /
 * `astro:after-swap`. This module script runs once and stays registered.
 *
 * Strategy (avoid double-jank with View Transition fade):
 * - before-preparation: stop Lenis inertia on the outgoing page
 * - after-swap / page-load: resize + immediate scroll to top (or hash)
 *   — smooth scroll-to-top would fight the opacity fade
 *
 * Blank-main failsafe:
 * Named `public-page-main` (and other transition scopes) are hidden by the
 * UA during View Transitions. If the transition is skipped because the tab
 * is hidden, those nodes can stay at opacity 0 while the footer (root group)
 * still paints — matching the live "white page + footer" bug. Restore on
 * tab focus, bfcache restore, and after navigations settle.
 */
import {
  getLenis,
  prefersReducedMotion,
  PUBLIC_PAGE_TRANSITION_MS,
} from "@/lib/lenis-public";

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

/** Clear stuck VT / fallback fade state that leaves main content invisible. */
function restoreTransitionVisibility(): void {
  document.documentElement.removeAttribute("data-astro-transition-fallback");
  document.documentElement.removeAttribute("data-astro-transition");

  const nodes = document.querySelectorAll<HTMLElement>(
    ".public-page-main, .public-marketing-navbar, #beranda, [data-astro-transition-scope]",
  );

  for (const el of nodes) {
    for (const anim of el.getAnimations({ subtree: true })) {
      try {
        anim.cancel();
      } catch {
        /* ignore */
      }
    }
    el.style.removeProperty("opacity");
    el.style.removeProperty("visibility");
    // Framer / VT may leave opacity on wrappers; force paint on the live main slot.
    if (el.classList.contains("public-page-main") || el.id === "beranda") {
      el.style.setProperty("opacity", "1");
      el.style.setProperty("visibility", "visible");
    }
  }
}

function scheduleRestoreAfterNav(): void {
  // Let intentional crossfade finish, then ensure nothing stayed at opacity 0.
  window.setTimeout(restoreTransitionVisibility, PUBLIC_PAGE_TRANSITION_MS + 80);
}

if (typeof window !== "undefined" && !window[FLAG]) {
  window[FLAG] = true;
  document.addEventListener("astro:before-preparation", onBeforePreparation);
  document.addEventListener("astro:after-swap", () => {
    syncAfterSwap();
    restoreTransitionVisibility();
    scheduleRestoreAfterNav();
  });
  document.addEventListener("astro:page-load", () => {
    syncAfterSwap();
    restoreTransitionVisibility();
    scheduleRestoreAfterNav();
  });

  // Tab return / minimize restore — primary repro for blank main + visible footer.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      restoreTransitionVisibility();
    }
  });
  window.addEventListener("pageshow", () => {
    restoreTransitionVisibility();
  });

  // Cold load / late script: clear any stuck VT state immediately.
  restoreTransitionVisibility();
}
