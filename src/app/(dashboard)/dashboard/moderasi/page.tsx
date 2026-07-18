import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { ModerasiQueue } from "@/components/dashboard/moderasi/ModerasiQueue";
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
import type { ArtikelSiswaListItem } from "@/types/artikel-siswa";

export const dynamic = "force-dynamic";

export default async function DashboardModerasiPage() {
  const cms = await getCmsSession();
  if (!cms?.canViewModerasi) {
    redirect("/dashboard");
  }

  let items: ArtikelSiswaListItem[] = [];
  let error: string | null = null;

  if (!isApiConfigured()) {
    error =
      "API_URL / NEXT_PUBLIC_API_URL belum dikonfigurasi. Lihat .env.example.";
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
        status: "REVIEW",
      });
      items = res.data;
    } catch (err) {
      error =
        err instanceof ApiClientError
          ? err.message
          : "Gagal memuat antrian moderasi.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Moderasi
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Antrian artikel siswa berstatus <code>REVIEW</code>. Setujui /
            tolak hanya untuk peran <strong>admin</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BeritaListRefresh />
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/artikel">Semua artikel</Link>
          </Button>
        </div>
      </div>

      {!cms.canModerate ? (
        <div
          role="status"
          className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
        >
          Anda dapat melihat antrian. Hanya <code>admin</code> yang dapat
          menyetujui atau menolak.
        </div>
      ) : null}

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Tidak dapat memuat antrian</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ModerasiQueue items={items} />
      )}
    </div>
  );
}
