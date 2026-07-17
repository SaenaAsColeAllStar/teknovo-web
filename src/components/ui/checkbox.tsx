import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "size-4 shrink-0 cursor-pointer rounded-[3px] border border-[color:var(--color-border-default)] accent-[color:var(--color-brand)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";
