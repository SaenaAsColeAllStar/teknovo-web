import { useEffect, useState } from "react";

import { PengaturanForm } from "@/components/dashboard/pengaturan/PengaturanForm";
import { fetchPengaturanCms } from "@/lib/api-client";
import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
  type PengaturanSitusPublikData,
} from "@/lib/pengaturan-situs-publik-defaults";

import { useCmsGetToken } from "../lib/use-cms-get-token";

function defaultsData(): PengaturanSitusPublikData {
  return {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
    updatedAt: null,
  };
}

/** Mirrors `src/app/(dashboard)/dashboard/pengaturan/page.tsx`, fetched client-side. */
export function PengaturanPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const [initial, setInitial] = useState<PengaturanSitusPublikData>(defaultsData);
  const [loadNote, setLoadNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          if (!cancelled) {
            setLoadNote("Sesi token tidak tersedia — menampilkan default lokal.");
          }
          return;
        }
        const data = await fetchPengaturanCms(token);
        if (!cancelled) setInitial(data);
      } catch {
        if (!cancelled) {
          setLoadNote(
            "Gagal memuat pengaturan — menampilkan nilai default. Coba muat ulang, atau hubungi Super Admin jika berlanjut.",
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
  }, [getToken, isLoaded]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-body)]">
          Metadata situs, SEO, kontak, PPDB, dan tautan sosial. Hanya peran{" "}
          <code>admin</code>.
        </p>
        {loadNote ? (
          <p className="mt-2 text-xs text-[color:var(--color-body-subtle)]">
            {loadNote}
          </p>
        ) : null}
      </div>
      {loading ? (
        <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
      ) : (
        <PengaturanForm initial={initial} />
      )}
    </div>
  );
}
