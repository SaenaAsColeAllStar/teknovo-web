import type { ReactElement } from "react";

import { PublicNavMegaBrandWatermark } from "@/components/layout/PublicNavMegaBrandWatermark";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { PUBLIC_SITE_NAV_MEGA_PANELS } from "@/lib/public-nav-mega-menu";
import type { PublicSiteNavGroup } from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const megaLinkClass =
  "block rounded-none px-2 py-2 text-sm font-medium text-[color:var(--color-heading)] transition-colors hover:bg-[color:var(--color-border-default)]/55 hover:text-[color:var(--color-brand-strong)] focus:bg-[color:var(--color-border-default)]/55 focus:text-[color:var(--color-brand-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand)]/30";

function splitNavItems<T>(items: readonly T[]): [T[], T[]] {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

type PublicNavMegaPanelProps = {
  entry: PublicSiteNavGroup;
};

export function PublicNavMegaPanel({ entry }: PublicNavMegaPanelProps): ReactElement {
  const panel = PUBLIC_SITE_NAV_MEGA_PANELS[entry.id];
  const [leftColumn, rightColumn] = splitNavItems(entry.items);

  return (
    <div className="grid w-[min(100vw-2rem,72rem)] grid-cols-1 overflow-hidden bg-[color:var(--color-surface)] md:grid-cols-[minmax(13rem,15.5rem)_minmax(0,1fr)_minmax(0,9rem)]">
      <div className="relative hidden min-h-[17rem] flex-col border-r border-[color:var(--color-border-default)] md:flex">
        <div className={cn("relative min-h-[11.5rem] flex-1", publicOptimizedImageContainerClassName)}>
          <PublicOptimizedImage
            src={panel.imageSrc}
            alt={panel.imageAlt}
            fill
            sizes="248px"
            priority
            className="object-cover"
          />
        </div>
        <div className="bg-[color:var(--color-brand)] px-4 py-4 text-white">
          <p className="text-sm font-semibold leading-snug">{panel.headline}</p>
        </div>
        <NavigationMenuLink asChild>
          <PublicSiteLink
            href={panel.secondaryHref}
            className="block bg-[color:var(--color-brand-strong)] px-4 py-3 text-sm font-semibold text-white underline decoration-white/70 decoration-2 underline-offset-4 transition-colors hover:bg-[color:var(--color-brand)] focus:bg-[color:var(--color-brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {panel.secondaryLabel}
          </PublicSiteLink>
        </NavigationMenuLink>
      </div>

      <div className="px-6 py-6 md:px-8 md:py-7">
        <p className="text-lg font-bold text-[color:var(--color-heading)]">{entry.label}</p>
        <div className="mt-4 grid gap-x-10 gap-y-1 sm:grid-cols-2">
          {[leftColumn, rightColumn].map((column, columnIndex) => (
            <ul key={columnIndex} className="space-y-0.5">
              {column.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <PublicSiteLink href={item.href} className={megaLinkClass}>
                      {item.label}
                    </PublicSiteLink>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <PublicNavMegaBrandWatermark title={entry.label} />
    </div>
  );
}
