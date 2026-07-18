import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CmsAnalyticsOverview } from "@teknovo/shared";
import { apiRequest } from "../lib/api";

export function OverviewPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<CmsAnalyticsOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const overview = await apiRequest<CmsAnalyticsOverview>(
          "/api/v1/analytics/overview",
          { token },
        );
        if (!cancelled) setData(overview);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--muted)]">
          CMS tipuan TipTap — API di cf.smkteknovo.sch.id
        </p>
      </div>
      {error && (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {data && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Berita published" value={data.beritaPublished} />
          <Stat label="Berita draft" value={data.beritaDraft} />
          <Stat label="Artikel review" value={data.artikelReview} />
          <Stat label="Kategori" value={data.kategoriTotal} />
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/berita/baru"
          className="border border-[var(--brand)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
        >
          Tulis berita
        </Link>
        <Link
          to="/artikel/baru"
          className="border border-[var(--border)] px-4 py-2 text-sm"
        >
          Artikel siswa
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[var(--border)] bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
