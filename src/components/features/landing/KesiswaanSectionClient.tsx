"use client";

import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactElement } from "react";

import {
  IcoUsers,
  IcoX,
} from "@/components/icons/inline-glyphs";
import { useEffect, useId, useMemo, useState } from "react";

import { EkstrakurikulerIconGlyph } from "@/components/features/landing/kesiswaan/EkstrakurikulerIconGlyph";
import { KesiswaanPrestasiBlogSection } from "@/components/features/landing/kesiswaan/KesiswaanPrestasiBlogSection";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  EKSTRA_HUB_FEATURE_COLUMNS,
  EKSTRA_HUB_SECTION_BODY,
  EKSTRA_HUB_SECTION_EYEBROW,
  EKSTRA_HUB_SECTION_TITLE,
} from "@/lib/ekstrakurikuler-landing-content";
import { resolveOsisCoverSrc } from "@/lib/ekstrakurikuler-media";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import type { EkskulPublikCard, PrestasiPublikCard } from "@/services/kesiswaan-publik";
import { cn } from "@/lib/utils";

export type KesiswaanSectionClientProps = {
  ekskulItems: EkskulPublikCard[];
  prestasiItems: PrestasiPublikCard[];
  /** Jumlah unit ekskul aktif dari agregasi DB (bukan panjang daftar kartu). */
  ekskulAktifCount?: number;
};

const OSIS_PREVIEW_SRC = resolveOsisCoverSrc();

