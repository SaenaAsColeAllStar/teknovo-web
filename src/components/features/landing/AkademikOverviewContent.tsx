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

export function AkademikOverviewContent(): ReactElement {
  return (
    <AkademikPageShell title={AKADEMIK_PAGE_TITLE} lede={AKADEMIK_PAGE_LEDE} featuredFeedKey="ringkasan">
      <ul className="mt-14 grid gap-0 border border-border-default sm:grid-cols-2">
        {AKADEMIK_OVERVIEW_TEASERS.map((teaser, idx) => (
          <MotionInView
            as="li"
            key={teaser.href}
            className={cn(
              "border-border-default bg-surface",
              idx > 0 && "border-t sm:border-t-0",
              idx % 2 === 1 && "sm:border-l",
              idx >= 2 && "sm:border-t",
            )}
            delay={0.06 + idx * 0.02}
          >
            <Link
              href={teaser.href}
              className="group flex h-full flex-col gap-4 p-6 transition hover:bg-neutral-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:p-7"
            >
              <span
                aria-hidden
                className="inline-flex size-11 items-center justify-center border border-border-default bg-neutral-soft text-brand"
              >
                <AkademikIconGlyph iconKey={teaser.iconKey} className="size-6" />
              </span>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-heading group-hover:text-brand">
                  {teaser.title}
                </h2>
                <p className="text-sm leading-relaxed text-body">{teaser.description}</p>
              </div>
              <span className="mt-auto text-sm font-semibold text-brand">{teaser.linkLabel} →</span>
            </Link>
          </MotionInView>
        ))}
      </ul>

      <AkademikFooterCta />
    </AkademikPageShell>
  );
}
