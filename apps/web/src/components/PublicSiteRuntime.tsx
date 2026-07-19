"use client";

import type { ReactElement } from "react";

import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { ClickSpark } from "@/components/ui/click-spark/ClickSpark";

/**
 * Document-level public-site effects (Lenis + ClickSpark).
 *
 * Intentionally has **no page children** — nesting the Astro `<slot />` inside a
 * React island caused ClientRouter remounts to hit hydration mismatches and
 * wipe nested page islands (blank main + visible footer).
 */
export function PublicSiteRuntime(): ReactElement {
  return (
    <SmoothScrollProvider>
      <ClickSpark
        sparkColor="#1313BA"
        sparkSize={12}
        sparkRadius={24}
        sparkCount={10}
        duration={500}
        easing="ease-out"
        extraScale={1.1}
      />
    </SmoothScrollProvider>
  );
}
