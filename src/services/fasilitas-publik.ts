import type { Fasilitas, FasilitasListItem } from "@teknovo/shared";
import {
  fetchFasilitasBySlugOrNull,
  fetchFasilitasListOrNull,
} from "@/lib/api-client";
import {
  FASILITAS_ITEMS,
  FASILITAS_SLUGS,
  type FasilitasLandingItem,
  type FasilitasSlug,
  getFasilitasItem as getHardcodedFasilitasItem,
} from "@/lib/fasilitas-landing-content";

function apiToLanding(item: Fasilitas): FasilitasLandingItem {
  return {
    slug: item.slug as FasilitasSlug,
    title: item.title,
    description: item.description,
    coverSrc: item.coverUrl ?? "",
    highlights: item.highlights,
    paragraphs: item.paragraphs,
    features: item.extras.features,
    hours: item.extras.hours,
    services: item.extras.services,
    stats: item.extras.stats,
    pathwaySteps: item.extras.pathwaySteps,
    quote: item.extras.quote,
    splitNarrative: item.extras.splitNarrative,
  };
}

function listToLanding(item: FasilitasListItem): FasilitasLandingItem {
  const hardcoded = getHardcodedFasilitasItem(item.slug as FasilitasSlug);
  return {
    slug: item.slug as FasilitasSlug,
    title: item.title,
    description: item.description,
    coverSrc: item.coverUrl ?? hardcoded?.coverSrc ?? "",
    highlights: hardcoded?.highlights ?? [],
    paragraphs: hardcoded?.paragraphs ?? [],
    features: hardcoded?.features,
    hours: hardcoded?.hours,
    services: hardcoded?.services,
    stats: hardcoded?.stats,
    pathwaySteps: hardcoded?.pathwaySteps,
    quote: hardcoded?.quote,
    splitNarrative: hardcoded?.splitNarrative,
  };
}

/** Published fasilitas from API, with hardcoded fallback (berita pattern). */
export async function getPublishedFasilitasItems(): Promise<
  FasilitasLandingItem[]
> {
  const fromApi = await fetchFasilitasListOrNull({
    status: "PUBLISHED",
    limit: 50,
  });
  if (fromApi === null || fromApi.length === 0) {
    return [...FASILITAS_ITEMS];
  }
  return fromApi.map(listToLanding);
}

export async function getPublishedFasilitasSlugs(): Promise<string[]> {
  const items = await getPublishedFasilitasItems();
  const slugs = items.map((i) => i.slug);
  return slugs.length > 0 ? slugs : [...FASILITAS_SLUGS];
}

export async function getPublishedFasilitasBySlug(
  slug: string,
): Promise<FasilitasLandingItem | null> {
  const fromApi = await fetchFasilitasBySlugOrNull(slug);
  if (fromApi === undefined) {
    return getHardcodedFasilitasItem(slug as FasilitasSlug) ?? null;
  }
  if (fromApi === null) {
    return getHardcodedFasilitasItem(slug as FasilitasSlug) ?? null;
  }
  return apiToLanding(fromApi);
}

export type FasilitasNavLeaf = {
  label: string;
  href: string;
};

/** Navbar fasilitas children: ringkasan + published showInNav items. */
export async function getFasilitasNavLeaves(): Promise<FasilitasNavLeaf[]> {
  const fromApi = await fetchFasilitasListOrNull({
    status: "PUBLISHED",
    limit: 50,
  });
  if (fromApi === null || fromApi.length === 0) {
    return [
      { label: "Ringkasan Fasilitas", href: "/fasilitas" },
      { label: "Absensi Digital", href: "/fasilitas/absensi-digital" },
      { label: "Lab Komputer", href: "/fasilitas/laboratorium-komputer" },
      { label: "Perpustakaan Digital", href: "/fasilitas/perpustakaan-digital" },
      { label: "LMS Sekolah", href: "/fasilitas/lms-sekolah" },
    ];
  }
  return [
    { label: "Ringkasan Fasilitas", href: "/fasilitas" },
    ...fromApi
      .filter((i) => i.showInNav)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => ({
        label: i.navLabel || i.title,
        href: `/fasilitas/${i.slug}`,
      })),
  ];
}
