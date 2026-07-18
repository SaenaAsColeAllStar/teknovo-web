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
  Settings,
} as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const {
    canManageSettings,
    canAccessBeritaSekolah,
    canViewModerasi,
  } = useCmsRole();

  const nav = DASHBOARD_NAV.filter((item) => {
    if (item.href === "/dashboard/pengaturan") return canManageSettings;
    if (item.href === "/dashboard/berita") return canAccessBeritaSekolah;
    if (item.href === "/dashboard/moderasi") return canViewModerasi;
    return true;
  });

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[color:var(--color-border)] bg-white">
      <div className="flex h-14 items-center border-b border-[color:var(--color-border)] px-4">
        <Link href="/dashboard" className="font-semibold text-[color:var(--color-heading)]">
          {BRAND_SHORT} CMS
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="CMS">
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
      <div className="border-t border-[color:var(--color-border)] p-4">
        <UserButton />
      </div>
    </aside>
  );
}
