import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/** Centered empty / error illustration block for list pages. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border border-[color:var(--color-border)] bg-white px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-none border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] p-4">
        <Icon
          className="size-8 text-[color:var(--color-body-subtle)]"
          aria-hidden
        />
      </div>
      <h3 className="text-lg font-semibold text-[color:var(--color-heading)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-[color:var(--color-body)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
