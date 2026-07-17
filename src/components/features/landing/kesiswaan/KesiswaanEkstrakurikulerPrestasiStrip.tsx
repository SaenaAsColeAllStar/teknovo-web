import Link from "next/link";
import type { ReactElement } from "react";

import { AkademikLearnMoreLink } from "@/components/features/landing/AkademikLearnMoreLink";
import { EkstrakurikulerIconGlyph } from "@/components/features/landing/kesiswaan/EkstrakurikulerIconGlyph";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  EKSTRA_PRESTASI_LINK_HREF,
  EKSTRA_PRESTASI_LINK_LABEL,
  EKSTRA_PRESTASI_SECTION_BODY,
  EKSTRA_PRESTASI_SECTION_EYEBROW,
  EKSTRA_PRESTASI_SECTION_TITLE,
} from "@/lib/ekstrakurikuler-landing-content";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import type { PrestasiPublikCard } from "@/services/kesiswaan-publik";
import { cn, formatDateId } from "@/lib/utils";

const cardShellClass =
  "relative flex min-w-[17rem] max-w-[20rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:min-w-[18rem]";

export type KesiswaanEkstrakurikulerPrestasiStripProps = {
  prestasiItems: PrestasiPublikCard[];
};

function PrestasiTimelineCard({ item }: { item: PrestasiPublikCard }): ReactElement {
  return (
    <article className={cardShellClass}>
      <div className={cn("relative aspect-[16/10] w-full", publicOptimizedImageContainerClassName)}>
        <PublicOptimizedImage
          src={item.fileUrl}
          alt={`Ilustrasi prestasi: ${item.judul}`}
          fill
          sizes="320px"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent"
          aria-hidden
        />
        <time
          dateTime={item.tanggalIso}
          className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800 backdrop-blur-sm dark:bg-slate-950/80 dark:text-emerald-200"
        >
          {formatDateId(new Date(item.tanggalIso))}
        </time>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{item.judul}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{item.penyelenggara}</p>
        <p className={cn("line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400", publicFormalBodyClassName)}>
          {item.ringkasan}
        </p>
        <p className="mt-auto text-xs font-medium text-emerald-700 dark:text-emerald-300">{item.siswaLabel}</p>
      </div>
    </article>
  );
}

export function KesiswaanEkstrakurikulerPrestasiStrip({
  prestasiItems,
}: KesiswaanEkstrakurikulerPrestasiStripProps): ReactElement | null {
  if (prestasiItems.length === 0) {
    return null;
  }

  return (
    <MotionInView as="section" id="prestasi-sorotan" className="mt-16 scroll-mt-28" delay={0.08}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
            {EKSTRA_PRESTASI_SECTION_EYEBROW}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <EkstrakurikulerIconGlyph iconKey="prestasi" className="size-7 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {EKSTRA_PRESTASI_SECTION_TITLE}
            </h2>
          </div>
          <p className={cn("mt-3 text-sm text-slate-600 dark:text-slate-400", publicFormalBodyClassName)}>
            {EKSTRA_PRESTASI_SECTION_BODY}
          </p>
        </div>
        <AkademikLearnMoreLink href={EKSTRA_PRESTASI_LINK_HREF}>{EKSTRA_PRESTASI_LINK_LABEL}</AkademikLearnMoreLink>
      </div>

      <div className="relative mt-8">
        <div
          className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5"
          role="list"
          aria-label="Sorotan prestasi siswa"
        >
          {prestasiItems.map((item) => (
            <PrestasiTimelineCard key={item.id} item={item} />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-slate-950"
          aria-hidden
        />
      </div>

      <p className="mt-6 text-center sm:hidden">
        <Link
          href={EKSTRA_PRESTASI_LINK_HREF}
          className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
        >
          {EKSTRA_PRESTASI_LINK_LABEL}
        </Link>
      </p>
    </MotionInView>
  );
}
