import Link from "next/link";
import type { ReactElement } from "react";

import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { PublicFinalCta } from "@/components/features/landing/PublicFinalCta";
import type { GlyphProps } from "@/components/icons/inline-glyphs";
import { IcoChevronRight } from "@/components/icons/inline-glyphs";
import { PublicSectionHeader } from "@/components/features/landing/PublicSectionHeader";
import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  formatJurusanKodeBadge,
  getJurusanHighlightsByKode,
  getJurusanLandingCover,
  JURUSAN_CTA_BODY,
  JURUSAN_CTA_EYEBROW,
  JURUSAN_CTA_TITLE,
  JURUSAN_PKL_BAND,
  JURUSAN_SECTION_INTRO,
  JURUSAN_SECTION_TITLE,
  JURUSAN_STAT_LABELS,
} from "@/lib/akademik-landing-content";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";
import { getAkademikJurusanPublikStats } from "@/services/akademik-publik-stats";
import { getJurusanPublikCards, type JurusanPublikCard } from "@/services/jurusan-publik";
import { cn } from "@/lib/utils";

const cardShellClass = publicSplitCardShellClassName;

function FormalParagraph({ children }: { children: string }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
      {children}
    </p>
  );
}

function IcoJurusanLattice({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 7h6v6H5zM13 7h6v6h-6zM5 15h6v4H5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M14 16h5M14 19h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoJurusanPklArc({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M4 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 16V11l5-3 5 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="8" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IcoJurusanSeal({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 11l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 19l4 2 4-2" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function JurusanStatTile({
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
      <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </li>
  );
}

function JurusanAcademyCard({
  jurusan,
  coverSrc,
  highlights,
  priority,
}: {
  jurusan: JurusanPublikCard;
  coverSrc: string;
  highlights: readonly string[];
  priority?: boolean;
}): ReactElement {
  const badge = formatJurusanKodeBadge(jurusan.kode);

  return (
    <article className={cn(cardShellClass, "flex h-full flex-col")}>
      <div
        className={cn(
          "relative aspect-[16/10] w-full sm:aspect-[5/3]",
          publicOptimizedImageContainerClassName,
        )}
      >
        <PublicOptimizedImage
          src={coverSrc}
          alt={jurusan.nama}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority={priority}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"
          aria-hidden
        />
        <span className="absolute left-4 top-4 rounded-lg border border-white/30 bg-white/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-800 backdrop-blur-sm dark:bg-slate-950/80 dark:text-blue-200">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{jurusan.nama}</h3>
          <FormalParagraph>{jurusan.deskripsi}</FormalParagraph>
        </div>
        <ul className="space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <Link
          href={PUBLIC_SITE_PPDB_HREF}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-300"
        >
          Pelajari program
          <IcoChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export async function AkademikJurusanSection({
  standalone = false,
}: {
  standalone?: boolean;
} = {}): Promise<ReactElement> {
  const [jurusanCards, jurusanStats] = await Promise.all([
    getJurusanPublikCards(),
    getAkademikJurusanPublikStats(),
  ]);
  const jurusanCount = jurusanStats.jurusanAktif;

  return (
    <MotionInView
      as="section"
      id="jurusan"
      className={cn(standalone ? "mt-14 space-y-10" : "mt-16 scroll-mt-24 space-y-10")}
      delay={0.12}
    >
        {!standalone ? (
        <PublicSectionHeader eyebrow="Penjurusan" title={JURUSAN_SECTION_TITLE} intro={JURUSAN_SECTION_INTRO} />
        ) : null}

        <ul className={cn("grid w-full gap-4 sm:grid-cols-3", standalone ? "" : "mt-10")}>
          <JurusanStatTile
            icon={<IcoJurusanLattice className="size-5" />}
            value={String(jurusanCount)}
            label={JURUSAN_STAT_LABELS.jurusan}
          />
          <JurusanStatTile
            icon={<IcoJurusanPklArc className="size-5" />}
            value="Terstruktur"
            label={JURUSAN_STAT_LABELS.pkl}
          />
          <JurusanStatTile
            icon={<IcoJurusanSeal className="size-5" />}
            value="UKK"
            label={JURUSAN_STAT_LABELS.sertifikasi}
          />
        </ul>

        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {jurusanCards.map((jurusan, idx) => (
            <MotionInView as="li" key={jurusan.kode} delay={0.1 + idx * 0.04}>
              <JurusanAcademyCard
                jurusan={jurusan}
                coverSrc={getJurusanLandingCover(jurusan.kode, idx)}
                highlights={getJurusanHighlightsByKode(jurusan.kode)}
                priority={idx === 0}
              />
            </MotionInView>
          ))}
        </ul>

        <MotionInView as="article" className={cn(cardShellClass, "mt-10")} delay={0.14}>
          <PublicSplitContentCard
            tone="accent"
            textPanelClassName="justify-between"
            image={{
              src: LANDING_MEDIA.akademik.pklKompetensiIndustriWebp,
              alt: "Praktik Kerja Lapangan dan kompetensi industri SMK TEKNOVO",
              quality: 60,
            }}
          >
            <div className="space-y-4">
              <IcoJurusanPklArc className="size-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {JURUSAN_PKL_BAND.title}
              </h3>
              <FormalParagraph>{JURUSAN_PKL_BAND.description}</FormalParagraph>
            </div>
            <ul className="space-y-2 border-t border-blue-200/80 pt-4 text-sm font-medium text-blue-900 dark:border-blue-400/20 dark:text-blue-100">
              {JURUSAN_PKL_BAND.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </PublicSplitContentCard>
        </MotionInView>

        <PublicFinalCta
          as="article"
          className="mt-10"
          eyebrow={JURUSAN_CTA_EYEBROW}
          title={JURUSAN_CTA_TITLE}
          description={JURUSAN_CTA_BODY}
          delay={0.18}
        >
          <PpdbCtaLink href={PUBLIC_SITE_PPDB_HREF} label="Daftar PPDB" />
          <Link
            href="/profil/program-sekolah"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Program sekolah
          </Link>
        </PublicFinalCta>
    </MotionInView>
  );
}
