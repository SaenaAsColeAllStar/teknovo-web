import type { ReactElement, ReactNode } from "react";

import { BlueprintIsometricArt } from "@/components/features/landing/blueprint/BlueprintIsometricArt";
import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";
import {
  BlueprintSectionNav,
  type BlueprintSectionNavLink,
} from "@/components/features/landing/blueprint/BlueprintSectionNav";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BlueprintFramedHeroNavLink = BlueprintSectionNavLink;

export type BlueprintFramedHeroCta = {
  label: string;
  href: string;
};

export type BlueprintFramedHeroProps = {
  id?: string;
  /** Two-line display heading (large, left-aligned). */
  titleLines: readonly [string, string];
  lede: string;
  primaryCta: BlueprintFramedHeroCta;
  secondaryCta: BlueprintFramedHeroCta;
  navLinks: readonly BlueprintFramedHeroNavLink[];
  activeHref?: string;
  illustration?: ReactNode;
  className?: string;
};

const hatchClassName =
  "bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,var(--color-border-default)_6px,var(--color-border-default)_7px)]";

/**
 * Blueprint-style framed hero: outer plate border, registration plus marks,
 * top nav + two-column body (content | hatch + circle + isometric art).
 *
 * Plus marks: absolutely positioned at every border intersection (outer corners,
 * nav-rule ∩ sides, column-divider ∩ nav/bottom on lg, stack-rule ∩ sides on narrow).
 */
export function BlueprintFramedHero({
  id,
  titleLines,
  lede,
  primaryCta,
  secondaryCta,
  navLinks,
  activeHref,
  illustration,
  className,
}: BlueprintFramedHeroProps): ReactElement {
  return (
    <section id={id} className={cn("w-full min-w-0 scroll-mt-20 bg-neutral-soft", className)}>
      <div className="public-site-container py-6 sm:py-8 lg:py-10">
        <div className="relative flex min-h-[min(92svh,52rem)] flex-col border border-border-default bg-surface">
          {/* ── Outer corners ── */}
          <BlueprintPlusMark className="left-0 top-0" />
          <BlueprintPlusMark className="left-full top-0" />
          <BlueprintPlusMark className="bottom-0 left-0 translate-y-1/2" />
          <BlueprintPlusMark className="bottom-0 left-full translate-y-1/2" />

          <BlueprintSectionNav
            ariaLabel="Navigasi profil dalam kerangka"
            menuAriaLabel="Buka menu profil"
            links={navLinks}
            activeHref={activeHref}
            withBottomRule
            showColumnMark
          />

          <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
            {/* Vertical divider — desktop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border-default lg:block"
            />
            {/* Vertical divider ∩ bottom outer border */}
            <BlueprintPlusMark className="bottom-0 left-1/2 hidden translate-y-1/2 lg:block" />

            <div className="flex flex-1 items-center px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
              <div className="w-full max-w-xl">
                <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]">
                  <span className="block">{titleLines[0]}</span>
                  <span className="block">{titleLines[1]}</span>
                </h1>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-body sm:text-[15px]">{lede}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="bg-brand hover:bg-brand-strong">
                    <PublicSiteLink href={primaryCta.href}>{primaryCta.label}</PublicSiteLink>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <PublicSiteLink href={secondaryCta.href}>{secondaryCta.label}</PublicSiteLink>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stack rule — narrow (vertical divider becomes horizontal) */}
            <div className="relative h-px w-full shrink-0 bg-border-default lg:hidden">
              <BlueprintPlusMark className="left-0 top-0" />
              <BlueprintPlusMark className="left-full top-0" />
            </div>

            <div
              className={cn(
                "relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 sm:py-14 lg:px-8",
                hatchClassName,
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(78%,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-default"
              />
              {illustration ?? <BlueprintIsometricArt />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
