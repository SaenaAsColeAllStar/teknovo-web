import type { ReactElement } from "react";

import type {
  ActivitiesShowcaseIconKey,
  ActivitiesShowcaseItem,
} from "@/components/features/landing/home/activities-showcase-types";
import { ActivitiesShowcaseSectionClient } from "@/components/features/landing/home/ActivitiesShowcaseSectionClient";
import { getEkskulPublikCards } from "@/services/kesiswaan-publik";

function trimDescription(text: string, max = 96): string {
  const t = text.trim();
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, max - 1)}…`;
}

type MatrixSeed = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconKey: ActivitiesShowcaseIconKey;
  /** Match `getEkskulPublikCards().slug` to reuse live copy when present. */
  slug?: string;
};

/**
 * Sembilan unit etalase beranda — urutan baca atas→bawah, kiri→kanan.
 * Pad Pramuka / Robotik / Literasi Digital dari media & konten kesiswaan.
 */
const MATRIX_SEEDS: readonly MatrixSeed[] = [
  {
    id: "osis",
    title: "OSIS",
    description: "Kepemimpinan, aspirasi siswa, dan program kerja organisasi.",
    href: "/kesiswaan/ekstrakurikuler#osis",
    iconKey: "osis",
  },
  {
    id: "ekstra-pramuka",
    title: "Pramuka",
    description: "Kedisiplinan, kemandirian, dan pengabdian di lingkungan sekolah.",
    href: "/kesiswaan/ekstrakurikuler#ekstra-pramuka",
    iconKey: "pramuka",
    slug: "pramuka",
  },
  {
    id: "ekstra-paskibra",
    title: "Paskibraka",
    description: "Baris-berbaris, kepemimpinan, dan kedisiplinan upacara.",
    href: "/kesiswaan/ekstrakurikuler#ekstra-paskibra",
    iconKey: "paskibra",
    slug: "paskibra",
  },
  {
    id: "ekstra-futsal",
    title: "Futsal",
    description: "Pembinaan fisik, sportivitas, dan kompetisi antar sekolah.",
    href: "/kesiswaan/ekstrakurikuler#ekstra-futsal",
    iconKey: "futsal",
    slug: "futsal",
  },
  {
    id: "ekstra-pencaksilat",
    title: "Pencak Silat",
    description: "Seni bela diri nusantara dan penguatan mental siswa.",
    href: "/kesiswaan/ekstrakurikuler#ekstra-pencaksilat",
    iconKey: "pencaksilat",
    slug: "pencaksilat",
  },
  {
    id: "ekstra-blogger",
    title: "Blogger Club",
    description: "Literasi digital, penulisan berita, dan etika publikasi.",
    href: "/kesiswaan/ekstrakurikuler#ekstra-blogger",
    iconKey: "blogger",
    slug: "blogger",
  },
  {
    id: "ekstra-codingclub",
    title: "Coding Club",
    description: "Pemrograman, web, dan proyek teknologi siswa.",
    href: "/kesiswaan/ekstrakurikuler#ekstra-codingclub",
    iconKey: "coding",
    slug: "codingclub",
  },
  {
    id: "ekstra-robotik",
    title: "Robotik",
    description: "Eksplorasi robotika, otomasi, dan kompetisi STEM siswa.",
    href: "/kesiswaan/ekstrakurikuler",
    iconKey: "robotik",
  },
  {
    id: "ekstra-literasi",
    title: "Literasi Digital",
    description: "Etika daring, konten bertanggung jawab, dan karakter digital.",
    href: "/kesiswaan/ekstrakurikuler",
    iconKey: "literasi",
  },
] as const;

/**
 * Etalase program beranda — matriks 3×3 program & ekstrakurikuler.
 */
export async function ActivitiesShowcaseSection(): Promise<ReactElement> {
  const ekskulCards = await getEkskulPublikCards();
  const bySlug = new Map(ekskulCards.map((c) => [c.slug, c]));

  const items: ActivitiesShowcaseItem[] = MATRIX_SEEDS.map((seed) => {
    const live = seed.slug ? bySlug.get(seed.slug) : undefined;
    return {
      id: seed.id,
      title: seed.title,
      description: trimDescription(live?.detail ?? seed.description),
      href: seed.href,
      iconKey: seed.iconKey,
    };
  });

  return <ActivitiesShowcaseSectionClient items={items} />;
}
