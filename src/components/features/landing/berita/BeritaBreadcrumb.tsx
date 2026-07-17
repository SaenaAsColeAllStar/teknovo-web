import Link from "next/link";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export type BeritaBreadcrumbSegment = {
  label: string;
  href?: string;
};

type BeritaBreadcrumbProps = {
  segments: BeritaBreadcrumbSegment[];
  className?: string;
};

export function BeritaBreadcrumb({ segments, className }: BeritaBreadcrumbProps): ReactElement {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-slate-500 dark:text-slate-400", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={`${segment.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden className="text-slate-300 dark:text-slate-600">
                  ›
                </span>
              ) : null}
              {segment.href && !isLast ? (
                <Link
                  href={segment.href}
                  className="font-medium text-blue-600 transition hover:underline dark:text-blue-400"
                >
                  {segment.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "truncate",
                    isLast ? "font-medium text-slate-700 dark:text-slate-200" : "text-slate-600 dark:text-slate-300",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {segment.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
