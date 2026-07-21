"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Newspaper, PenLine, ShieldCheck, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCardsSkeleton } from "@/components/ui/loading-skeleton";
import {
  fetchCmsAnalytics,
  isApiConfigured,
} from "@/lib/api-client";
import type { CmsAnalyticsOverview } from "@/types/analytics";

const empty: CmsAnalyticsOverview = {
  beritaTotal: 0,
  beritaPublished: 0,
  beritaDraft: 0,
  beritaArchived: 0,
  artikelTotal: 0,
  artikelReview: 0,
  artikelPublished: 0,
  kategoriTotal: 0,
  siteContentPending: 0,
  pengumumanTotal: 0,
  beritaPerBulan: [],
  recentActivity: [],
  source: "unavailable",
};

type Props = {
  canAccessBerita: boolean;
  canViewModerasi: boolean;
};

export function DashboardAnalytics({
  canAccessBerita,
  canViewModerasi,
}: Props) {
  const { getToken, isLoaded } = useAuth();
  const [data, setData] = useState<CmsAnalyticsOverview>(empty);
  const [loading, setLoading] = useState(true);
  const apiReady = isApiConfigured();

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    async function load() {
      if (!apiReady) {
        setLoading(false);
        return;
      }
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const next = await fetchCmsAnalytics(token);
        if (!cancelled) setData(next);
      } catch {
        if (!cancelled) setData(empty);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid getToken identity churn
  }, [apiReady, isLoaded]);

  const chartData = useMemo(
    () =>
      data.beritaPerBulan.length > 0
        ? data.beritaPerBulan.map((b) => ({
            name: b.bulan,
            value: b.jumlah,
          }))
        : [
            { name: "Berita terbit", value: data.beritaPublished },
            { name: "Berita draf", value: data.beritaDraft },
            { name: "Berita arsip", value: data.beritaArchived },
            { name: "Artikel terbit", value: data.artikelPublished },
            { name: "Menunggu review", value: data.artikelReview },
          ],
    [data],
  );

  const pendingTotal = data.artikelReview + data.siteContentPending;

  const sourceLabel =
    data.source === "api"
      ? "Data langsung dari server"
      : data.source === "aggregate"
        ? "Ringkasan dari daftar konten"
        : "Data belum tersedia";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
            Ringkasan konten
          </h2>
          <p className="text-xs text-[color:var(--color-body-subtle)]">
            {loading ? "Memuat…" : sourceLabel}
          </p>
        </div>
        {canViewModerasi && pendingTotal > 0 ? (
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/moderasi">
              {pendingTotal} menunggu moderasi
            </Link>
          </Button>
        ) : null}
      </div>

      {loading ? (
        <StatCardsSkeleton count={4} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              canAccessBerita
                ? {
                    label: "Berita",
                    value: data.beritaTotal,
                    icon: Newspaper,
                  }
                : null,
              {
                label: "Artikel siswa",
                value: data.artikelTotal,
                icon: PenLine,
              },
              {
                label: "Menunggu review",
                value: pendingTotal,
                icon: ShieldCheck,
                badge: pendingTotal > 0,
              },
              {
                label: "Kategori",
                value: data.kategoriTotal,
                icon: Tags,
              },
            ] as const
          )
            .filter(Boolean)
            .map((row) => {
              const item = row!;
              const Icon = item.icon;
              return (
                <Card key={item.label}>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1.5">
                      <Icon className="size-3.5" aria-hidden />
                      {item.label}
                      {"badge" in item && item.badge ? (
                        <span className="ml-auto rounded-sm bg-[color:var(--color-brand)]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-brand)]">
                          antrian
                        </span>
                      ) : null}
                    </CardDescription>
                    <CardTitle className="text-2xl tabular-nums">
                      {item.value}
                    </CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
        </div>
      )}

      {canAccessBerita ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {data.beritaPerBulan.length > 0
                ? "Berita per bulan"
                : "Status konten"}
            </CardTitle>
            <CardDescription>
              {data.beritaPerBulan.length > 0
                ? "Jumlah berita dibuat dalam 6 bulan terakhir."
                : "Perbandingan cepat berita sekolah dan artikel siswa."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-56 w-full">
            {!loading && data.source !== "unavailable" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8F8" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1313BA" radius={0} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[color:var(--color-body)]">
                {apiReady
                  ? "Belum ada data untuk ditampilkan."
                  : "Konfigurasi VITE_API_URL belum tersedia."}
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {!loading && data.recentActivity.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aktivitas terbaru</CardTitle>
            <CardDescription>
              Perubahan berita dan artikel terbaru dari database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[color:var(--color-border)]">
              {data.recentActivity.map((item, idx) => (
                <li
                  key={`${item.time}-${idx}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm"
                >
                  <span className="text-[color:var(--color-heading)]">
                    <span className="mr-2 text-xs uppercase text-[color:var(--color-body-subtle)]">
                      {item.type}
                    </span>
                    {item.label}
                  </span>
                  <time
                    className="text-xs tabular-nums text-[color:var(--color-body-subtle)]"
                    dateTime={item.time}
                  >
                    {new Date(item.time).toLocaleString("id-ID")}
                  </time>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
