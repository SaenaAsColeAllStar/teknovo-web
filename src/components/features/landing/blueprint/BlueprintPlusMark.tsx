import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export type BlueprintPlusMarkProps = {
  className?: string;
};

/**
 * Registration “+” at blueprint frame intersections — low-contrast, centered on the join.
 */
export function BlueprintPlusMark({ className }: BlueprintPlusMarkProps): ReactElement {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none",
        "font-mono text-[10px] leading-none text-body-subtle sm:text-[11px]",
        className,
      )}
    >
      +
    </span>
  );
}
