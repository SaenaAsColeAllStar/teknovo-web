import type { Fasilitas, FasilitasListItem } from "@teknovo/shared";
import {
  fetchFasilitasBySlugOrNull,
  fetchFasilitasListOrNull,
} from "@/lib/api-client";
import {
  type FasilitasLandingItem,
  type FasilitasSlug,
  getFasilitasItem as getHardcodedFasilitasItem,
} from "@/lib/fasilitas-landing-content";

function apiToLanding(item: Fasilitas): FasilitasLandingItem {
  const layout = item.layoutConfig;
  return {
    slug: item.slug as FasilitasSlug,
    title: item.title,
    description: item.description,
    coverSrc: item.coverUrl ?? "",
    highlights: item.highlights,
    paragraphs: item.paragraphs,
    features: layout?.showFeatures === false ? undefined : item.extras.features,
    hours: layout?.showHours === false ? undefined : item.extras.hours,
    services: item.extras.services,
    stats: layout?.showStats ? item.extras.stats : undefined,
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

/** Published fasilitas from API. Empty / unreachable / 429 → [] (no mock inventory). */
export async function getPublishedFasilitasItems(): Promise<
  FasilitasLandingItem[]
> {
  const fromApi = await fetchFasilitasListOrNull({
    status: "PUBLISHED",
    limit: 50,
  });
  if (fromApi === null || fromApi.length === 0) return [];
  return fromApi.map(listToLanding);
}

export async function getPublishedFasilitasSlugs(): Promise<string[]> {
  const items = await getPublishedFasilitasItems();
  return items.map((i) => i.slug);
}

export async function getPublishedFasilitasBySlug(
  slug: string,
): Promise<FasilitasLandingItem | null> {
  const fromApi = await fetchFasilitasBySlugOrNull(slug);
  if (fromApi === undefined || fromApi === null) return null;
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
    return [{ label: "Ringkasan Fasilitas", href: "/fasilitas" }];
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
