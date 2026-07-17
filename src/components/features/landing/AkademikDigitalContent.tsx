import type { ReactElement, ReactNode } from "react";

import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { AkademikFooterCta } from "@/components/features/landing/AkademikFooterCta";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { AkademikPageShell } from "@/components/features/landing/AkademikPageShell";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  AKADEMIK_DIGITAL_ITEMS,
  AKADEMIK_DIGITAL_PAGE_LEDE,
  AKADEMIK_DIGITAL_PAGE_TITLE,
  AKADEMIK_DIGITAL_SECTION_INTRO,
  AKADEMIK_DIGITAL_SECTION_TITLE,
} from "@/lib/akademik-landing-content";
import { publicFormalBodyClassName, publicSectionTitleClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

function FormalParagraph({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
      {children}
    </p>
  );
}

export function AkademikDigitalContent(): ReactElement {
  return (
    <AkademikPageShell title={AKADEMIK_DIGITAL_PAGE_TITLE} lede={AKADEMIK_DIGITAL_PAGE_LEDE}>
      <MotionInView as="div" className="mt-14 space-y-8" delay={0.06}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span
            aria-hidden
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
          >
            <AkademikIconGlyph iconKey="digital" className="size-6" />
          </span>
          <div className="min-w-0">
            <h2 className={publicSectionTitleClassName}>{AKADEMIK_DIGITAL_SECTION_TITLE}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{AKADEMIK_DIGITAL_SECTION_INTRO}</p>
          </div>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {AKADEMIK_DIGITAL_ITEMS.map((item, idx) => (
            <MotionInView
              as="li"
              key={item.id}
              className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8"
              delay={0.08 + idx * 0.02}
            >
              <AkademikIconGlyph iconKey="digital" className="size-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <FormalParagraph>{item.description}</FormalParagraph>
              <AkademikLearnMoreLink href={item.href} className="mt-auto">
                {item.hrefLabel}
              </AkademikLearnMoreLink>
            </MotionInView>
          ))}
        </ul>
      </MotionInView>

      <AkademikFooterCta />
    </AkademikPageShell>
  );
}
