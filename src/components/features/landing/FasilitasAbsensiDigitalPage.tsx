import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { FasilitasIconGlyph } from "@/components/features/landing/FasilitasIconGlyph";
import { FasilitasPageShell } from "@/components/features/landing/FasilitasPageShell";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import {
  ABSENSI_AUDIENCE_CARDS,
  ABSENSI_AUDIENCE_SECTION_INTRO,
  ABSENSI_AUDIENCE_SECTION_TITLE,
  ABSENSI_FAQ_ITEMS,
  ABSENSI_FAQ_SECTION_TITLE,
  ABSENSI_INTEGRATION_ITEMS,
  ABSENSI_INTEGRATION_SECTION_INTRO,
  ABSENSI_INTEGRATION_SECTION_TITLE,
  ABSENSI_WORKFLOW_SECTION_INTRO,
  ABSENSI_WORKFLOW_SECTION_TITLE,
  ABSENSI_WORKFLOW_STEPS,
} from "@/lib/fasilitas-absensi-content";
import {
  FASILITAS_FOOTER_CTA_BODY,
  FASILITAS_FOOTER_CTA_KONTAK_HREF,
  FASILITAS_FOOTER_CTA_PPDB_HREF,
  FASILITAS_FOOTER_CTA_TITLE,
  getFasilitasDetailPath,
  getFasilitasItem,
  getRelatedFasilitasItems,
} from "@/lib/fasilitas-landing-content";
import {
  publicFormalBodyClassName,
  publicSectionIntroClassName,
  publicSectionTitleClassName,
} from "@/lib/public-section-styles";
import { getFasilitasAbsensiPublikStats } from "@/services/fasilitas-publik-stats";
import { cn } from "@/lib/utils";

const cardShellClass = publicSplitCardShellClassName;

const pillarCardClass =
  "flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-blue-50 p-6 shadow-sm dark:border-slate-800 dark:bg-blue-950/35 sm:p-7";

const relatedTileClass =
  "group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800/60";

const faqDetailsClass = cn(
  cardShellClass,
  "group p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden",
);

function FormalParagraph({ children }: { children: string }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
      {children}
    </p>
  );
}

function WorkflowStepBadge({ index }: { index: number }): ReactElement {
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold tabular-nums text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
    >
      {index}
    </span>
  );
}

