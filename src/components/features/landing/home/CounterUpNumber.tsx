"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useInView } from "framer-motion";

export type CounterUpNumberProps = {
  value: number;
  suffix?: string;
  durationMs?: number;
  /**
   * Batas awal animasi.
   * Catatan: untuk 1000+ / 50+ / 30+ biasanya cukup 0.
   */
  from?: number;
};

function formatNumberId(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export function CounterUpNumber({
  value,
  suffix = "",
  durationMs = 900,
  from = 0,
}: CounterUpNumberProps): ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });

  const end = useMemo(() => Math.max(0, value), [value]);
  const start = useMemo(() => Math.max(0, from), [from]);

  const [display, setDisplay] = useState<number>(start);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const startTs = performance.now();
    const span = end - start;

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    let raf = 0;
    function tick(now: number): void {
      const elapsed = now - startTs;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(progress);
      const next = start + Math.round(span * eased);
      setDisplay(next);

      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    }

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [durationMs, end, isInView, start, value]);

  // Wrapper ref butuh node; kita sembunyikan dengan style.
  return (
    <span ref={ref}>
      {formatNumberId(display)}
      {suffix}
    </span>
  );
}

