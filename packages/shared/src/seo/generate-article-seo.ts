/**
 * Deterministic SEO metadata generator for berita & artikel siswa.
 * Follows Google SERP length guidance (title ~50–60, description ~150–160)
 * with word-boundary truncation and Indonesian-friendly defaults.
 */

export const SEO_META_TITLE_MAX = 70;
export const SEO_META_TITLE_IDEAL = 60;
export const SEO_META_DESCRIPTION_MAX = 160;
export const SEO_META_DESCRIPTION_IDEAL = 155;
export const SEO_META_KEYWORDS_MAX = 200;

export type ArticleSeoKind = "berita" | "artikel";

export type GenerateArticleSeoInput = {
  judul: string;
  ringkasan?: string | null;
  /** HTML or plain body text */
  konten?: string | null;
  kategoriNama?: string | null;
  coverUrl?: string | null;
  slug?: string | null;
  kind?: ArticleSeoKind;
  /** Short brand label, e.g. "TEKNOVO" */
  siteName?: string;
  /** Absolute public origin without trailing slash, e.g. https://smkteknovo.sch.id */
  siteBaseUrl?: string;
};

export type GeneratedArticleSeo = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
  canonicalUrl: string;
};

const DEFAULT_SITE_NAME = "TEKNOVO";
const DEFAULT_SITE_BASE = "https://smkteknovo.sch.id";

/** Common Indonesian + English function words — skip for keyword extraction. */
const STOP_WORDS = new Set([
  "yang",
  "dan",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "pada",
  "dalam",
  "adalah",
  "ini",
  "itu",
  "atau",
  "juga",
  "akan",
  "telah",
  "sudah",
  "sebagai",
  "oleh",
  "para",
  "satu",
  "dua",
  "tiga",
  "lebih",
  "sangat",
  "bagi",
  "karena",
  "agar",
  "bahwa",
  "serta",
  "the",
  "a",
  "an",
  "of",
  "to",
  "in",
  "on",
  "for",
  "and",
  "or",
  "is",
  "are",
  "was",
  "were",
  "be",
  "at",
  "by",
  "smk",
  "teknovo",
]);

export function stripHtmlToPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncate at a word boundary when possible; append ellipsis if cut.
 * Prefers not cutting before `minKeep` characters.
 */
export function truncateAtWordBoundary(
  text: string,
  max: number,
  minKeep = Math.floor(max * 0.55),
): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace >= minKeep ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

function buildMetaTitle(judul: string, siteName: string): string {
  const clean = judul.replace(/\s+/g, " ").trim();
  if (!clean) return siteName.slice(0, SEO_META_TITLE_MAX);

  const withBrand = `${clean} | ${siteName}`;
  if (withBrand.length <= SEO_META_TITLE_IDEAL) {
    return withBrand;
  }
  if (clean.length <= SEO_META_TITLE_IDEAL) {
    return clean;
  }
  return truncateAtWordBoundary(clean, SEO_META_TITLE_IDEAL);
}

function buildMetaDescription(
  ringkasan: string | null | undefined,
  bodyPlain: string,
  judul: string,
  kind: ArticleSeoKind,
  siteName: string,
): string {
  const excerpt = ringkasan?.replace(/\s+/g, " ").trim() || "";
  if (excerpt.length >= 40) {
    return truncateAtWordBoundary(excerpt, SEO_META_DESCRIPTION_IDEAL);
  }

  if (bodyPlain.length >= 40) {
    return truncateAtWordBoundary(bodyPlain, SEO_META_DESCRIPTION_IDEAL);
  }

  const kindLabel =
    kind === "artikel" ? "Artikel siswa" : "Berita kegiatan";
  const base = excerpt || judul.trim() || kindLabel;
  const fallback = `${base} — ${kindLabel} ${siteName}.`;
  return truncateAtWordBoundary(fallback, SEO_META_DESCRIPTION_IDEAL);
}

function extractKeywordTokens(text: string, limit: number): string[] {
  const tokens = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOP_WORDS.has(t));

  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tokens) {
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= limit) break;
  }
  return out;
}

function buildMetaKeywords(
  judul: string,
  kategoriNama: string | null | undefined,
  kind: ArticleSeoKind,
  siteName: string,
  bodyPlain: string,
): string {
  const parts: string[] = [];
  const push = (value: string | null | undefined) => {
    const v = value?.replace(/\s+/g, " ").trim();
    if (!v) return;
    const lower = v.toLowerCase();
    if (parts.some((p) => p.toLowerCase() === lower)) return;
    parts.push(v);
  };

  push(kategoriNama);
  push(kind === "artikel" ? "artikel siswa" : "berita kegiatan");
  push("berita sekolah");
  push(siteName);
  push("SMK TEKNOVO");

  for (const token of extractKeywordTokens(`${judul} ${bodyPlain.slice(0, 400)}`, 6)) {
    push(token);
  }

  const joined = parts.join(", ");
  if (joined.length <= SEO_META_KEYWORDS_MAX) return joined;
  return truncateAtWordBoundary(joined, SEO_META_KEYWORDS_MAX).replace(/…$/, "");
}

function buildCanonicalUrl(
  kind: ArticleSeoKind,
  slug: string | null | undefined,
  siteBaseUrl: string,
): string {
  const cleanSlug = slug?.trim().replace(/^\/+|\/+$/g, "") || "";
  if (!cleanSlug) return "";
  const base = siteBaseUrl.replace(/\/$/, "");
  const path =
    kind === "artikel"
      ? `/berita/siswa/${cleanSlug}`
      : `/berita/kegiatan/${cleanSlug}`;
  return `${base}${path}`;
}

/**
 * Generate optimal SEO fields from article content.
 * Pure / deterministic — safe to call from CMS UI or API.
 */
export function generateArticleSeo(
  input: GenerateArticleSeoInput,
): GeneratedArticleSeo {
  const siteName = (input.siteName?.trim() || DEFAULT_SITE_NAME).slice(0, 40);
  const siteBaseUrl = input.siteBaseUrl?.trim() || DEFAULT_SITE_BASE;
  const kind = input.kind ?? "berita";
  const judul = input.judul?.trim() || "";
  const bodyPlain = stripHtmlToPlainText(input.konten ?? "");

  const metaTitle = buildMetaTitle(judul, siteName).slice(0, SEO_META_TITLE_MAX);
  const metaDescription = buildMetaDescription(
    input.ringkasan,
    bodyPlain,
    judul,
    kind,
    siteName,
  ).slice(0, SEO_META_DESCRIPTION_MAX);
  const metaKeywords = buildMetaKeywords(
    judul,
    input.kategoriNama,
    kind,
    siteName,
    bodyPlain,
  ).slice(0, SEO_META_KEYWORDS_MAX);
  const ogImageUrl = input.coverUrl?.trim() || "";
  const canonicalUrl = buildCanonicalUrl(kind, input.slug, siteBaseUrl);

  return {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogImageUrl,
    canonicalUrl,
  };
}
