"use client";

/**
 * Compact translucent top bar for the home hero — brand · centered primary links · CTAs.
 * Replaces the three-tier PublicMarketingNavbar on `/` only.
 */
import { ChevronDown, Menu, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { useHoverIntentOpen } from "@/hooks/use-hover-intent-open";
import { usePublicSitePathname } from "@/hooks/use-public-site-pathname";
import { BRAND_SHORT } from "@/lib/branding";
import { isPublicSiteNavEntryActive } from "@/lib/public-site-nav-active";
import {
  PUBLIC_SITE_MAIN_NAV,
  PUBLIC_SITE_NAV_PPDB_CTA_LABEL,
  PUBLIC_SITE_PPDB_HREF,
  type PublicSiteNavGroup,
} from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const CMS_HREF = "https://cms.smkteknovo.sch.id" as const;

const linkClassName =
  "inline-flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

function HeroDesktopDropdown({
  entry,
  active,
}: {
  entry: PublicSiteNavGroup;
  active: boolean;
}): ReactElement {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    open,
    openMenu,
    closeMenu,
    onRootPointerEnter,
    onRootPointerLeave,
    toggleFromClick,
  } = useHoverIntentOpen();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeMenu]);

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFromClick();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu();
    }
    if (event.key === "Escape") {
      closeMenu();
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={onRootPointerEnter}
      onPointerLeave={onRootPointerLeave}
    >
      <button
        type="button"
        className={cn(linkClassName, active && "text-white underline decoration-2 underline-offset-4")}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="menu"
        onClick={toggleFromClick}
        onKeyDown={onTriggerKeyDown}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-80 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={panelId}
          role="menu"
          className="absolute top-full left-0 z-50 min-w-[14rem] pt-2"
        >
          <div className="border border-white/20 bg-brand-strong/95 py-1 shadow-sm backdrop-blur-md">
            {entry.items.map((item) => (
              <PublicSiteLink
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                onClick={closeMenu}
              >
                {item.label}
              </PublicSiteLink>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HeroMobileGroup({
  entry,
  onNavigate,
}: {
  entry: PublicSiteNavGroup;
  onNavigate: () => void;
}): ReactElement {
  const groupId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/15 first:border-t-0">
      <button
        type="button"
        id={`${groupId}-trigger`}
        className="flex w-full items-center justify-between gap-3 px-1 py-2.5 text-left text-sm font-medium text-white"
        aria-expanded={open}
        aria-controls={`${groupId}-panel`}
        onClick={() => setOpen((value) => !value)}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-80 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={`${groupId}-panel`}
          role="region"
          aria-labelledby={`${groupId}-trigger`}
          className="space-y-0.5 pb-2"
        >
          {entry.items.map((item) => (
            <PublicSiteLink
              key={item.href}
              href={item.href}
              className="block py-2 pl-3 text-sm text-white/80 hover:text-white"
              onClick={onNavigate}
            >
              {item.label}
            </PublicSiteLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

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
    <div className="relative z-[3] w-full">
      <div className="border-b border-white/15 bg-brand-strong/25 backdrop-blur-md">
        <div className="public-site-container flex items-center gap-3 py-3 sm:py-3.5">
          <PublicSiteLink
            href="/"
            className="inline-flex shrink-0 items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`Beranda ${BRAND_SHORT}`}
          >
            <BrandLogoMark
              pixelSize={28}
              shine
              priority
              roundedClassName="rounded-none"
            />
            <span className="text-sm font-bold tracking-wide text-white sm:text-base">
              {BRAND_SHORT}
            </span>
          </PublicSiteLink>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-6"
            aria-label="Menu utama"
          >
            {PUBLIC_SITE_MAIN_NAV.map((entry) => {
              const active = isPublicSiteNavEntryActive(pathname, entry);

              if (entry.type === "link") {
                return (
                  <PublicSiteLink
                    key={entry.href}
                    href={entry.href}
                    className={cn(
                      linkClassName,
                      active && "text-white underline decoration-2 underline-offset-4",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {entry.label}
                  </PublicSiteLink>
                );
              }

              return (
                <HeroDesktopDropdown key={entry.id} entry={entry} active={active} />
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            <a
              href={CMS_HREF}
              rel="noopener noreferrer"
              className="hidden border border-white/35 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:inline-flex sm:text-sm"
            >
              CMS
            </a>
            <PublicSiteLink
              href={PUBLIC_SITE_PPDB_HREF}
              className="inline-flex border border-brand bg-brand px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4 sm:text-sm"
            >
              {PUBLIC_SITE_NAV_PPDB_CTA_LABEL}
            </PublicSiteLink>

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center border border-white/35 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
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
          className="border-b border-white/15 bg-brand-strong/90 backdrop-blur-md lg:hidden"
        >
          <nav
            className="public-site-container flex max-h-[70vh] flex-col gap-0.5 overflow-y-auto py-3"
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
                      "block border border-transparent px-1 py-2.5 text-sm font-medium text-white",
                      active && "border-white/20 bg-white/10",
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {entry.label}
                  </PublicSiteLink>
                );
              }

              return (
                <HeroMobileGroup
                  key={entry.id}
                  entry={entry}
                  onNavigate={() => setMobileOpen(false)}
                />
              );
            })}

            <div className="flex flex-col gap-2 border-t border-white/15 pt-3 sm:hidden">
              <a
                href={CMS_HREF}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-white/35 px-3 py-2.5 text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                CMS
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