export async function FasilitasAbsensiDigitalPage(): Promise<ReactElement> {
  const item = getFasilitasItem("absensi-digital");
  if (!item) {
    notFound();
  }

  const [stats, related] = await Promise.all([
    getFasilitasAbsensiPublikStats(),
    Promise.resolve(getRelatedFasilitasItems("absensi-digital")),
  ]);

  const features = item.features ?? [];

  return (
    <FasilitasPageShell eyebrow="Fasilitas TEKNOVO" title={item.title} lede={item.description}>
      <div className="space-y-14 sm:space-y-16">
        <MotionInView as="article" className={cn(cardShellClass, "mt-10 min-h-[18rem] sm:min-h-[22rem]")} delay={0.04}>
          <PublicSplitContentCard
            tone="accent"
            columnsAt="lg"
            textPanelClassName="lg:p-10"
            image={{
              src: item.coverSrc,
              alt: item.title,
              quality: 70,
              priority: true,
            }}
          >
            <FasilitasIconGlyph iconKey="absensi-digital" className="size-9 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Kehadiran terpadu
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Dari tap masuk hingga portal orang tua
            </h2>
            <ul className="flex flex-wrap gap-2">
              {item.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full border border-blue-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-blue-900 dark:border-blue-500/30 dark:bg-slate-950/50 dark:text-blue-100"
                >
                  {highlight}
                </li>
              ))}
            </ul>
            <FormalParagraph>{item.paragraphs[0] ?? item.description}</FormalParagraph>
            <AkademikLearnMoreLink href="/fasilitas">Kembali ke ringkasan</AkademikLearnMoreLink>
          </PublicSplitContentCard>
        </MotionInView>

        <MotionInView as="section" delay={0.06} aria-labelledby="absensi-stats">
          <h2 id="absensi-stats" className="sr-only">
            Ringkasan kapasitas sistem
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {stats.cells.map((cell, idx) => (
              <MotionInView
                as="li"
                key={cell.label}
                className={cn(cardShellClass, "px-5 py-6 text-center sm:px-6")}
                delay={0.07 + idx * 0.02}
              >
                <p className="text-3xl font-bold tabular-nums tracking-tight text-blue-700 dark:text-blue-300">
                  {cell.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{cell.label}</p>
                {cell.hint ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{cell.hint}</p>
                ) : null}
              </MotionInView>
            ))}
          </ul>
          {!stats.fromDatabase ? (
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Angka ilustrasi kapasitas sistem; data operasional diperbarui saat tahun ajaran berjalan.
            </p>
          ) : null}
        </MotionInView>

        <MotionInView as="section" delay={0.08} aria-labelledby="absensi-alur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="absensi-alur" className={publicSectionTitleClassName}>
                {ABSENSI_WORKFLOW_SECTION_TITLE}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {ABSENSI_WORKFLOW_SECTION_INTRO}
              </p>
            </div>
            <div className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 sm:ml-6 sm:block" />
          </div>
          <ol className="mt-8 grid gap-4 lg:grid-cols-4">
            {ABSENSI_WORKFLOW_STEPS.map((step, idx) => (
              <MotionInView
                as="li"
                key={step.id}
                className={cn(cardShellClass, "flex h-full flex-col gap-4 p-5 sm:p-6")}
                delay={0.09 + idx * 0.02}
              >
                <div className="flex items-center gap-3">
                  <WorkflowStepBadge index={idx + 1} />
                  {idx < ABSENSI_WORKFLOW_STEPS.length - 1 ? (
                    <span
                      className="hidden h-px flex-1 bg-blue-200 dark:bg-blue-800/60 lg:block"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <FormalParagraph>{step.description}</FormalParagraph>
                </div>
              </MotionInView>
            ))}
          </ol>
        </MotionInView>

        <MotionInView as="div" className="space-y-6" delay={0.1}>
          {item.paragraphs.slice(1).map((paragraph) => (
            <FormalParagraph key={paragraph}>{paragraph}</FormalParagraph>
          ))}
        </MotionInView>

        {features.length > 0 ? (
          <MotionInView as="section" className="space-y-8" delay={0.11} aria-labelledby="absensi-fitur">
            <div>
              <h2 id="absensi-fitur" className={publicSectionTitleClassName}>
                Keunggulan utama
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Pilar absensi digital yang mendukung kedisiplinan, pembelajaran, dan transparansi ke sekolah.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {features.map((feature, idx) => (
                <MotionInView as="li" key={feature.id} className={pillarCardClass} delay={0.12 + idx * 0.02}>
                  <FasilitasIconGlyph iconKey="absensi-digital" className="size-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feature.description}</p>
                </MotionInView>
              ))}
            </ul>
          </MotionInView>
        ) : null}

        <MotionInView as="section" delay={0.13} aria-labelledby="absensi-audience">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="absensi-audience" className={publicSectionTitleClassName}>
                {ABSENSI_AUDIENCE_SECTION_TITLE}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {ABSENSI_AUDIENCE_SECTION_INTRO}
              </p>
            </div>
            <div className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 sm:ml-6 sm:block" />
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABSENSI_AUDIENCE_CARDS.map((card, idx) => (
              <MotionInView as="li" key={card.id} className={pillarCardClass} delay={0.14 + idx * 0.02}>
                <FasilitasIconGlyph iconKey={card.iconKey} className="size-7 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{card.audience}</h3>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{card.summary}</p>
                <ul className="mt-1 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {card.items.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </MotionInView>
            ))}
          </ul>
        </MotionInView>

        <MotionInView as="section" delay={0.15} aria-labelledby="absensi-integrasi">
          <div className={cn(cardShellClass, "p-6 sm:p-8")}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <FasilitasIconGlyph iconKey="lms-sekolah" className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="absensi-integrasi" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {ABSENSI_INTEGRATION_SECTION_TITLE}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{ABSENSI_INTEGRATION_SECTION_INTRO}</p>
                <ul className="mt-6 space-y-3">
                  {ABSENSI_INTEGRATION_ITEMS.map((line) => (
                    <li key={line} className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-sm bg-blue-600 ring-4 ring-blue-50 dark:bg-blue-500 dark:ring-blue-950/40"
                        aria-hidden
                      />
                      <span className={publicFormalBodyClassName}>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </MotionInView>

        {item.hours && item.hours.length > 0 ? (
          <MotionInView as="section" delay={0.16} aria-labelledby="absensi-jam">
            <div className={cn(cardShellClass, "p-6 sm:p-8")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  <FasilitasIconGlyph iconKey="hours" className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id="absensi-jam" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Jam operasional
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Jadwal mengikuti kalender sekolah; dapat disesuaikan saat ujian, study tour, atau libur nasional.
                  </p>
                  <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                    {item.hours.map((row) => (
                      <div
                        key={row.label}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50"
                      >
                        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          {row.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </MotionInView>
        ) : null}

        {item.services && item.services.length > 0 ? (
          <MotionInView as="section" className="space-y-6" delay={0.17} aria-labelledby="absensi-layanan">
            <h2 id="absensi-layanan" className={publicSectionTitleClassName}>
              Dua jalur pencatatan
            </h2>
            <ul className="grid gap-5 lg:grid-cols-2">
              {item.services.map((band) => (
                <li key={band.audience} className={pillarCardClass}>
                  <div className="flex items-center gap-3">
                    <FasilitasIconGlyph iconKey="service" className="size-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{band.audience}</h3>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {band.items.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </MotionInView>
        ) : null}

        <MotionInView as="section" className="space-y-5" delay={0.18} aria-labelledby="absensi-faq">
          <h2 id="absensi-faq" className={publicSectionTitleClassName}>
            {ABSENSI_FAQ_SECTION_TITLE}
          </h2>
          <div className="space-y-3">
            {ABSENSI_FAQ_ITEMS.map((faq, idx) => (
              <MotionInView as="div" key={faq.id} delay={0.19 + idx * 0.02}>
                <details className={faqDetailsClass}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    {faq.question}
                    <span className="text-blue-600 transition group-open:rotate-45 dark:text-blue-400" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className={cn("mt-4 text-sm text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                    {faq.answer}
                  </p>
                </details>
              </MotionInView>
            ))}
          </div>
        </MotionInView>

        <MotionInView as="section" className="space-y-6" delay={0.2} aria-labelledby="absensi-lainnya">
          <h2 id="absensi-lainnya" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Fasilitas lainnya
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {related.map((relatedItem) => (
              <li key={relatedItem.slug}>
                <Link href={getFasilitasDetailPath(relatedItem.slug)} className={relatedTileClass}>
                  <div className={cn("relative min-h-[8rem]", publicOptimizedImageContainerClassName)}>
                    <PublicOptimizedImage
                      src={relatedItem.coverSrc}
                      alt={relatedItem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/25" aria-hidden />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{relatedItem.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{relatedItem.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </MotionInView>

        <MotionInView
          as="section"
          className="rounded-2xl border border-blue-200/80 bg-blue-50 px-6 py-8 text-center dark:border-blue-800/50 dark:bg-blue-950/35 sm:px-10"
          delay={0.22}
        >
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{FASILITAS_FOOTER_CTA_TITLE}</h2>
          <p className={cn("mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300", publicSectionIntroClassName)}>
            {FASILITAS_FOOTER_CTA_BODY}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={FASILITAS_FOOTER_CTA_KONTAK_HREF}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Hubungi sekolah
            </Link>
            <PpdbCtaLink href={FASILITAS_FOOTER_CTA_PPDB_HREF} label="Daftar PPDB" className="px-5 py-2.5 text-sm" />
          </div>
        </MotionInView>
      </div>
    </FasilitasPageShell>
  );
}
