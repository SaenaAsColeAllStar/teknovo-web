"use client";

import { HOME_HERO_VIDEO_FALLBACK_BODY, HOME_HERO_VIDEO_FALLBACK_TITLE } from "@/lib/home-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

const SOURCES = [...LANDING_MEDIA.video.heroSlides];

/**
 * Video bergantian di hero beranda. Jika file belum diunggah ke `public/media/landing/video/`, tampil fallback.
 */
export function HeroSlideVideos(): ReactElement {
  const [index, setIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);
  const failedRef = useRef(new Set<number>());
  const videoRef = useRef<HTMLVideoElement>(null);

  const tryNext = useCallback(() => {
    if (SOURCES.length <= 1) {
      setAllFailed(true);
      return;
    }
    setIndex((i) => (i + 1) % SOURCES.length);
  }, []);

  const onVideoError = useCallback(() => {
    failedRef.current.add(index);
    if (failedRef.current.size >= SOURCES.length) {
      setAllFailed(true);
      return;
    }
    tryNext();
  }, [index, tryNext]);

  const onEnded = useCallback(() => {
    setIndex((i) => (i + 1) % SOURCES.length);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || allFailed) return;
    void v.play().catch(() => {
      onVideoError();
    });
  }, [index, allFailed, onVideoError]);

  if (allFailed) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-100 to-blue-50 px-4 py-8 text-center dark:border-slate-600 dark:from-slate-900 dark:to-slate-800">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{HOME_HERO_VIDEO_FALLBACK_TITLE}</p>
        <p className="max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {HOME_HERO_VIDEO_FALLBACK_BODY}
        </p>
      </div>
    );
  }

  const src = SOURCES[index] ?? SOURCES[0];

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-lg shadow-slate-900/10 ring-1 ring-slate-900/5 dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-black/40 dark:ring-white/10">
      <video
        ref={videoRef}
        key={src}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        poster={LANDING_MEDIA.hero.welcomeJpg}
        onEnded={onEnded}
        onError={onVideoError}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
