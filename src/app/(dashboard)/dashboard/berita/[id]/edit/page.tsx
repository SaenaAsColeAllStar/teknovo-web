import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { BeritaForm } from "@/components/dashboard/berita/BeritaForm";
import { Button } from "@/components/ui/button";
import {
  ApiClientError,
  fetchBeritaById,
  fetchKategoriList,
  isApiConfigured,
} from "@/lib/api-client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditBeritaPage({ params }: Props) {
  const { id } = await params;

  let error: string | null = null;
  let berita = null;
  let kategori: Awaited<ReturnType<typeof fetchKategoriList>> = [];

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
      const [row, cats] = await Promise.all([
        fetchBeritaById(id, token),
        fetchKategoriList(),
      ]);
      berita = row;
      kategori = cats;
    } catch (err) {
      error =
        err instanceof ApiClientError
          ? err.message
          : "Gagal memuat berita.";
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Edit berita
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Muat via <code>GET /v1/berita/id/:id</code>, simpan via{" "}
            <code>PATCH /v1/berita/:id</code>.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link href="/dashboard/berita">Kembali</Link>
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

      {!error && berita ? (
        <BeritaForm mode="edit" initial={berita} kategori={kategori} />
      ) : null}
    </div>
  );
}
