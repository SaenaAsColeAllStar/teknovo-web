"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CMS_ROLE_LABEL,
  cmsAssignableRoles,
  type CmsRole,
} from "@teknovo/shared";

import { InviteTeamModal } from "@/components/dashboard/pengguna/InviteTeamModal";
import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ApiClientError,
  deleteCmsUser,
  fetchCmsInvitations,
  fetchCmsUsers,
  resendCmsInvitation,
  revokeCmsInvitation,
  updateCmsUser,
  type CmsInvitationListItem,
  type CmsUserListItem,
} from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  buildWhatsAppInviteMessage,
  buildWhatsAppInviteUrl,
} from "@/lib/whatsapp-invite";

const selectClass =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:opacity-50";

const INVITE_STATUS_LABEL: Record<CmsInvitationListItem["status"], string> = {
  pending: "Menunggu",
  accepted: "Diterima",
  revoked: "Dibatalkan",
  expired: "Kedaluwarsa",
};

type TabId = "pengguna" | "undangan";

type Props = {
  /** Current Clerk user id — used to disable self-delete. */
  currentUserId: string | null;
};

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

export function PenggunaManager({ currentUserId }: Props) {
  const { getToken } = useAuth();
  const { role: actorRole } = useCmsRole();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabFromQuery = searchParams.get("tab");
  const inviteFromQuery = searchParams.get("invite");

  const [tab, setTab] = useState<TabId>(
    tabFromQuery === "undangan" ? "undangan" : "pengguna",
  );
  const [inviteOpen, setInviteOpen] = useState(inviteFromQuery === "1");

  const [users, setUsers] = useState<CmsUserListItem[]>([]);
  const [invitations, setInvitations] = useState<CmsInvitationListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [busy, setBusy] = useState(false);

  const createOptions = useMemo(
    () => cmsAssignableRoles(actorRole),
    [actorRole],
  );

  const stripInviteParam = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (!next.has("invite")) return;
    next.delete("invite");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

  const setTabAndUrl = useCallback(
    (nextTab: TabId) => {
      setTab(nextTab);
      const next = new URLSearchParams(searchParams.toString());
      if (nextTab === "pengguna") next.delete("tab");
      else next.set("tab", "undangan");
      next.delete("invite");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (tabFromQuery === "undangan") setTab("undangan");
    else if (tabFromQuery === "pengguna" || !tabFromQuery) setTab("pengguna");
  }, [tabFromQuery]);

  useEffect(() => {
    if (inviteFromQuery === "1") setInviteOpen(true);
  }, [inviteFromQuery]);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
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
      setLoadingUsers(false);
    }
  }, [getToken]);

  const loadInvitations = useCallback(async () => {
    setLoadingInvites(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const res = await fetchCmsInvitations(token, { limit: 100 });
      setInvitations(res.data);
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal memuat daftar undangan.",
      );
    } finally {
      setLoadingInvites(false);
    }
  }, [getToken]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (tab === "undangan") void loadInvitations();
  }, [tab, loadInvitations]);

  function roleOptionsForRow(user: CmsUserListItem): CmsRole[] {
    const assignable = cmsAssignableRoles(actorRole);
    if (!(assignable as readonly string[]).includes(user.role)) {
      return [user.role, ...assignable];
    }
    return [...assignable];
  }

  function canEditUser(user: CmsUserListItem): boolean {
    if (user.id === currentUserId) return false;
    if (actorRole === "admin") return true;
    if (actorRole === "editor") return user.role === "siswa";
    return false;
  }

  async function onChangeRole(user: CmsUserListItem, nextRole: CmsRole) {
    if (nextRole === user.role) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const updated = await updateCmsUser(user.id, { role: nextRole }, token);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
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

  async function onRevoke(invite: CmsInvitationListItem) {
    if (invite.status !== "pending") return;
    if (
      !window.confirm(
        `Batalkan undangan ke ${invite.email}? Tautan undangan tidak akan bisa dipakai.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const revoked = await revokeCmsInvitation(invite.id, token);
      setInvitations((prev) =>
        prev.map((item) => (item.id === revoked.id ? revoked : item)),
      );
      toast.success("Undangan dibatalkan");
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal membatalkan undangan.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyInviteUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Tautan undangan disalin");
    } catch {
      toast.error("Gagal menyalin tautan.");
    }
  }

  function openInviteWhatsApp(invite: CmsInvitationListItem) {
    if (!invite.url) {
      toast.error("Tautan undangan tidak tersedia.");
      return;
    }
    const message = buildWhatsAppInviteMessage({
      inviteUrl: invite.url,
      role: invite.role,
      email: invite.email,
      expiresAt: invite.expiresAt,
      expiresInDays: invite.expiresInDays,
    });
    window.open(
      buildWhatsAppInviteUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function onResend(invite: CmsInvitationListItem) {
    if (invite.status !== "pending") return;
    if (
      !window.confirm(
        `Kirim ulang undangan ke ${invite.email}? Undangan lama akan dibatalkan dan diganti tautan baru.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await resendCmsInvitation(invite.id, token);
      toast.success("Undangan dikirim ulang", {
        description: "Email Clerk baru diminta. Bagikan tautan jika perlu.",
      });
      await loadInvitations();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "Gagal mengirim ulang undangan.",
      );
      await loadInvitations();
    } finally {
      setBusy(false);
    }
  }

  const actorLabel =
    actorRole === "admin"
      ? "Super Admin dapat mengundang Super Admin, Admin, Siswa, dan Viewer. Setelah diterima, sesuaikan peran di daftar pengguna."
      : "Admin hanya dapat mengundang akun Siswa.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Pengguna
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-body)]">
            Kelola akun CMS lewat undangan (tanpa daftar publik). {actorLabel}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setInviteOpen(true)}
          disabled={busy || createOptions.length === 0}
        >
          Undang tim
        </Button>
      </div>

      <div
        className="flex gap-0 border-b border-[color:var(--color-border)]"
        role="tablist"
        aria-label="Bag pengguna"
      >
        {(
          [
            { id: "pengguna", label: "Pengguna" },
            { id: "undangan", label: "Undangan" },
          ] as const
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={cn(
                "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-[color:var(--color-brand)] text-[color:var(--color-brand)]"
                  : "border-transparent text-[color:var(--color-body)] hover:text-[color:var(--color-heading)]",
              )}
              onClick={() => setTabAndUrl(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "pengguna" ? (
        <Card>
          <CardHeader>
            <CardTitle>Daftar pengguna</CardTitle>
            <CardDescription>
              Akun yang sudah aktif di Clerk. Undangan yang belum diterima ada di
              tab Undangan.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {loadingUsers ? (
              <p className="p-6 text-sm text-[color:var(--color-body)]">
                Memuat…
              </p>
            ) : users.length === 0 ? (
              <p className="p-6 text-sm text-[color:var(--color-body)]">
                Belum ada pengguna. Undang anggota tim untuk memulai.
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
                    const editable = canEditUser(user);
                    const options = roleOptionsForRow(user);
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
                          {editable ? (
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
                              {options.map((value) => (
                                <option key={value} value={value}>
                                  {CMS_ROLE_LABEL[value]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>{CMS_ROLE_LABEL[user.role]}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[color:var(--color-body-subtle)]">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-3">
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            disabled={busy || !editable}
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Undangan</CardTitle>
            <CardDescription>
              Undangan Clerk yang masih aktif atau sudah diproses. Admin hanya
              melihat undangan Siswa.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {loadingInvites ? (
              <p className="p-6 text-sm text-[color:var(--color-body)]">
                Memuat…
              </p>
            ) : invitations.length === 0 ? (
              <p className="p-6 text-sm text-[color:var(--color-body)]">
                Belum ada undangan. Klik Undang tim untuk mengirim undangan.
              </p>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] text-[color:var(--color-heading)]">
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Peran</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Kedaluwarsa</th>
                    <th className="px-4 py-3 font-medium">Dibuat</th>
                    <th className="px-6 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invite) => {
                    const canRevoke = invite.status === "pending";
                    return (
                      <tr
                        key={invite.id}
                        className="border-b border-[color:var(--color-border)] last:border-0"
                      >
                        <td className="px-6 py-3 text-[color:var(--color-heading)]">
                          {invite.email}
                        </td>
                        <td className="px-4 py-3">
                          {CMS_ROLE_LABEL[invite.role]}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              invite.status === "pending" &&
                                "text-[color:var(--color-brand)]",
                              invite.status === "accepted" &&
                                "text-[color:var(--color-success)]",
                              (invite.status === "revoked" ||
                                invite.status === "expired") &&
                                "text-[color:var(--color-body-subtle)]",
                            )}
                          >
                            {INVITE_STATUS_LABEL[invite.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[color:var(--color-body-subtle)]">
                          {invite.expiresAt
                            ? formatDate(invite.expiresAt)
                            : invite.expiresInDays
                              ? `${invite.expiresInDays} hari`
                              : "—"}
                        </td>
                        <td className="px-4 py-3 text-[color:var(--color-body-subtle)]">
                          {formatDate(invite.createdAt)}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-2">
                            {invite.url && invite.status === "pending" ? (
                              <>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  disabled={busy}
                                  onClick={() => void copyInviteUrl(invite.url!)}
                                >
                                  Salin tautan
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  disabled={busy}
                                  onClick={() => openInviteWhatsApp(invite)}
                                >
                                  WhatsApp
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  disabled={busy}
                                  onClick={() => void onResend(invite)}
                                >
                                  Kirim ulang
                                </Button>
                              </>
                            ) : null}
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              disabled={busy || !canRevoke}
                              onClick={() => void onRevoke(invite)}
                            >
                              Batalkan
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      <InviteTeamModal
        open={inviteOpen}
        onOpenChange={(open) => {
          setInviteOpen(open);
          if (!open) stripInviteParam();
        }}
        onInvited={() => {
          setTabAndUrl("undangan");
          void loadInvitations();
          void loadUsers();
        }}
      />
    </div>
  );
}
