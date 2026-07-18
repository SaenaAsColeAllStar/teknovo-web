import { Link, NavLink, Outlet } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { parseCmsRole, CMS_ROLE_LABEL } from "@teknovo/shared";

const nav = [
  { to: "/", label: "Overview", end: true },
  { to: "/berita", label: "Berita" },
  { to: "/artikel", label: "Artikel siswa" },
  { to: "/moderasi", label: "Moderasi" },
  { to: "/kategori", label: "Kategori" },
  { to: "/media", label: "Media" },
  { to: "/pengaturan", label: "Pengaturan" },
];

export function AppShell() {
  const { user } = useUser();
  const role = parseCmsRole(user?.publicMetadata);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-[var(--border)] bg-[var(--soft)] md:border-b-0 md:border-r">
        <div className="border-b border-[var(--border)] px-4 py-4">
          <Link to="/" className="text-sm font-bold tracking-wide text-[var(--brand)]">
            SMK TEKNOVO CMS
          </Link>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {CMS_ROLE_LABEL[role]}
          </p>
        </div>
        <nav className="flex flex-wrap gap-1 p-3 md:flex-col">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 text-sm ${
                  isActive
                    ? "bg-white font-semibold text-[var(--brand)]"
                    : "text-[var(--muted)] hover:bg-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <p className="text-sm text-[var(--muted)]">cms.smkteknovo.sch.id</p>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
