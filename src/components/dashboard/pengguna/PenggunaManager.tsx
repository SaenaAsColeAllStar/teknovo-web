"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  CMS_ROLE_LABEL,
  type CmsRole,
} from "@teknovo/shared";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  createCmsUser,
  deleteCmsUser,
  fetchCmsUsers,
  updateCmsUser,
  type CmsUserListItem,
} from "@/lib/api-client";

const ROLE_OPTIONS: { value: "admin" | "editor" | "siswa"; label: string }[] = [
  { value: "admin", label: "Super Admin" },
  { value: "editor", label: "Admin" },
  { value: "siswa", label: "Siswa" },
];

const ALL_ROLE_OPTIONS: { value: CmsRole; label: string }[] = [
  ...ROLE_OPTIONS,
  { value: "viewer", label: "Viewer" },
];

const selectClass =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:opacity-50";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  /** Current Clerk user id — used to disable self-delete. */
  currentUserId: string | null;
};

export function PenggunaManager({ currentUserId }: Props) {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<CmsUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "siswa">("editor");
  const [password, setPassword] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const res = await fetchCmsUsers(token, { limit: 100 });
      setUsers(res.data);
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal memuat daftar pengguna.",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setEmail("");
    setNama("");
    setRole("editor");
    setPassword("");
    setShowForm(false);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const created = await createCmsUser(
        {
          email: email.trim(),
          nama: nama.trim() || undefined,
          role,
          password: password.trim() || undefined,
        },
        token,
      );
      if (created.invited) {
        toast.success("Undangan dikirim", {
          description: `Email undangan Clerk dikirim ke ${created.email}.`,
        });
      } else {
        toast.success("Akun dibuat", {
          description: created.email ?? undefined,
        });
      }
      resetForm();
      await load();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal membuat akun.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onChangeRole(user: CmsUserListItem, nextRole: CmsRole) {
    if (nextRole === user.role) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const updated = await updateCmsUser(user.id, { role: nextRole }, token);
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u)),
      );
      toast.success("Peran diperbarui", {
        description: `${updated.email ?? updated.id} → ${CMS_ROLE_LABEL[updated.role]}`,
      });
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal mengubah peran.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(user: CmsUserListItem) {
    if (user.id === currentUserId) {
      toast.error("Tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    const label = user.email ?? user.name ?? user.id;
    if (
      !window.confirm(
        `Hapus akun "${label}" dari Clerk? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await deleteCmsUser(user.id, token);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("Akun dihapus");
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal menghapus akun.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Pengguna
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-body)]">
            Kelola akun CMS via Clerk. Hanya{" "}
            <span className="font-medium text-[color:var(--color-heading)]">
              Super Admin
            </span>{" "}
            (<code className="text-xs">publicMetadata.role = admin</code>).
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          disabled={busy}
        >
          {showForm ? "Tutup form" : "Tambah akun"}
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Tambah akun</CardTitle>
            <CardDescription>
              Isi password untuk membuat akun langsung, atau kosongkan agar
              Clerk mengirim undangan email (user set password sendiri).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid max-w-xl gap-4" onSubmit={onCreate}>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@sekolah.id"
                  disabled={busy}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-nama">Nama (opsional)</Label>
                <Input
                  id="user-nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap"
                  disabled={busy}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">Peran</Label>
                <select
                  id="user-role"
                  className={selectClass}
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "admin" | "editor" | "siswa")
                  }
                  disabled={busy}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-password">Password (opsional)</Label>
                <Input
                  id="user-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter — kosong = undangan email"
                  disabled={busy}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={busy || !email.trim()}>
                  {busy ? "Menyimpan…" : "Buat akun"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  disabled={busy}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Daftar pengguna</CardTitle>
          <CardDescription>
            Data dari Clerk Backend API. Undangan yang belum diterima tidak
            muncul di sini.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <p className="p-6 text-sm text-[color:var(--color-body)]">
              Memuat…
            </p>
          ) : users.length === 0 ? (
            <p className="p-6 text-sm text-[color:var(--color-body)]">
              Belum ada pengguna.
            </p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] text-[color:var(--color-heading)]">
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Peran</th>
                  <th className="px-4 py-3 font-medium">Dibuat</th>
                  <th className="px-6 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-[color:var(--color-border)] last:border-0"
                    >
                      <td className="px-6 py-3 text-[color:var(--color-heading)]">
                        {user.email ?? "—"}
                        {isSelf ? (
                          <span className="ml-2 text-xs text-[color:var(--color-body-subtle)]">
                            (Anda)
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{user.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <select
                          className={selectClass}
                          value={user.role}
                          disabled={busy}
                          onChange={(e) =>
                            void onChangeRole(
                              user,
                              e.target.value as CmsRole,
                            )
                          }
                          aria-label={`Peran ${user.email ?? user.id}`}
                        >
                          {ALL_ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-[color:var(--color-body-subtle)]">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-3">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          disabled={busy || isSelf}
                          onClick={() => void onDelete(user)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
