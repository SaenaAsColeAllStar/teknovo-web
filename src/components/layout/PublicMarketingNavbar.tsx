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
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PUBLIC_SITE_MAIN_NAV,
  PUBLIC_SITE_PPDB_HREF,
  type PublicSiteNavGroup,
} from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const CMS_HREF = "https://cms.smkteknovo.sch.id" as const;

const ANNOUNCEMENT_HREF = PUBLIC_SITE_PPDB_HREF;
const ANNOUNCEMENT_TEXT =
  HOME_FLASH_MARQUEE_ITEMS[0] ??
  "PPDB Tahun Ajaran 2026/2027 telah dibuka — pantau halaman PPDB resmi sekolah.";

const SEARCH_CATEGORIES = [
  { id: "all", label: "Semua", href: "/berita/berita-terbaru" },
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

const tierContainerClassName = "public-site-container flex items-center";

const navItemClassName =
  "inline-flex items-center gap-1 text-sm font-medium text-heading transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

const navItemActiveClassName = "text-brand underline decoration-2 underline-offset-4";

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

function DesktopNavDropdown({
  entry,
  active,
}: {
  entry: PublicSiteNavGroup;
  active: boolean;
}): ReactElement {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(navItemClassName, active && navItemActiveClassName)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-body-subtle transition-transform duration-200",
            open && "rotate-180 text-brand",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={panelId}
          role="menu"
          className="absolute top-full left-0 z-50 mt-2 min-w-[14rem] border border-border-default bg-surface py-1 shadow-sm"
        >
          {entry.items.map((item) => (
            <PublicSiteLink
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-neutral-soft hover:text-brand"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </PublicSiteLink>
          ))}
        </div>
      ) : null}
    </div>
  );
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
    <div className="border-t border-border-default first:border-t-0">
      <button
        type="button"
        id={`${groupId}-trigger`}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-heading"
        aria-expanded={open}
        aria-controls={`${groupId}-panel`}
        onClick={() => setOpen((value) => !value)}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-body-subtle transition-transform duration-200",
            open && "rotate-180 text-brand",
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
              className="block px-3 py-2 pl-5 text-sm text-body hover:text-heading"
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

function JoinedSearchForm({
  idPrefix,
  searchQuery,
  searchCategory,
  onQueryChange,
  onCategoryChange,
  onSubmit,
  className,
}: {
  idPrefix: string;
  searchQuery: string;
  searchCategory: SearchCategoryId;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: SearchCategoryId) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
}): ReactElement {
  const categoryId = `${idPrefix}-category`;
  const inputId = `${idPrefix}-query`;

  return (
    <form
      onSubmit={onSubmit}
      className={className}
      role="search"
      aria-label="Cari konten sekolah"
    >
      <div className="flex w-full min-w-0 max-w-[480px] items-stretch overflow-hidden border border-border-default">
        <label className="sr-only" htmlFor={categoryId}>
          Kategori pencarian
        </label>
        <select
          id={categoryId}
          value={searchCategory}
          onChange={(event) => onCategoryChange(event.target.value as SearchCategoryId)}
          className="h-10 shrink-0 border-0 border-r border-border-default bg-surface px-3 text-sm font-medium text-heading focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
        >
          {SEARCH_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor={inputId}>
          Kata kunci
        </label>
        <Input
          id={inputId}
          value={searchQuery}
          onChange={(event) => onQueryChange(event.target.value)}
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
  );
}

export function PublicMarketingNavbar(): ReactElement {
  const pathname = usePublicSitePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const mobileNavId = useId();
  const searchFormId = useId();
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
        "sticky top-0 z-50 w-full overflow-visible bg-surface",
        "[--public-nav-bottom:11rem]",
      )}
    >
      {/* Announcement bar */}
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

      {/* Main bar */}
      <div className="border-b border-border-default py-4">
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
              className="inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-heading"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Phone className="size-[18px] shrink-0" aria-hidden />
              <span className="truncate">{contactPhoneDisplay}</span>
            </a>
            <a
              href={contactEmailHref}
              className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-body transition-colors hover:text-heading"
            >
              <Mail className="size-[18px] shrink-0" aria-hidden />
              <span className="truncate">{contactEmailDisplay}</span>
            </a>
          </div>

          {/* Brand — center */}
          <PublicSiteLink
            href="/"
            className="col-start-2 inline-flex shrink-0 items-center justify-self-center focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
            aria-label={`Beranda ${BRAND_SHORT}`}
          >
            <BrandLogoMark
              pixelSize={32}
              shine
              priority
              roundedClassName="rounded-none"
            />
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
              <a href={CMS_HREF} rel="noopener noreferrer">
                CMS
              </a>
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

      {/* Bottom bar — primary nav (≥lg) + joined search (≥md) */}
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
                <DesktopNavDropdown key={entry.id} entry={entry} active={active} />
              );
            })}
          </nav>

          <JoinedSearchForm
            idPrefix={searchFormId}
            searchQuery={searchQuery}
            searchCategory={searchCategory}
            onQueryChange={setSearchQuery}
            onCategoryChange={setSearchCategory}
            onSubmit={onSearchSubmit}
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
                <MobileNavGroup
                  key={entry.id}
                  entry={entry}
                  onNavigate={() => setMobileOpen(false)}
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
                  href={CMS_HREF}
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                >
                  CMS
                </a>
              </Button>
            </div>

            <div className="border-t border-border-default pt-3 md:hidden">
              <JoinedSearchForm
                idPrefix={`${searchFormId}-mobile`}
                searchQuery={searchQuery}
                searchCategory={searchCategory}
                onQueryChange={setSearchQuery}
                onCategoryChange={setSearchCategory}
                onSubmit={onSearchSubmit}
                className="w-full"
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
