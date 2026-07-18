import { auth } from "@clerk/nextjs/server";

import { KategoriManager } from "@/components/dashboard/kategori/KategoriManager";
import {
  ApiClientError,
  fetchKategoriListCms,
  isApiConfigured,
} from "@/lib/api-client";
import type { Kategori } from "@/types/kategori";

export const dynamic = "force-dynamic";

export default async function KategoriPage() {
  let items: Kategori[] = [];
  let listError: string | null = null;

  if (!isApiConfigured()) {
    listError =
      "API_URL / NEXT_PUBLIC_API_URL belum dikonfigurasi. Lihat .env.example dan docs/API.md.";
  } else {
    try {
      const session = await auth();
      const token = await session.getToken();
      if (!token) {
        throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      }
      const res = await fetchKategoriListCms(token);
      items = res.data;
    } catch (err) {
      listError =
        err instanceof ApiClientError
          ? err.message
          : "Gagal memuat daftar kategori.";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Kategori
        </h1>
        <p className="text-sm text-[color:var(--color-body)]">
          CRUD terhadap <code>GET/POST/PATCH/DELETE /v1/kategori</code> (api-web).
        </p>
      </div>
      <KategoriManager initial={items} listError={listError} />
    </div>
  );
}
