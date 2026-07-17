import type { Metadata } from "next";
import type { BreadcrumbList, NewsArticle, WithContext } from "schema-dts";

import { BRAND_LOGO_SRC, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { SEO_PRIMARY_LANGUAGE, SEO_PRIMARY_LOCALE } from "@/lib/seo/school";
import {
  buildLandingAbsoluteUrl,
  resolveOgImageUrl,
  truncateMetaDescription,
} from "@/lib/seo/urls";

export type BeritaArticleKind = "siswa" | "kegiatan";

export type BeritaRelatedItem = {
  href: string;
  judul: string;
  ringkasan: string;
  tanggalIso: string;
  kind: BeritaArticleKind;
};

export type BeritaArticleSeoInput = {
  kind: BeritaArticleKind;
  judul: string;
  ringkasan: string;
  path: string;
  publishedAt: Date;
  authorName: string;
  /** URL absolut atau path dari origin situs (mis. `/brand/logo.webp`). */
  imageUrl?: string;
  /** Override dari editor SEO; fallback ke judul/ringkasan bila kosong. */
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImageOverride?: string | null;
};

export type BeritaHubSeoInput = {
  title: string;
  description: string;
  path: string;
};

export function getBeritaSiswaDetailPath(slug: string): `/berita/siswa/${string}` {
  return `/berita/siswa/${slug}`;
}

export function getBeritaKegiatanDetailPath(slug: string): `/berita/kegiatan/${string}` {
  return `/berita/kegiatan/${slug}`;
}

export function buildBeritaArticleMetadata(input: BeritaArticleSeoInput): Metadata {
  const description = truncateMetaDescription(
    input.metaDescription?.trim() || input.ringkasan,
  );
  const canonical = buildLandingAbsoluteUrl(input.path);
  const title = input.metaTitle?.trim() || input.judul;
  const ogImage = resolveOgImageUrl(input.ogImageOverride?.trim() || input.imageUrl);
  const sectionLabel = input.kind === "siswa" ? "Artikel siswa" : "Berita kegiatan";
  const storedKeywords = input.metaKeywords
    ?.split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
  const keywords =
    storedKeywords && storedKeywords.length > 0
      ? storedKeywords
      : input.kind === "siswa"
        ? ["artikel siswa", "berita sekolah", BRAND_SHORT, sectionLabel]
        : ["berita kegiatan sekolah", "pengumuman sekolah", BRAND_SHORT, sectionLabel];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: { [SEO_PRIMARY_LANGUAGE]: canonical },
    },
    openGraph: {
      type: "article",
      locale: SEO_PRIMARY_LOCALE,
      url: canonical,
      title: `${title} | ${BRAND_SHORT}`,
      description,
      siteName: BRAND_SCHOOL_FULL,
      publishedTime: input.publishedAt.toISOString(),
      authors: [input.authorName],
      section: sectionLabel,
      tags: keywords,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND_SHORT}`,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    robots: { index: true, follow: true },
  };
}

export function buildBeritaHubMetadata(input: BeritaHubSeoInput): Metadata {
  const description = truncateMetaDescription(input.description);
  const canonical = buildLandingAbsoluteUrl(input.path);
  const title = input.title;
  const ogImage = resolveOgImageUrl(BRAND_LOGO_SRC);
  const fullTitle = `${title} — ${BRAND_SHORT}`;

  return {
    title,
    description,
    keywords: ["berita sekolah", "artikel siswa", "berita kegiatan", BRAND_SHORT, BRAND_SCHOOL_FULL],
    alternates: {
      canonical,
      languages: { [SEO_PRIMARY_LANGUAGE]: canonical },
    },
    openGraph: {
      type: "website",
      locale: SEO_PRIMARY_LOCALE,
      url: canonical,
      title: fullTitle,
      description,
      siteName: BRAND_SCHOOL_FULL,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    robots: { index: true, follow: true },
  };
}

export type BeritaBreadcrumbJsonLdInput = {
  judul: string;
  path: string;
  sectionLabel: string;
  sectionPath: string;
};

export function buildBeritaBreadcrumbJsonLd(
  input: BeritaBreadcrumbJsonLdInput,
): WithContext<BreadcrumbList> {
  const home = buildLandingAbsoluteUrl("/");
  const beritaHub = buildLandingAbsoluteUrl("/berita/berita-terbaru");
  const section = buildLandingAbsoluteUrl(input.sectionPath);
  const article = buildLandingAbsoluteUrl(input.path);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: home },
      { "@type": "ListItem", position: 2, name: "Berita", item: beritaHub },
      { "@type": "ListItem", position: 3, name: input.sectionLabel, item: section },
      { "@type": "ListItem", position: 4, name: input.judul, item: article },
    ],
  };
}

export function buildBeritaNewsArticleJsonLd(
  input: BeritaArticleSeoInput,
): WithContext<NewsArticle> {
  const canonical = buildLandingAbsoluteUrl(input.path);
  const ogImage = resolveOgImageUrl(input.ogImageOverride?.trim() || input.imageUrl);
  const sectionLabel = input.kind === "siswa" ? "Artikel siswa" : "Berita kegiatan sekolah";
  const headline = input.metaTitle?.trim() || input.judul;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description: truncateMetaDescription(input.metaDescription?.trim() || input.ringkasan),
    image: [ogImage],
    datePublished: input.publishedAt.toISOString(),
    dateModified: input.publishedAt.toISOString(),
    author: { "@type": "Person", name: input.authorName },
    publisher: {
      "@type": "Organization",
      name: BRAND_SCHOOL_FULL,
      logo: { "@type": "ImageObject", url: buildLandingAbsoluteUrl(BRAND_LOGO_SRC) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: SEO_PRIMARY_LANGUAGE,
    articleSection: sectionLabel,
    isAccessibleForFree: true,
  };
}
