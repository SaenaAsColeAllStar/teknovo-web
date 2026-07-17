"use client";

/**
 * Three-tier marketing navbar — announcement + main (contact/brand/actions) + bottom (nav/search).
 * Self-contained chrome for the public site layout.
 */
import { ChevronDown, Mail, Menu, Phone, Search, X } from "lucide-react";
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
import { PublicNavMegaPanel } from "@/components/layout/PublicNavMegaPanel";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PUBLIC_SITE_PORTAL_LOGIN_HREF,
  PUBLIC_SITE_PPDB_HREF,
  type PublicSiteNavGroup,
} from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const ANNOUNCEMENT_HREF = PUBLIC_SITE_PPDB_HREF;
const ANNOUNCEMENT_TEXT =
  "PPDB Tahun Ajaran 2026/2027 telah dibuka — daftar online atau hubungi Tata Usaha untuk info jurusan TM & ULW.";

const SEARCH_CATEGORIES = [
  { id: "all", label: "Semua kategori", href: "/berita/berita-terbaru" },
  { id: "berita", label: "Berita", href: "/berita/berita-terbaru" },
  { id: "akademik", label: "Akademik", href: "/akademik" },
  { id: "jurusan", label: "Jurusan", href: "/akademik/jurusan" },
  { id: "ppdb", label: "PPDB", href: PUBLIC_SITE_PPDB_HREF },
] as const;

type SearchCategoryId = (typeof SEARCH_CATEGORIES)[number]["id"];

const contactPhoneDisplay =
  CONTACT.phone.includes("000000") || CONTACT.phone.trim() === ""
    ? PUBLIK_CONTACT_WA_DISPLAY
    : CONTACT.phone;

const contactEmailDisplay =
  CONTACT.email.trim() !== "" ? CONTACT.email : PUBLIK_CONTACT_EMAIL;

const contactPhoneHref = getPublikWhatsAppUrl();
const contactEmailHref = `mailto:${contactEmailDisplay}`;

const tierContainerClassName =
  "mx-auto flex w-full max-w-7xl items-center px-4 2xl:px-0";

const navLinkClassName = cn(
  navigationMenuTriggerStyle(),
  "h-auto rounded-none bg-transparent px-0 text-sm font-medium text-[color:var(--color-heading)] shadow-none hover:bg-transparent hover:text-[color:var(--color-brand-strong)] focus:bg-transparent focus:text-[color:var(--color-brand-strong)] data-[state=open]:bg-transparent data-[state=open]:text-[color:var(--color-brand)] data-[state=open]:shadow-none",
);

const navLinkActiveClassName =
  "text-[color:var(--color-brand)] underline decoration-2 underline-offset-4";

function buildSearchHref(categoryId: SearchCategoryId, query: string): string {
  const category =
    SEARCH_CATEGORIES.find((item) => item.id === categoryId) ?? SEARCH_CATEGORIES[0];
  const trimmed = query.trim();
  if (!trimmed) {
    return category.href;
  }
  const params = new URLSearchParams({ q: trimmed });
  return `${category.href}?${params.toString()}`;
}

