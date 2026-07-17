import Link from "next/link";
import type { ReactElement } from "react";

import {
  AkademikFramePlusMarks,
  akademikFrameShellClass,
  akademikSecondaryBtnClass,
  akademikSoftPlateClass,
} from "@/components/features/landing/AkademikBlueprintFrame";
import { PublicOptimizedImage } from "@/components/shared/PublicOptimizedImage";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { PengajarCarousel } from "@/components/features/landing/PengajarCarousel";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PENGAJAR_CTA_BODY,
  PENGAJAR_CTA_EYEBROW,
  PENGAJAR_FEATURED_INTRO,
  PENGAJAR_CTA_KONTAK_HREF,
  PENGAJAR_CTA_PORTAL_HREF,
  PENGAJAR_CTA_PORTAL_LABEL,
  PENGAJAR_CTA_TITLE,
  PENGAJAR_PILLARS,
  PENGAJAR_QUOTES,
  PENGAJAR_SECTION_INTRO,
  PENGAJAR_SECTION_TITLE,
  type PengajarQuoteItem,
} from "@/lib/akademik-landing-content";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { getAkademikPengajarPublikStats } from "@/services/akademik-publik-stats";
import { cn } from "@/lib/utils";

function FormalParagraph({ children }: { children: string }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}>{children}</p>
  );
}

function IcoPengajarStatLattice({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M6 20v-4a3 3 0 016 0v4M15 20v-3a2.5 2.5 0 015 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IcoPengajarStatSeal({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <circle cx="12" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 11l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 19l4 2 4-2" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function IcoPengajarStatArc({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M5 18V9l7-4 7 4v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoQuoteAccent({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path
        d="M6 14c0-2.5 1.2-4.5 3.5-6M14 14c0-2.5 1.2-4.5 3.5-6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PengajarStatTile({
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

function initialsFromName(nama: string): string {
  const parts = nama.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function PengajarQuoteCard({ item, delay }: { item: PengajarQuoteItem; delay?: number }): ReactElement {
  const hasPhoto = Boolean(item.fotoSrc);

  return (
    <MotionInView as="article" className={cn(akademikFrameShellClass, "flex h-full flex-col")} delay={delay}>
      <AkademikFramePlusMarks />
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <IcoQuoteAccent className="size-7 text-brand/70" />
        <blockquote className="flex-1">
          <p className="text-base font-medium leading-relaxed text-heading">
            &ldquo;{item.quote}&rdquo;
          </p>
        </blockquote>
        <footer className="flex items-center gap-4 border-t border-border-default pt-4">
          {hasPhoto ? (
            <div className="relative size-14 shrink-0 overflow-hidden border border-border-default bg-neutral-soft">
              <PublicOptimizedImage
                src={item.fotoSrc ?? ""}
                alt={`Foto ${item.nama}, ${item.jabatan}`}
                fill
                sizes="56px"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div
              className="flex size-14 shrink-0 items-center justify-center border border-border-default bg-neutral-soft text-sm font-semibold text-brand"
              aria-hidden
            >
              {initialsFromName(item.nama)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-heading">{item.nama}</p>
            <p className="text-xs text-body">{item.jabatan}</p>
          </div>
        </footer>
      </div>
    </MotionInView>
  );
}

export async function AkademikPengajarSection({
  standalone = false,
}: {
  standalone?: boolean;
} = {}): Promise<ReactElement> {
  const summary = await getAkademikPengajarPublikStats();

  return (
    <MotionInView
      as="section"
      id="pengajar"
      className={cn(standalone ? "mt-14" : "mt-16 scroll-mt-24")}
      delay={0.16}
    >
      <div className={cn(standalone ? "space-y-10" : "public-site-container space-y-10")}>
        {!standalone ? (
          <header className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Komunitas pendidik
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
              {PENGAJAR_SECTION_TITLE}
            </h2>
            <div className="mt-3 space-y-3">
              {PENGAJAR_SECTION_INTRO.map((paragraph) => (
                <FormalParagraph key={paragraph}>{paragraph}</FormalParagraph>
              ))}
            </div>
          </header>
        ) : null}

        <ul className="grid w-full gap-0 border border-border-default sm:grid-cols-3">
          <PengajarStatTile
            icon={<IcoPengajarStatLattice className="size-5" />}
            value={String(summary.totalAktif)}
            label="Guru aktif"
          />
          <PengajarStatTile
            icon={<IcoPengajarStatSeal className="size-5" />}
            value={String(summary.totalBersertifikasi)}
            label="Bersertifikasi"
            className="border-t border-border-default sm:border-t-0 sm:border-l"
          />
          <PengajarStatTile
            icon={<IcoPengajarStatArc className="size-5" />}
            value={String(summary.totalWaliKelas)}
            label="Wali kelas"
            className="border-t border-border-default sm:border-t-0 sm:border-l"
          />
        </ul>

        <ul className="grid gap-6 lg:grid-cols-3">
          {PENGAJAR_QUOTES.map((quote, idx) => (
            <li key={`${quote.jabatan}-${quote.nama}`}>
              <PengajarQuoteCard item={quote} delay={0.17 + idx * 0.03} />
            </li>
          ))}
        </ul>

        <ul className="grid gap-0 border border-border-default md:grid-cols-3">
          {PENGAJAR_PILLARS.map((pillar, idx) => (
            <MotionInView
              as="li"
              key={pillar.id}
              className={cn(
                akademikSoftPlateClass,
                "border-0",
                idx > 0 && "border-t border-border-default md:border-t-0 md:border-l",
              )}
              delay={0.2 + idx * 0.02}
            >
              <h3 className="text-base font-semibold text-heading">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-body">{pillar.description}</p>
            </MotionInView>
          ))}
        </ul>

        {summary.gurus.length > 0 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-heading">Tim pengajar</h3>
              <p className="mt-1 text-sm text-body">{PENGAJAR_FEATURED_INTRO}</p>
            </div>
            <PengajarCarousel gurus={summary.gurus} />
          </div>
        ) : null}

        <MotionInView as="article" className={akademikFrameShellClass} delay={0.26}>
          <AkademikFramePlusMarks />
          <div className="relative space-y-6 p-8 text-center sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              {PENGAJAR_CTA_EYEBROW}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
              {PENGAJAR_CTA_TITLE}
            </h2>
            <p
              className={cn(
                "mx-auto max-w-2xl text-sm leading-relaxed text-body",
                publicFormalBodyClassName,
              )}
            >
              {PENGAJAR_CTA_BODY}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href={PENGAJAR_CTA_KONTAK_HREF} className={akademikSecondaryBtnClass}>
                Hubungi sekolah
              </Link>
              <AkademikLearnMoreLink href={PENGAJAR_CTA_PORTAL_HREF}>
                {PENGAJAR_CTA_PORTAL_LABEL}
              </AkademikLearnMoreLink>
            </div>
          </div>
        </MotionInView>
      </div>
    </MotionInView>
  );
}
