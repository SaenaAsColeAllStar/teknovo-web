import Link from "next/link";
import type { ReactElement } from "react";

import { AkademikFooterCta } from "@/components/features/landing/AkademikFooterCta";
import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { AkademikPageShell } from "@/components/features/landing/AkademikPageShell";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  AKADEMIK_OVERVIEW_TEASERS,
  AKADEMIK_PAGE_LEDE,
  AKADEMIK_PAGE_TITLE,
} from "@/lib/akademik-landing-content";
import { cn } from "@/lib/utils";

const teaserCardClass =
  "group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800/60 sm:p-7";

export function AkademikOverviewContent(): ReactElement {
  return (
    <AkademikPageShell title={AKADEMIK_PAGE_TITLE} lede={AKADEMIK_PAGE_LEDE} showPathwayHero>
      <ul className="mt-14 grid gap-4 sm:grid-cols-2">
        {AKADEMIK_OVERVIEW_TEASERS.map((teaser, idx) => (
          <MotionInView as="li" key={teaser.href} delay={0.06 + idx * 0.02}>
            <Link href={teaser.href} className={cn(teaserCardClass, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40")}>
              <span
                aria-hidden
                className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              >
                <AkademikIconGlyph iconKey={teaser.iconKey} className="size-6" />
              </span>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                  {teaser.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{teaser.description}</p>
              </div>
              <span className="mt-auto text-sm font-semibold text-blue-600 dark:text-blue-400">{teaser.linkLabel} →</span>
            </Link>
          </MotionInView>
        ))}
      </ul>

      <AkademikFooterCta />
    </AkademikPageShell>
  );
}
