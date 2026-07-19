"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Copy, Link2, MessageCircle, RefreshCw } from "lucide-react";
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
  resendCmsInvitation,
  type CmsUserListItem,
} from "@/lib/api-client";
import {
  buildWhatsAppInviteMessage,
  buildWhatsAppInviteUrl,
} from "@/lib/whatsapp-invite";

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
  invitationId: string;
  email: string;
  role: CmsRole;
  expiresAt: string | null;
  expiresInDays: number | null;
  url: string | null;
  notified: boolean;
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
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<CmsRole>(defaultRole);
  const [expiresInDays, setExpiresInDays] = useState<CmsInviteExpiryDays>(
    CMS_INVITE_EXPIRY_DEFAULT,
  );
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<InviteSuccess | null>(null);

  useEffect(() => {
    if (!open) return;
    setRole(defaultRole);
    setExpiresInDays(CMS_INVITE_EXPIRY_DEFAULT);
    setEmail("");
    setNama("");
    setPhone("");
    setSuccess(null);
    setFormError(null);
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
      setFormError("Email tidak valid.");
      toast.error("Email tidak valid.");
      return;
    }
    if (createOptions.length === 0) {
      setFormError("Anda tidak dapat mengundang pengguna.");
      toast.error("Anda tidak dapat mengundang pengguna.");
      return;
    }

    setBusy(true);
    setFormError(null);
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
        invitationId: created.id,
        email: created.email ?? emailTrim,
        role,
        expiresAt: created.expiresAt ?? null,
        expiresInDays: created.expiresInDays ?? expiresInDays,
        url: created.url ?? null,
        notified: created.notified !== false,
      });
      onInvited?.(created);
      toast.success("Undangan dibuat", {
        description:
          "Clerk diminta mengirim email. Cek spam, tunggu 1–2 menit, atau bagikan tautan / WhatsApp.",
      });
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Gagal mengirim undangan.";
      setFormError(message);
      toast.error(message);
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

  function openWhatsApp() {
    if (!success?.url) {
      toast.error("Tautan undangan belum tersedia dari Clerk.");
      return;
    }
    const message = buildWhatsAppInviteMessage({
      inviteUrl: success.url,
      role: success.role,
      email: success.email,
      expiresAt: success.expiresAt,
      expiresInDays: success.expiresInDays,
    });
    const href = buildWhatsAppInviteUrl(message, phone);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function onResend() {
    if (!success?.invitationId) return;
    setBusy(true);
    setFormError(null);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const created = await resendCmsInvitation(success.invitationId, token);
      setSuccess({
        invitationId: created.id,
        email: created.email ?? success.email,
        role: (created.role as CmsRole) ?? success.role,
        expiresAt: created.expiresAt ?? null,
        expiresInDays: created.expiresInDays ?? success.expiresInDays,
        url: created.url ?? null,
        notified: created.notified !== false,
      });
      onInvited?.(created);
      toast.success("Undangan dikirim ulang", {
        description: "Email Clerk baru diminta. Bagikan tautan jika perlu.",
      });
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Gagal mengirim ulang undangan.";
      setFormError(message);
      toast.error(message);
    } finally {
      setBusy(false);
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
            {success ? "Undangan dibuat" : "Undang tim"}
          </DialogTitle>
          <DialogDescription>
            {success
              ? "Bagikan tautan jika email lambat atau tidak sampai. Setelah diterima, sesuaikan peran di tab Pengguna bila perlu."
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
              <div className="flex justify-between gap-3">
                <dt className="text-[color:var(--color-body-subtle)]">Email Clerk</dt>
                <dd className="text-right text-[color:var(--color-heading)]">
                  {success.notified
                    ? "Diminta kirim (bisa 1–2 menit / spam)"
                    : "Tidak diminta"}
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

            <div className="space-y-2 border border-[color:var(--color-border)] p-3 text-xs text-[color:var(--color-body)]">
              <p className="font-medium text-[color:var(--color-heading)]">
                Email belum masuk?
              </p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Tunggu 1–2 menit, lalu cek folder spam/promosi.</li>
                <li>
                  Pastikan Clerk Dashboard → Email aktif (lihat Bantuan).
                </li>
                <li>
                  Bagikan <strong>tautan undangan</strong> atau kirim via WhatsApp
                  di bawah.
                </li>
              </ul>
            </div>

            {success.url ? (
              <div className="space-y-2">
                <Label htmlFor="invite-url">Tautan undangan (utama)</Label>
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
                  Salin tautan ini jika email Clerk terlambat atau tidak sampai.
                </p>
              </div>
            ) : (
              <p className="text-sm text-[color:var(--color-body)]">
                Clerk belum mengembalikan tautan undangan. Cek tab Undangan atau
                kirim ulang.
              </p>
            )}

            {formError ? (
              <p
                role="alert"
                className="border border-[color:var(--color-danger)]/25 bg-[color:var(--color-danger)]/5 px-3 py-2 text-sm text-[color:var(--color-danger)]"
              >
                {formError}
              </p>
            ) : null}

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <div className="flex w-full flex-wrap gap-2">
                <Button
                  type="button"
                  className="flex-1 gap-2"
                  disabled={!success.url || busy}
                  onClick={openWhatsApp}
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Kirim via WhatsApp
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 gap-2"
                  disabled={busy || !success.url}
                  onClick={() => void copyUrl()}
                >
                  <Copy className="size-4" aria-hidden />
                  Salin tautan
                </Button>
              </div>
              <div className="flex w-full flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 gap-2"
                  disabled={busy}
                  onClick={() => void onResend()}
                >
                  <RefreshCw className="size-4" aria-hidden />
                  {busy ? "Mengirim…" : "Kirim ulang undangan"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  disabled={busy}
                  onClick={() => onOpenChange(false)}
                >
                  Selesai
                </Button>
              </div>
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
              <Label htmlFor="invite-phone">
                WhatsApp (opsional)
              </Label>
              <Input
                id="invite-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08… atau 62…"
                disabled={busy}
              />
              <p className="text-xs text-[color:var(--color-body-subtle)]">
                Setelah undangan dibuat, tombol WhatsApp membuka chat dengan
                nomor ini (atau pemilih kontak jika kosong).
              </p>
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
                  setExpiresInDays(
                    Number(e.target.value) as CmsInviteExpiryDays,
                  )
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
                Default 7 hari. Email dikirim oleh Clerk (bukan SMTP sekolah).
              </p>
            </div>

            {formError ? (
              <p
                role="alert"
                className="border border-[color:var(--color-danger)]/25 bg-[color:var(--color-danger)]/5 px-3 py-2 text-sm text-[color:var(--color-danger)]"
              >
                {formError}
              </p>
            ) : null}

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
