import type { ReactElement, ReactNode } from "react";

import {
  AkademikFramePlusMarks,
  akademikFrameShellClass,
  akademikSoftPlateClass,
} from "@/components/features/landing/AkademikBlueprintFrame";
import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { AkademikFooterCta } from "@/components/features/landing/AkademikFooterCta";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { AkademikPageShell } from "@/components/features/landing/AkademikPageShell";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
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
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

function FormalParagraph({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}>{children}</p>
  );
}

export function AkademikKurikulumContent(): ReactElement {
  return (
    <AkademikPageShell title={AKADEMIK_KURIKULUM_PAGE_TITLE} lede={AKADEMIK_KURIKULUM_PAGE_LEDE}>
      <MotionInView as="div" className="mt-14 space-y-10" delay={0.06}>
        <header className="max-w-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span
              aria-hidden
              className="inline-flex size-11 shrink-0 items-center justify-center border border-border-default bg-neutral-soft text-brand"
            >
              <AkademikIconGlyph iconKey="kurikulum" className="size-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                {AKADEMIK_KURIKULUM_SECTION_TITLE}
              </h2>
              <p className={cn("mt-2 text-sm leading-relaxed text-body", publicFormalBodyClassName)}>
                {AKADEMIK_KURIKULUM_SECTION_INTRO}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            {AKADEMIK_KURIKULUM_NARRATIVE.map((paragraph) => (
              <FormalParagraph key={paragraph}>{paragraph}</FormalParagraph>
            ))}
          </div>
          <ol className="space-y-0 border border-border-default">
            {AKADEMIK_PATHWAY_STEPS.map((step, idx) => (
              <li
                key={step.tingkat}
                className={cn(
                  "bg-surface p-5 sm:p-6",
                  idx > 0 && "border-t border-border-default",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-heading">{step.tingkat}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                    {step.fase}
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-body">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 bg-brand" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <ul className="grid gap-0 border border-border-default sm:grid-cols-2 lg:grid-cols-4">
          {AKADEMIK_KURIKULUM_PILLARS.map((pillar, idx) => (
            <MotionInView
              as="li"
              key={pillar.id}
              className={cn(
                akademikSoftPlateClass,
                "border-0",
                idx > 0 && "border-t border-border-default sm:border-t-0",
                idx % 2 === 1 && "sm:border-l sm:border-border-default",
                idx >= 2 && "sm:border-t sm:border-border-default",
                idx > 0 && "lg:border-t-0 lg:border-l lg:border-border-default",
              )}
              delay={0.08 + idx * 0.02}
            >
              <h3 className="text-base font-semibold text-heading">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-body">{pillar.description}</p>
            </MotionInView>
          ))}
        </ul>

        <MotionInView
          as="article"
          className={cn(akademikFrameShellClass, "min-h-[16rem] sm:min-h-[18rem]")}
          delay={0.1}
        >
          <AkademikFramePlusMarks />
          <div className="grid h-full md:grid-cols-2">
            <div className="flex flex-col justify-center gap-5 border-b border-border-default p-6 md:border-b-0 md:border-r sm:p-8">
              <AkademikIconGlyph iconKey="digital" className="size-8 text-brand" />
              <h3 className="text-xl font-semibold tracking-tight text-heading">
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
            </div>
            <div
              className={cn(
                "relative min-h-[14rem] md:min-h-full",
                publicOptimizedImageContainerClassName,
              )}
            >
              <PublicOptimizedImage
                src={LANDING_MEDIA.fasilitas.lmsWebp}
                alt="LMS sekolah sebagai ilustrasi kurikulum digital"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                quality={65}
              />
            </div>
          </div>
        </MotionInView>
      </MotionInView>

      <AkademikFooterCta />
    </AkademikPageShell>
  );
}
