import type { ReactElement, ReactNode } from "react";

import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { AkademikFooterCta } from "@/components/features/landing/AkademikFooterCta";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { AkademikPageShell } from "@/components/features/landing/AkademikPageShell";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import {
  AKADEMIK_DIGITAL_SPLIT_PARAGRAPHS,
  AKADEMIK_DIGITAL_SPLIT_TITLE,
  AKADEMIK_KURIKULUM_CTA,
  AKADEMIK_KURIKULUM_NARRATIVE,
  AKADEMIK_KURIKULUM_PAGE_LEDE,
  AKADEMIK_KURIKULUM_PAGE_TITLE,
  AKADEMIK_KURIKULUM_PILLARS,
  AKADEMIK_KURIKULUM_SECTION_INTRO,
  AKADEMIK_KURIKULUM_SECTION_TITLE,
  AKADEMIK_PATHWAY_STEPS,
} from "@/lib/akademik-landing-content";
import { MotionInView } from "@/components/motion/MotionInView";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { publicFormalBodyClassName, publicSectionTitleClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

const cardShellClass = publicSplitCardShellClassName;

const pillarCardClass =
  "flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-blue-50 p-6 shadow-sm dark:border-slate-800 dark:bg-blue-950/35 sm:p-7";

function FormalParagraph({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
      {children}
    </p>
  );
}

function SectionHeader({
  title,
  intro,
}: {
  title: string;
  intro: string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
      <span
        aria-hidden
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
      >
        <AkademikIconGlyph iconKey="kurikulum" className="size-6" />
      </span>
      <div className="min-w-0">
        <h2 className={publicSectionTitleClassName}>{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{intro}</p>
      </div>
    </div>
  );
}

export function AkademikKurikulumContent(): ReactElement {
  return (
    <AkademikPageShell title={AKADEMIK_KURIKULUM_PAGE_TITLE} lede={AKADEMIK_KURIKULUM_PAGE_LEDE}>
      <MotionInView as="div" className="mt-14 space-y-10" delay={0.06}>
        <SectionHeader title={AKADEMIK_KURIKULUM_SECTION_TITLE} intro={AKADEMIK_KURIKULUM_SECTION_INTRO} />

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            {AKADEMIK_KURIKULUM_NARRATIVE.map((paragraph) => (
              <FormalParagraph key={paragraph}>{paragraph}</FormalParagraph>
            ))}
          </div>
          <ol className="space-y-4">
            {AKADEMIK_PATHWAY_STEPS.map((step) => (
              <li
                key={step.tingkat}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{step.tingkat}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                    {step.fase}
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AKADEMIK_KURIKULUM_PILLARS.map((pillar, idx) => (
            <MotionInView as="li" key={pillar.id} className={pillarCardClass} delay={0.08 + idx * 0.02}>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{pillar.description}</p>
            </MotionInView>
          ))}
        </ul>

        <MotionInView as="article" className={cn(cardShellClass, "min-h-[16rem] sm:min-h-[18rem]")} delay={0.1}>
          <PublicSplitContentCard
            tone="plain"
            image={{
              src: LANDING_MEDIA.fasilitas.lmsWebp,
              alt: "LMS sekolah sebagai ilustrasi kurikulum digital",
              quality: 65,
            }}
          >
            <AkademikIconGlyph iconKey="digital" className="size-8 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {AKADEMIK_DIGITAL_SPLIT_TITLE}
            </h3>
            <div className="space-y-4">
              {AKADEMIK_DIGITAL_SPLIT_PARAGRAPHS.map((paragraph) => (
                <FormalParagraph key={paragraph}>{paragraph}</FormalParagraph>
              ))}
            </div>
            <AkademikLearnMoreLink href={AKADEMIK_KURIKULUM_CTA.href}>
              {AKADEMIK_KURIKULUM_CTA.label}
            </AkademikLearnMoreLink>
          </PublicSplitContentCard>
        </MotionInView>
      </MotionInView>

      <AkademikFooterCta />
    </AkademikPageShell>
  );
}
