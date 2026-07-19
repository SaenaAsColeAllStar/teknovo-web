"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import {
  CMS_INVITE_EXPIRY_DEFAULT,
  CMS_INVITE_EXPIRY_PRESETS,
  CMS_ROLE_LABEL,
  cmsAssignableRoles,
  type CmsInviteExpiryDays,
  type CmsRole,
} from "@teknovo/shared";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  createCmsUser,
  type CmsUserListItem,
} from "@/lib/api-client";

const selectClass =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:opacity-50";

const EXPIRY_LABEL: Record<CmsInviteExpiryDays, string> = {
  1: "1 hari",
  3: "3 hari",
  7: "7 hari (disarankan)",
  14: "14 hari",
  30: "30 hari",
};

export type InviteSuccess = {
  email: string;
  role: CmsRole;
  expiresAt: string | null;
  url: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: (created: CmsUserListItem) => void;
};

export function InviteTeamModal({ open, onOpenChange, onInvited }: Props) {
  const { getToken } = useAuth();
  const { role: actorRole } = useCmsRole();
  const createOptions = useMemo(
    () =>
      cmsAssignableRoles(actorRole).map((value) => ({
        value,
        label: CMS_ROLE_LABEL[value],
      })),
    [actorRole],
  );
  const defaultRole = (createOptions[0]?.value ?? "siswa") as CmsRole;

  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [role, setRole] = useState<CmsRole>(defaultRole);
  const [expiresInDays, setExpiresInDays] = useState<CmsInviteExpiryDays>(
    CMS_INVITE_EXPIRY_DEFAULT,
  );
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<InviteSuccess | null>(null);

  useEffect(() => {
    if (!open) return;
    setRole(defaultRole);
    setExpiresInDays(CMS_INVITE_EXPIRY_DEFAULT);
    setEmail("");
    setNama("");
    setSuccess(null);
    setBusy(false);
  }, [open, defaultRole]);

  function handleOpenChange(next: boolean) {
    if (!next && busy) return;
    onOpenChange(next);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailTrim = email.trim();
    if (!emailTrim || !emailTrim.includes("@")) {
      toast.error("Email tidak valid.");
      return;
    }
    if (createOptions.length === 0) {
      toast.error("Anda tidak dapat mengundang pengguna.");
      return;
    }

    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const created = await createCmsUser(
        {
          email: emailTrim,
          nama: nama.trim() || undefined,
          role,
          expiresInDays,
        },
        token,
      );
      if (!created.invited) {
        toast.success("Akun dibuat", {
          description: created.email ?? undefined,
        });
        onInvited?.(created);
        onOpenChange(false);
        return;
      }
      setSuccess({
        email: created.email ?? emailTrim,
        role,
        expiresAt: created.expiresAt ?? null,
        url: created.url ?? null,
      });
      onInvited?.(created);
      toast.success("Undangan dikirim", {
        description: `Email undangan Clerk dikirim ke ${created.email ?? emailTrim}.`,
      });
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal mengirim undangan.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl() {
    if (!success?.url) return;
    try {
      await navigator.clipboard.writeText(success.url);
      toast.success("Tautan undangan disalin");
    } catch {
      toast.error("Gagal menyalin tautan.");
    }
  }

  const actorHint =
    actorRole === "admin"
      ? "Super Admin dapat mengundang Super Admin, Admin, Siswa, dan Viewer."
      : "Admin hanya dapat mengundang akun Siswa.";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md"
        closeLabel="Tutup"
        showCloseButton={!busy}
      >
        <DialogHeader>
          <DialogTitle>
            {success ? "Undangan terkirim" : "Undang tim"}
          </DialogTitle>
          <DialogDescription>
            {success
              ? "Tinjau status undangan. Setelah diterima, tetapkan atau sesuaikan peran di tab Pengguna."
              : actorHint}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <dl className="space-y-2 border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[color:var(--color-body-subtle)]">Email</dt>
                <dd className="font-medium text-[color:var(--color-heading)]">
                  {success.email}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[color:var(--color-body-subtle)]">Peran</dt>
                <dd className="font-medium text-[color:var(--color-heading)]">
                  {CMS_ROLE_LABEL[success.role]}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[color:var(--color-body-subtle)]">Status</dt>
                <dd className="font-medium text-[color:var(--color-brand)]">
                  Menunggu
                </dd>
              </div>
              {success.expiresAt ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-[color:var(--color-body-subtle)]">
                    Kedaluwarsa
                  </dt>
                  <dd className="text-[color:var(--color-heading)]">
                    {formatDate(success.expiresAt)}
                  </dd>
                </div>
              ) : null}
            </dl>

            {success.url ? (
              <div className="space-y-2">
                <Label htmlFor="invite-url">Tautan undangan</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-url"
                    readOnly
                    value={success.url}
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void copyUrl()}
                    aria-label="Salin tautan"
                  >
                    <Copy className="size-4" aria-hidden />
                  </Button>
                </div>
                <p className="flex items-start gap-1.5 text-xs text-[color:var(--color-body-subtle)]">
                  <Link2 className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  Email sudah dikirim. Tautan ini bisa dibagikan manual jika
                  perlu.
                </p>
              </div>
            ) : (
              <p className="text-sm text-[color:var(--color-body)]">
                Email undangan telah dikirim. Cek tab Undangan untuk status.
              </p>
            )}

            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Selesai
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
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
              <Label htmlFor="invite-nama">Nama (opsional)</Label>
              <Input
                id="invite-nama"
                type="text"
                autoComplete="off"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Peran</Label>
              <select
                id="invite-role"
                className={selectClass}
                value={role}
                onChange={(e) => setRole(e.target.value as CmsRole)}
                disabled={busy || createOptions.length <= 1}
              >
                {createOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-expiry">Masa berlaku undangan</Label>
              <select
                id="invite-expiry"
                className={selectClass}
                value={expiresInDays}
                onChange={(e) =>
                  setExpiresInDays(Number(e.target.value) as CmsInviteExpiryDays)
                }
                disabled={busy}
              >
                {CMS_INVITE_EXPIRY_PRESETS.map((days) => (
                  <option key={days} value={days}>
                    {EXPIRY_LABEL[days]}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[color:var(--color-body-subtle)]">
                Setelah masa berlaku habis, tautan undangan tidak bisa dipakai.
                Default 7 hari.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={busy}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={busy || !email.trim() || createOptions.length === 0}
              >
                {busy ? "Mengirim…" : "Kirim undangan"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
