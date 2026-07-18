/**
 * Client-safe search index for the public marketing navbar.
 * Static page/jurusan targets + live berita terbaru from the CMS API.
 */
import { AKADEMIK_JURUSAN_ITEMS } from "@/lib/akademik-landing-content";
import {
  PUBLIC_SITE_FOOTER_SECTIONS,
  PUBLIC_SITE_MAIN_NAV,
  PUBLIC_SITE_PPDB_HREF,
} from "@/lib/public-site-nav";
import { getBeritaKegiatanDetailPath, getBeritaSiswaDetailPath } from "@/lib/seo/berita";
import { LMS_BERITA_KEGIATAN_SLUG } from "@/lib/seo/lms";

export type PublicSiteSearchHitKind = "berita" | "jurusan" | "halaman";

export type PublicSiteSearchHit = {
  id: string;
  title: string;
  href: string;
  kind: PublicSiteSearchHitKind;
  /** ISO date for berita sorting; optional for static targets. */
  publishedAt?: string | null;
};

const RECENT_BERITA_LIMIT = 8;

/**
 * Worker mounts at `/api/v1/*`. Env may be origin (`https://cf…`) or already
 * include `/api` (CMS `VITE_API_URL` style).
 */
function resolvePublicApiV1Base(): string {
  const raw =
    (typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL ||
        process.env.PUBLIC_API_URL ||
        process.env.API_URL
      : undefined) || "https://cf.smkteknovo.sch.id";
  const trimmed = raw.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
}

/** Offline / API-down fallback — mirrors known kegiatan berita slugs. */
const FALLBACK_BERITA_HITS: readonly PublicSiteSearchHit[] = [
  {
    id: "fallback-ppdb-g1",
    title: "Pembukaan Gelombang 1 PPDB 2026/2027",
    href: getBeritaKegiatanDetailPath("pembukaan-gelombang-1-ppdb-2026"),
    kind: "berita",
    publishedAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "fallback-jurusan",
    title: "Program Kejuruan Teknik Mesin & Unit Layanan Wisata",
    href: getBeritaKegiatanDetailPath("program-kejuruan-teknik-mesin-dan-ulw"),
    kind: "berita",
    publishedAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: "fallback-lms",
    title: "Platform LMS Online & Pembelajaran Hybrid",
    href: getBeritaKegiatanDetailPath(LMS_BERITA_KEGIATAN_SLUG),
    kind: "berita",
    publishedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "fallback-lab",
    title: "Laboratorium Komputer Siap Praktik Kejuruan",
    href: getBeritaKegiatanDetailPath("laboratorium-komputer-siap-praktik"),
    kind: "berita",
    publishedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "fallback-akreditasi",
    title: "Akreditasi A: Komitmen Mutu Pendidikan",
    href: getBeritaKegiatanDetailPath("akreditasi-a-komitmen-mutu-sekolah"),
    kind: "berita",
    publishedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "fallback-ekskul",
    title: "Ekstrakurikuler & Blogger Club",
    href: getBeritaKegiatanDetailPath("ekstrakurikuler-dan-blogger-club"),
    kind: "berita",
    publishedAt: "2025-12-15T00:00:00.000Z",
  },
] as const;

type ApiListItem = {
  id: string;
  judul: string;
  slug: string;
  publishedAt?: string | null;
};

type ApiListResponse = {
  ok: boolean;
  data: ApiListItem[];
};

function buildStaticPageHits(): PublicSiteSearchHit[] {
  const seen = new Set<string>();
  const hits: PublicSiteSearchHit[] = [];

  const push = (title: string, href: string, kind: PublicSiteSearchHitKind, id: string) => {
    if (seen.has(href)) return;
    seen.add(href);
    hits.push({ id, title, href, kind });
  };

  for (const entry of PUBLIC_SITE_MAIN_NAV) {
    if (entry.type === "link") {
      push(entry.label, entry.href, "halaman", `nav-${entry.href}`);
      continue;
    }
    push(entry.label, entry.items[0]?.href ?? `/${entry.id}`, "halaman", `nav-group-${entry.id}`);
    for (const item of entry.items) {
      push(item.label, item.href, "halaman", `nav-${item.href}`);
    }
  }

  for (const section of PUBLIC_SITE_FOOTER_SECTIONS) {
    for (const link of section.links) {
      push(link.label, link.href, "halaman", `footer-${link.href}`);
    }
  }

  push("PPDB", PUBLIC_SITE_PPDB_HREF, "halaman", "nav-ppdb");

  for (const jurusan of AKADEMIK_JURUSAN_ITEMS) {
    push(jurusan.title, "/akademik/jurusan", "jurusan", `jurusan-${jurusan.id}`);
  }

  return hits;
}

