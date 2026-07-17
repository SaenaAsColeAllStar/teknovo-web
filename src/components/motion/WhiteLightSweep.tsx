import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

type WhiteLightSweepProps = {
  className?: string;
  roundedClassName?: string;
  /**
   * `behind` — sapuan di belakang konten (CTA biru).
   * `overlay` — sapuan di atas konten dengan blend (logo & wordmark navbar).
   */
  placement?: "behind" | "overlay";
};

export function WhiteLightSweep({
  className,
  roundedClassName = "rounded-[inherit]",
  placement = "behind",
}: WhiteLightSweepProps): ReactElement {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        placement === "overlay"
          ? "z-20 mix-blend-soft-light dark:mix-blend-plus-lighter"
          : "z-0",
        roundedClassName,
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-teknovo-cta-shine" />
    </span>
  );
}
