import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";

import { KategoriManager } from "@/components/dashboard/kategori/KategoriManager";
import { ApiClientError, fetchKategoriListCms } from "@/lib/api-client";
import type { Kategori } from "@/types/kategori";

import { onRouterRefresh } from "../shims/next-navigation";

/** Mirrors `src/app/(dashboard)/dashboard/kategori/page.tsx`, fetched client-side. */
export function KategoriPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<Kategori[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setListError(null);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const res = await fetchKategoriListCms(token);
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setListError(
            err instanceof ApiClientError ? err.message : "Gagal memuat daftar kategori.",
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
  }, [getToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Kategori
        </h1>
        <p className="text-sm text-[color:var(--color-body)]">
          CRUD terhadap <code>GET/POST/PATCH/DELETE /v1/kategori</code> (api-web).
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
      ) : (
        <KategoriManager initial={items} listError={listError} />
      )}
    </div>
  );
}
