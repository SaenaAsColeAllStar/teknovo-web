import type { Metadata } from "next";

import { BeritaCardGrid } from "@/components/berita/BeritaCardGrid";
import { fetchBeritaList } from "@/lib/api-client";
import { BRAND_SHORT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Berita",
  description: `Berita dan kegiatan ${BRAND_SHORT}.`,
};

export default async function BeritaIndexPage() {
  const items = await fetchBeritaList({ limit: 24 });

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--color-body-subtle)]">
          Publikasi
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-[color:var(--color-heading)]">
          Berita
        </h1>
        <p className="mt-3 text-[color:var(--color-body)]">
          Arsip berita kegiatan, prestasi siswa, dan pengumuman resmi sekolah.
          Konten dilayani dari API homelab (lihat docs/API.md).
        </p>
      </header>
      <BeritaCardGrid items={items} />
    </div>
  );
}
