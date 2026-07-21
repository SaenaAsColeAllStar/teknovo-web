"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import {
  ApiClientError,
  approveSiteContentReview,
  rejectSiteContentReview,
  type SiteContentPendingItem,
} from "@/lib/api-client";

import { useCmsGetToken } from "../../../lib/use-cms-get-token";

const ENTITY_LABEL: Record<SiteContentPendingItem["entity"], string> = {
  fasilitas: "Fasilitas",
  ekstrakurikuler: "Ekstrakurikuler",
  prestasi: "Prestasi",
  kurikulum: "Kurikulum",
  "program-sekolah": "Program Sekolah",
  "program-jurusan": "Program Jurusan",
  "tenaga-pengajar": "Tenaga Pengajar",
  kontak: "Kontak",
  pengumuman: "Pengumuman",
};

type Props = {
  items: SiteContentPendingItem[];
  onChanged?: () => void;
};

export function SiteContentModerasiQueue({ items: initial, onChanged }: Props) {
  const { getToken } = useCmsGetToken();
  const { canModerate } = useCmsRole();
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function withToken() {
    const token = await getToken();
    if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
    return token;
  }

  async function onApprove(row: SiteContentPendingItem) {
    if (!canModerate) {
      toast.error("Hanya Super Admin yang dapat menyetujui.");
      return;
    }
    setBusyId(row.id);
    try {
      const token = await withToken();
      await approveSiteContentReview(row.entity, row.id, token);
      setItems((prev) => prev.filter((item) => item.id !== row.id));
      toast.success("Konten disetujui & dipublikasikan");
      onChanged?.();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menyetujui.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function onReject(row: SiteContentPendingItem) {
    if (!canModerate) {
      toast.error("Hanya Super Admin yang dapat menolak.");
      return;
    }
    const note =
      window.prompt(
        `Catatan revisi untuk "${row.title}" (wajib):`,
        "",
      ) ?? undefined;
    if (note === undefined) return;
    const trimmed = note.trim();
    if (!trimmed) {
      toast.error("Catatan penolakan wajib diisi.");
      return;
    }

    setBusyId(row.id);
    try {
      const token = await withToken();
      await rejectSiteContentReview(row.entity, row.id, token, trimmed);
      setItems((prev) => prev.filter((item) => item.id !== row.id));
      toast.success("Konten ditolak (REJECTED)");
      onChanged?.();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menolak.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="border border-[color:var(--color-border)] bg-white px-4 py-8 text-center text-sm text-[color:var(--color-body)]">
        Tidak ada konten situs menunggu review.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] text-[color:var(--color-body)]">
          <tr>
            <th className="px-4 py-3 font-medium">Judul</th>
            <th className="px-4 py-3 font-medium">Entity</th>
            <th className="px-4 py-3 font-medium">Diajukan</th>
            <th className="px-4 py-3 font-medium"> </th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr
              key={`${row.entity}-${row.id}`}
              className="border-b border-[color:var(--color-border)] last:border-0"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-[color:var(--color-heading)]">
                  {row.title}
                </p>
                {row.slug ? (
                  <p className="text-xs text-[color:var(--color-body-subtle)]">
                    /{row.slug}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[color:var(--color-body)]">
                {ENTITY_LABEL[row.entity]}
              </td>
              <td className="px-4 py-3 text-[color:var(--color-body)]">
                {format(new Date(row.updatedAt), "d MMM yyyy HH:mm", {
                  locale: localeId,
                })}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link to={row.editPath}>Lihat</Link>
                  </Button>
                  {canModerate ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        disabled={busyId === row.id}
                        onClick={() => void onApprove(row)}
                      >
                        {busyId === row.id ? "…" : "Setujui"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        disabled={busyId === row.id}
                        onClick={() => void onReject(row)}
                      >
                        Tolak
                      </Button>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
