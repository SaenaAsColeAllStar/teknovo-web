"use client";

import type { ComponentType, ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
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
  /**
   * Sub-nav di dalam `public-site-container` (halaman landing) — bar penuh lebar
   * dengan konten pill yang tetap sejajar container.
   */
  inset?: boolean;
  LinkComponent?: ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
    "aria-current"?: "page" | undefined;
  }>;
};

const navLinkBase =
  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40";

const navShellClassName =
  "sticky top-[var(--public-nav-bottom,4.25rem)] z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-950/95";

const navInsetClassName = "-mx-4 px-4 sm:-mx-6 sm:px-6";

const navListClassName =
  "public-site-container flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export function PublicSectionSubNav({
  ariaLabel,
  items,
  activeHref,
  inset = true,
  LinkComponent = PublicSiteLink,
}: PublicSectionSubNavProps): ReactElement {
  return (
    <nav aria-label={ariaLabel} className={cn(navShellClassName, inset && navInsetClassName)}>
      <ul className={navListClassName}>
        {items.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <li key={item.href}>
              <LinkComponent
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  navLinkBase,
                  isActive
                    ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                {item.label}
              </LinkComponent>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
