"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";

/** Bilah progres baca ringan — hanya tampil saat pengguna menggulir artikel. */
export function BeritaReadingProgress(): ReactElement {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector<HTMLElement>("[data-berita-article]");
      if (!article) {
        return;
      }
      const rect = article.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = article.offsetHeight;
      const viewport = window.innerHeight;
      const scrolled = window.scrollY - articleTop + viewport * 0.15;
      const total = articleHeight - viewport * 0.5;
      const ratio = total <= 0 ? 1 : Math.min(1, Math.max(0, scrolled / total));
      setProgress(ratio * 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (progress <= 0) {
    return <span className="sr-only" aria-hidden />;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[var(--public-nav-bottom,10.5rem)] z-50 h-0.5 bg-slate-200/80 dark:bg-slate-800/80"
      aria-hidden
    >
      <div
        className="h-full bg-blue-600 transition-[width] duration-150 ease-out dark:bg-blue-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
