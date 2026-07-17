"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactElement } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import { cn } from "@/lib/utils";

export type FlashInfoMarqueeProps = {
  items: readonly string[];
  label?: string;
  className?: string;
};

export function FlashInfoMarquee({
  items,
  label = "Pengumuman",
  className,
}: FlashInfoMarqueeProps): ReactElement {
  const reduceMotion = useReducedMotion();

  // Duplikasi supaya efek "berjalan" terasa kontinu.
  const loopItems = [...items, ...items];

  return (
    <MotionInView
      as="div"
      className={cn(
        "border-b border-border-default bg-surface/80 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto public-site-container flex items-center gap-3 py-2 max-md:flex-col max-md:items-center">
        <div className="flex shrink-0 items-center gap-2 rounded-none border border-border-default bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          <span className="inline-block size-2 rounded-full bg-brand" aria-hidden />
          {label}
        </div>

        <div className="relative w-full overflow-hidden">
          {reduceMotion ? (
            <div className="flex w-full flex-wrap gap-x-3 gap-y-1 text-sm text-body">
              {items.map((t) => (
                <span key={t} className="whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex whitespace-nowrap">
              <m.div
                className="flex gap-10"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                {loopItems.map((t, idx) => (
                  <span key={t + idx} className="text-sm text-body">
                    {t}
                    <span className="mx-3 text-body-subtle" aria-hidden>
                      |
                    </span>
                  </span>
                ))}
              </m.div>
            </div>
          )}
        </div>
      </div>
    </MotionInView>
  );
}

