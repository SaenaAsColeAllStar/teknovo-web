"use client";

/**
 * Joined category + query search used by PublicMarketingNavbar and HeroOverlayNav.
 */
import { Search } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicSiteNavAppearance } from "@/components/layout/PublicSiteNavMenus";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";
import {
  filterPublicSiteSearchHits,
  loadRecentBeritaSearchHits,
  publicSiteSearchKindLabel,
  type PublicSiteSearchHit,
} from "@/lib/public-site-search";
import { cn } from "@/lib/utils";

export const PUBLIC_SITE_SEARCH_CATEGORIES = [
  { id: "all", label: "Semua", href: "/berita/berita-terbaru" },
  { id: "berita", label: "Berita", href: "/berita/berita-terbaru" },
  { id: "akademik", label: "Akademik", href: "/akademik" },
  { id: "jurusan", label: "Jurusan", href: "/akademik/jurusan" },
  { id: "ppdb", label: "PPDB", href: PUBLIC_SITE_PPDB_HREF },
] as const;

export type PublicSiteSearchCategoryId =
  (typeof PUBLIC_SITE_SEARCH_CATEGORIES)[number]["id"];

export function buildPublicSiteSearchHref(
  categoryId: PublicSiteSearchCategoryId,
  query: string,
): string {
  const category =
    PUBLIC_SITE_SEARCH_CATEGORIES.find((item) => item.id === categoryId) ??
    PUBLIC_SITE_SEARCH_CATEGORIES[0];
  const trimmed = query.trim();
  if (!trimmed) {
    return category.href;
  }
  const params = new URLSearchParams({ q: trimmed });
  return `${category.href}?${params.toString()}`;
}

const shellClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "flex w-full min-w-0 max-w-[480px] items-stretch overflow-hidden border border-border-default",
  overlay:
    "flex w-full min-w-0 max-w-[480px] items-stretch overflow-hidden border border-white/35 bg-white/10 backdrop-blur-sm",
};

const selectClassName: Record<PublicSiteNavAppearance, string> = {
  surface:
    "h-10 shrink-0 border-0 border-r border-border-default bg-surface px-3 text-sm font-medium text-heading focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20",
  overlay:
    "h-10 shrink-0 border-0 border-r border-white/25 bg-transparent px-3 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 [&>option]:bg-brand-strong [&>option]:text-white",
};

const inputClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "h-10 min-w-0 flex-1 rounded-none border-0 focus-visible:ring-0",
  overlay:
    "h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent text-white placeholder:text-white/55 focus-visible:ring-0",
};

const submitClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "h-10 shrink-0 gap-2 rounded-none px-4 text-sm font-medium [&_svg]:size-[18px]",
  overlay:
    "h-10 shrink-0 gap-2 rounded-none border-0 bg-white/15 px-4 text-sm font-medium text-white hover:bg-white/25 [&_svg]:size-[18px]",
};

const panelClassName: Record<PublicSiteNavAppearance, string> = {
  surface:
    "absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-y-auto border border-border-default bg-surface shadow-sm",
  overlay:
    "absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-y-auto border border-white/20 bg-brand-strong/95 shadow-sm backdrop-blur-md",
};

const panelHintClassName: Record<PublicSiteNavAppearance, string> = {
  surface:
    "border-b border-border-default px-3 py-2 text-xs font-medium tracking-wide text-body-subtle uppercase",
  overlay:
    "border-b border-white/15 px-3 py-2 text-xs font-medium tracking-wide text-white/60 uppercase",
};

const panelLoadingClassName: Record<PublicSiteNavAppearance, string> = {
  surface: "px-3 py-2.5 text-sm text-body-subtle",
  overlay: "px-3 py-2.5 text-sm text-white/60",
};

export function PublicSiteSearchForm({
  idPrefix,
  searchQuery,
  searchCategory,
  onQueryChange,
  onCategoryChange,
  onSubmit,
  onNavigateSuggestion,
  appearance = "surface",
  className,
}: {
  idPrefix: string;
  searchQuery: string;
  searchCategory: PublicSiteSearchCategoryId;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: PublicSiteSearchCategoryId) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNavigateSuggestion: (href: string) => void;
  appearance?: PublicSiteNavAppearance;
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
      <div className={shellClassName[appearance]}>
        <label className="sr-only" htmlFor={categoryId}>
          Kategori pencarian
        </label>
        <select
          id={categoryId}
          value={searchCategory}
          onChange={(event) =>
            onCategoryChange(event.target.value as PublicSiteSearchCategoryId)
          }
          className={selectClassName[appearance]}
        >
          {PUBLIC_SITE_SEARCH_CATEGORIES.map((category) => (
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
          className={inputClassName[appearance]}
        />
        <Button type="submit" className={submitClassName[appearance]}>
          <Search aria-hidden />
          Cari
        </Button>
      </div>

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Saran pencarian"
          className={panelClassName[appearance]}
        >
          {!searchQuery.trim() && suggestions.length > 0 ? (
            <p className={panelHintClassName[appearance]}>Berita terbaru</p>
          ) : null}
          {beritaLoading && suggestions.length === 0 ? (
            <p className={panelLoadingClassName[appearance]}>Memuat saran…</p>
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
                appearance === "overlay"
                  ? index === activeIndex
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                  : index === activeIndex
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
                  appearance === "overlay"
                    ? index === activeIndex
                      ? "text-white/80"
                      : "text-white/55"
                    : index === activeIndex
                      ? "text-white/80"
                      : "text-body-subtle",
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
