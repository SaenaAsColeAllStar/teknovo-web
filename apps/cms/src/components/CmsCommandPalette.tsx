"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Building2,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  PenLine,
  ShieldCheck,
  Tags,
  Trophy,
  Users,
} from "lucide-react";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";

type NavItem = {
  id: string;
  label: string;
  href: string;
  group: string;
  icon: ReactNode;
};

/**
 * Cmd+K command palette for CMS navigation (no new heavy deps beyond cmdk).
 */
export function CmsCommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    canAccessBeritaSekolah,
    canViewModerasi,
    canManageSiteContent,
    canManageUsers,
    canManageSettings,
    canWrite,
    canWriteArtikel,
  } = useCmsRole();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => {
    const list: NavItem[] = [
      {
        id: "home",
        label: "Ringkasan",
        href: "/",
        group: "Umum",
        icon: <LayoutDashboard className="size-4" />,
      },
    ];
    if (canAccessBeritaSekolah) {
      list.push({
        id: "berita",
        label: "Berita",
        href: "/berita",
        group: "Konten",
        icon: <Newspaper className="size-4" />,
      });
      if (canWrite) {
        list.push({
          id: "berita-baru",
          label: "Berita baru",
          href: "/berita/baru",
          group: "Konten",
          icon: <FileText className="size-4" />,
        });
      }
    }
    list.push({
      id: "artikel",
      label: "Artikel siswa",
      href: "/artikel",
      group: "Konten",
      icon: <PenLine className="size-4" />,
    });
    if (canWriteArtikel) {
      list.push({
        id: "artikel-baru",
        label: "Artikel baru",
        href: "/artikel/baru",
        group: "Konten",
        icon: <PenLine className="size-4" />,
      });
    }
    if (canViewModerasi) {
      list.push({
        id: "moderasi",
        label: "Moderasi",
        href: "/moderasi",
        group: "Konten",
        icon: <ShieldCheck className="size-4" />,
      });
    }
    list.push({
      id: "kategori",
      label: "Kategori",
      href: "/kategori",
      group: "Konten",
      icon: <Tags className="size-4" />,
    });
    if (canManageSiteContent) {
      list.push(
        {
          id: "pengumuman",
          label: "Pengumuman",
          href: "/pengumuman",
          group: "Profil sekolah",
          icon: <Megaphone className="size-4" />,
        },
        {
          id: "fasilitas",
          label: "Fasilitas",
          href: "/fasilitas",
          group: "Profil sekolah",
          icon: <Building2 className="size-4" />,
        },
        {
          id: "prestasi",
          label: "Prestasi",
          href: "/prestasi",
          group: "Profil sekolah",
          icon: <Trophy className="size-4" />,
        },
        {
          id: "kurikulum",
          label: "Kurikulum",
          href: "/kurikulum",
          group: "Profil sekolah",
          icon: <BookOpen className="size-4" />,
        },
        {
          id: "kontak",
          label: "Kontak",
          href: "/kontak",
          group: "Profil sekolah",
          icon: <BookOpen className="size-4" />,
        },
      );
    }
    list.push({
      id: "media",
      label: "Media",
      href: "/media",
      group: "Profil sekolah",
      icon: <ImageIcon className="size-4" />,
    });
    if (canManageUsers) {
      list.push({
        id: "pengguna",
        label: "Pengguna",
        href: "/pengguna",
        group: "Sistem",
        icon: <Users className="size-4" />,
      });
    }
    if (canManageSettings) {
      list.push({
        id: "pengaturan",
        label: "Pengaturan",
        href: "/pengaturan",
        group: "Sistem",
        icon: <LayoutDashboard className="size-4" />,
      });
    }
    return list;
  }, [
    canAccessBeritaSekolah,
    canViewModerasi,
    canManageSiteContent,
    canManageUsers,
    canManageSettings,
    canWrite,
    canWriteArtikel,
  ]);

  if (!open) return null;

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <Command
        className="w-full max-w-lg overflow-hidden border border-[color:var(--color-border)] bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
        label="Navigasi CMS"
      >
        <Command.Input
          placeholder="Cari halaman… (Ctrl+K)"
          className="w-full border-b border-[color:var(--color-border)] px-4 py-3 text-sm outline-none"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-[color:var(--color-body)]">
            Tidak ada hasil.
          </Command.Empty>
          {groups.map((group) => (
            <Command.Group
              key={group}
              heading={group}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[color:var(--color-body-subtle)]"
            >
              {items
                .filter((i) => i.group === group)
                .map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.href}`}
                    onSelect={() => {
                      setOpen(false);
                      navigate(item.href);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-none px-2 py-2 text-sm text-[color:var(--color-heading)] aria-selected:bg-[color:var(--color-neutral-soft)]"
                  >
                    {item.icon}
                    {item.label}
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
