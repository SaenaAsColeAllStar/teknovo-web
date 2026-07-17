import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { fetchBeritaBySlug } from "@/lib/api-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const berita = await fetchBeritaBySlug(slug);
  if (!berita) {
    return { title: "Berita tidak ditemukan" };
  }
  return {
    title: berita.judul,
    description: berita.ringkasan ?? undefined,
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const berita = await fetchBeritaBySlug(slug);
  if (!berita) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[800px] px-4 py-14 md:px-6">
      <header className="mb-8">
        <p className="text-sm text-[color:var(--color-body-subtle)]">
          {berita.publishedAt
            ? format(new Date(berita.publishedAt), "d MMMM yyyy", {
                locale: localeId,
              })
            : null}
          {berita.kategori ? ` · ${berita.kategori.nama}` : null}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-[color:var(--color-heading)]">
          {berita.judul}
        </h1>
        {berita.ringkasan ? (
          <p className="mt-4 text-lg text-[color:var(--color-body)]">{berita.ringkasan}</p>
        ) : null}
      </header>
      <div
        className="prose prose-indigo max-w-none text-[color:var(--color-body)]"
        dangerouslySetInnerHTML={{ __html: berita.konten }}
      />
    </article>
  );
}
