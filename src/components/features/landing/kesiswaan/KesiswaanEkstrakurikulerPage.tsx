import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { EkstrakurikulerIconGlyph } from "@/components/features/landing/kesiswaan/EkstrakurikulerIconGlyph";
import { KesiswaanEkstrakurikulerClient } from "@/components/features/landing/kesiswaan/KesiswaanEkstrakurikulerClient";
import { KesiswaanEkstrakurikulerPrestasiStrip } from "@/components/features/landing/kesiswaan/KesiswaanEkstrakurikulerPrestasiStrip";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import {
  EKSTRA_CTA_BODY,
  EKSTRA_CTA_TITLE,
  EKSTRA_GRID_INTRO,
  EKSTRA_HERO_EYEBROW,
  EKSTRA_OPPORTUNITIES_BODY,
  EKSTRA_OPPORTUNITIES_TITLE,
  EKSTRA_OSIS_BODY,
  EKSTRA_OSIS_CTA_HREF,
  EKSTRA_OSIS_CTA_LABEL,
  EKSTRA_OSIS_FOCUS_ITEMS,
  EKSTRA_OSIS_HEADLINE,
  EKSTRA_OSIS_TAGLINE,
  EKSTRA_OSIS_TITLE,
  EKSTRA_PAGE_LEDE,
  EKSTRA_PAGE_TITLE,
  EKSTRA_PORTAL_HREF,
  EKSTRA_PORTAL_LABEL,
  EKSTRA_PPDB_CTA,
  EKSTRA_PRESTASI_LINK_HREF,
  EKSTRA_STATS_LABELS,
} from "@/lib/ekstrakurikuler-landing-content";
import { resolveOsisCoverSrc } from "@/lib/ekstrakurikuler-media";
import { KesiswaanPageShell } from "@/components/features/landing/KesiswaanPageShell";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import {
  getEkskulPublikCards,
  getPrestasiPublikCards,
  type EkskulPublikCard,
  type PrestasiPublikCard,
} from "@/services/kesiswaan-publik";
import { cn } from "@/lib/utils";

type KesiswaanEkstrakurikulerPageProps = {
  /** Prefetched at Astro build — avoids client re-fetch / 429 mock fallthrough. */
  ekskulItems?: EkskulPublikCard[];
  prestasiItems?: PrestasiPublikCard[];
};

const bandShellClass =
  "relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

function FormalParagraph({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
      {children}
    </p>
  );
}

function HeroStatTile({
  icon,
  value,
  label,
}: {
  icon: ReactElement;
  value: string;
  label: string;
}): ReactElement {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:px-6">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </li>
  );
}

