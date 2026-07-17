"use client";

import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";

import { IcoChevronLeft, IcoChevronRight } from "@/components/icons/inline-glyphs";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import type { HomeSocialProofSlide } from "@/lib/home-landing-content";
import { cn } from "@/lib/utils";

export type SocialProofCarouselProps = {
  slides: readonly HomeSocialProofSlide[];
};

function useVisibleCount(): number {
  /** Default 2 agar SSR/desktop selaras; mobile dikoreksi setelah mount. */
  const [count, setCount] = useState(2);

  useEffect(() => {
    function update(): void {
      setCount(window.matchMedia("(min-width: 768px)").matches ? 2 : 1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function SocialProofCarousel({ slides }: SocialProofCarouselProps): ReactElement | null {
  const visibleCount = useVisibleCount();
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(slides.length / visibleCount));
  const safePage = page % pageCount;
  const start = safePage * visibleCount;
  const visible = slides.slice(start, start + visibleCount);

  useEffect(() => {
    setPage((p) => p % Math.max(1, Math.ceil(slides.length / visibleCount)));
  }, [slides.length, visibleCount]);

  const goPrev = useCallback((): void => {
    setPage((p) => (p - 1 + pageCount) % pageCount);
  }, [pageCount]);

  const goNext = useCallback((): void => {
    setPage((p) => (p + 1) % pageCount);
  }, [pageCount]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev],
  );

  if (slides.length === 0) {
    return null;
  }

  const status = `Slide ${safePage + 1} dari ${pageCount}`;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Dokumentasi kegiatan dan fasilitas sekolah"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
      </p>

      <ul className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {visible.map((slide, idx) => (
          <li key={slide.id}>
            <div
              className={cn(
                "relative aspect-[16/10] overflow-hidden rounded-md border border-border-default",
                publicOptimizedImageContainerClassName,
              )}
            >
              <PublicOptimizedImage
                src={slide.src}
                alt={slide.alt}
                fill
                sizes={visibleCount > 1 ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
                className="object-cover"
                priority={safePage === 0 && idx === 0}
              />
            </div>
          </li>
        ))}
      </ul>

      {pageCount > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute top-1/2 left-0 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-default bg-white text-heading shadow-sm transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:size-11"
            aria-label="Slide sebelumnya"
          >
            <IcoChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute top-1/2 right-0 z-10 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-default bg-white text-heading shadow-sm transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:size-11"
            aria-label="Slide berikutnya"
          >
            <IcoChevronRight className="size-5" />
          </button>
        </>
      ) : null}
    </div>
  );
}
