"use client";

/**
 * Three-tier marketing navbar — announcement + main (brand/actions) + bottom (nav/search).
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
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHoverIntentOpen } from "@/hooks/use-hover-intent-open";
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
import {
  filterPublicSiteSearchHits,
  loadRecentBeritaSearchHits,
  publicSiteSearchKindLabel,
  type PublicSiteSearchHit,
} from "@/lib/public-site-search";
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
        className={cn(navItemClassName, active && navItemActiveClassName)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="menu"
        onClick={toggleFromClick}
        onKeyDown={onTriggerKeyDown}
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
          className="absolute top-full left-0 z-50 min-w-[14rem] pt-2"
        >
          <div className="border border-border-default bg-surface py-1 shadow-sm">
            {entry.items.map((item) => (
              <PublicSiteLink
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-neutral-soft hover:text-brand"
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
  onNavigateSuggestion,
  className,
}: {
  idPrefix: string;
  searchQuery: string;
  searchCategory: SearchCategoryId;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: SearchCategoryId) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNavigateSuggestion: (href: string) => void;
  className?: string;
}): ReactElement {
  const categoryId = `${idPrefix}-category`;
  const inputId = `${idPrefix}-query`;
  const listboxId = `${idPrefix}-suggestions`;
  const rootRef = useRef<HTMLFormElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [beritaHits, setBeritaHits] = useState<PublicSiteSearchHit[]>([]);
  const [beritaLoaded, setBeritaLoaded] = useState(false);
  const [beritaLoading, setBeritaLoading] = useState(false);

  const suggestions = filterPublicSiteSearchHits(searchQuery, beritaHits);
  const showPanel = panelOpen && (suggestions.length > 0 || beritaLoading);

  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setPanelOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [panelOpen]);

  async function ensureBeritaIndex() {
    if (beritaLoaded || beritaLoading) return;
    setBeritaLoading(true);
    try {
      const hits = await loadRecentBeritaSearchHits(8);
      setBeritaHits(hits);
      setBeritaLoaded(true);
    } finally {
      setBeritaLoading(false);
    }
  }

  async function onFocusSearch() {
    setPanelOpen(true);
    await ensureBeritaIndex();
  }

  function selectSuggestion(hit: PublicSiteSearchHit) {
    setPanelOpen(false);
    setActiveIndex(-1);
    onNavigateSuggestion(hit.href);
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setPanelOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!showPanel || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
      return;
    }
    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const hit = suggestions[activeIndex];
      if (hit) selectSuggestion(hit);
    }
  }

  return (
    <form
      ref={rootRef}
      onSubmit={(event) => {
        setPanelOpen(false);
        onSubmit(event);
      }}
      className={cn("relative", className)}
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
          onChange={(event) => {
            onQueryChange(event.target.value);
            setPanelOpen(true);
            setActiveIndex(-1);
            void ensureBeritaIndex();
          }}
          onFocus={() => {
            void onFocusSearch();
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Cari berita, jurusan…"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
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

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Saran pencarian"
          className="absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-y-auto border border-border-default bg-surface shadow-sm"
        >
          {!searchQuery.trim() && suggestions.length > 0 ? (
            <p className="border-b border-border-default px-3 py-2 text-xs font-medium tracking-wide text-body-subtle uppercase">
              Berita terbaru
            </p>
          ) : null}
          {beritaLoading && suggestions.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-body-subtle">Memuat saran…</p>
          ) : null}
          {suggestions.map((hit, index) => (
            <button
              key={hit.id}
              id={`${listboxId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                index === activeIndex
                  ? "bg-brand text-white"
                  : "text-heading hover:bg-neutral-soft hover:text-brand",
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectSuggestion(hit)}
            >
              <span className="min-w-0 flex-1 font-medium">{hit.title}</span>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  index === activeIndex ? "text-white/80" : "text-body-subtle",
                )}
              >
                {publicSiteSearchKindLabel(hit.kind)}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}

export type PublicMarketingNavbarProps = {
  /**
   * Sembunyikan chrome tiga tingkat (beranda memakai HeroOverlayNav di dalam hero).
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
  const [searchCategory, setSearchCategory] = useState<SearchCategoryId>("all");

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
    router.push(buildSearchHref(searchCategory, searchQuery));
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
            onNavigateSuggestion={onNavigateSuggestion}
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
                onNavigateSuggestion={onNavigateSuggestion}
                className="w-full"
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
