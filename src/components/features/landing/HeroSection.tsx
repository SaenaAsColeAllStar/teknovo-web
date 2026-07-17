import Link from "next/link";
import type { ReactElement } from "react";

import { HeroSlideVideos } from "@/components/features/landing/HeroSlideVideos";
import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  HOME_HERO_CTA_EXPLORE_HREF,
  HOME_HERO_CTA_EXPLORE_LABEL,
  HOME_HERO_CTA_PPDB_LABEL,
  HOME_HERO_EYEBROW,
  HOME_HERO_LEDE,
  HOME_HERO_TITLE,
} from "@/lib/home-landing-content";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";

export function HeroSection(): ReactElement {
  return (
    <MotionInView
      as="section"
      id="beranda"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.14),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]" />
      <div className="public-site-container relative flex flex-col gap-10 py-12 sm:py-14 lg:gap-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="relative z-10 order-2 flex flex-col items-center space-y-6 text-center lg:order-1 lg:items-start lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {HOME_HERO_EYEBROW}
            </p>
            <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:mx-0 lg:text-[2.75rem] lg:leading-[1.1] dark:text-white">
              {HOME_HERO_TITLE}
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0">
              {HOME_HERO_LEDE}
            </p>
            <div className="relative z-10 flex w-full flex-row flex-wrap justify-center gap-3 pt-2 sm:gap-4 lg:justify-start">
              <PpdbCtaLink href={PUBLIC_SITE_PPDB_HREF} label={HOME_HERO_CTA_PPDB_LABEL} />
              <Link
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-500"
                href={HOME_HERO_CTA_EXPLORE_HREF}
              >
                {HOME_HERO_CTA_EXPLORE_LABEL}
              </Link>
            </div>
          </div>
          <div className="relative z-10 order-1 w-full lg:order-2 lg:justify-self-end lg:max-w-xl">
            <HeroSlideVideos />
          </div>
        </div>
      </div>
    </MotionInView>
  );
}
