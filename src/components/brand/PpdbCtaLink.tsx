import type { ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { WhiteLightSweep } from "@/components/motion/WhiteLightSweep";
import { cn } from "@/lib/utils";

const ppdbCtaBaseClass =
  "relative isolate inline-flex items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-sm font-semibold text-white ring-2 ring-blue-300/70 ring-offset-2 ring-offset-slate-50 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-blue-400/50 dark:ring-offset-slate-950 dark:focus-visible:ring-offset-slate-950";

type PpdbCtaLinkProps = {
  href: string;
  label: string;
  className?: string;
  variant?: "hero" | "nav";
  active?: boolean;
  onNavigate?: () => void;
};

export function PpdbCtaLink({
  href,
  label,
  className,
  variant = "hero",
  active = false,
  onNavigate,
}: PpdbCtaLinkProps): ReactElement {
  return (
    <PublicSiteLink
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        ppdbCtaBaseClass,
        variant === "hero"
          ? "px-6 py-3"
          : "ml-1 h-9 shrink-0 whitespace-nowrap px-4 lg:h-8 lg:px-3 lg:text-xs xl:h-9 xl:px-4 xl:text-sm",
        active && "bg-blue-700 hover:bg-blue-700",
        className,
      )}
      onClick={onNavigate}
    >
      <WhiteLightSweep roundedClassName="rounded-xl" />
      <span className="relative z-10">{label}</span>
    </PublicSiteLink>
  );
}
