"use client";

/**
 * Navbar situs publik — dipakai `apps/web` dan `apps/admissions` lewat `PublicSiteLayout`.
 * Menu dan mega-panel: `PUBLIC_SITE_MAIN_NAV` + `PUBLIC_SITE_NAV_MEGA_PANELS`.
 */
import type { ReactElement } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { PublicNavMegaPanel } from "@/components/layout/PublicNavMegaPanel";
import { PublicNavbarClock } from "@/components/layout/PublicNavbarClock";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePublicSitePathname } from "@/hooks/use-public-site-pathname";
import { isPublicSiteNavEntryActive } from "@/lib/public-site-nav-active";
import { PUBLIC_SITE_MAIN_NAV, PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

/** Tab/link aktif — selaras `data-[state=open]` pada trigger mega menu. */
const publicNavActiveTriggerClass =
  "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 dark:focus:bg-blue-600";

export function PublicNavbar(): ReactElement {
  const pathname = usePublicSitePathname();

  return (
    <header className="sticky top-0 z-50 w-full overflow-visible border-b border-slate-200/80 bg-white/90 backdrop-blur-md [--public-nav-bottom:4.25rem] dark:border-slate-800/80 dark:bg-slate-950/90 lg:[--public-nav-bottom:4rem]">
      <div className="public-site-container hidden h-[4.25rem] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 md:grid md:gap-3 lg:h-16 lg:gap-3 xl:gap-4">
        <BrandLogo href="/" layout="compact" className="shrink-0 justify-self-start" shine />

        <NavigationMenu
          className="max-w-none min-w-0 justify-center justify-self-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] xl:overflow-visible [&::-webkit-scrollbar]:hidden"
          viewportVariant="public-mega"
        >
          <NavigationMenuList className="flex-nowrap justify-center whitespace-nowrap [&_a]:lg:px-1.5 [&_a]:lg:text-xs [&_a]:xl:px-2.5 [&_a]:xl:text-sm [&_button]:lg:px-1.5 [&_button]:lg:text-xs [&_button]:xl:px-2.5 [&_button]:xl:text-sm">
            {PUBLIC_SITE_MAIN_NAV.map((entry) => {
              const active = isPublicSiteNavEntryActive(pathname, entry);

              if (entry.type === "link") {
                if (entry.href === PUBLIC_SITE_PPDB_HREF) {
                  return (
                    <NavigationMenuItem key={entry.href}>
                      <PpdbCtaLink href={entry.href} label={entry.label} variant="nav" active={active} />
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={entry.href}>
                    <NavigationMenuLink asChild>
                      <PublicSiteLink
                        href={entry.href}
                        className={cn(navigationMenuTriggerStyle(), active && publicNavActiveTriggerClass)}
                        aria-current={active ? "page" : undefined}
                      >
                        {entry.label}
                      </PublicSiteLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              }

              return (
                <NavigationMenuItem key={entry.id}>
                  <NavigationMenuTrigger className={cn(active && publicNavActiveTriggerClass)}>
                    {entry.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-0">
                    <PublicNavMegaPanel entry={entry} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <PublicNavbarClock className="justify-self-end" />
      </div>

      <div className="public-site-container flex h-[3.75rem] w-full items-center justify-center md:hidden">
        <BrandLogo href="/" layout="compact" className="max-w-full" shine />
      </div>
    </header>
  );
}
