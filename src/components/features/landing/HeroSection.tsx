"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, type ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import {
  HOME_HERO_CTA_LABEL,
  HOME_HERO_LEDE,
  HOME_HERO_TITLE,
  HOME_HERO_WATERMARK,
} from "@/lib/home-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { PUBLIC_SITE_PPDB_HREF } from "@/lib/public-site-nav";
import { cn } from "@/lib/utils";

const SLIDES = LANDING_MEDIA.hero.slides;

/**
 * Hero beranda full-bleed: foto/video edge-to-edge, tipografi watermark,
 * anchor kiri (judul + lede + CTA), dan carousel thumb kanan-bawah.
 */
export function HeroSection(): ReactElement {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const slide = SLIDES[index] ?? SLIDES[0];
  const count = SLIDES.length;

  const go = useCallback(
    (next: number) => {
      setVideoFailed(false);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => go(index - 1), [go, index]);
  const goNext = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => go(index + 1), 10_000);
    return () => window.clearInterval(id);
  }, [go, index, reduceMotion]);

  return (
    <section
      id="beranda"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-brand-strong text-white"
      aria-label="Beranda SMK TEKNOVO"
    >
      {/* Full-bleed media */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync" initial={false}>
          <m.div
            key={slide.id}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {!videoFailed ? (
              <video
                key={slide.videoMp4}
                className="h-full w-full object-cover"
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
                poster={slide.bg}
                onError={() => setVideoFailed(true)}
              >
                <source src={slide.videoMp4} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={slide.bg}
                alt=""
                fill
                priority={index === 0}
                unoptimized
                className="object-cover"
                sizes="100vw"
              />
            )}
          </m.div>
        </AnimatePresence>

        {/* Soft readability wash — not a card/badge overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-strong/80 via-brand-strong/30 to-brand-strong/40"
          aria-hidden
        />
      </div>

      {/* Oversized watermark */}
      <m.p
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] z-[1] w-[140%] -translate-x-1/2 select-none text-center text-[18vw] font-bold leading-none tracking-[-0.04em] text-white/15 sm:top-[16%] sm:text-[15vw] lg:text-[12vw]"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        {HOME_HERO_WATERMARK}
      </m.p>

      {/* Bottom anchors */}
      <div className="relative z-[2] flex min-h-[100svh] flex-col justify-end">
        <div className="public-site-container flex w-full flex-col gap-10 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-10 sm:pb-12 sm:pt-12 md:pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pb-14">
          <m.div
            className="max-w-xl space-y-4 lg:pb-1"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]">
              {HOME_HERO_TITLE}
            </h1>
            <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">{HOME_HERO_LEDE}</p>
            <PublicSiteLink
              href={PUBLIC_SITE_PPDB_HREF}
              className="group inline-flex items-center gap-2 border border-border-default/40 bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              {HOME_HERO_CTA_LABEL}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </PublicSiteLink>
          </m.div>

          <m.div
            className="flex w-full flex-col gap-3 sm:max-w-md lg:w-auto lg:items-end"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            role="group"
            aria-label="Galeri sorotan sekolah"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>

              <ul className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SLIDES.map((item, i) => {
                  const selected = i === index;
                  return (
                    <li key={item.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`Tampilkan ${item.label}`}
                        aria-current={selected ? "true" : undefined}
                        className={cn(
                          "relative block size-14 overflow-hidden rounded-md border-2 transition sm:size-16",
                          selected
                            ? "border-white ring-2 ring-brand"
                            : "border-white/30 opacity-80 hover:opacity-100",
                        )}
                      >
                        <Image
                          src={item.thumb}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
            <p className="text-center text-xs font-medium tracking-wide text-white/70 lg:text-right">
              {slide.label}
              <span className="mx-1.5 text-white/40" aria-hidden>
                ·
              </span>
              {index + 1}/{count}
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
}
