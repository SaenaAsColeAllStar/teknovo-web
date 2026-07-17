import type { ReactElement } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { cn } from "@/lib/utils";

export type BlueprintSectionNavLink = {
  label: string;
  href: string;
};

export type BlueprintSectionNavProps = {
  ariaLabel: string;
  /** Accessible label for the mobile disclosure control. */
  menuAriaLabel?: string;
  links: readonly BlueprintSectionNavLink[];
  activeHref?: string | null;
  /**
   * When true (hero frame with body below), draw bottom rule + plus marks at
   * nav-rule ∩ outer sides. Standalone framed bars omit the rule.
   */
  withBottomRule?: boolean;
  /** Plus mark at nav-rule ∩ vertical column divider (hero desktop). */
  showColumnMark?: boolean;
  className?: string;
};

/**
 * Blueprint plate nav: brand left, section links right, hamburger on narrow.
 * Used inside `BlueprintFramedHero` and standalone framed section subnavs.
 */
export function BlueprintSectionNav({
  ariaLabel,
  menuAriaLabel = "Buka menu bagian",
  links,
  activeHref,
  withBottomRule = false,
  showColumnMark = false,
  className,
}: BlueprintSectionNavProps): ReactElement {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "relative flex h-14 shrink-0 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8",
        withBottomRule && "border-b border-border-default",
        className,
      )}
    >
      {withBottomRule ? (
        <>
          <BlueprintPlusMark className="left-0 top-full" />
          <BlueprintPlusMark className="left-full top-full" />
          {showColumnMark ? (
            <BlueprintPlusMark className="left-1/2 top-full hidden lg:block" />
          ) : null}
        </>
      ) : null}

      <BrandLogo href="/" layout="compact" shine={false} className="min-w-0" />

      <ul className="hidden items-center gap-1 md:flex lg:gap-2">
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <li key={link.href}>
              <PublicSiteLink
                href={link.href}
                className={cn(
                  "px-2.5 py-1.5 text-xs font-medium tracking-wide transition-colors lg:text-[13px]",
                  active ? "text-heading" : "text-body-subtle hover:text-heading",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </PublicSiteLink>
            </li>
          );
        })}
      </ul>

      <details className="relative md:hidden">
        <summary
          className={cn(
            "flex size-9 cursor-pointer list-none items-center justify-center border border-border-default",
            "text-heading marker:content-none [&::-webkit-details-marker]:hidden",
            "hover:bg-neutral-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
          )}
          aria-label={menuAriaLabel}
        >
          <span className="flex flex-col gap-1" aria-hidden>
            <span className="block h-px w-4 bg-heading" />
            <span className="block h-px w-4 bg-heading" />
            <span className="block h-px w-4 bg-heading" />
          </span>
        </summary>
        <ul className="absolute right-0 top-full z-30 mt-1 min-w-[12rem] border border-border-default bg-surface py-1 shadow-sm">
          {links.map((link) => {
            const active = activeHref === link.href;
            return (
              <li key={link.href}>
                <PublicSiteLink
                  href={link.href}
                  className={cn(
                    "block px-3 py-2 text-sm transition-colors hover:bg-neutral-soft",
                    active ? "font-medium text-heading" : "text-body",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </PublicSiteLink>
              </li>
            );
          })}
        </ul>
      </details>
    </nav>
  );
}
