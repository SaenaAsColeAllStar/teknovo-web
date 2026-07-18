import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { BeritaForm } from "@/components/dashboard/berita/BeritaForm";
import { Button } from "@/components/ui/button";
import { ApiClientError, fetchBeritaById, fetchKategoriList } from "@/lib/api-client";
import type { Berita } from "@/types/berita";
import type { Kategori } from "@/types/kategori";

/** Mirrors `dashboard/berita/baru/page.tsx` + `dashboard/berita/[id]/edit/page.tsx`. */
export function BeritaFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [berita, setBerita] = useState<Berita | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (mode === "edit" && id) {
          const token = await getToken();
          if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
          const [row, cats] = await Promise.all([
            fetchBeritaById(id, token),
            fetchKategoriList(),
          ]);
          if (cancelled) return;
          setBerita(row);
          setKategori(cats);
        } else {
          const cats = await fetchKategoriList();
          if (cancelled) return;
          setKategori(cats);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiClientError ? err.message : "Gagal memuat berita.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, id, getToken]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            {mode === "create" ? "Berita baru" : "Edit berita"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            {mode === "create" ? (
              <>
                Form Zod + TipTap Starter Kit → <code>POST /v1/berita</code>.
              </>
            ) : (
              <>
                Muat via <code>GET /v1/berita/id/:id</code>, simpan via{" "}
                <code>PATCH /v1/berita/:id</code>.
              </>
            )}
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/berita">Kembali</Link>
        </Button>
      </div>

      {error ? (
        <div
          role="alert"
          className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
      ) : null}

      {!loading && !error && mode === "create" ? (
        <BeritaForm mode="create" kategori={kategori} />
      ) : null}

      {!loading && !error && mode === "edit" && berita ? (
        <BeritaForm mode="edit" initial={berita} kategori={kategori} />
      ) : null}
    </div>
  );
}
