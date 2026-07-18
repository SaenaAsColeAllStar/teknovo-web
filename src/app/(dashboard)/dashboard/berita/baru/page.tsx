import Link from "next/link";
import { redirect } from "next/navigation";

import { BeritaForm } from "@/components/dashboard/berita/BeritaForm";
import { Button } from "@/components/ui/button";
import { fetchKategoriList } from "@/lib/api-client";
import { getCmsSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export default async function BeritaBaruPage() {
  const cms = await getCmsSession();
  if (!cms?.canWrite) {
    redirect("/dashboard/berita");
  }

  const kategori = await fetchKategoriList();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Berita baru
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Form Zod + TipTap Starter Kit → <code>POST /v1/berita</code>.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link href="/dashboard/berita">Kembali</Link>
        </Button>
      </div>
      <BeritaForm mode="create" kategori={kategori} />
    </div>
  );
}
