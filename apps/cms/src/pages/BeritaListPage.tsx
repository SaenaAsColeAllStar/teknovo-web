import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BeritaListItem } from "@teknovo/shared";
import { apiList } from "../lib/api";

export function BeritaListPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<BeritaListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await apiList<BeritaListItem>(
          "/api/v1/berita?limit=50",
          token,
        );
        if (!cancelled) setItems(res.data);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Berita sekolah</h1>
        <Link
          to="/berita/baru"
          className="border border-[var(--brand)] bg-[var(--brand)] px-3 py-2 text-sm text-white"
        >
          Baru
        </Link>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <ul className="divide-y divide-[var(--border)] border border-[var(--border)]">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 p-3">
            <div>
              <p className="font-medium">{item.judul}</p>
              <p className="text-xs text-[var(--muted)]">
                {item.status} · {item.slug}
              </p>
            </div>
            <Link to={`/berita/${item.id}/edit`} className="text-sm">
              Edit
            </Link>
          </li>
        ))}
        {!items.length && !error && (
          <li className="p-4 text-sm text-[var(--muted)]">Belum ada berita.</li>
        )}
      </ul>
    </div>
  );
}
