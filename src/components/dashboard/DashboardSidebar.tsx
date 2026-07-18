"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  LayoutDashboard,
  Newspaper,
  PenLine,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { cn } from "@/lib/utils";
import { BRAND_SHORT, DASHBOARD_NAV } from "@/lib/constants";

const ICONS = {
  LayoutDashboard,
  Newspaper,
  PenLine,
  ShieldCheck,
  Tags,
  Image: ImageIcon,
  Users,
  Settings,
} as const;

export type DashboardSidebarProps = {
  /** Hide the sidebar brand row (CMS application navbar already shows brand). */
  hideBrand?: boolean;
  /** Hide Clerk UserButton footer (CMS navbar owns avatar / logout). */
  hideUserButton?: boolean;
  /** Called after a nav link is activated (e.g. close mobile drawer). */
  onNavigate?: () => void;
  className?: string;
};

export function DashboardSidebar({
  hideBrand = false,
  hideUserButton = false,
  onNavigate,
  className,
}: DashboardSidebarProps = {}) {
  const pathname = usePathname();
  const {
    canManageSettings,
    canManageUsers,
    canAccessBeritaSekolah,
    canViewModerasi,
  } = useCmsRole();

  const nav = DASHBOARD_NAV.filter((item) => {
    if (item.href === "/dashboard/pengaturan") return canManageSettings;
    if (item.href === "/dashboard/pengguna") return canManageUsers;
    if (item.href === "/dashboard/berita") return canAccessBeritaSekolah;
    if (item.href === "/dashboard/moderasi") return canViewModerasi;
    return true;
  });

  return (
    <aside
      className={cn(
        "flex h-full w-56 shrink-0 flex-col border-r border-[color:var(--color-border)] bg-white",
        className,
      )}
    >
      {hideBrand ? null : (
        <div className="flex h-14 shrink-0 items-center border-b border-[color:var(--color-border)] px-4">
          <Link href="/dashboard" className="font-semibold text-[color:var(--color-heading)]">
            {BRAND_SHORT} CMS
          </Link>
        </div>
      )}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="CMS">
        {nav.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS] ?? LayoutDashboard;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[color:var(--color-brand)] text-white"
                  : "text-[color:var(--color-body)] hover:bg-[color:var(--color-neutral-soft)] hover:text-[color:var(--color-heading)]",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {hideUserButton ? null : (
        <div className="shrink-0 border-t border-[color:var(--color-border)] p-4">
          <UserButton />
        </div>
      )}
    </aside>
  );
}
