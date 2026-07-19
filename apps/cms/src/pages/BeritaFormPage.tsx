import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { BeritaForm } from "@/components/dashboard/berita/BeritaForm";
import { Button } from "@/components/ui/button";
import {
  ApiClientError,
  fetchBeritaById,
  fetchKategoriListCms,
} from "@/lib/api-client";
import type { Berita } from "@/types/berita";
import type { Kategori } from "@/types/kategori";

import { useCmsGetToken } from "../lib/use-cms-get-token";

/** Mirrors `dashboard/berita/baru/page.tsx` + `dashboard/berita/[id]/edit/page.tsx`. */
export function BeritaFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const { getToken, isLoaded } = useCmsGetToken();
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [berita, setBerita] = useState<Berita | null>(null);
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
        if (mode === "edit" && id) {
          const [row, cats] = await Promise.all([
            fetchBeritaById(id, token),
            fetchKategoriListCms(token),
          ]);
          if (cancelled) return;
          setBerita(row);
          setKategori(cats.data);
        } else {
          const cats = await fetchKategoriListCms(token);
          if (cancelled) return;
          setKategori(cats.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Gagal memuat berita.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, id, getToken, isLoaded]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            {mode === "create" ? "Berita baru" : "Edit berita"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            {mode === "create"
              ? "Tulis pengumuman atau kegiatan sekolah, lalu simpan draf atau terbitkan."
              : "Perbarui isi, cover, SEO, lalu simpan atau terbitkan ulang."}
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
