import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import { BeritaArticleDetailShell } from "@/components/features/landing/berita/BeritaArticleDetailShell";
import {
  buildBeritaArticleMetadata,
  getBeritaSiswaDetailPath,
  type BeritaArticleSeoInput,
} from "@/lib/berita-seo";
import {
  getArtikelSiswaPublikBySlug,
  getRelatedArtikelSiswa,
} from "@/services/artikel-berita-publik";
import { getRelatedBeritaKegiatan } from "@/services/berita-kegiatan-publik";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artikel = await getArtikelSiswaPublikBySlug(slug);
  if (!artikel) {
    return { title: "Artikel tidak ditemukan", robots: { index: false, follow: false } };
  }
  return buildBeritaArticleMetadata({
    kind: "siswa",
    judul: artikel.judul,
    ringkasan: artikel.ringkasan,
    path: getBeritaSiswaDetailPath(slug),
    publishedAt: artikel.publishedAt,
    authorName: `${artikel.penulisNama} (${artikel.penulisKelas})`,
    imageUrl: artikel.coverSrc,
    metaTitle: artikel.metaTitle,
    metaDescription: artikel.metaDescription,
    metaKeywords: artikel.metaKeywords,
    ogImageOverride: artikel.ogImageOverride,
  });
}

export default async function BeritaArtikelSiswaPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const artikel = await getArtikelSiswaPublikBySlug(slug);
  if (!artikel) {
    notFound();
  }

  const [relatedSiswa, relatedKegiatan] = await Promise.all([
    getRelatedArtikelSiswa(slug, 2),
    getRelatedBeritaKegiatan("__none__", 1),
  ]);
  const related = [...relatedSiswa, ...relatedKegiatan].slice(0, 3);

  const authorLabel = `${artikel.penulisNama} · ${artikel.penulisKelas}`;
  const coverAlt = artikel.coverAlt?.trim() || `Ilustrasi artikel: ${artikel.judul}`;
  const seo: BeritaArticleSeoInput = {
    kind: "siswa",
    judul: artikel.judul,
    ringkasan: artikel.ringkasan,
    path: getBeritaSiswaDetailPath(slug),
    publishedAt: artikel.publishedAt,
    authorName: authorLabel,
    imageUrl: artikel.coverSrc,
    metaTitle: artikel.metaTitle,
    metaDescription: artikel.metaDescription,
    metaKeywords: artikel.metaKeywords,
    ogImageOverride: artikel.ogImageOverride,
  };

  return (
    <BeritaArticleDetailShell
      seo={seo}
      backHref="/berita/berita-terbaru"
      backLabel="Berita terbaru"
      sectionPath="/berita/berita-terbaru"
      publishedAt={artikel.publishedAt}
      authorLabel={authorLabel}
      judul={artikel.judul}
      ringkasan={artikel.ringkasan}
      kontenHtml={artikel.konten}
      cover={{ src: artikel.coverSrc, alt: coverAlt }}
      related={related}
    />
  );
}
