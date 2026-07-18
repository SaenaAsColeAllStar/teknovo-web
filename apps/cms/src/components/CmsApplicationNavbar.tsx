import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  FilePlus2,
  Filter,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CMS_ROLE_LABEL,
  type CmsAnalyticsOverview,
} from "@teknovo/shared";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCmsAnalytics, isApiConfigured } from "@/lib/api-client";
import { BRAND_LOGO_SRC, BRAND_SHORT, DASHBOARD_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { toRealPath } from "../shims/cms-route-path";

/** Compact labeled action buttons — 12×6 padding, 12px medium label. */
const actionBtnClassName =
  "h-auto gap-1.5 rounded-none px-3 py-1.5 text-xs font-medium [&_svg]:size-3.5";

const DEMO_METRICS = [
  { label: "Draft", value: "—" },
  { label: "Terbit", value: "—" },
  { label: "Review", value: "—" },
  { label: "Kategori", value: "—" },
] as const;

type MetricPair = { label: string; value: string };

function metricsFromAnalytics(data: CmsAnalyticsOverview): MetricPair[] {
  return [
    { label: "Draft", value: String(data.beritaDraft) },
    { label: "Terbit", value: String(data.beritaPublished + data.artikelPublished) },
    { label: "Review", value: String(data.artikelReview) },
    { label: "Kategori", value: String(data.kategoriTotal) },
  ];
}

type BreadcrumbSegment = {
  label: string;
  href?: string;
  icon?: ReactElement;
};

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const home: BreadcrumbSegment = {
    label: "Ringkasan",
    href: "/",
    icon: <LayoutDashboard className="size-3.5" aria-hidden />,
  };

  if (pathname === "/" || pathname === "") {
    return [home];
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbSegment[] = [home];

  const navMatch = DASHBOARD_NAV.find((item) => {
    const real = toRealPath(item.href);
    return real !== "/" && pathname.startsWith(real);
  });

  if (navMatch) {
    crumbs.push({
      label: navMatch.label,
      href: toRealPath(navMatch.href),
    });
  }

  if (segments.includes("baru")) {
    crumbs.push({ label: "Buat baru" });
  } else if (segments.includes("edit")) {
    crumbs.push({ label: "Edit" });
  }

  return crumbs;
}

export type CmsApplicationNavbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
};

/**
 * Three-bar CMS application chrome — metrics · primary · breadcrumb.
 * Full viewport width, fixed at top; sets `--cms-nav-height` for content offset.
 */
