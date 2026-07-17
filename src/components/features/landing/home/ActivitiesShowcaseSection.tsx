import type { ReactElement } from "react";

import type { ActivitiesShowcaseItem } from "@/components/features/landing/home/activities-showcase-types";
import { ActivitiesShowcaseSectionClient } from "@/components/features/landing/home/ActivitiesShowcaseSectionClient";
import { resolveEkstrakurikulerCoverSrc, resolveOsisCoverSrc } from "@/lib/ekstrakurikuler-media";
import { getEkskulPublikCards } from "@/services/kesiswaan-publik";

function trimDescription(text: string, max = 140): string {
  const t = text.trim();
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, max - 1)}…`;
}

/**
 * Etalase program beranda — OSIS + hingga lima unit ekskul aktif dari database.
 */
export async function ActivitiesShowcaseSection(): Promise<ReactElement> {
  const ekskulCards = await getEkskulPublikCards();
  const tanpaOsis = ekskulCards.filter((c) => !/\bosis\b/i.test(c.name)).slice(0, 5);

  const items: ActivitiesShowcaseItem[] = [
    {
      id: "osis",
      title: "OSIS",
      description: "Kegiatan kepemimpinan dan pengembangan organisasi siswa.",
      href: "/kesiswaan/ekstrakurikuler#osis",
      coverSrc: resolveOsisCoverSrc(),
      highlight: true,
    },
    ...tanpaOsis.map((c) => ({
      id: `ekstra-${c.slug}`,
      title: c.name,
      description: trimDescription(c.detail),
      href: `/kesiswaan/ekstrakurikuler#ekstra-${c.slug}`,
      coverSrc: resolveEkstrakurikulerCoverSrc(c.slug),
      kategori: c.kategori,
    })),
  ];

  return <ActivitiesShowcaseSectionClient items={items} />;
}
