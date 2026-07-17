"use client";

import type { ReactElement } from "react";

import type { ActivitiesShowcaseItem } from "@/components/features/landing/home/activities-showcase-types";
import { EkstrakurikulerIconGlyph } from "@/components/features/landing/kesiswaan/EkstrakurikulerIconGlyph";
import { PublicFeatureGridCard } from "@/components/features/landing/PublicFeatureGridCard";
import { MotionInView } from "@/components/motion/MotionInView";
import { EKSTRA_KATEGORI_LABELS } from "@/lib/ekstrakurikuler-landing-content";
import type { EkskulPublikKategori } from "@/services/kesiswaan-publik";
import { cn } from "@/lib/utils";

const kategoriBadgeClass: Record<EkskulPublikKategori, string> = {
  TEKNOLOGI:
    "border-blue-200/80 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200",
  OLAHRAGA:
    "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200",
  AKADEMIK:
    "border-amber-200/80 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200",
  SENI: "border-violet-200/80 bg-violet-50 text-violet-800 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-200",
};

function ShowcaseCard({ item, priority }: { item: ActivitiesShowcaseItem; priority?: boolean }): ReactElement {
  const isOsis = item.id === "osis";

  return (
    <PublicFeatureGridCard
      title={item.title}
      description={item.description}
      coverSrc={item.coverSrc}
      coverAlt={item.title}
      href={item.href}
      linkLabel="Selengkapnya"
      priority={priority}
      featured={item.highlight}
      icon={isOsis ? <EkstrakurikulerIconGlyph iconKey="osis" className="size-5" /> : undefined}
      imageOverlay={
        item.kategori && !isOsis ? (
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
              kategoriBadgeClass[item.kategori],
            )}
          >
            {EKSTRA_KATEGORI_LABELS[item.kategori]}
          </span>
        ) : undefined
      }
    />
  );
}

export type ActivitiesShowcaseSectionClientProps = {
  items: ActivitiesShowcaseItem[];
};

export function ActivitiesShowcaseSectionClient({
  items,
}: ActivitiesShowcaseSectionClientProps): ReactElement {
  return (
    <section id="program-ekstrakurikuler" className="bg-white py-14 dark:bg-slate-950 sm:py-16">
      <MotionInView as="div" className="public-site-container">
        <MotionInView as="header" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Program & Ekstrakurikuler
          </h2>
        </MotionInView>

        <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2">
          {items.map((item, idx) => (
            <MotionInView
              as="li"
              key={item.id}
              id={item.id}
              className={cn(item.highlight && "lg:col-span-2")}
              delay={0.06 * idx}
            >
              <ShowcaseCard item={item} priority={idx === 0} />
            </MotionInView>
          ))}
        </ul>
      </MotionInView>
    </section>
  );
}
