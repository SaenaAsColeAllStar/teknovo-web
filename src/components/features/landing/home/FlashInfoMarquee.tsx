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
        "border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70",
        className,
      )}
    >
      <div className="mx-auto public-site-container flex items-center gap-3 py-2 max-md:flex-col max-md:items-center">
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-blue-200/70 bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-500/15 dark:text-blue-200">
          <span className="inline-block size-2 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden />
          {label}
        </div>

        <div className="relative w-full overflow-hidden">
          {reduceMotion ? (
            <div className="flex w-full flex-wrap gap-x-3 gap-y-1 text-sm text-slate-700 dark:text-slate-200">
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
                  <span key={t + idx} className="text-sm text-slate-700 dark:text-slate-200">
                    {t}
                    <span className="mx-3 text-slate-400" aria-hidden>
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

