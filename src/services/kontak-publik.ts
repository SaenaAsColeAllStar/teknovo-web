import type { Kontak } from "@teknovo/shared";

import {
  fetchKontakBySlugOrNull,
  fetchKontakListPublishedOrNull,
} from "@/lib/api-client";

/**
 * Published kontak with full detail (maps, jam, media).
 * List is summary-only; hydrate each row via public slug GET.
 * Empty / unreachable → [] (no hardcoded fallback inventory).
 */
export async function getPublishedKontakItems(): Promise<Kontak[]> {
  const list = await fetchKontakListPublishedOrNull({ limit: 50 });
  if (list === null || list.length === 0) return [];

  const sorted = [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  const full = await Promise.all(
    sorted.map((item) => fetchKontakBySlugOrNull(item.slug)),
  );

  return full.filter((row): row is Kontak => row != null);
}

/** Primary location for map / form — first by sortOrder, or null. */
export async function getPrimaryPublishedKontak(): Promise<Kontak | null> {
  const items = await getPublishedKontakItems();
  return items[0] ?? null;
}
