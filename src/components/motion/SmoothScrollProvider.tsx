"use client";

import { cancelFrame, frame } from "framer-motion";
import { ReactLenis, type LenisRef } from "lenis/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import {
  publicLenisOptions,
  setLenisInstance,
} from "@/lib/lenis-public";

import "lenis/dist/lenis.css";

/**
 * Smooth scroll for the public site via Lenis (root / document scroll).
 * Syncs RAF with Framer Motion so scroll-reveal (`MotionInView`) stays in step.
 * Skips Lenis entirely when `prefers-reduced-motion: reduce`.
 *
 * Astro ClientRouter remounts chrome each navigation — we re-bind on mount and
 * sync scroll on remount (rAF). Persistent `apps/web` script also handles
 * `astro:before-preparation` / `astro:after-swap` so inertia stops before the
 * fade and scroll resets after swap without fighting View Transitions.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const lenisRef = useRef<LenisRef>(null);
  /** `false` until mount so SSR/hydration stay native; then enable only if motion is OK. */
  const [smoothEnabled, setSmoothEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSmoothEnabled(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!smoothEnabled) {
      setLenisInstance(null);
      return;
    }

    let cancelled = false;
    let tries = 0;

    const bind = () => {
      if (cancelled) return;
      const instance = lenisRef.current?.lenis;
      if (instance) {
        setLenisInstance(instance);
        return;
      }
      if (tries++ < 24) {
        window.requestAnimationFrame(bind);
      }
    };

    bind();

    return () => {
      cancelled = true;
      setLenisInstance(null);
    };
  }, [smoothEnabled]);

  useEffect(() => {
    if (!smoothEnabled) return;

    const update = ({ timestamp }: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(timestamp);
    };

    frame.update(update, true);
    return () => cancelFrame(update);
  }, [smoothEnabled]);

  /**
   * Prevent native hash jumps from fighting Lenis anchors (capture phase).
   * Lenis `anchors` still handles `scrollTo` on bubble.
   */
  useEffect(() => {
    if (!smoothEnabled) return;

    function onClickCapture(event: MouseEvent): void {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event
        .composedPath()
        .find(
          (node): node is HTMLAnchorElement =>
            node instanceof HTMLAnchorElement && Boolean(node.href),
        );
      if (!anchor) return;

      let targetUrl: URL;
      let currentUrl: URL;
      try {
        targetUrl = new URL(anchor.href);
        currentUrl = new URL(window.location.href);
      } catch {
        return;
      }

      if (
        targetUrl.host !== currentUrl.host ||
        targetUrl.pathname !== currentUrl.pathname ||
        !targetUrl.hash
      ) {
        return;
      }

      event.preventDefault();
      if (targetUrl.hash !== currentUrl.hash) {
        history.pushState(null, "", `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`);
      }
    }

    window.addEventListener("click", onClickCapture, true);
    return () => window.removeEventListener("click", onClickCapture, true);
  }, [smoothEnabled]);

  /**
   * After remount (ClientRouter swap), sync Lenis once the instance is ready:
   * - hash → immediate scroll to target
   * - else → instant jump to top (smooth scroll would fight the page fade)
   *
   * Persistent apps/web `lenis-page-nav` script also listens to Astro events;
   * both paths are idempotent (immediate scrollTo same target).
   */
  useEffect(() => {
    if (!smoothEnabled) return;

    const syncScroll = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;

      lenis.resize();
      lenis.start();

      const hash = window.location.hash;
      if (hash.length > 1) {
        try {
          const el = document.querySelector(hash);
          if (el instanceof HTMLElement) {
            lenis.scrollTo(el, { immediate: true });
            return;
          }
        } catch {
          /* invalid hash selector */
        }
      }

      lenis.scrollTo(0, { immediate: true });
    };

    const id = window.requestAnimationFrame(syncScroll);
    document.addEventListener("astro:page-load", syncScroll);
    return () => {
      window.cancelAnimationFrame(id);
      document.removeEventListener("astro:page-load", syncScroll);
    };
  }, [smoothEnabled]);

  if (!smoothEnabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root ref={lenisRef} options={publicLenisOptions}>
      {children}
    </ReactLenis>
  );
}
