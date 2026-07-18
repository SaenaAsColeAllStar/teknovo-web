"use client";

/**
 * Two-tier translucent overlay for the home hero — mirrors PublicMarketingNavbar
 * brand/actions + nav/search (skips announcement; stays over the photographic hero).
 */
import { Mail, Menu, Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import {
  PublicDesktopNavDropdown,
  PublicMobileNavGroup,
} from "@/components/layout/PublicSiteNavMenus";
import {
  buildPublicSiteSearchHref,
  PublicSiteSearchForm,
  type PublicSiteSearchCategoryId,
} from "@/components/layout/PublicSiteSearchForm";
import { usePublicSitePathname } from "@/hooks/use-public-site-pathname";
import { BRAND_SHORT } from "@/lib/branding";
import { CONTACT } from "@/lib/constants";
import {
  getPublikWhatsAppUrl,
  PUBLIK_CONTACT_EMAIL,
  PUBLIK_CONTACT_WA_DISPLAY,
} from "@/lib/kontak-publik";
import { isPublicSiteNavEntryActive } from "@/lib/public-site-nav-active";
import {
  PUBLIC_SITE_MAIN_NAV,
  PUBLIC_SITE_NAV_PPDB_CTA_LABEL,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const contactPhoneDisplay =
  CONTACT.phone.includes("000000") || CONTACT.phone.trim() === ""
    ? PUBLIK_CONTACT_WA_DISPLAY
    : CONTACT.phone;

const contactEmailDisplay =
  CONTACT.email.trim() !== "" ? CONTACT.email : PUBLIK_CONTACT_EMAIL;

const contactPhoneHref = getPublikWhatsAppUrl();
const contactEmailHref = `mailto:${contactEmailDisplay}`;

const tierContainerClassName = "public-site-container flex items-center";

const navItemClassName =
  "inline-flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

const navItemActiveClassName =
  "text-white underline decoration-2 underline-offset-4";

export function HeroOverlayNav(): ReactElement {
  const pathname = usePublicSitePathname();
  const router = useRouter();
  const mobileNavId = useId();
  const searchFormId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] =
    useState<PublicSiteSearchCategoryId>("all");

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

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildPublicSiteSearchHref(searchCategory, searchQuery));
    setMobileOpen(false);
  }

  function onNavigateSuggestion(href: string) {
    router.push(href);
    setMobileOpen(false);
  }

  return (
    <div className="relative z-[3] w-full">
      {/* Brand / actions — mirrors marketing main bar */}
      <div className="border-b border-white/15 bg-brand-strong/25 backdrop-blur-md">
        <div
          className={cn(
            tierContainerClassName,
            "relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 sm:py-3.5",
          )}
        >
          <PublicSiteLink
            href="/"
            className="col-start-2 inline-flex shrink-0 flex-col items-center justify-self-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`Beranda ${BRAND_SHORT}`}
          >
            <BrandLogoMark
              pixelSize={32}
              shine
              priority
              roundedClassName="rounded-none"
            />
            <span className="text-[11px] font-bold tracking-[0.08em] text-white sm:text-xs">
              SMK {BRAND_SHORT}
            </span>
          </PublicSiteLink>

          <div className="col-start-3 flex items-center justify-end gap-2 sm:gap-3">
            <a
              href={contactPhoneHref}
              className="hidden items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white md:inline-flex"
              rel="noopener noreferrer"
              target="_blank"
            >
              Hubungi kami
              <Phone className="size-[18px] shrink-0" aria-hidden />
            </a>

            <PublicSiteLink
              href={PUBLIC_SITE_PPDB_HREF}
              className="inline-flex border border-white/35 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4 sm:text-sm"
            >
              {PUBLIC_SITE_NAV_PPDB_CTA_LABEL}
            </PublicSiteLink>

            <button
              type="button"
              className="ds-menu-toggle inline-flex size-10 items-center justify-center border border-white/35 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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

      {/* Nav + search — mirrors marketing bottom bar */}
      <div className="hidden border-b border-white/15 bg-brand-strong/20 backdrop-blur-md md:block">
        <div
          className={cn(
            tierContainerClassName,
            "justify-between gap-4 overflow-visible py-2.5",
          )}
        >
          <nav
            className="hidden min-w-0 flex-1 items-center gap-6 lg:flex"
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
          </nav>

          <PublicSiteSearchForm
            idPrefix={searchFormId}
            searchQuery={searchQuery}
            searchCategory={searchCategory}
            onQueryChange={setSearchQuery}
            onCategoryChange={setSearchCategory}
            onSubmit={onSearchSubmit}
            onNavigateSuggestion={onNavigateSuggestion}
            appearance="overlay"
            className="ml-auto hidden w-full max-w-[480px] md:flex"
          />
        </div>
      </div>

      {mobileOpen ? (
        <div
          id={mobileNavId}
          className="ds-mobile-nav border-b border-white/15 bg-brand-strong/90 backdrop-blur-md"
        >
          <nav
            className={cn(
              tierContainerClassName,
              "max-h-[70vh] flex-col items-stretch gap-1 overflow-y-auto py-3",
            )}
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

            <div className="flex flex-col gap-2 border-t border-white/15 pt-3 sm:hidden">
              <a
                href={contactPhoneHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80"
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => setMobileOpen(false)}
              >
                <Phone className="size-[18px]" aria-hidden />
                {contactPhoneDisplay}
              </a>
              <a
                href={contactEmailHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80"
                onClick={() => setMobileOpen(false)}
              >
                <Mail className="size-[18px]" aria-hidden />
                {contactEmailDisplay}
              </a>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/15 pt-3 md:hidden">
              <a
                href={contactPhoneHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white"
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => setMobileOpen(false)}
              >
                Hubungi kami
                <Phone className="size-[18px]" aria-hidden />
              </a>
              <PublicSiteLink
                href={PUBLIC_SITE_PPDB_HREF}
                className="inline-flex w-full items-center justify-center border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => setMobileOpen(false)}
              >
                {PUBLIC_SITE_NAV_PPDB_CTA_LABEL}
              </PublicSiteLink>
            </div>

            <div className="border-t border-white/15 pt-3 md:hidden">
              <PublicSiteSearchForm
                idPrefix={`${searchFormId}-mobile`}
                searchQuery={searchQuery}
                searchCategory={searchCategory}
                onQueryChange={setSearchQuery}
                onCategoryChange={setSearchCategory}
                onSubmit={onSearchSubmit}
                onNavigateSuggestion={onNavigateSuggestion}
                appearance="overlay"
                className="w-full"
              />
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
