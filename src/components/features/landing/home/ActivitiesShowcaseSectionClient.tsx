"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  Code2,
  Compass,
  Flag,
  Newspaper,
  Swords,
  Target,
  UsersRound,
} from "lucide-react";
import type { ReactElement } from "react";

import type {
  ActivitiesShowcaseIconKey,
  ActivitiesShowcaseItem,
} from "@/components/features/landing/home/activities-showcase-types";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import { EKSTRA_PAGE_LEDE } from "@/lib/ekstrakurikuler-landing-content";
import { cn } from "@/lib/utils";

const ICONS: Record<ActivitiesShowcaseIconKey, LucideIcon> = {
  osis: UsersRound,
  pramuka: Compass,
  paskibra: Flag,
  futsal: Target,
  pencaksilat: Swords,
  blogger: Newspaper,
  coding: Code2,
  robotik: Bot,
  literasi: BookOpen,
};

function MatrixCell({
  item,
  index,
  total,
}: {
  item: ActivitiesShowcaseItem;
  index: number;
  total: number;
}): ReactElement {
  const Icon = ICONS[item.iconKey];
  const isLast = index === total - 1;
  const isNotLastCol = index % 3 !== 2;
  const isNotLastRow = index < 6;

  return (
    <MotionInView
      as="li"
      id={item.id}
      delay={0.04 * index}
      className={cn(
        "flex flex-col items-center px-4 py-8 text-center sm:px-5 sm:py-10",
        !isLast && "border-b border-border-default",
        "sm:border-b-0",
        isNotLastRow && "sm:border-b sm:border-border-default",
        isNotLastCol && "sm:border-r sm:border-border-default",
      )}
    >
      <span
        className="flex size-11 items-center justify-center rounded-full border border-border-default bg-surface text-brand"
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <PublicSiteLink
        href={item.href}
        className="mt-4 text-base font-bold tracking-tight text-heading transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
      >
        {item.title}
      </PublicSiteLink>
      <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-body">{item.description}</p>
    </MotionInView>
  );
}

export type ActivitiesShowcaseSectionClientProps = {
  items: ActivitiesShowcaseItem[];
};

export function ActivitiesShowcaseSectionClient({
  items,
}: ActivitiesShowcaseSectionClientProps): ReactElement {
  return (
    <section
      id="program-ekstrakurikuler"
      aria-labelledby="program-ekstrakurikuler-heading"
      className="scroll-mt-20 border-b border-border-default bg-surface py-14 sm:py-16 lg:py-20"
    >
      <div className="public-site-container">
        <MotionInView as="header" className="mx-auto max-w-2xl text-center">
          <h2
            id="program-ekstrakurikuler-heading"
            className="text-3xl font-bold tracking-tight text-heading sm:text-4xl"
          >
            Program & Ekstrakurikuler
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            {EKSTRA_PAGE_LEDE[0]}
          </p>
        </MotionInView>

        <MotionInView
          as="div"
          className="mt-10 rounded-2xl border border-border-default p-3 sm:mt-12 sm:p-4"
          delay={0.06}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-3">
            {items.map((item, index) => (
              <MatrixCell key={item.id} item={item} index={index} total={items.length} />
            ))}
          </ul>
        </MotionInView>
      </div>
    </section>
  );
}
