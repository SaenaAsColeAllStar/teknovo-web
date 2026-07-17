import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import { BeritaArticleDetailShell } from "@/components/features/landing/berita/BeritaArticleDetailShell";
import {
  buildBeritaArticleMetadata,
  getBeritaKegiatanDetailPath,
  type BeritaArticleSeoInput,
} from "@/lib/berita-seo";
import { getBeritaKegiatanPublikBySlug, getRelatedBeritaKegiatan } from "@/services/berita-kegiatan-publik";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const row = await getBeritaKegiatanPublikBySlug(slug);
  if (!row) {
    return { title: "Berita tidak ditemukan", robots: { index: false, follow: false } };
  }
  const authorName =
    row.penulisNama?.trim() && row.penulisNama.trim().length > 0
      ? row.penulisNama.trim()
      : "Humas sekolah";

  return buildBeritaArticleMetadata({
    kind: "kegiatan",
    judul: row.judul,
    ringkasan: row.ringkasan,
    path: getBeritaKegiatanDetailPath(slug),
    publishedAt: row.publishedAt,
    authorName,
    imageUrl: row.coverSrc,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    metaKeywords: row.metaKeywords,
    ogImageOverride: row.ogImageOverride,
  });
}

export default async function BeritaKegiatanPublikPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const artikel = await getBeritaKegiatanPublikBySlug(slug);
  if (!artikel) {
    notFound();
  }

  const related = await getRelatedBeritaKegiatan(slug, 3);

  const authorLabel =
    artikel.penulisNama?.trim() && artikel.penulisNama.trim().length > 0
      ? artikel.penulisNama.trim()
      : "Humas sekolah";

  const coverAlt = artikel.coverAlt?.trim() || `Ilustrasi berita: ${artikel.judul}`;
  const seo: BeritaArticleSeoInput = {
    kind: "kegiatan",
    judul: artikel.judul,
    ringkasan: artikel.ringkasan,
    path: getBeritaKegiatanDetailPath(slug),
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
      backHref="/berita/kegiatan-sekolah"
      backLabel="Berita kegiatan sekolah"
      sectionPath="/berita/kegiatan-sekolah"
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
