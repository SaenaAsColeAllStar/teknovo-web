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
  "block rounded-md px-2 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 hover:text-blue-700 focus:bg-slate-50 focus:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:text-slate-100 dark:hover:bg-slate-800/70 dark:hover:text-blue-300 dark:focus:bg-slate-800/70";

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
    <div className="grid w-[min(100vw-2rem,72rem)] grid-cols-1 overflow-hidden bg-white dark:bg-slate-950 md:grid-cols-[minmax(13rem,15.5rem)_minmax(0,1fr)_minmax(0,9rem)]">
      <div className="relative hidden min-h-[17rem] flex-col md:flex">
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
        <div className="bg-blue-800 px-4 py-4 text-white dark:bg-blue-950">
          <p className="text-sm font-semibold leading-snug">{panel.headline}</p>
        </div>
        <NavigationMenuLink asChild>
          <PublicSiteLink
            href={panel.secondaryHref}
            className="block bg-blue-700 px-4 py-3 text-sm font-semibold text-white underline decoration-amber-300 decoration-2 underline-offset-4 transition-colors hover:bg-blue-800 focus:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800"
          >
            {panel.secondaryLabel}
          </PublicSiteLink>
        </NavigationMenuLink>
      </div>

      <div className="px-6 py-6 md:px-8 md:py-7">
        <p className="text-lg font-bold text-slate-900 dark:text-white">{entry.label}</p>
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
