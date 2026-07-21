import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { BeritaListRefresh } from "@/components/dashboard/berita/BeritaListRefresh";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ApiClientError, fetchBeritaListCms } from "@/lib/api-client";
import type { BeritaListItem, BeritaStatus } from "@/types/berita";
import { Newspaper } from "lucide-react";

import { useCmsGetToken } from "../lib/use-cms-get-token";
import { onRouterRefresh } from "../shims/next-navigation";

const STATUS_LABEL: Record<BeritaStatus, string> = {
  DRAFT: "Draf",
  PUBLISHED: "Terbit",
  ARCHIVED: "Arsip",
};

/** Mirrors `src/app/(dashboard)/dashboard/berita/page.tsx`, fetched client-side. */
export function BeritaListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canWrite } = useCmsRole();
  const [items, setItems] = useState<BeritaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    async function load(force: boolean) {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const res = await fetchBeritaListCms(token, {
          page: 1,
          limit: 50,
          force,
        });
        if (cancelled) return;
        setItems(res.data);
        setTotal(res.meta.total);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiClientError
            ? err.message
            : "Gagal memuat daftar berita.";
        setError(message);
        if (err instanceof ApiClientError && err.status === 429) {
          const waitSec = err.retryAfterSec ?? 12;
          toast.error(message, {
            duration: Math.min(60_000, waitSec * 1000),
          });
          if (retryTimer) clearTimeout(retryTimer);
          retryTimer = setTimeout(() => {
            if (!cancelled) void load(true);
          }, waitSec * 1000);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load(false);
    const unsubscribe = onRouterRefresh(() => void load(true));
    return () => {
      cancelled = true;
      unsubscribe();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [getToken, isLoaded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Berita
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Kelola berita sekolah untuk situs publik smkteknovo.sch.id.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BeritaListRefresh />
          {canWrite ? (
            <Button asChild size="sm">
              <Link to="/berita/baru">Berita baru</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <EmptyState
          icon={Newspaper}
          title="Tidak dapat memuat berita"
          description={error}
        />
      ) : null}

      {loading ? <TableSkeleton rows={6} cols={5} /> : null}

      {!error && !loading && items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="Belum ada berita"
          description="Belum ada entri. Klik Berita baru untuk menulis kegiatan sekolah."
          action={
            canWrite ? (
              <Button asChild size="sm">
                <Link to="/berita/baru">Berita baru</Link>
              </Button>
            ) : undefined
          }
        />
      ) : null}

      {!error && !loading && items.length > 0 ? (
        <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] text-[color:var(--color-body)]">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Terbit</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
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
                    {STATUS_LABEL[row.status]}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-body)]">
                    {row.kategori?.nama ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-body)]">
                    {row.publishedAt
                      ? format(new Date(row.publishedAt), "d MMM yyyy", {
                          locale: localeId,
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="secondary">
                      <Link to={`/berita/${row.id}/edit`}>
                        {canWrite ? "Edit" : "Lihat"}
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[color:var(--color-border)] px-4 py-2 text-xs text-[color:var(--color-body-subtle)]">
            {items.length} dari {total} berita
          </p>
        </div>
      ) : null}
    </div>
  );
}
