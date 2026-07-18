import Link from "next/link";
import { redirect } from "next/navigation";

import { ArtikelSiswaForm } from "@/components/dashboard/artikel/ArtikelSiswaForm";
import { Button } from "@/components/ui/button";
import { fetchKategoriList } from "@/lib/api-client";
import { getCmsSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export default async function ArtikelSiswaBaruPage() {
  const cms = await getCmsSession();
  if (!cms?.canWriteArtikel) {
    redirect("/dashboard/artikel");
  }

  const kategori = await fetchKategoriList();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Artikel siswa baru
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            TipTap → <code>POST /v1/artikel-siswa</code>. Siswa mengirim status{" "}
            <code>REVIEW</code> untuk moderasi.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link href="/dashboard/artikel">Kembali</Link>
        </Button>
      </div>
      <ArtikelSiswaForm mode="create" kategori={kategori} />
    </div>
  );
}
