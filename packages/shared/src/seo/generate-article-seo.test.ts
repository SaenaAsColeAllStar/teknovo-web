import { describe, expect, it } from "vitest";

import {
  generateArticleSeo,
  stripHtmlToPlainText,
  truncateAtWordBoundary,
  SEO_META_DESCRIPTION_MAX,
  SEO_META_TITLE_MAX,
} from "./generate-article-seo";

describe("stripHtmlToPlainText", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtmlToPlainText("<p>Halo <strong>dunia</strong></p>")).toBe(
      "Halo dunia",
    );
  });
});

describe("truncateAtWordBoundary", () => {
  it("keeps short text", () => {
    expect(truncateAtWordBoundary("Pendek saja", 20)).toBe("Pendek saja");
  });

  it("cuts at word boundary", () => {
    const long =
      "SMK TEKNOVO mengadakan kegiatan praktik industri bagi siswa kelas sebelas tahun ini";
    const out = truncateAtWordBoundary(long, 40);
    expect(out.length).toBeLessThanOrEqual(40);
    expect(out.endsWith("…")).toBe(true);
    expect(out.includes("  ")).toBe(false);
  });
});

describe("generateArticleSeo", () => {
  it("builds berita SEO within Google length limits", () => {
    const seo = generateArticleSeo({
      judul: "Kunjungan Industri Siswa ke Pabrik Otomotif Subang",
      ringkasan:
        "Siswa kelas XI jurusan Teknik Kendaraan Ringan mengunjungi pabrik otomotif di Subang untuk melihat proses produksi secara langsung.",
      konten:
        "<p>Kegiatan ini bertujuan memperkenalkan dunia kerja nyata kepada siswa.</p>",
      kategoriNama: "Kegiatan",
      coverUrl: "https://r2.example.com/cover.jpg",
      slug: "kunjungan-industri-siswa",
      kind: "berita",
      siteName: "TEKNOVO",
      siteBaseUrl: "https://smkteknovo.sch.id",
    });

    expect(seo.metaTitle.length).toBeGreaterThan(10);
    expect(seo.metaTitle.length).toBeLessThanOrEqual(SEO_META_TITLE_MAX);
    expect(seo.metaDescription.length).toBeGreaterThan(40);
    expect(seo.metaDescription.length).toBeLessThanOrEqual(
      SEO_META_DESCRIPTION_MAX,
    );
    expect(seo.ogImageUrl).toBe("https://r2.example.com/cover.jpg");
    expect(seo.canonicalUrl).toBe(
      "https://smkteknovo.sch.id/berita/kegiatan/kunjungan-industri-siswa",
    );
    expect(seo.metaKeywords.toLowerCase()).toContain("berita");
    expect(seo.metaKeywords.toLowerCase()).toContain("teknovo");
  });

  it("falls back to body text when ringkasan is empty", () => {
    const seo = generateArticleSeo({
      judul: "Artikel pendek",
      konten:
        "<p>Ini adalah isi artikel yang cukup panjang untuk menjadi deskripsi meta ketika ringkasan kosong di CMS.</p>",
      kind: "artikel",
      slug: "artikel-pendek",
    });
    expect(seo.metaDescription.length).toBeGreaterThan(40);
    expect(seo.canonicalUrl).toContain("/berita/siswa/artikel-pendek");
  });

  it("avoids stuffing brand twice in short titles", () => {
    const seo = generateArticleSeo({
      judul: "PPDB dibuka",
      kind: "berita",
      siteName: "TEKNOVO",
    });
    expect(seo.metaTitle).toBe("PPDB dibuka | TEKNOVO");
  });
});
