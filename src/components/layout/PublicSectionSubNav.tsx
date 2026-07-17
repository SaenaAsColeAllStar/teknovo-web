import type { ReactElement } from "react";

import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";
import { BlueprintSectionNav } from "@/components/features/landing/blueprint/BlueprintSectionNav";
import { cn } from "@/lib/utils";

export type PublicSectionSubNavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

export type PublicSectionSubNavProps = {
  ariaLabel: string;
  items: readonly PublicSectionSubNavItem[];
  activeHref: string | null;
  /** Accessible label for the mobile menu control. */
  menuAriaLabel?: string;
  className?: string;
};

/**
 * Blueprint framed section subnav — brand left, section links right, plus marks
 * at plate corners. Matches the in-frame nav on profil `BlueprintFramedHero`.
 */
export function PublicSectionSubNav({
  ariaLabel,
  items,
  activeHref,
  menuAriaLabel,
  className,
}: PublicSectionSubNavProps): ReactElement {
  return (
    <div className={cn("relative border border-border-default bg-surface", className)}>
      <BlueprintPlusMark className="left-0 top-0" />
      <BlueprintPlusMark className="left-full top-0" />
      <BlueprintPlusMark className="bottom-0 left-0 translate-y-1/2" />
      <BlueprintPlusMark className="bottom-0 left-full translate-y-1/2" />

      <BlueprintSectionNav
        ariaLabel={ariaLabel}
        menuAriaLabel={menuAriaLabel}
        links={items}
        activeHref={activeHref}
      />
    </div>
  );
}
