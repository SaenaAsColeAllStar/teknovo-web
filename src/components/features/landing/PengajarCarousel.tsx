"use client";

import { IcoChevronLeft, IcoChevronRight } from "@/components/icons/inline-glyphs";
import type { PengajarPublikCard } from "@/services/pengajar-publik";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useSyncExternalStore, useState } from "react";
import type { ReactElement } from "react";

const AUTO_INTERVAL_MS = 5_000;

function useIsClientMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const cardShellClass =
  "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

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

function PengajarCard({ pengajar }: { pengajar: PengajarPublikCard }): ReactElement {
  return (
    <article className={cn(cardShellClass, "flex h-full flex-col p-5 sm:p-6")}>
      <div className="flex items-start gap-4">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-slate-100 text-sm font-semibold tracking-wide text-blue-800 dark:from-blue-950/80 dark:to-slate-900 dark:text-blue-200"
          aria-hidden
        >
          {initialsFromName(pengajar.namaLengkap)}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-white">{pengajar.namaLengkap}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{pengajar.bidang}</p>
          <div className="flex flex-wrap gap-2">
            {pengajar.isBersertifikasi ? (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-blue-800 dark:bg-blue-950/60 dark:text-blue-200">
                Bersertifikasi
              </span>
            ) : null}
            {pengajar.isWaliKelas ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Wali kelas
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function useItemsPerSlide(): number {
  const [perSlide, setPerSlide] = useState(1);

  useEffect(() => {
    function update(): void {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setPerSlide(3);
        return;
      }
      if (window.matchMedia("(min-width: 640px)").matches) {
        setPerSlide(2);
        return;
      }
      setPerSlide(1);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perSlide;
}

function chunkGurus(gurus: PengajarPublikCard[], perSlide: number): PengajarPublikCard[][] {
  if (gurus.length === 0) {
    return [];
  }
  const slides: PengajarPublikCard[][] = [];
  for (let i = 0; i < gurus.length; i += perSlide) {
    slides.push(gurus.slice(i, i + perSlide));
  }
  return slides;
}

export type PengajarCarouselProps = {
  gurus: PengajarPublikCard[];
};

function PengajarStaticGrid({ gurus }: { gurus: PengajarPublikCard[] }): ReactElement {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {gurus.map((pengajar) => (
        <li key={pengajar.id}>
          <PengajarCard pengajar={pengajar} />
        </li>
      ))}
    </ul>
  );
}

export function PengajarCarousel({ gurus }: PengajarCarouselProps): ReactElement | null {
  const mounted = useIsClientMounted();
  const perSlide = useItemsPerSlide();
  const slides = useMemo(() => chunkGurus(gurus, perSlide), [gurus, perSlide]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const totalSlides = slides.length;
  const safeIndex = totalSlides > 0 ? slideIndex % totalSlides : 0;
  const currentSlide = slides[safeIndex] ?? [];

  const goToSlide = useCallback(
    (index: number): void => {
      if (totalSlides <= 0) {
        return;
      }
      const normalized = ((index % totalSlides) + totalSlides) % totalSlides;
      setSlideIndex(normalized);
    },
    [totalSlides],
  );

  const goNext = useCallback((): void => {
    goToSlide(safeIndex + 1);
  }, [goToSlide, safeIndex]);

  const goPrev = useCallback((): void => {
    goToSlide(safeIndex - 1);
  }, [goToSlide, safeIndex]);

  useEffect(() => {
    if (totalSlides <= 1 || paused) {
      return;
    }
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % totalSlides);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, totalSlides]);

  if (gurus.length === 0) {
    return null;
  }

  if (!mounted) {
    return <PengajarStaticGrid gurus={gurus} />;
  }

  const slideStatus =
    totalSlides > 1
      ? `Slide ${safeIndex + 1} dari ${totalSlides}, menampilkan ${currentSlide.length} pengajar`
      : `Menampilkan ${gurus.length} pengajar`;

  return (
    <div
      className="space-y-4"
      role="region"
      aria-roledescription="carousel"
      aria-label="Daftar pengajar SMK TEKNOVO"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {slideStatus}
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentSlide.map((pengajar) => (
          <li key={pengajar.id}>
            <PengajarCard pengajar={pengajar} />
          </li>
        ))}
      </ul>

      {totalSlides > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Pengajar sebelumnya"
          >
            <IcoChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Navigasi slide pengajar">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === safeIndex}
                aria-label={`Ke slide ${idx + 1} dari ${totalSlides}`}
                onClick={() => goToSlide(idx)}
                className={cn(
                  "size-2.5 rounded-full transition",
                  idx === safeIndex
                    ? "bg-blue-600 dark:bg-blue-400"
                    : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Pengajar berikutnya"
          >
            <IcoChevronRight className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
