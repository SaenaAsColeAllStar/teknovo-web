import type Lenis from "lenis";
import type { LenisOptions, ScrollToOptions } from "lenis";

/**
 * Atlas marketing Lenis tune — snappy wheel + short programmatic eases.
 * `autoRaf: false` — RAF owned by Framer `frame.update` in SmoothScrollProvider.
 */
export const PUBLIC_LENIS_LERP = 0.14;
/** Programmatic / anchor scroll duration (seconds). */
export const PUBLIC_LENIS_DURATION = 0.65;
/** Slightly sharper than Lenis default expo for micro-interaction feel. */
export function publicLenisEasing(t: number): number {
  return Math.min(1, 1.001 - Math.pow(2, -12 * t));
}

/** Shared options for `ReactLenis` / `new Lenis`. */
export const publicLenisOptions = {
  autoRaf: false,
  lerp: PUBLIC_LENIS_LERP,
  wheelMultiplier: 0.92,
  touchMultiplier: 1,
  /** Same-path `#hash` clicks → Lenis.scrollTo (respects scroll-margin / scroll-padding). */
  anchors: {
    offset: 0,
    duration: PUBLIC_LENIS_DURATION,
    easing: publicLenisEasing,
  },
  stopInertiaOnNavigate: true,
} as const satisfies LenisOptions;

const DEFAULT_NAV_OFFSET_PX = 176; // 11rem @ 16px

let lenisInstance: Lenis | null = null;

/** Register the live root Lenis (called from SmoothScrollProvider). */
export function setLenisInstance(instance: Lenis | null): void {
  lenisInstance = instance;
}

/** Imperative access for islands outside React Lenis context. */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Nested-safe Lenis pause while overlays / nav menus are open so wheel
 * inertia does not fight fixed panels. Call the returned release fn on close.
 */
let lenisScrollLockCount = 0;

export function lockLenisScroll(): () => void {
  if (typeof window === "undefined" || prefersReducedMotion()) {
    return () => {};
  }

  const lenis = getLenis();
  if (!lenis) return () => {};

  if (lenisScrollLockCount === 0) {
    lenis.stop();
  }
  lenisScrollLockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lenisScrollLockCount = Math.max(0, lenisScrollLockCount - 1);
    if (lenisScrollLockCount === 0) {
      getLenis()?.start();
    }
  };
}

/** Open/close duration (seconds) for public nav menus — snappy with Lenis feel. */
export const PUBLIC_NAV_MENU_DURATION = 0.2;

/** Slightly shorter exit so dismiss feels immediate. */
export const PUBLIC_NAV_MENU_EXIT_DURATION = 0.15;

/**
 * Sticky public navbar height from `--public-nav-bottom`
 * (set by PublicMarketingNavbar ResizeObserver).
 */
export function getPublicNavScrollOffsetPx(): number {
  if (typeof window === "undefined") return DEFAULT_NAV_OFFSET_PX;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--public-nav-bottom")
    .trim();
  if (!raw) return DEFAULT_NAV_OFFSET_PX;
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return DEFAULT_NAV_OFFSET_PX;
  if (raw.endsWith("rem")) {
    const rootPx = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return value * rootPx;
  }
  return value;
}

export type PublicScrollTarget = string | number | HTMLElement;

export type PublicScrollToOptions = ScrollToOptions & {
  /**
   * Extra `-nav` offset. Prefer `html { scroll-padding-top }` / `scroll-mt-*` instead —
   * only use when the target has neither (avoids double-counting with Lenis).
   */
  accountForNav?: boolean;
};

/**
 * Smooth scroll via Lenis when available; native fallback otherwise.
 * Prefer this over `element.scrollIntoView` / `window.scrollTo` on the public site.
 * Nav clearance: `scroll-padding-top` on `html` (and optional `scroll-mt-*` on targets).
 */
export function scrollToPublic(
  target: PublicScrollTarget,
  options: PublicScrollToOptions = {},
): void {
  const { accountForNav = false, offset = 0, ...rest } = options;
  const navNudge = accountForNav ? -getPublicNavScrollOffsetPx() : 0;
  const mergedOffset = offset + navNudge;

  const lenis = getLenis();
  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(target, {
      duration: PUBLIC_LENIS_DURATION,
      easing: publicLenisEasing,
      ...rest,
      offset: mergedOffset,
    });
    return;
  }

  // Native fallback (reduced-motion or pre-mount)
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }
  if (typeof target === "string") {
    if (target === "top" || target === "#" || target === "#top") {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }
    try {
      const el =
        target.startsWith("#")
          ? document.getElementById(target.slice(1))
          : document.querySelector(target);
      if (el instanceof HTMLElement) {
        el.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      }
    } catch {
      /* invalid selector */
    }
    return;
  }
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

/** Jump to top of page (route changes, back-to-top). */
export function scrollToTopPublic(options: PublicScrollToOptions = {}): void {
  scrollToPublic(0, { immediate: true, ...options });
}
