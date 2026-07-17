import Link from "next/link";
import type { ReactElement } from "react";

import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import {
  AkademikFramePlusMarks,
  akademikFrameShellClass,
  akademikSecondaryBtnClass,
} from "@/components/features/landing/AkademikBlueprintFrame";
import type { GlyphProps } from "@/components/icons/inline-glyphs";
import { IcoChevronRight } from "@/components/icons/inline-glyphs";
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

function FormalParagraph({ children }: { children: string }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}>{children}</p>
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
  className,
}: {
  icon: ReactElement;
  value: string;
  label: string;
  className?: string;
}): ReactElement {
  return (
    <li className={cn("flex items-center gap-4 bg-surface px-5 py-4 sm:px-6", className)}>
      <span className="flex size-10 items-center justify-center border border-border-default bg-neutral-soft text-brand">
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold tabular-nums text-heading">{value}</p>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-body-subtle">{label}</p>
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
    <article className={cn(akademikFrameShellClass, "flex h-full flex-col")}>
      <AkademikFramePlusMarks />
      <div
        className={cn(
          "relative aspect-[16/10] w-full border-b border-border-default sm:aspect-[5/3]",
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
        <span className="absolute left-4 top-4 border border-border-default bg-surface px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-heading">{jurusan.nama}</h3>
          <FormalParagraph>{jurusan.deskripsi}</FormalParagraph>
        </div>
        <ul className="space-y-2 border-t border-border-default pt-4 text-sm text-body">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 bg-brand" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <Link
          href={PUBLIC_SITE_PPDB_HREF}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-2 hover:underline"
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
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Penjurusan</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
            {JURUSAN_SECTION_TITLE}
          </h2>
          <div className="mt-3 space-y-3">
            {JURUSAN_SECTION_INTRO.map((paragraph) => (
              <p
                key={paragraph}
                className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </header>
      ) : null}

      <ul className={cn("grid w-full gap-0 border border-border-default sm:grid-cols-3", standalone ? "" : "mt-10")}>
        <JurusanStatTile
          icon={<IcoJurusanLattice className="size-5" />}
          value={String(jurusanCount)}
          label={JURUSAN_STAT_LABELS.jurusan}
        />
        <JurusanStatTile
          icon={<IcoJurusanPklArc className="size-5" />}
          value="Terstruktur"
          label={JURUSAN_STAT_LABELS.pkl}
          className="border-t border-border-default sm:border-t-0 sm:border-l"
        />
        <JurusanStatTile
          icon={<IcoJurusanSeal className="size-5" />}
          value="UKK"
          label={JURUSAN_STAT_LABELS.sertifikasi}
          className="border-t border-border-default sm:border-t-0 sm:border-l"
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

      <MotionInView as="article" className={cn(akademikFrameShellClass, "mt-10")} delay={0.14}>
        <AkademikFramePlusMarks />
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-between gap-5 border-b border-border-default p-6 md:border-b-0 md:border-r sm:p-8">
            <div className="space-y-4">
              <IcoJurusanPklArc className="size-8 text-brand" />
              <h3 className="text-xl font-semibold tracking-tight text-heading">{JURUSAN_PKL_BAND.title}</h3>
              <FormalParagraph>{JURUSAN_PKL_BAND.description}</FormalParagraph>
            </div>
            <ul className="space-y-2 border-t border-border-default pt-4 text-sm font-medium text-heading">
              {JURUSAN_PKL_BAND.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              "relative min-h-[14rem] md:min-h-full",
              publicOptimizedImageContainerClassName,
            )}
          >
            <PublicOptimizedImage
              src={LANDING_MEDIA.akademik.pklKompetensiIndustriWebp}
              alt="Praktik Kerja Lapangan dan kompetensi industri SMK TEKNOVO"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              quality={60}
            />
          </div>
        </div>
      </MotionInView>

      <MotionInView as="article" className={cn(akademikFrameShellClass, "mt-10")} delay={0.18}>
        <AkademikFramePlusMarks />
        <div className="relative space-y-6 p-8 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {JURUSAN_CTA_EYEBROW}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
            {JURUSAN_CTA_TITLE}
          </h2>
          <p className={cn("mx-auto max-w-2xl text-sm leading-relaxed text-body", publicFormalBodyClassName)}>
            {JURUSAN_CTA_BODY}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PpdbCtaLink href={PUBLIC_SITE_PPDB_HREF} label="Daftar PPDB" />
            <Link href="/profil/program-sekolah" className={akademikSecondaryBtnClass}>
              Program sekolah
            </Link>
          </div>
        </div>
      </MotionInView>
    </MotionInView>
  );
}
