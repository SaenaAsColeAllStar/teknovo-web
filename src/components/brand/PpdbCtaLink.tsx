import type { ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { WhiteLightSweep } from "@/components/motion/WhiteLightSweep";
import { cn } from "@/lib/utils";

const ppdbCtaBaseClass =
  "relative isolate inline-flex items-center justify-center overflow-hidden rounded-none bg-brand text-sm font-semibold text-white ring-2 ring-brand/30 ring-offset-2 ring-offset-surface transition hover:bg-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

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
