"use client";

/**
 * Three-tier marketing navbar — announcement + main (contact/brand/actions) + bottom (nav/search).
 * Self-contained chrome for the public site layout.
 * Dropdown/search primitives shared with the public site chrome.
 */
import { Mail, Menu, Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
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
import { Button } from "@/components/ui/button";
import { usePublicSitePathname } from "@/hooks/use-public-site-pathname";
import { BRAND_SHORT } from "@/lib/branding";
import { CONTACT } from "@/lib/constants";
import { HOME_FLASH_MARQUEE_ITEMS } from "@/lib/home-landing-content";
import {
  getPublikWhatsAppUrl,
  PUBLIK_CONTACT_EMAIL,
  PUBLIK_CONTACT_WA_DISPLAY,
} from "@/lib/kontak-publik";
import { isPublicSiteNavEntryActive } from "@/lib/public-site-nav-active";
import {
  PUBLIC_SITE_CMS_LOGIN_HREF,
  PUBLIC_SITE_MAIN_NAV,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const ANNOUNCEMENT_HREF = PUBLIC_SITE_PPDB_HREF;
const ANNOUNCEMENT_TEXT =
  HOME_FLASH_MARQUEE_ITEMS[0] ??
  "PPDB Tahun Ajaran 2026/2027 telah dibuka — pantau halaman PPDB resmi sekolah.";

const contactPhoneDisplay =
  CONTACT.phone.includes("000000") || CONTACT.phone.trim() === ""
    ? PUBLIK_CONTACT_WA_DISPLAY
    : CONTACT.phone;

const contactEmailDisplay =
  CONTACT.email.trim() !== "" ? CONTACT.email : PUBLIK_CONTACT_EMAIL;

const contactPhoneHref = getPublikWhatsAppUrl();
const contactEmailHref = `mailto:${contactEmailDisplay}`;

const tierContainerClassName = "public-site-container flex items-center";

const contactLinkClassName =
  "inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-heading";

const navItemClassName =
  "inline-flex items-center gap-1 text-sm font-medium text-heading transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

const navItemActiveClassName = "text-brand underline decoration-2 underline-offset-4";

export type PublicMarketingNavbarProps = {
  /**
   * Sembunyikan chrome tiga tingkat (beranda memakai HomeCardNav di dalam hero).
   * Bila tidak di-set, otomatis true saat pathname situs publik adalah `/`.
   */
  hidden?: boolean;
};

export function PublicMarketingNavbar({
  hidden,
}: PublicMarketingNavbarProps = {}): ReactElement | null {
  const pathname = usePublicSitePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const mobileNavId = useId();
  const searchFormId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] =
    useState<PublicSiteSearchCategoryId>("all");

  const hideChrome = hidden ?? pathname === "/";

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

  /** Keep sticky offset tokens in sync with real three-tier (+ mobile) height. */
  useEffect(() => {
    if (hideChrome) {
      document.documentElement.style.setProperty("--public-nav-bottom", "0px");
      return;
    }

    const header = headerRef.current;
    if (!header || typeof ResizeObserver === "undefined") return;

    const syncNavBottom = () => {
      header.style.setProperty("--public-nav-bottom", `${header.offsetHeight}px`);
    };

    syncNavBottom();
    const observer = new ResizeObserver(syncNavBottom);
    observer.observe(header);
    return () => observer.disconnect();
  }, [mobileOpen, hideChrome]);

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildPublicSiteSearchHref(searchCategory, searchQuery));
    setMobileOpen(false);
  }

  function onNavigateSuggestion(href: string) {
    router.push(href);
    setMobileOpen(false);
  }

  if (hideChrome) {
    return null;
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full overflow-visible bg-surface",
        "[--public-nav-bottom:11rem]",
      )}
    >
      {/* Tier 1 — Announcement bar */}
      <div className="border-b border-border-default bg-neutral-soft py-2.5">
        <div className={cn(tierContainerClassName, "justify-center")}>
          <PublicSiteLink
            href={ANNOUNCEMENT_HREF}
            className="text-center text-xs font-medium text-body transition-colors hover:text-heading sm:text-sm"
          >
            {ANNOUNCEMENT_TEXT}
          </PublicSiteLink>
        </div>
      </div>

      {/* Tier 2 — Main bar: contact | brand | actions */}
      <div className="border-b border-border-default py-4">
        <div
          className={cn(
            tierContainerClassName,
            "relative grid grid-cols-[1fr_auto_1fr] items-center gap-3",
          )}
        >
          {/* Contact — start (≥sm) */}
          <div className="col-start-1 hidden min-w-0 items-center gap-4 sm:flex">
            <a
              href={contactPhoneHref}
              className={contactLinkClassName}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Phone className="size-[18px] shrink-0" aria-hidden />
              <span className="truncate">{contactPhoneDisplay}</span>
            </a>
            <a href={contactEmailHref} className={contactLinkClassName}>
              <Mail className="size-[18px] shrink-0" aria-hidden />
              <span className="truncate">{contactEmailDisplay}</span>
            </a>
          </div>

          {/* Brand — center (logo + school name) */}
          <PublicSiteLink
            href="/"
            className="col-start-2 inline-flex shrink-0 flex-col items-center justify-self-center gap-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
            aria-label={`Beranda ${BRAND_SHORT}`}
          >
            <BrandLogoMark
              pixelSize={32}
              shine
              priority
              roundedClassName="rounded-none"
            />
            <span className="text-[11px] font-bold tracking-[0.08em] text-brand sm:text-xs">
              SMK {BRAND_SHORT}
            </span>
          </PublicSiteLink>

          {/* Actions — end */}
          <div className="col-start-3 flex items-center justify-end gap-4">
            <a
              href={contactPhoneHref}
              className="hidden items-center gap-2 text-sm font-medium text-heading transition-colors hover:text-brand md:inline-flex"
              rel="noopener noreferrer"
              target="_blank"
            >
              Hubungi kami
              <Phone className="size-[18px] shrink-0" aria-hidden />
            </a>

            <Button
              asChild
              variant="secondary"
              className="h-auto px-5 py-2.5 text-sm font-medium text-heading"
            >
              <a href={PUBLIC_SITE_CMS_LOGIN_HREF}>Login</a>
            </Button>

            <button
              type="button"
              className="ds-menu-toggle inline-flex size-10 items-center justify-center border border-border-default text-heading transition-colors hover:bg-neutral-soft"
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

      {/* Tier 3 — Bottom bar: primary nav (≥lg) + joined search (≥md) */}
      <div className="overflow-visible border-b border-border-default py-3">
        <div
          className={cn(
            tierContainerClassName,
            "justify-between gap-4 overflow-visible",
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
                    className={cn(navItemClassName, active && navItemActiveClassName)}
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
                  appearance="surface"
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
            appearance="surface"
            className="ml-auto hidden w-full max-w-[480px] md:flex"
          />
        </div>
      </div>

      {/* Mobile menu — ≤768px via .ds-menu-toggle companion panel */}
      {mobileOpen ? (
        <div
          id={mobileNavId}
          className="ds-mobile-nav border-b border-border-default bg-surface"
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
                      "block border border-transparent px-3 py-2.5 text-sm font-medium text-heading",
                      active && "border-border-default bg-neutral-soft",
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
                  appearance="surface"
                />
              );
            })}

            <div className="flex flex-col gap-2 border-t border-border-default pt-3 sm:hidden">
              <a
                href={contactPhoneHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-body"
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => setMobileOpen(false)}
              >
                <Phone className="size-[18px]" aria-hidden />
                {contactPhoneDisplay}
              </a>
              <a
                href={contactEmailHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-body"
                onClick={() => setMobileOpen(false)}
              >
                <Mail className="size-[18px]" aria-hidden />
                {contactEmailDisplay}
              </a>
            </div>

            <div className="flex flex-col gap-2 border-t border-border-default pt-3 md:hidden">
              <a
                href={contactPhoneHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-heading"
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => setMobileOpen(false)}
              >
                Hubungi kami
                <Phone className="size-[18px]" aria-hidden />
              </a>
              <Button
                asChild
                variant="secondary"
                className="h-auto w-full px-5 py-2.5 text-sm font-medium text-heading"
              >
                <a
                  href={PUBLIC_SITE_CMS_LOGIN_HREF}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </a>
              </Button>
            </div>

            <div className="border-t border-border-default pt-3 md:hidden">
              <PublicSiteSearchForm
                idPrefix={`${searchFormId}-mobile`}
                searchQuery={searchQuery}
                searchCategory={searchCategory}
                onQueryChange={setSearchQuery}
                onCategoryChange={setSearchCategory}
                onSubmit={onSearchSubmit}
                onNavigateSuggestion={onNavigateSuggestion}
                appearance="surface"
                className="w-full"
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
