"use client";

/**
 * Single-row translucent nav pinned to the home photographic hero.
 * Brand left · primary links center · two compact CTAs right (not the three-tier chrome).
 */
import { Menu, X } from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type ReactElement,
} from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import {
  PublicDesktopNavDropdown,
  PublicMobileNavGroup,
} from "@/components/layout/PublicSiteNavMenus";
import { usePublicSitePathname } from "@/hooks/use-public-site-pathname";
import { BRAND_SHORT } from "@/lib/branding";
import { isPublicSiteNavEntryActive } from "@/lib/public-site-nav-active";
import {
  PUBLIC_SITE_CMS_LOGIN_HREF,
  PUBLIC_SITE_MAIN_NAV,
  PUBLIC_SITE_NAV_PPDB_CTA_LABEL,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const navItemClassName =
  "inline-flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

const navItemActiveClassName =
  "text-white underline decoration-2 underline-offset-4";

const actionBtnClassName =
  "inline-flex items-center justify-center border border-white/35 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4 sm:text-sm";

export function HeroOverlayNav(): ReactElement {
  const pathname = usePublicSitePathname();
  const mobileNavId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="relative z-[3] w-full">
      <div className="border-b border-white/15 bg-brand-strong/30 backdrop-blur-md">
        <div className="public-site-container relative flex items-center gap-3 py-3 sm:py-3.5">
          {/* Brand — start */}
          <PublicSiteLink
            href="/"
            className="inline-flex shrink-0 items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`Beranda ${BRAND_SHORT}`}
          >
            <BrandLogoMark
              pixelSize={28}
              shine
              priority
              roundedClassName="rounded-none"
            />
            <span className="text-xs font-bold tracking-[0.06em] text-white sm:text-sm">
              SMK {BRAND_SHORT}
            </span>
          </PublicSiteLink>

          {/* Primary links — center (≥lg) */}
          <nav
            className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center lg:pointer-events-auto lg:flex"
            aria-label="Menu utama"
          >
            <div className="flex max-w-[min(100%,42rem)] items-center justify-center gap-5 xl:gap-6">
              {PUBLIC_SITE_MAIN_NAV.map((entry) => {
                const active = isPublicSiteNavEntryActive(pathname, entry);

                if (entry.type === "link") {
                  return (
                    <PublicSiteLink
                      key={entry.href}
                      href={entry.href}
                      className={cn(
                        navItemClassName,
                        active && navItemActiveClassName,
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {entry.label}
                    </PublicSiteLink>
                  );
                }

                return (
                  <PublicDesktopNavDropdown
                    key={entry.id}
                    entry={entry}
                    active={active}
                    appearance="overlay"
                  />
                );
              })}
            </div>
          </nav>

          {/* Actions — end */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <PublicSiteLink
              href={PUBLIC_SITE_PPDB_HREF}
              className={actionBtnClassName}
            >
              {PUBLIC_SITE_NAV_PPDB_CTA_LABEL}
            </PublicSiteLink>

            <a href={PUBLIC_SITE_CMS_LOGIN_HREF} className={actionBtnClassName}>
              Login
            </a>

            {/* Stay visible until lg — desktop links only appear at lg */}
            <button
              type="button"
              className="hero-menu-toggle inline-flex size-10 items-center justify-center border border-white/35 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-expanded={mobileOpen}
              aria-controls={mobileNavId}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="size-[18px]" aria-hidden />
              ) : (
                <Menu className="size-[18px]" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id={mobileNavId}
          className="hero-mobile-nav border-b border-white/15 bg-brand-strong/95 backdrop-blur-md"
        >
          <nav
            className="public-site-container flex max-h-[70vh] flex-col items-stretch gap-1 overflow-y-auto py-3"
            aria-label="Menu situs"
          >
            {PUBLIC_SITE_MAIN_NAV.map((entry) => {
              if (entry.type === "link") {
                const active = isPublicSiteNavEntryActive(pathname, entry);
                return (
                  <PublicSiteLink
                    key={entry.href}
                    href={entry.href}
                    className={cn(
                      "block border border-transparent px-3 py-2.5 text-sm font-medium text-white",
                      active && "border-white/20 bg-white/10",
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {entry.label}
                  </PublicSiteLink>
                );
              }

              return (
                <PublicMobileNavGroup
                  key={entry.id}
                  entry={entry}
                  onNavigate={() => setMobileOpen(false)}
                  appearance="overlay"
                />
              );
            })}

            <div className="flex flex-col gap-2 border-t border-white/15 pt-3">
              <PublicSiteLink
                href={PUBLIC_SITE_PPDB_HREF}
                className="inline-flex w-full items-center justify-center border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => setMobileOpen(false)}
              >
                {PUBLIC_SITE_NAV_PPDB_CTA_LABEL}
              </PublicSiteLink>
              <a
                href={PUBLIC_SITE_CMS_LOGIN_HREF}
                className="inline-flex w-full items-center justify-center border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