function MobileNavGroup({
  entry,
  onNavigate,
}: {
  entry: PublicSiteNavGroup;
  onNavigate: () => void;
}): ReactElement {
  const groupId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[color:var(--color-border-default)] first:border-t-0">
      <button
        type="button"
        id={`${groupId}-trigger`}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-[color:var(--color-heading)]"
        aria-expanded={open}
        aria-controls={`${groupId}-panel`}
        onClick={() => setOpen((value) => !value)}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[color:var(--color-body-subtle)] transition-transform duration-200",
            open && "rotate-180 text-[color:var(--color-brand)]",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div id={`${groupId}-panel`} role="region" aria-labelledby={`${groupId}-trigger`} className="space-y-0.5 pb-2">
          {entry.items.map((item) => (
            <PublicSiteLink
              key={item.href}
              href={item.href}
              className="block px-3 py-2 pl-5 text-sm text-[color:var(--color-body)] hover:text-[color:var(--color-heading)]"
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

export function PublicMarketingNavbar(): ReactElement {
  const pathname = usePublicSitePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const mobileNavId = useId();
  const searchInputId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<SearchCategoryId>("all");

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
    const header = headerRef.current;
    if (!header || typeof ResizeObserver === "undefined") return;

    const syncNavBottom = () => {
      header.style.setProperty("--public-nav-bottom", `${header.offsetHeight}px`);
    };

    syncNavBottom();
    const observer = new ResizeObserver(syncNavBottom);
    observer.observe(header);
    return () => observer.disconnect();
  }, [mobileOpen]);

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildSearchHref(searchCategory, searchQuery));
    setMobileOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full overflow-visible bg-[color:var(--color-surface)]",
        "[--public-nav-bottom:11rem]",
      )}
    >
      {/* Announcement bar */}
      <div className="border-b border-[color:var(--color-border-default)] bg-[color:var(--color-border-default)]/55 py-2.5">
        <div className={cn(tierContainerClassName, "justify-center")}>
          <PublicSiteLink
            href={ANNOUNCEMENT_HREF}
            className="text-center text-xs font-medium text-[color:var(--color-body)] transition-colors hover:text-[color:var(--color-heading)] sm:text-sm"
          >
            {ANNOUNCEMENT_TEXT}
          </PublicSiteLink>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-[color:var(--color-border-default)] py-4">
        <div
          className={cn(
            tierContainerClassName,
            "relative grid grid-cols-[1fr_auto_1fr] items-center gap-3",
          )}
        >
          {/* Contact — start */}
          <div className="hidden min-w-0 items-center gap-4 sm:flex">
            <a
              href={contactPhoneHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-body-subtle)] transition-colors hover:text-[color:var(--color-heading)]"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Phone className="size-[18px] shrink-0" aria-hidden />
              <span className="truncate">{contactPhoneDisplay}</span>
            </a>
            <a
              href={contactEmailHref}
              className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-[color:var(--color-body-subtle)] transition-colors hover:text-[color:var(--color-heading)]"
            >
              <Mail className="size-[18px] shrink-0" aria-hidden />
              <span className="truncate">{contactEmailDisplay}</span>
            </a>
          </div>

          {/* Brand — center */}
          <PublicSiteLink
            href="/"
            className="col-start-2 justify-self-center shrink-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20"
            aria-label={`Beranda ${BRAND_SHORT}`}
          >
            <BrandLogoMark pixelSize={48} shine priority roundedClassName="rounded-none" />
          </PublicSiteLink>

          {/* Actions — end */}
          <div className="col-start-3 flex items-center justify-end gap-4">
            <PublicSiteLink
              href="/kontak"
              className="hidden items-center gap-2 text-sm font-medium text-[color:var(--color-heading)] transition-colors hover:text-[color:var(--color-brand-strong)] md:inline-flex"
            >
              Hubungi kami
              <Phone className="size-[18px] shrink-0" aria-hidden />
            </PublicSiteLink>

            <Button asChild variant="secondary" className="h-auto px-5 py-2.5 text-sm font-medium">
              <PublicSiteLink href={PUBLIC_SITE_PORTAL_LOGIN_HREF}>Login</PublicSiteLink>
            </Button>

            <button
              type="button"
              className="ds-menu-toggle inline-flex size-10 items-center justify-center border border-[color:var(--color-border-default)] text-[color:var(--color-heading)] transition-colors hover:bg-[color:var(--color-border-default)]/40"
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

      {/* Bottom bar — primary nav (≥768) + search */}
      <div className="overflow-visible border-b border-[color:var(--color-border-default)] py-3">
        <div
          className={cn(
            tierContainerClassName,
            "flex-col items-stretch gap-3 overflow-visible lg:flex-row lg:items-center lg:justify-between lg:gap-4",
          )}
        >
          <NavigationMenu
            className="hidden max-w-none min-w-0 flex-1 justify-start md:flex"
            viewportVariant="public-mega"
            delayDuration={120}
          >
            <NavigationMenuList className="flex-wrap justify-start gap-x-6 gap-y-2">
              {PUBLIC_SITE_MAIN_NAV.map((entry) => {
                const active = isPublicSiteNavEntryActive(pathname, entry);

                if (entry.type === "link") {
                  return (
                    <NavigationMenuItem key={entry.href}>
                      <NavigationMenuLink asChild>
                        <PublicSiteLink
                          href={entry.href}
                          className={cn(navLinkClassName, active && navLinkActiveClassName)}
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
                    <NavigationMenuTrigger
                      className={cn(navLinkClassName, active && navLinkActiveClassName)}
                    >
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

          <form
            onSubmit={onSearchSubmit}
            className="hidden w-full max-w-none md:flex lg:ml-auto lg:max-w-[480px]"
            role="search"
            aria-label="Cari konten sekolah"
          >
            <div className="flex w-full min-w-0 items-stretch overflow-hidden border border-[color:var(--color-border-default)]">
              <label className="sr-only" htmlFor={`${searchInputId}-category`}>
                Kategori pencarian
              </label>
              <select
                id={`${searchInputId}-category`}
                value={searchCategory}
                onChange={(event) => setSearchCategory(event.target.value as SearchCategoryId)}
                className="hidden h-10 shrink-0 border-0 border-r border-[color:var(--color-border-default)] bg-[color:var(--color-surface)] px-3 text-sm font-medium text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 lg:block"
              >
                {SEARCH_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor={searchInputId}>
                Kata kunci
              </label>
              <Input
                id={searchInputId}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari berita, jurusan…"
                className="h-10 min-w-0 flex-1 rounded-none border-0 focus-visible:ring-0"
              />
              <Button
                type="submit"
                className="h-10 shrink-0 gap-2 rounded-none px-4 text-sm font-medium [&_svg]:size-[18px]"
              >
                <Search aria-hidden />
                Cari
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu — &lt;768px via .ds-menu-toggle companion panel */}
      {mobileOpen ? (
        <div
          id={mobileNavId}
          className="ds-mobile-nav border-b border-[color:var(--color-border-default)] bg-[color:var(--color-surface)]"
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
                      "block border border-transparent px-3 py-2.5 text-sm font-medium text-[color:var(--color-heading)]",
                      active &&
                        "border-[color:var(--color-border-default)] bg-[color:var(--color-border-default)]/40",
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {entry.label}
                  </PublicSiteLink>
                );
              }

              return (
                <MobileNavGroup
                  key={entry.id}
                  entry={entry}
                  onNavigate={() => setMobileOpen(false)}
                />
              );
            })}

            <div className="flex flex-col gap-2 border-t border-[color:var(--color-border-default)] pt-3 sm:hidden">
              <a
                href={contactPhoneHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[color:var(--color-body)]"
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => setMobileOpen(false)}
              >
                <Phone className="size-[18px]" aria-hidden />
                {contactPhoneDisplay}
              </a>
              <a
                href={contactEmailHref}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[color:var(--color-body)]"
                onClick={() => setMobileOpen(false)}
              >
                <Mail className="size-[18px]" aria-hidden />
                {contactEmailDisplay}
              </a>
            </div>

            <div className="flex gap-2 border-t border-[color:var(--color-border-default)] pt-3 md:hidden">
              <Button asChild variant="outline" className="h-auto flex-1 px-3 py-2.5 text-sm font-semibold">
                <PublicSiteLink href="/kontak" onClick={() => setMobileOpen(false)}>
                  Hubungi kami
                </PublicSiteLink>
              </Button>
              <Button asChild variant="secondary" className="h-auto flex-1 px-3 py-2.5 text-sm font-semibold">
                <PublicSiteLink
                  href={PUBLIC_SITE_PORTAL_LOGIN_HREF}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </PublicSiteLink>
              </Button>
            </div>

            <form
              onSubmit={onSearchSubmit}
              className="border-t border-[color:var(--color-border-default)] pt-3 md:hidden"
              role="search"
            >
              <div className="flex flex-col gap-2">
                <select
                  value={searchCategory}
                  onChange={(event) => setSearchCategory(event.target.value as SearchCategoryId)}
                  className="h-10 w-full border border-[color:var(--color-border-default)] bg-[color:var(--color-surface)] px-3 text-sm font-medium text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20"
                >
                  {SEARCH_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari berita, jurusan…"
                />
                <Button type="submit" className="h-10 gap-2 text-sm font-medium [&_svg]:size-[18px]">
                  <Search aria-hidden />
                  Cari
                </Button>
              </div>
            </form>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
