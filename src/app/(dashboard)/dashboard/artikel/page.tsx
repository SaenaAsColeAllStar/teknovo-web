import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { BeritaListRefresh } from "@/components/dashboard/berita/BeritaListRefresh";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ApiClientError,
  fetchArtikelSiswaListCms,
  isApiConfigured,
} from "@/lib/api-client";
import { getCmsSession } from "@/lib/cms-auth";
import type {
  ArtikelSiswaListItem,
  ArtikelSiswaStatus,
} from "@/types/artikel-siswa";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<ArtikelSiswaStatus, string> = {
  DRAFT: "Draft",
  REVIEW: "Review",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export default async function DashboardArtikelPage() {
  const cms = await getCmsSession();
  const canWriteArtikel = cms?.canWriteArtikel ?? false;
  const isSiswa = cms?.role === "siswa";

  let items: ArtikelSiswaListItem[] = [];
  let total = 0;
  let error: string | null = null;

  if (!isApiConfigured()) {
    error =
      "API_URL / NEXT_PUBLIC_API_URL belum dikonfigurasi. Lihat .env.example dan docs/API.md.";
  } else {
    try {
      const session = await auth();
      const token = await session.getToken();
      if (!token) {
        throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      }
      const res = await fetchArtikelSiswaListCms(token, {
        page: 1,
        limit: 50,
        mine: isSiswa,
      });
      items = res.data;
      total = res.meta.total;
    } catch (err) {
      error =
        err instanceof ApiClientError
          ? err.message
          : "Gagal memuat daftar artikel siswa.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            {isSiswa ? "Artikel saya" : "Artikel siswa"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            {isSiswa
              ? "Tulis dan kirim artikel ekstrakurikuler untuk dimoderasi admin."
              : "Channel artikel siswa (ekskul). Publik hanya menampilkan status PUBLISHED."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BeritaListRefresh />
          {canWriteArtikel ? (
            <Button asChild size="sm">
              <Link href="/dashboard/artikel/baru">Artikel baru</Link>
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

      {!error && items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {isSiswa ? "Belum ada artikel Anda" : "Belum ada artikel siswa"}
            </CardTitle>
            <CardDescription>
              {isSiswa
                ? "Buat draft lalu kirim ke moderasi (status REVIEW)."
                : "Pastikan api-web melayani GET /v1/artikel-siswa."}
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
                {!isSiswa ? (
                  <th className="px-4 py-3 font-medium">Penulis</th>
                ) : null}
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
                      <Link href={`/dashboard/artikel/${row.id}/edit`}>
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
