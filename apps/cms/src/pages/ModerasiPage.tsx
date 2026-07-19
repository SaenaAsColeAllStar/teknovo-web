import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { BeritaListRefresh } from "@/components/dashboard/berita/BeritaListRefresh";
import { ModerasiQueue } from "@/components/dashboard/moderasi/ModerasiQueue";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError, fetchArtikelSiswaListCms } from "@/lib/api-client";
import type { ArtikelSiswaListItem } from "@/types/artikel-siswa";

import { useCmsGetToken } from "../lib/use-cms-get-token";
import { onRouterRefresh } from "../shims/next-navigation";

/** Mirrors `src/app/(dashboard)/dashboard/moderasi/page.tsx`, fetched client-side. */
export function ModerasiPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canModerate } = useCmsRole();
  const [items, setItems] = useState<ArtikelSiswaListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const res = await fetchArtikelSiswaListCms(token, {
          page: 1,
          limit: 50,
          status: "REVIEW",
        });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Gagal memuat antrian moderasi.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    const unsubscribe = onRouterRefresh(() => void load());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [getToken, isLoaded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Moderasi
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Antrian artikel siswa yang menunggu persetujuan Super Admin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BeritaListRefresh />
          <Button asChild size="sm" variant="secondary">
            <Link to="/artikel">Semua artikel</Link>
          </Button>
        </div>
      </div>

      {!canModerate ? (
        <div
          role="status"
          className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
        >
          Anda dapat melihat antrian. Hanya Super Admin yang dapat menyetujui atau
          menolak.
        </div>
      ) : null}

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Tidak dapat memuat antrian</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : !loading ? (
        <ModerasiQueue items={items} />
      ) : (
        <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
      )}
    </div>
  );
}
