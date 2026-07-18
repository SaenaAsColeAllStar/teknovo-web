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

import "lenis/dist/lenis.css";

/**
 * Smooth scroll for the public site via Lenis (root / document scroll).
 * Syncs RAF with Framer Motion so scroll-reveal (`MotionInView`) stays in step.
 * Skips Lenis entirely when `prefers-reduced-motion: reduce`.
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
    if (!smoothEnabled) return;

    const update = ({ timestamp }: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(timestamp);
    };

    frame.update(update, true);
    return () => cancelFrame(update);
  }, [smoothEnabled]);

  if (!smoothEnabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        // Hash / in-page anchors via Lenis.scrollTo — respects scroll-margin / scroll-mt-*
        anchors: true,
        lerp: 0.1,
        // Avoid lingering inertia when clicking internal links
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
