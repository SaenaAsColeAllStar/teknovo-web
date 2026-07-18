"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import {
  ApiClientError,
  approveArtikelSiswa,
  rejectArtikelSiswa,
} from "@/lib/api-client";
import { revalidateArtikelSiswaCache } from "@/lib/cms-revalidate";
import type { ArtikelSiswaListItem } from "@/types/artikel-siswa";

type Props = {
  items: ArtikelSiswaListItem[];
};

export function ModerasiQueue({ items: initial }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { canModerate } = useCmsRole();
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function withToken() {
    const token = await getToken();
    if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
    return token;
  }

  async function onApprove(row: ArtikelSiswaListItem) {
    if (!canModerate) {
      toast.error("Hanya admin yang dapat menyetujui.");
      return;
    }
    setBusyId(row.id);
    try {
      const token = await withToken();
      const saved = await approveArtikelSiswa(row.id, token);
      setItems((prev) => prev.filter((item) => item.id !== row.id));
      try {
        await revalidateArtikelSiswaCache(saved.slug);
      } catch {
        /* best-effort */
      }
      toast.success("Artikel disetujui & dipublikasikan");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menyetujui.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function onReject(row: ArtikelSiswaListItem) {
    if (!canModerate) {
      toast.error("Hanya admin yang dapat menolak.");
      return;
    }
    const reason =
      window.prompt(
        `Alasan penolakan untuk "${row.judul}" (opsional):`,
        "",
      ) ?? undefined;
    if (reason === undefined) return;

    setBusyId(row.id);
    try {
      const token = await withToken();
      await rejectArtikelSiswa(row.id, token, reason || undefined);
      setItems((prev) => prev.filter((item) => item.id !== row.id));
      toast.success("Artikel ditolak (ARCHIVED)");
      router.refresh();
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
        Tidak ada artikel menunggu moderasi.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] text-[color:var(--color-body)]">
          <tr>
            <th className="px-4 py-3 font-medium">Judul</th>
            <th className="px-4 py-3 font-medium">Penulis</th>
            <th className="px-4 py-3 font-medium">Diajukan</th>
            <th className="px-4 py-3 font-medium"> </th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => {
            const submitted = row.submittedAt || row.publishedAt;
            return (
              <tr
                key={row.id}
                className="border-b border-[color:var(--color-border)] last:border-0"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-[color:var(--color-heading)]">
                    {row.judul}
                  </p>
                  <p className="text-xs text-[color:var(--color-body-subtle)]">
                    /{row.slug}
                  </p>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-body)]">
                  {row.penulis?.nama ?? "—"}
                  {row.penulis?.kelas ? (
                    <span className="text-[color:var(--color-body-subtle)]">
                      {" "}
                      · {row.penulis.kelas}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[color:var(--color-body)]">
                  {submitted
                    ? format(new Date(submitted), "d MMM yyyy HH:mm", {
                        locale: localeId,
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/dashboard/artikel/${row.id}/edit`}>
                        Lihat
                      </Link>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
