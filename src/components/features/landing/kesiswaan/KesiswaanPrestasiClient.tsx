"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import { KesiswaanIconGlyph } from "@/components/features/landing/kesiswaan/KesiswaanIconGlyph";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  KESISWAAN_PRESTASI_EMPTY_BODY,
  KESISWAAN_PRESTASI_EMPTY_TITLE,
  KESISWAAN_PRESTASI_FILTER_ALL,
  KESISWAAN_PRESTASI_PORTAL_HREF,
  KESISWAAN_PRESTASI_PORTAL_LINK_LABEL,
  KESISWAAN_PRESTASI_PORTAL_NOTE,
} from "@/lib/kesiswaan-landing-content";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName, publicSectionIntroClassName } from "@/lib/public-section-styles";
import type { PrestasiPublikCard } from "@/services/kesiswaan-publik";
import { cn, formatDateId } from "@/lib/utils";

const placeholderGradientClass =
  "flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-100 via-slate-50 to-blue-100 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/30";

export type KesiswaanPrestasiClientProps = {
  prestasiItems: PrestasiPublikCard[];
};

function extractYear(iso: string): number {
  return new Date(iso).getFullYear();
}

export function KesiswaanPrestasiClient({ prestasiItems }: KesiswaanPrestasiClientProps): ReactElement {
  const years = useMemo(() => {
    const set = new Set(prestasiItems.map((p) => extractYear(p.tanggalIso)));
    return [...set].sort((a, b) => b - a);
  }, [prestasiItems]);

  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    if (yearFilter === "all") {
      return prestasiItems;
    }
    return prestasiItems.filter((p) => extractYear(p.tanggalIso) === yearFilter);
  }, [prestasiItems, yearFilter]);

  if (prestasiItems.length === 0) {
    return (
      <MotionInView
        as="div"
        className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900/40"
      >
        <KesiswaanIconGlyph iconKey="prestasi" className="mx-auto size-10 text-emerald-600 dark:text-emerald-400" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{KESISWAAN_PRESTASI_EMPTY_TITLE}</h2>
        <p className={cn("mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400", publicSectionIntroClassName)}>
          {KESISWAAN_PRESTASI_EMPTY_BODY}
        </p>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">{KESISWAAN_PRESTASI_PORTAL_NOTE}</p>
        <Link
          href={KESISWAAN_PRESTASI_PORTAL_HREF}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
        >
          <KesiswaanIconGlyph iconKey="portal" className="size-4" />
          {KESISWAAN_PRESTASI_PORTAL_LINK_LABEL}
        </Link>
      </MotionInView>
    );
  }

  return (
    <>
      {years.length > 1 ? (
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <KesiswaanIconGlyph iconKey="calendar" className="size-4 text-slate-500" aria-hidden />
          <button
            type="button"
            onClick={() => setYearFilter("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              yearFilter === "all"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
            )}
          >
            {KESISWAAN_PRESTASI_FILTER_ALL}
          </button>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYearFilter(y)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition",
                yearFilter === y
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
              )}
            >
              {y}
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Tidak ada prestasi untuk tahun yang dipilih.
        </p>
      ) : (
        <ul
          id="prestasi"
          className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5 [&>li]:break-inside-avoid"
        >
          {filtered.map((p, idx) => {
            const isPdf = p.fileUrl.toLowerCase().endsWith(".pdf");
            const hasThumb = p.fileUrl.length > 0 && !isPdf;

            return (
              <MotionInView as="li" key={p.id} delay={0.03 + idx * 0.02}>
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div
                    className={cn(
                      "relative aspect-[4/3] w-full",
                      hasThumb && publicOptimizedImageContainerClassName,
                    )}
                  >
                    {hasThumb ? (
                      <PublicOptimizedImage
                        src={p.fileUrl}
                        alt={`Ilustrasi prestasi: ${p.judul}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 360px"
                      />
                    ) : isPdf && p.fileUrl ? (
                      <div className={placeholderGradientClass}>
                        <KesiswaanIconGlyph iconKey="document" className="size-10 text-emerald-700/70 dark:text-emerald-300/70" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Bukti PDF</span>
                      </div>
                    ) : (
                      <div className={placeholderGradientClass}>
                        <KesiswaanIconGlyph iconKey="trophy" className="size-10 text-emerald-700/50 dark:text-emerald-300/50" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                      {formatDateId(new Date(p.tanggalIso))}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{p.judul}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.penyelenggara}</p>
                    <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{p.siswaLabel}</p>
                    {p.ringkasan ? (
                      <p
                        className={cn(
                          "mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
                          publicFormalBodyClassName,
                        )}
                      >
                        {p.ringkasan}
                      </p>
                    ) : null}
                    {p.fileUrl ? (
                      <a
                        href={p.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        <KesiswaanIconGlyph iconKey="document" className="size-3.5" />
                        {isPdf ? "Buka dokumen PDF" : "Lihat bukti"}
                      </a>
                    ) : null}
                  </div>
                </article>
              </MotionInView>
            );
          })}
        </ul>
      )}

      <p className={cn("mt-10 text-sm text-slate-600 dark:text-slate-400", publicSectionIntroClassName)}>
        {KESISWAAN_PRESTASI_PORTAL_NOTE}{" "}
        <Link
          href={KESISWAAN_PRESTASI_PORTAL_HREF}
          className="font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
        >
          {KESISWAAN_PRESTASI_PORTAL_LINK_LABEL}
        </Link>
      </p>
    </>
  );
}