export async function KesiswaanEkstrakurikulerPage({
  ekskulItems: ekskulProp,
  prestasiItems: prestasiProp,
}: KesiswaanEkstrakurikulerPageProps = {}): Promise<ReactElement> {
  const [ekskulItems, prestasiItems] = await Promise.all([
    ekskulProp ?? getEkskulPublikCards(),
    prestasiProp ?? getPrestasiPublikCards(8),
  ]);
  const osisCover = resolveOsisCoverSrc();
  const unitCount = ekskulItems.length;
  const kategoriCount = new Set(ekskulItems.map((item) => item.kategori)).size;
  const prestasiCount = prestasiItems.length;

  return (
    <KesiswaanPageShell eyebrow={EKSTRA_HERO_EYEBROW} title={EKSTRA_PAGE_TITLE} lede={EKSTRA_PAGE_LEDE}>
      <MotionInView as="ul" className="mt-12 grid w-full gap-4 sm:grid-cols-3" delay={0.04}>
          <HeroStatTile
            icon={<EkstrakurikulerIconGlyph iconKey="semua" className="size-5" />}
            value={String(unitCount)}
            label={EKSTRA_STATS_LABELS.unit}
          />
          <HeroStatTile
            icon={<EkstrakurikulerIconGlyph iconKey="teknologi" className="size-5" />}
            value={String(kategoriCount)}
            label={EKSTRA_STATS_LABELS.kategori}
          />
          <HeroStatTile
            icon={<EkstrakurikulerIconGlyph iconKey="prestasi" className="size-5" />}
            value={String(prestasiCount)}
            label={EKSTRA_STATS_LABELS.prestasi}
          />
        </MotionInView>

        <MotionInView
          as="article"
          className={cn(
            bandShellClass,
            "mt-10 bg-gradient-to-br from-amber-50/60 via-white to-blue-50/40 p-6 dark:from-amber-950/15 dark:via-slate-950 dark:to-blue-950/20 sm:p-8",
          )}
          delay={0.05}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <EkstrakurikulerIconGlyph
              iconKey="opportunities"
              className="size-9 shrink-0 text-amber-700 dark:text-amber-400"
            />
            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {EKSTRA_OPPORTUNITIES_TITLE}
              </h2>
              <FormalParagraph>{EKSTRA_OPPORTUNITIES_BODY}</FormalParagraph>
            </div>
          </div>
        </MotionInView>

        <MotionInView as="article" id="osis" className={cn(bandShellClass, "mt-12 scroll-mt-28")} delay={0.06}>
          <div className="grid lg:grid-cols-2">
            <div className={cn("relative min-h-[14rem] lg:min-h-full", publicOptimizedImageContainerClassName)}>
              <PublicOptimizedImage
                src={osisCover}
                alt="Kegiatan OSIS SMK TEKNOVO"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent lg:bg-gradient-to-r" />
              <div className="absolute inset-x-0 bottom-0 p-5 lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200/90">
                  {EKSTRA_OSIS_TAGLINE}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{EKSTRA_OSIS_HEADLINE}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  <EkstrakurikulerIconGlyph iconKey="osis" className="size-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Organisasi
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{EKSTRA_OSIS_TITLE}</h2>
                </div>
              </div>
              <p className="hidden text-sm font-semibold text-slate-800 dark:text-slate-200 lg:block">
                {EKSTRA_OSIS_HEADLINE}
              </p>
              <FormalParagraph>{EKSTRA_OSIS_BODY}</FormalParagraph>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {EKSTRA_OSIS_FOCUS_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
                    <span className={cn("leading-relaxed", publicFormalBodyClassName)}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={EKSTRA_OSIS_CTA_HREF}
                className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-blue-500"
              >
                <EkstrakurikulerIconGlyph iconKey="osis" className="size-4" />
                {EKSTRA_OSIS_CTA_LABEL}
              </Link>
            </div>
          </div>
        </MotionInView>

        <MotionInView
          as="div"
          className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50"
          delay={0.07}
        >
          <div className="flex items-center gap-3">
            <EkstrakurikulerIconGlyph iconKey="semua" className="size-8 text-amber-600 dark:text-amber-400" />
            <p className={cn("max-w-lg text-sm text-slate-600 dark:text-slate-400", publicFormalBodyClassName)}>
              {EKSTRA_GRID_INTRO}
            </p>
          </div>
        </MotionInView>

        <div id="unit-ekstra" className="scroll-mt-28">
          <KesiswaanEkstrakurikulerClient ekskulItems={ekskulItems} />
        </div>

        <KesiswaanEkstrakurikulerPrestasiStrip prestasiItems={prestasiItems} />

        <MotionInView
          as="div"
          className={cn(
            bandShellClass,
            "mt-14 flex flex-col gap-6 bg-gradient-to-br from-amber-50/80 via-white to-blue-50/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:from-amber-950/20 dark:via-slate-950 dark:to-blue-950/20",
          )}
          delay={0.1}
        >
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">{EKSTRA_CTA_TITLE}</h2>
            <p className={cn("mt-2 text-sm text-slate-600 dark:text-slate-400", publicFormalBodyClassName)}>
              {EKSTRA_CTA_BODY}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PpdbCtaLink href={EKSTRA_PPDB_CTA.href} label={EKSTRA_PPDB_CTA.label} variant="hero" />
            <Link
              href={EKSTRA_PORTAL_HREF}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <EkstrakurikulerIconGlyph iconKey="coach" className="size-4 opacity-80" />
              {EKSTRA_PORTAL_LABEL}
            </Link>
            <Link
              href={EKSTRA_PRESTASI_LINK_HREF}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/60"
            >
              <EkstrakurikulerIconGlyph iconKey="prestasi" className="size-4" />
              Prestasi siswa
            </Link>
          </div>
        </MotionInView>

      <p className="mt-8 text-center">
        <AkademikLearnMoreLink href="/kesiswaan">Ringkasan kesiswaan</AkademikLearnMoreLink>
      </p>
    </KesiswaanPageShell>
  );
}