export function KesiswaanSectionClient({
  ekskulItems,
  prestasiItems,
}: KesiswaanSectionClientProps): ReactElement {
  const modalTitleId = useId();
  const [activeEkstra, setActiveEkstra] = useState<EkskulPublikCard | null>(null);

  const featureColumns = useMemo(() => {
    return EKSTRA_HUB_FEATURE_COLUMNS.map((column) => ({
      ...column,
      items: ekskulItems.filter((item) =>
        (column.kategoriKeys as readonly string[]).includes(item.kategori),
      ),
    }));
  }, [ekskulItems]);

  const relatedPrestasiHref = useMemo(() => {
    if (!activeEkstra) {
      return null;
    }
    return "#prestasi";
  }, [activeEkstra]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        setActiveEkstra(null);
      }
    }
    if (!activeEkstra) {
      return;
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeEkstra]);

  useEffect(() => {
    function syncEkstraFromHash(): void {
      const h = window.location.hash;
      if (!h.startsWith("#ekstra-")) {
        return;
      }
      const slug = h.slice("#ekstra-".length);
      const found = ekskulItems.find((e) => e.slug === slug);
      if (found) {
        setActiveEkstra(found);
      }
    }

    syncEkstraFromHash();
    window.addEventListener("hashchange", syncEkstraFromHash);
    return () => window.removeEventListener("hashchange", syncEkstraFromHash);
  }, [ekskulItems]);

  return (
    <>
      <MotionInView
        as="article"
        id="ekstrakurikuler"
        className="mt-12 scroll-mt-24"
        delay={0.05}
      >
        <header className="max-w-2xl text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {EKSTRA_HUB_SECTION_EYEBROW}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-heading sm:text-3xl lg:text-4xl">
            {EKSTRA_HUB_SECTION_TITLE}
          </h2>
          <p
            className={cn(
              "mt-4 max-w-prose text-sm leading-relaxed text-body sm:text-[15px]",
              publicFormalBodyClassName,
            )}
          >
            {EKSTRA_HUB_SECTION_BODY}
          </p>
        </header>

        {ekskulItems.length === 0 ? (
          <p className="mt-10 border border-dashed border-border-default bg-neutral-soft px-4 py-8 text-center text-sm text-body">
            Belum ada unit ekstrakurikuler aktif untuk ditampilkan.
          </p>
        ) : (
          <div className="mt-10 grid gap-0 lg:grid-cols-3">
            {featureColumns.map((column, idx) => (
              <div
                key={column.id}
                className={cn(
                  "flex flex-col gap-4 py-8 lg:px-8 lg:py-2",
                  idx === 0 && "pt-0 lg:pl-0",
                  idx === featureColumns.length - 1 && "lg:pr-0",
                  idx > 0 && "border-t border-border-default lg:border-t-0 lg:border-l",
                )}
              >
                <span className="flex size-10 items-center justify-center rounded-lg border border-border-default bg-neutral-soft text-brand">
                  <EkstrakurikulerIconGlyph iconKey={column.iconKey} className="size-5" />
                </span>
                <h3 className="text-base font-medium tracking-tight text-heading sm:text-lg">
                  {column.title}
                </h3>
                {column.items.length === 0 ? (
                  <p className="text-sm text-body-subtle">Belum ada unit di kategori ini.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {column.items.map((item) => (
                      <li key={item.slug} id={`ekstra-${item.slug}`} className="scroll-mt-28">
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                          onClick={() => setActiveEkstra(item)}
                          aria-haspopup="dialog"
                        >
                          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border-default bg-brand/10 text-brand">
                            <Check className="size-3" strokeWidth={2.5} aria-hidden />
                          </span>
                          <span className="truncate text-sm font-medium text-heading sm:text-[15px]">
                            {item.name}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </MotionInView>

      <MotionInView
                as="article"
                id="osis"
                className={cn(
                  "mt-12 scroll-mt-24 group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",
                  "transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md",
                  "dark:border-slate-800 dark:bg-slate-950",
                )}
                delay={0.08}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/12 via-indigo-500/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                        <IcoUsers className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          Organisasi
                        </p>
                        <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">OSIS</h3>
                      </div>
                    </div>
                    <span className="rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700/90 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                      Kepemimpinan
                    </span>
                  </div>

                  <div
                    className={cn(
                      "relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800",
                      publicOptimizedImageContainerClassName,
                    )}
                  >
                    <PublicOptimizedImage
                      src={OSIS_PREVIEW_SRC}
                      alt="Kegiatan OSIS"
                      fill
                      sizes="(max-width: 1024px) 100vw, 520px"
                      className="object-cover"
                      priority
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200/90">
                        Program kerja & kepemimpinan
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-white">
                        OSIS sebagai ruang tumbuh, kolaborasi, dan dampak sosial
                      </p>
                    </div>
                  </div>

                  <p
                    className={cn(
                      "mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
                      publicFormalBodyClassName,
                    )}
                  >
                    Wadah aspirasi, kegiatan sosial, dan pengembangan kepemimpinan. Program kerja OSIS dirancang
                    untuk membangun budaya positif dan partisipasi aktif siswa.
                  </p>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Fokus program
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      {[
                        "Event seni & kreativitas siswa",
                        "Bakti sosial dan kegiatan kepedulian",
                        "Forum dialog siswa & penguatan karakter",
                        "Pelatihan kepemimpinan pengurus dan anggota",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
                          <span className={cn("leading-relaxed", publicFormalBodyClassName)}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-500">
                    Informasi struktur pengurus OSIS periode berjalan dapat ditambahkan di sini.
                  </p>
                </div>
              </MotionInView>

      <KesiswaanPrestasiBlogSection prestasiItems={prestasiItems} />

      <LazyMotion features={domAnimation} strict>
        <AnimatePresence>
          {activeEkstra ? (
            <m.div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={modalTitleId}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setActiveEkstra(null);
                }
              }}
            >
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" aria-hidden />
              <m.div
                className={cn(
                  "relative w-full max-w-[46rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl",
                  "dark:border-slate-800 dark:bg-slate-950",
                )}
                initial={{ y: 16, scale: 0.98, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 16, scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-blue-500/8 to-transparent" />
                <div className="relative flex items-start justify-between gap-4 border-b border-slate-200/80 p-5 dark:border-slate-800/80">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Ekstrakurikuler
                    </p>
                    <h3
                      id={modalTitleId}
                      className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
                    >
                      {activeEkstra.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    onClick={() => setActiveEkstra(null)}
                    aria-label="Tutup detail"
                  >
                    <IcoX className="size-5" aria-hidden />
                  </button>
                </div>

                <div className="relative grid gap-5 p-5 md:grid-cols-[1fr,220px]">
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {activeEkstra.fullDescription}
                    </p>

                    {activeEkstra.relatedAchievements.length > 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          Prestasi terkait
                        </p>
                        <ul className="mt-3 space-y-2">
                          {activeEkstra.relatedAchievements.map((a) => (
                            <li key={a} className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                              <span className="mr-2 inline-block size-1.5 rounded-full bg-amber-500 align-middle" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    {relatedPrestasiHref ? (
                      <Link
                        href={relatedPrestasiHref}
                        className="flex min-h-11 w-full items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
                        onClick={() => setActiveEkstra(null)}
                      >
                        Lihat prestasi siswa
                      </Link>
                    ) : null}

                    <button
                      type="button"
                      className="flex min-h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                      onClick={() => setActiveEkstra(null)}
                    >
                      Kembali
                    </button>
                  </div>
                </div>
              </m.div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </LazyMotion>
    </>
  );
}