export const PUBLIC_SITE_STATIC_SEARCH_HITS: readonly PublicSiteSearchHit[] =
  buildStaticPageHits();

async function fetchPublishedList(
  path: string,
  limit: number,
): Promise<ApiListItem[]> {
  const qs = new URLSearchParams({
    status: "PUBLISHED",
    page: "1",
    limit: String(limit),
  });
  const url = `${resolvePublicApiV1Base()}/v1/${path}?${qs.toString()}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse;
    if (!json.ok || !Array.isArray(json.data)) return [];
    return json.data;
  } catch {
    return [];
  }
}

function sortByPublishedDesc(a: PublicSiteSearchHit, b: PublicSiteSearchHit): number {
  const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
  const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
  return tb - ta;
}

/**
 * Load latest berita (kegiatan + artikel siswa), merged and sorted.
 * Falls back to static index when the API returns nothing.
 */
export async function loadRecentBeritaSearchHits(
  limit = RECENT_BERITA_LIMIT,
): Promise<PublicSiteSearchHit[]> {
  const [berita, artikel] = await Promise.all([
    fetchPublishedList("berita", limit),
    fetchPublishedList("artikel-siswa", limit),
  ]);

  const hits: PublicSiteSearchHit[] = [
    ...berita.map((item) => ({
      id: `berita-${item.id}`,
      title: item.judul,
      href: getBeritaKegiatanDetailPath(item.slug),
      kind: "berita" as const,
      publishedAt: item.publishedAt,
    })),
    ...artikel.map((item) => ({
      id: `artikel-${item.id}`,
      title: item.judul,
      href: getBeritaSiswaDetailPath(item.slug),
      kind: "berita" as const,
      publishedAt: item.publishedAt,
    })),
  ];

  hits.sort(sortByPublishedDesc);
  const sliced = hits.slice(0, limit);
  if (sliced.length > 0) return sliced;
  return FALLBACK_BERITA_HITS.slice(0, limit);
}

export function filterPublicSiteSearchHits(
  query: string,
  beritaHits: readonly PublicSiteSearchHit[],
  limit = 8,
): PublicSiteSearchHit[] {
  const trimmed = query.trim().toLowerCase();
  const pool = [...beritaHits, ...PUBLIC_SITE_STATIC_SEARCH_HITS];

  if (!trimmed) {
    return beritaHits.slice(0, limit);
  }

  const matched = pool.filter((hit) => hit.title.toLowerCase().includes(trimmed));
  // Prefer berita matches, then keep stable order within kinds.
  matched.sort((a, b) => {
    if (a.kind === "berita" && b.kind !== "berita") return -1;
    if (b.kind === "berita" && a.kind !== "berita") return 1;
    if (a.kind === "berita" && b.kind === "berita") {
      return sortByPublishedDesc(a, b);
    }
    return a.title.localeCompare(b.title, "id");
  });

  const seen = new Set<string>();
  const unique: PublicSiteSearchHit[] = [];
  for (const hit of matched) {
    if (seen.has(hit.href + hit.title)) continue;
    seen.add(hit.href + hit.title);
    unique.push(hit);
    if (unique.length >= limit) break;
  }
  return unique;
}

export function publicSiteSearchKindLabel(kind: PublicSiteSearchHitKind): string {
  switch (kind) {
    case "berita":
      return "Berita";
    case "jurusan":
      return "Jurusan";
    default:
      return "Halaman";
  }
}
