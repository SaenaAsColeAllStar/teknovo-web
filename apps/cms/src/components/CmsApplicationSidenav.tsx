import { useAuth } from "@clerk/clerk-react";
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  Download,
  FileText,
  Image as ImageIcon,
  Info,
  LayoutDashboard,
  Newspaper,
  PenLine,
  Settings,
  ShieldCheck,
  Tags,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import { fetchCmsAnalytics, isApiConfigured } from "@/lib/api-client";
import { BRAND_LOGO_SRC, BRAND_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DOCS_HREF =
  "https://github.com/SaenaAsColeAllStar/teknovo-web/blob/main/docs/API.md";
const HELP_HREF = "mailto:info@smkteknovo.sch.id?subject=Bantuan%20CMS%20TEKNOVO";

type NavChild = {
  id: string;
  label: string;
  href: string;
  badge?: number;
};

type NavLeaf = {
  kind: "link";
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
};

type NavGroup = {
  kind: "group";
  id: string;
  label: string;
  icon: ReactNode;
  children: NavChild[];
  /** Expand this group on first paint. */
  defaultOpen?: boolean;
};

type NavEntry = NavLeaf | NavGroup;

function pathActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupActive(pathname: string, children: NavChild[]): boolean {
  return children.some((c) => pathActive(pathname, c.href));
}

export type CmsApplicationSidenavProps = {
  /** Called after an in-app nav link is activated (e.g. close mobile drawer). */
  onNavigate?: () => void;
  className?: string;
};

/**
 * CMS application sidenav — brand, primary/secondary nav, dismissible tip card,
 * and bottom utilities. Self-contained panel (no main-content chrome).
 * Parent layout owns fixed positioning / mobile slide-in.
 */
export function CmsApplicationSidenav({
  onNavigate,
  className,
}: CmsApplicationSidenavProps): ReactElement {
  const location = useLocation();
  const pathname = location.pathname;
  const { getToken } = useAuth();
  const {
    canManageSettings,
    canManageUsers,
    canAccessBeritaSekolah,
    canViewModerasi,
    canWrite,
    canWriteArtikel,
  } = useCmsRole();

  const [reviewBadge, setReviewBadge] = useState(0);
  const [alertVisible, setAlertVisible] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    konten: true,
  });

  const alertTitleId = useId();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isApiConfigured() || !canViewModerasi) return;
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const data = await fetchCmsAnalytics(token);
        if (!cancelled && data.source !== "unavailable") {
          setReviewBadge(data.artikelReview);
        }
      } catch {
        /* keep zero */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [getToken, canViewModerasi]);

  const kontenChildren: NavChild[] = [];
  if (canAccessBeritaSekolah) {
    kontenChildren.push({ id: "berita", label: "Berita", href: "/berita" });
    if (canWrite) {
      kontenChildren.push({
        id: "berita-baru",
        label: "Berita baru",
        href: "/berita/baru",
      });
    }
  }
  kontenChildren.push({
    id: "artikel",
    label: "Artikel siswa",
    href: "/artikel",
  });
  if (canWriteArtikel) {
    kontenChildren.push({
      id: "artikel-baru",
      label: "Artikel baru",
      href: "/artikel/baru",
    });
  }
  if (canViewModerasi) {
    kontenChildren.push({
      id: "moderasi",
      label: "Moderasi",
      href: "/moderasi",
      badge: reviewBadge > 0 ? reviewBadge : undefined,
    });
  }
  kontenChildren.push({ id: "kategori", label: "Kategori", href: "/kategori" });

  const primaryNav: NavEntry[] = [
    {
      kind: "link",
      id: "ringkasan",
      label: "Ringkasan",
      href: "/",
      icon: <LayoutDashboard className="size-4 shrink-0" aria-hidden />,
    },
    {
      kind: "group",
      id: "konten",
      label: "Konten",
      icon: <Newspaper className="size-4 shrink-0" aria-hidden />,
      defaultOpen: true,
      children: kontenChildren,
    },
    {
      kind: "link",
      id: "media",
      label: "Media",
      href: "/media",
      icon: <ImageIcon className="size-4 shrink-0" aria-hidden />,
    },
  ];

  if (canManageUsers) {
    primaryNav.push({
      kind: "link",
      id: "pengguna",
      label: "Pengguna",
      href: "/pengguna",
      icon: <Users className="size-4 shrink-0" aria-hidden />,
    });
  }

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleNav() {
    onNavigate?.();
  }

  const rowClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-[color:var(--color-brand)] text-white"
        : "text-[color:var(--color-body)] hover:bg-[color:var(--color-neutral-soft)] hover:text-[color:var(--color-heading)]",
    );

  const childRowClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2 py-1.5 pl-9 pr-3 text-sm font-medium transition-colors",
      active
        ? "bg-[color:var(--color-neutral-soft)] text-[color:var(--color-heading)]"
        : "text-[color:var(--color-body)] hover:bg-[color:var(--color-neutral-soft)] hover:text-[color:var(--color-heading)]",
    );

  return (
    <aside
      className={cn(
        "flex h-[100vh] w-60 shrink-0 flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]",
        className,
      )}
      aria-label="Navigasi CMS"
    >
      {/* Brand header */}
      <div className="shrink-0 px-4 pt-4">
        <Link
          to="/"
          onClick={handleNav}
          className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20"
          aria-label={`${BRAND_SHORT} CMS`}
        >
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            width={28}
            height={28}
            className="size-7 object-contain"
          />
          <span className="text-sm font-bold leading-none tracking-tight text-[color:var(--color-heading)]">
            {BRAND_SHORT}{" "}
            <span className="font-semibold text-[color:var(--color-body)]">
              CMS
            </span>
          </span>
        </Link>
        <hr className="mt-3 border-0 border-t border-[color:var(--color-border)]" />
      </div>

      {/* Scrollable middle: primary + secondary + alert */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <nav className="flex flex-col gap-0.5 p-3" aria-label="Utama">
          {primaryNav.map((entry) => {
            if (entry.kind === "link") {
              const active = pathActive(pathname, entry.href);
              return (
                <Link
                  key={entry.id}
                  to={entry.href}
                  onClick={handleNav}
                  className={rowClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {entry.icon}
                  <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                  {entry.badge != null && entry.badge > 0 ? (
                    <NavBadge value={entry.badge} active={active} />
                  ) : null}
                </Link>
              );
            }

            const expanded = openGroups[entry.id] ?? entry.defaultOpen ?? false;
            const active = groupActive(pathname, entry.children);
            return (
              <div key={entry.id} className="flex flex-col gap-0.5">
                <button
                  type="button"
                  className={cn(
                    rowClass(active && !expanded),
                    active && expanded &&
                      "bg-[color:var(--color-neutral-soft)] text-[color:var(--color-heading)]",
                  )}
                  aria-expanded={expanded}
                  onClick={() => toggleGroup(entry.id)}
                >
                  {entry.icon}
                  <span className="min-w-0 flex-1 truncate text-left">
                    {entry.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-200",
                      expanded && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                {expanded ? (
                  <div className="flex flex-col gap-0.5 pb-1" role="group">
                    {entry.children.map((child) => {
                      const childActive = pathActive(pathname, child.href);
                      return (
                        <Link
                          key={child.id}
                          to={child.href}
                          onClick={handleNav}
                          className={childRowClass(childActive)}
                          aria-current={childActive ? "page" : undefined}
                        >
                          {child.id === "moderasi" ? (
                            <ShieldCheck className="size-3.5 shrink-0 opacity-70" aria-hidden />
                          ) : child.id.startsWith("artikel") ? (
                            <PenLine className="size-3.5 shrink-0 opacity-70" aria-hidden />
                          ) : child.id === "kategori" ? (
                            <Tags className="size-3.5 shrink-0 opacity-70" aria-hidden />
                          ) : (
                            <FileText className="size-3.5 shrink-0 opacity-70" aria-hidden />
                          )}
                          <span className="min-w-0 flex-1 truncate">
                            {child.label}
                          </span>
                          {child.badge != null && child.badge > 0 ? (
                            <NavBadge value={child.badge} active={false} />
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <hr className="mx-3 border-0 border-t border-[color:var(--color-border)]" />

        <nav className="flex flex-col gap-0.5 p-3" aria-label="Utilitas">
          <a
            href={DOCS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass(false)}
          >
            <BookOpen className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">Dokumentasi</span>
          </a>
          <a href={HELP_HREF} className={rowClass(false)}>
            <CircleHelp className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">Bantuan</span>
          </a>
        </nav>

        {alertVisible ? (
          <div className="px-3 pb-3">
            <div
              className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] p-3 shadow-sm"
              role="status"
              aria-labelledby={alertTitleId}
            >
              <div className="flex items-start gap-2">
                <Info
                  className="mt-0.5 size-4 shrink-0 text-[color:var(--color-brand)]"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p
                    id={alertTitleId}
                    className="text-sm font-bold text-[color:var(--color-heading)]"
                  >
                    Tip publikasi
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex size-6 shrink-0 items-center justify-center text-[color:var(--color-body-subtle)] hover:text-[color:var(--color-heading)]"
                  aria-label="Tutup tip"
                  onClick={() => setAlertVisible(false)}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--color-body)]">
                Setelah berita atau artikel diterbitkan, API memicu rebuild situs
                publik agar konten muncul di smkteknovo.sch.id.
              </p>
              <Button asChild className="mt-3 w-full justify-center text-xs" size="sm">
                <a href={DOCS_HREF} target="_blank" rel="noopener noreferrer">
                  <Download className="size-3.5" aria-hidden />
                  Buka panduan API
                </a>
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom utility group — pinned */}
      <div className="mt-auto shrink-0 border-t border-[color:var(--color-border)] p-3">
        <nav className="flex flex-col gap-0.5" aria-label="Akun & tim">
          {canManageSettings ? (
            <Link
              to="/pengaturan"
              onClick={handleNav}
              className={rowClass(pathActive(pathname, "/pengaturan"))}
              aria-current={
                pathActive(pathname, "/pengaturan") ? "page" : undefined
              }
            >
              <Settings className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">Pengaturan</span>
            </Link>
          ) : null}
          <a href={HELP_HREF} className={rowClass(false)}>
            <CircleHelp className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">Bantuan & ketentuan</span>
          </a>
          {canManageUsers ? (
            <Link
              to="/pengguna"
              onClick={handleNav}
              className={rowClass(pathActive(pathname, "/pengguna"))}
              aria-current={
                pathActive(pathname, "/pengguna") ? "page" : undefined
              }
            >
              <UserPlus className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">Undang tim</span>
            </Link>
          ) : null}
        </nav>
      </div>
    </aside>
  );
}

function NavBadge({
  value,
  active,
}: {
  value: number;
  active: boolean;
}): ReactElement {
  const label = value > 99 ? "99+" : String(value);
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold leading-none",
        active
          ? "bg-white/20 text-white"
          : "bg-[color:var(--color-brand)] text-white",
      )}
      aria-label={`${value} item`}
    >
      {label}
    </span>
  );
}