export function CmsApplicationNavbar({
  onToggleSidebar,
  sidebarOpen,
}: CmsApplicationNavbarProps): ReactElement {
  const headerRef = useRef<HTMLElement>(null);
  const searchId = useId();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { role, canWrite, canWriteArtikel, canAccessBeritaSekolah } = useCmsRole();
  const location = useLocation();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<MetricPair[]>([...DEMO_METRICS]);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const breadcrumbs = useMemo(
    () => buildBreadcrumbs(location.pathname),
    [location.pathname],
  );

  const createHref = canAccessBeritaSekolah && canWrite
    ? "/berita/baru"
    : canWriteArtikel
      ? "/artikel/baru"
      : null;

  const avatarUrl = user?.imageUrl;
  const displayName =
    user?.fullName || user?.primaryEmailAddress?.emailAddress || "Pengguna";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  useEffect(() => {
    const header = headerRef.current;
    if (!header || typeof ResizeObserver === "undefined") return;

    const sync = () => {
      document.documentElement.style.setProperty(
        "--cms-nav-height",
        `${header.offsetHeight}px`,
      );
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--cms-nav-height");
    };
  }, [metricsOpen, searchOpen]);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isApiConfigured()) return;
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const data = await fetchCmsAnalytics(token);
        if (!cancelled && data.source !== "unavailable") {
          setMetrics(metricsFromAnalytics(data));
        }
      } catch {
        /* keep demo placeholders */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  useEffect(() => {
    if (!profileOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  useEffect(() => {
    setSearchOpen(false);
    setActionsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const searchHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return DASHBOARD_NAV.filter((item) =>
      item.label.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [searchQuery]);

  function onSearchSubmit(event: FormEvent) {
    event.preventDefault();
    const hit = searchHits[0];
    if (hit) {
      navigate(toRealPath(hit.href));
      setSearchQuery("");
      setSearchOpen(false);
    }
  }

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  async function handleSignOut() {
    await signOut({ redirectUrl: "/sign-in" });
  }

  const lastCrumb = breadcrumbs[breadcrumbs.length - 1];
  const parentCrumb =
    breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 w-full bg-[color:var(--color-surface)] text-[color:var(--color-body)]"
    >
      {/* Bar 1 — metrics strip */}
      <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)]">
        <div className="flex w-full items-center justify-between gap-3 px-3 py-1.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[color:var(--color-body-subtle)] md:hidden"
              aria-expanded={metricsOpen}
              onClick={() => setMetricsOpen((v) => !v)}
            >
              Metrik
              <ChevronDown
                className={cn(
                  "size-3 transition-transform",
                  metricsOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            <div
              className={cn(
                "min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                metricsOpen ? "flex" : "hidden md:flex",
              )}
            >
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="inline-flex shrink-0 items-baseline gap-1.5"
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[color:var(--color-body-subtle)]">
                    {m.label}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-[color:var(--color-heading)]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--color-heading)]"
              aria-label="Bahasa"
            >
              <span aria-hidden className="text-sm leading-none">
                🇮🇩
              </span>
              <span className="hidden sm:inline">Bahasa</span>
              <ChevronDown className="size-3 opacity-70" aria-hidden />
            </button>
            <span className="hidden h-3 w-px bg-[color:var(--color-border)] sm:block" />
            <span className="inline-flex items-center gap-1 text-xs text-[color:var(--color-body)]">
              <Globe2 className="size-3.5 shrink-0" aria-hidden />
              <span className="font-medium text-[color:var(--color-heading)]">
                {CMS_ROLE_LABEL[role]}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Bar 2 — primary navbar */}
      <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="flex w-full items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)]"
            aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={sidebarOpen}
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>

          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20"
            aria-label={`${BRAND_SHORT} CMS`}
          >
            <img
              src={BRAND_LOGO_SRC}
              alt=""
              width={28}
              height={28}
              className="size-7 object-contain"
            />
            <span className="hidden text-sm font-bold tracking-tight text-[color:var(--color-heading)] sm:inline">
              {BRAND_SHORT}{" "}
              <span className="font-semibold text-[color:var(--color-body)]">
                CMS
              </span>
            </span>
          </Link>

          {/* Search — desktop */}
          <form
            onSubmit={onSearchSubmit}
            className="relative hidden min-w-0 flex-1 md:block md:max-w-xs lg:max-w-sm"
            role="search"
          >
            <label htmlFor={searchId} className="sr-only">
              Cari di CMS
            </label>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-body-subtle)]"
              aria-hidden
            />
            <Input
              id={searchId}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari halaman…"
              className="h-9 pl-8 text-xs"
              autoComplete="off"
            />
            {searchHits.length > 0 ? (
              <ul className="absolute left-0 right-0 top-full z-10 mt-1 border border-[color:var(--color-border)] bg-white py-1 shadow-sm">
                {searchHits.map((hit) => (
                  <li key={hit.href}>
                    <button
                      type="button"
                      className="flex w-full px-3 py-1.5 text-left text-xs text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)]"
                      onClick={() => {
                        navigate(toRealPath(hit.href));
                        setSearchQuery("");
                      }}
                    >
                      {hit.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)] md:hidden"
              aria-label="Cari"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search className="size-4" aria-hidden />
            </button>

            {createHref ? (
              <Button
                asChild
                className={cn(actionBtnClassName, "hidden sm:inline-flex")}
              >
                <Link to={createHref}>
                  <Plus aria-hidden />
                  Buat konten
                </Link>
              </Button>
            ) : null}
            {createHref ? (
              <Button
                asChild
                size="icon"
                className="size-9 sm:hidden"
                aria-label="Buat konten"
              >
                <Link to={createHref}>
                  <Plus className="size-4" aria-hidden />
                </Link>
              </Button>
            ) : null}

            <button
              type="button"
              className="inline-flex size-9 items-center justify-center text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)]"
              aria-label={dark ? "Mode terang" : "Mode gelap"}
              onClick={toggleTheme}
            >
              {dark ? (
                <Sun className="size-4" aria-hidden />
              ) : (
                <Moon className="size-4" aria-hidden />
              )}
            </button>

            <button
              type="button"
              className="relative inline-flex size-9 items-center justify-center text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)]"
              aria-label="Notifikasi"
            >
              <Bell className="size-4" aria-hidden />
            </button>

            <div ref={profileRef} className="relative">
              <button
                type="button"
                className="inline-flex size-8 overflow-hidden rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20"
                aria-label="Profil"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-[10px] font-semibold text-[color:var(--color-heading)]">
                    {initials || "?"}
                  </span>
                )}
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[12rem] border border-[color:var(--color-border)] bg-white py-1 shadow-sm">
                  <div className="border-b border-[color:var(--color-border)] px-3 py-2">
                    <p className="truncate text-xs font-semibold text-[color:var(--color-heading)]">
                      {displayName}
                    </p>
                    <p className="text-[10px] text-[color:var(--color-body-subtle)]">
                      {CMS_ROLE_LABEL[role]}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex w-full px-3 py-1.5 text-left text-xs text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)]"
                    onClick={() => {
                      setProfileOpen(false);
                      openUserProfile();
                    }}
                  >
                    Kelola akun
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="hidden text-xs font-medium text-[color:var(--color-body)] underline-offset-2 hover:text-[color:var(--color-heading)] hover:underline sm:inline"
              onClick={() => void handleSignOut()}
            >
              Keluar
            </button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)] sm:hidden"
              aria-label="Keluar"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Mobile search panel */}
        {searchOpen ? (
          <form
            onSubmit={onSearchSubmit}
            className="border-t border-[color:var(--color-border)] px-3 py-2 md:hidden"
            role="search"
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-body-subtle)]"
                aria-hidden
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari halaman…"
                className="h-9 pl-8 text-xs"
                autoFocus
                autoComplete="off"
              />
            </div>
            {searchHits.length > 0 ? (
              <ul className="mt-1 border border-[color:var(--color-border)] bg-white py-1">
                {searchHits.map((hit) => (
                  <li key={hit.href}>
                    <button
                      type="button"
                      className="flex w-full px-3 py-1.5 text-left text-xs text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)]"
                      onClick={() => {
                        navigate(toRealPath(hit.href));
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      {hit.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
        ) : null}
      </div>

      {/* Bar 3 — breadcrumb + actions */}
      <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="flex w-full items-center justify-between gap-2 px-3 py-1.5 sm:px-4">
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            {/* Mobile: back + last segment */}
            <div className="flex items-center gap-1.5 sm:hidden">
              {parentCrumb?.href ? (
                <Link
                  to={parentCrumb.href}
                  className="inline-flex size-7 items-center justify-center text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)]"
                  aria-label="Kembali"
                >
                  <ChevronRight className="size-4 rotate-180" aria-hidden />
                </Link>
              ) : null}
              <span className="truncate text-xs font-medium text-[color:var(--color-heading)]">
                {lastCrumb?.label}
              </span>
            </div>

            {/* Desktop: full trail */}
            <ol className="hidden items-center gap-1 sm:flex">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                    {index > 0 ? (
                      <ChevronRight
                        className="size-3.5 shrink-0 text-[color:var(--color-body-subtle)]"
                        aria-hidden
                      />
                    ) : null}
                    {crumb.href && !isLast ? (
                      <Link
                        to={crumb.href}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-body)] hover:text-[color:var(--color-heading)]"
                      >
                        {crumb.icon}
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-medium",
                          isLast
                            ? "text-[color:var(--color-heading)]"
                            : "text-[color:var(--color-body)]",
                        )}
                        aria-current={isLast ? "page" : undefined}
                      >
                        {crumb.icon}
                        {crumb.label}
                        {!isLast ? (
                          <ChevronDown className="size-3 opacity-60" aria-hidden />
                        ) : null}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="relative flex shrink-0 items-center gap-1.5">
            {/* Desktop actions */}
            <div className="hidden items-center gap-1.5 sm:flex">
              <Button
                type="button"
                variant="outline"
                className={actionBtnClassName}
              >
                <Filter aria-hidden />
                Filter
              </Button>
              {createHref ? (
                <Button asChild className={actionBtnClassName}>
                  <Link to={createHref}>
                    Tambah
                    <Plus aria-hidden />
                  </Link>
                </Button>
              ) : (
                <Button type="button" className={actionBtnClassName} disabled>
                  Tambah
                  <Plus aria-hidden />
                </Button>
              )}
            </div>

            {/* Mobile overflow */}
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center text-[color:var(--color-heading)] hover:bg-[color:var(--color-neutral-soft)] sm:hidden"
              aria-label="Aksi"
              aria-expanded={actionsOpen}
              onClick={() => setActionsOpen((v) => !v)}
            >
              <FilePlus2 className="size-4" aria-hidden />
            </button>
            {actionsOpen ? (
              <div className="absolute right-0 top-full z-20 mt-1 flex min-w-[10rem] flex-col gap-1 border border-[color:var(--color-border)] bg-white p-2 shadow-sm sm:hidden">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(actionBtnClassName, "w-full justify-start")}
                  onClick={() => setActionsOpen(false)}
                >
                  <Filter aria-hidden />
                  Filter
                </Button>
                {createHref ? (
                  <Button
                    asChild
                    className={cn(actionBtnClassName, "w-full justify-start")}
                  >
                    <Link to={createHref} onClick={() => setActionsOpen(false)}>
                      Tambah
                      <Plus aria-hidden />
                    </Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
