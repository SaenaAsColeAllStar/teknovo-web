import { useAuth } from "@clerk/react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ArtikelSiswaForm } from "@/components/dashboard/artikel/ArtikelSiswaForm";
import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { BeritaListRefresh } from "@/components/dashboard/berita/BeritaListRefresh";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ApiClientError,
  fetchArtikelSiswaById,
  fetchArtikelSiswaListCms,
  fetchKategoriListCms,
} from "@/lib/api-client";
import type { ArtikelSiswa, ArtikelSiswaListItem, ArtikelSiswaStatus } from "@/types/artikel-siswa";
import type { Kategori } from "@/types/kategori";

import { onRouterRefresh } from "../shims/next-navigation";

const STATUS_LABEL: Record<ArtikelSiswaStatus, string> = {
  DRAFT: "Draf",
  REVIEW: "Menunggu review",
  PUBLISHED: "Terbit",
  ARCHIVED: "Arsip",
};

/** Mirrors `src/app/(dashboard)/dashboard/artikel/page.tsx`, fetched client-side. */
export function ArtikelListPage() {
  const { getToken } = useAuth();
  const { role, canWriteArtikel } = useCmsRole();
  const isSiswa = role === "siswa";
  const [items, setItems] = useState<ArtikelSiswaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          mine: isSiswa,
        });
        if (cancelled) return;
        setItems(res.data);
        setTotal(res.meta.total);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Gagal memuat daftar artikel siswa.",
        );
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
  }, [getToken, isSiswa]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            {isSiswa ? "Artikel saya" : "Artikel siswa"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            {isSiswa
              ? "Tulis artikel ekstrakurikuler, lalu kirim ke redaksi untuk ditinjau."
              : "Artikel ekstrakurikuler siswa. Hanya yang disetujui yang tampil di situs publik."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BeritaListRefresh />
          {canWriteArtikel ? (
            <Button asChild size="sm">
              <Link to="/artikel/baru">Artikel baru</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Tidak dapat memuat artikel</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!error && !loading && items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {isSiswa ? "Belum ada artikel Anda" : "Belum ada artikel siswa"}
            </CardTitle>
            <CardDescription>
              {isSiswa
                ? "Buat draf, lalu kirim ke moderasi agar redaksi dapat meninjau."
                : "Belum ada artikel. Siswa dapat menulis dari menu Artikel baru."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!error && items.length > 0 ? (
        <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] text-[color:var(--color-body)]">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {!isSiswa ? <th className="px-4 py-3 font-medium">Penulis</th> : null}
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
                  {!isSiswa ? (
                    <td className="px-4 py-3 text-[color:var(--color-body)]">
                      {row.penulis?.nama ?? "—"}
                      {row.penulis?.kelas ? ` · ${row.penulis.kelas}` : ""}
                    </td>
                  ) : null}
                  <td className="px-4 py-3 text-[color:var(--color-body)]">
                    {row.publishedAt
                      ? format(new Date(row.publishedAt), "d MMM yyyy", {
                          locale: localeId,
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="secondary">
                      <Link to={`/artikel/${row.id}/edit`}>
                        {canWriteArtikel ? "Edit" : "Lihat"}
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[color:var(--color-border)] px-4 py-2 text-xs text-[color:var(--color-body-subtle)]">
            {items.length} dari {total} artikel
          </p>
        </div>
      ) : null}
    </div>
  );
}

/** Mirrors `dashboard/artikel/baru/page.tsx` + `dashboard/artikel/[id]/edit/page.tsx`. */
export function ArtikelFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const { getToken, isLoaded } = useAuth();
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [artikel, setArtikel] = useState<ArtikelSiswa | null>(null);
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
            fetchArtikelSiswaById(id, token),
            fetchKategoriListCms(token),
          ]);
          if (cancelled) return;
          setArtikel(row);
          setKategori(cats.data);
        } else {
          const cats = await fetchKategoriListCms(token);
          if (cancelled) return;
          setKategori(cats.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Gagal memuat artikel.",
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
            {mode === "create" ? "Artikel siswa baru" : "Edit artikel siswa"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            {mode === "create"
              ? "Tulis artikel ekstrakurikuler, simpan draf, lalu kirim ke moderasi."
              : "Perbarui artikel, lalu simpan atau kirim ulang ke review."}
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/artikel">Kembali</Link>
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
        <ArtikelSiswaForm mode="create" kategori={kategori} />
      ) : null}

      {!loading && !error && mode === "edit" && artikel ? (
        <ArtikelSiswaForm mode="edit" initial={artikel} kategori={kategori} />
      ) : null}
    </div>
  );
}
