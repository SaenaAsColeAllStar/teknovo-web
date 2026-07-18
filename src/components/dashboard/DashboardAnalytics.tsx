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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { getToken } = useAuth();
  const [data, setData] = useState<CmsAnalyticsOverview>(empty);
  const [loading, setLoading] = useState(true);
  const apiReady = isApiConfigured();

  useEffect(() => {
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
  }, [apiReady, getToken]);

  const chartData = useMemo(
    () => [
      { name: "Published", value: data.beritaPublished },
      { name: "Draft", value: data.beritaDraft },
      { name: "Archived", value: data.beritaArchived },
      { name: "Artikel PUB", value: data.artikelPublished },
      { name: "REVIEW", value: data.artikelReview },
    ],
    [data],
  );

  const sourceLabel =
    data.source === "api"
      ? "dari /v1/analytics/overview"
      : data.source === "aggregate"
        ? "agregasi daftar CMS"
        : "API tidak tersedia";

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
        {canViewModerasi && data.artikelReview > 0 ? (
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/moderasi">
              {data.artikelReview} menunggu moderasi
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            canAccessBerita
              ? (["Berita", data.beritaTotal] as const)
              : null,
            ["Artikel siswa", data.artikelTotal] as const,
            ["Antrian REVIEW", data.artikelReview] as const,
            ["Kategori", data.kategoriTotal] as const,
          ] as const
        )
          .filter(Boolean)
          .map((row) => {
            const [label, value] = row!;
            return (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {loading ? "—" : value}
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          })}
      </div>

      {canAccessBerita ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status konten</CardTitle>
            <CardDescription>
              Perbandingan cepat berita & artikel (sample hingga 100 item bila
              agregasi).
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
                  ? "Belum ada data chart (API offline atau kosong)."
                  : "Set API_URL untuk menampilkan analytics."}
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
