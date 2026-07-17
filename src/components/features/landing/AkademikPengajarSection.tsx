import Link from "next/link";
import type { ReactElement } from "react";

import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { PublicOptimizedImage } from "@/components/shared/PublicOptimizedImage";
import { PublicSectionHeader } from "@/components/features/landing/PublicSectionHeader";
import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { PengajarCarousel } from "@/components/features/landing/PengajarCarousel";
import { PublicFinalCta } from "@/components/features/landing/PublicFinalCta";
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

const cardShellClass =
  "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

const pillarCardClass =
  "flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-blue-50 p-6 shadow-sm dark:border-slate-800 dark:bg-blue-950/35 sm:p-7";

function FormalParagraph({ children }: { children: string }): ReactElement {
  return (
    <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
      {children}
    </p>
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
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</p>
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
    <MotionInView
      as="article"
      className={cn(cardShellClass, "flex h-full flex-col")}
      delay={delay}
    >
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <IcoQuoteAccent className="size-7 text-blue-500/70 dark:text-blue-400/70" />
        <blockquote className="flex-1">
          <p className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-100">
            &ldquo;{item.quote}&rdquo;
          </p>
        </blockquote>
        <footer className="flex items-center gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          {hasPhoto ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-800/90">
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
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-200"
              aria-hidden
            >
              {initialsFromName(item.nama)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.nama}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{item.jabatan}</p>
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
      <PublicSectionHeader
        eyebrow="Komunitas pendidik"
        title={PENGAJAR_SECTION_TITLE}
        intro={PENGAJAR_SECTION_INTRO}
        icon={
          <span
            aria-hidden
            className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
          >
            <AkademikIconGlyph iconKey="pengajar" className="size-6" />
          </span>
        }
      />
      ) : null}

      <ul className="grid w-full gap-4 sm:grid-cols-3">
        <PengajarStatTile
          icon={<IcoPengajarStatLattice className="size-5" />}
          value={String(summary.totalAktif)}
          label="Guru aktif"
        />
        <PengajarStatTile
          icon={<IcoPengajarStatSeal className="size-5" />}
          value={String(summary.totalBersertifikasi)}
          label="Bersertifikasi"
        />
        <PengajarStatTile
          icon={<IcoPengajarStatArc className="size-5" />}
          value={String(summary.totalWaliKelas)}
          label="Wali kelas"
        />
      </ul>

      <ul className="grid gap-5 lg:grid-cols-3">
        {PENGAJAR_QUOTES.map((quote, idx) => (
          <li key={`${quote.jabatan}-${quote.nama}`}>
            <PengajarQuoteCard item={quote} delay={0.17 + idx * 0.03} />
          </li>
        ))}
      </ul>

      <ul className="grid gap-4 md:grid-cols-3">
        {PENGAJAR_PILLARS.map((pillar, idx) => (
          <MotionInView as="li" key={pillar.id} className={pillarCardClass} delay={0.2 + idx * 0.02}>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{pillar.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{pillar.description}</p>
          </MotionInView>
        ))}
      </ul>

      {summary.gurus.length > 0 ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Tim pengajar
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {PENGAJAR_FEATURED_INTRO}
              </p>
            </div>
          </div>
          <PengajarCarousel gurus={summary.gurus} />
        </div>
      ) : null}

      <PublicFinalCta
        as="article"
        eyebrow={PENGAJAR_CTA_EYEBROW}
        title={PENGAJAR_CTA_TITLE}
        description={PENGAJAR_CTA_BODY}
        delay={0.26}
      >
        <Link
          href={PENGAJAR_CTA_KONTAK_HREF}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Hubungi sekolah
        </Link>
        <AkademikLearnMoreLink href={PENGAJAR_CTA_PORTAL_HREF}>{PENGAJAR_CTA_PORTAL_LABEL}</AkademikLearnMoreLink>
      </PublicFinalCta>
      </div>
    </MotionInView>
  );
}
