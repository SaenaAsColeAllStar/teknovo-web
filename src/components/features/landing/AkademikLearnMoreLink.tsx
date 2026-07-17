import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AkademikLearnMoreLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function IcoLearnMoreArrow({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-3.5 shrink-0", className)} aria-hidden>
      <path d="M3 8h9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AkademikLearnMoreLink({
  href,
  children,
  className,
}: AkademikLearnMoreLinkProps): ReactElement {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 transition hover:text-brand-strong hover:underline",
        className,
      )}
    >
      {children}
      <IcoLearnMoreArrow />
    </Link>
  );
}
