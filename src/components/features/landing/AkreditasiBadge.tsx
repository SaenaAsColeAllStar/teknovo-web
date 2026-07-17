"use client";

import { m } from "framer-motion";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export type AkreditasiBadgeProps = {
  text?: string;
  className?: string;
};

export function AkreditasiBadge({
  text = "Akreditasi",
  className,
}: AkreditasiBadgeProps): ReactElement {
  return (
    <m.div
      role="note"
      aria-label={text}
      className={cn(
        "absolute bottom-4 left-3 z-30",
        "pointer-events-none flex w-fit items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-2.5 py-2",
        "backdrop-blur-sm shadow-lg",
        "text-xs font-semibold text-slate-900 sm:text-sm",
        className,
      )}
      style={{ willChange: "transform" }}
    >
      <span
        className="pointer-events-none absolute inset-0 z-[0] overflow-hidden rounded-2xl"
        aria-hidden
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-teknovo-cta-shine" />
      </span>

      <span className="relative z-10 inline text-[11px] sm:text-sm">{text}</span>
      <span className="relative z-10 inline-flex size-7 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
        <span className="text-sm font-bold">A</span>
      </span>
    </m.div>
  );
}

