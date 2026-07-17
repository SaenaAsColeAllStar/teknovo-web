"use client";

import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import type { ReactElement } from "react";
import { useEffect, useId, useMemo, useState } from "react";

import { EkstrakurikulerIconGlyph } from "@/components/features/landing/kesiswaan/EkstrakurikulerIconGlyph";
import { KesiswaanIconGlyph } from "@/components/features/landing/kesiswaan/KesiswaanIconGlyph";
import { MotionInView } from "@/components/motion/MotionInView";
import { IcoChevronRight } from "@/components/icons/inline-glyphs";
import {
  EKSTRA_FILTER_OPTIONS,
  EKSTRA_KATEGORI_INTRO,
  EKSTRA_KATEGORI_LABELS,
  type EkstrakurikulerFilterKey,
} from "@/lib/ekstrakurikuler-landing-content";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import type { EkskulPublikCard, EkskulPublikKategori } from "@/services/kesiswaan-publik";
import { cn } from "@/lib/utils";

const cardShellClass =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200/80 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-amber-500/30";

const kategoriBadgeClass: Record<EkskulPublikKategori, string> = {
  TEKNOLOGI: "border-blue-200/80 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200",
  OLAHRAGA:
    "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200",
  AKADEMIK:
    "border-amber-200/80 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200",
  SENI: "border-violet-200/80 bg-violet-50 text-violet-800 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-200",
};

const filterBtnBase =
  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600";

const KATEGORI_INTRO_ORDER: Exclude<EkstrakurikulerFilterKey, "SEMUA">[] = [
  "TEKNOLOGI",
  "OLAHRAGA",
  "AKADEMIK",
  "SENI",
];

export type KesiswaanEkstrakurikulerClientProps = {
  ekskulItems: EkskulPublikCard[];
};

function EkskulMetaRow({
  iconKey,
  label,
}: {
  iconKey: "schedule" | "location" | "coach";
  label: string;
}): ReactElement {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <EkstrakurikulerIconGlyph iconKey={iconKey} className="size-3.5 shrink-0 opacity-70" />
      <span className="line-clamp-1">{label}</span>
    </span>
  );
}

export function KesiswaanEkstrakurikulerClient({
  ekskulItems,
}: KesiswaanEkstrakurikulerClientProps): ReactElement {
  const modalTitleId = useId();
  const [categoryFilter, setCategoryFilter] = useState<EkstrakurikulerFilterKey>("SEMUA");
  const [activeEkstra, setActiveEkstra] = useState<EkskulPublikCard | null>(null);

  const filteredItems = useMemo(() => {
    if (categoryFilter === "SEMUA") {
      return ekskulItems;
    }
    return ekskulItems.filter((e) => e.kategori === categoryFilter);
  }, [ekskulItems, categoryFilter]);

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
      <div className="sticky top-[var(--public-nav-offset,4.5rem)] z-20 -mx-4 mt-8 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95 sm:-mx-6 sm:px-6">
        <div
          className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter kategori ekstrakurikuler"
        >
          {EKSTRA_FILTER_OPTIONS.map((opt) => {
            const active = categoryFilter === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategoryFilter(opt.key)}
                className={cn(
                  filterBtnBase,
                  active
                    ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-600/50 dark:bg-amber-950/50 dark:text-amber-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600",
                )}
              >
                <EkstrakurikulerIconGlyph
                  iconKey={opt.iconKey}
                  className={cn("size-4", active ? "text-amber-700 dark:text-amber-300" : "opacity-60")}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {categoryFilter === "SEMUA" ? (
        <div className="mt-6 hidden space-y-3 sm:block">
          {KATEGORI_INTRO_ORDER.map((key) => {
            const intro = EKSTRA_KATEGORI_INTRO[key];
            const hasItems = ekskulItems.some((e) => e.kategori === key);
            if (!hasItems) {
              return null;
            }
            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {EKSTRA_KATEGORI_LABELS[key]}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{intro.title}</p>
                <p className={cn("mt-1 text-sm text-slate-600 dark:text-slate-400", publicFormalBodyClassName)}>
                  {intro.body}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {filteredItems.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
          {categoryFilter === "SEMUA"
            ? "Belum ada unit ekstrakurikuler aktif untuk ditampilkan."
            : `Belum ada unit dalam kategori ${EKSTRA_KATEGORI_LABELS[categoryFilter]}.`}
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => (
            <MotionInView
              as="li"
              key={item.slug}
              id={`ekstra-${item.slug}`}
              className={cn(cardShellClass, "scroll-mt-36")}
              delay={0.04 + idx * 0.02}
            >
              <button
                type="button"
                className="relative flex w-full flex-1 flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                onClick={() => setActiveEkstra(item)}
                aria-haspopup="dialog"
              >
                <div
                  className={cn(
                    "relative aspect-[16/10] w-full overflow-hidden sm:aspect-[5/3]",
                    publicOptimizedImageContainerClassName,
                  )}
                >
                  <PublicOptimizedImage
                    src={item.previewSrc}
                    alt={`Kegiatan ekstrakurikuler ${item.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
                      kategoriBadgeClass[item.kategori],
                    )}
                  >
                    {EKSTRA_KATEGORI_LABELS[item.kategori]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{item.name}</h3>
                  <p
                    className={cn(
                      "line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
                      publicFormalBodyClassName,
                    )}
                  >
                    {item.detail}
                  </p>
                  {(item.jadwalRingkas || item.lokasiLatihan || item.pembinaNama) && (
                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                      {item.jadwalRingkas ? (
                        <EkskulMetaRow iconKey="schedule" label={item.jadwalRingkas} />
                      ) : null}
                      {item.lokasiLatihan ? (
                        <EkskulMetaRow iconKey="location" label={item.lokasiLatihan} />
                      ) : null}
                      {item.pembinaNama ? (
                        <EkskulMetaRow iconKey="coach" label={item.pembinaNama} />
                      ) : null}
                    </div>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                    Selengkapnya
                    <IcoChevronRight className="size-3.5" aria-hidden />
                  </span>
                </div>
              </button>
            </MotionInView>
          ))}
        </ul>
      )}

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
                  "relative max-h-[min(90vh,52rem)] w-full max-w-[46rem] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl",
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
                      {EKSTRA_KATEGORI_LABELS[activeEkstra.kategori]}
                    </p>
                    <h3
                      id={modalTitleId}
                      className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
                    >
                      {activeEkstra.name}
                    </h3>
                    {activeEkstra.pembinaNama ? (
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <EkstrakurikulerIconGlyph iconKey="coach" className="size-4 opacity-70" />
                        <span>
                          Pembina:{" "}
                          <span className="font-medium text-slate-800 dark:text-slate-200">{activeEkstra.pembinaNama}</span>
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    onClick={() => setActiveEkstra(null)}
                    aria-label="Tutup detail"
                  >
                    <KesiswaanIconGlyph iconKey="close" className="size-5" />
                  </button>
                </div>

                <div className={cn("relative aspect-[16/9] w-full", publicOptimizedImageContainerClassName)}>
                  <PublicOptimizedImage
                    src={activeEkstra.previewSrc}
                    alt={`Kegiatan ekstrakurikuler ${activeEkstra.name}`}
                    fill
                    className="object-cover"
                    sizes="736px"
                  />
                </div>

                <div className="relative grid gap-5 p-5 md:grid-cols-[1fr,200px]">
                  <div className="space-y-4">
                    <p className={cn("text-sm leading-relaxed text-slate-700 dark:text-slate-300", publicFormalBodyClassName)}>
                      {activeEkstra.fullDescription}
                    </p>

                    {activeEkstra.jadwalRingkas || activeEkstra.lokasiLatihan ? (
                      <dl className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:grid-cols-2">
                        {activeEkstra.jadwalRingkas ? (
                          <div>
                            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                              <EkstrakurikulerIconGlyph iconKey="schedule" className="size-3.5" />
                              Jadwal
                            </dt>
                            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">{activeEkstra.jadwalRingkas}</dd>
                          </div>
                        ) : null}
                        {activeEkstra.lokasiLatihan ? (
                          <div>
                            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                              <EkstrakurikulerIconGlyph iconKey="location" className="size-3.5" />
                              Lokasi
                            </dt>
                            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">{activeEkstra.lokasiLatihan}</dd>
                          </div>
                        ) : null}
                      </dl>
                    ) : null}

                    {activeEkstra.relatedAchievements.length > 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          <EkstrakurikulerIconGlyph iconKey="prestasi" className="size-3.5" />
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
                    <Link
                      href="/kesiswaan/prestasi#prestasi"
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:hover:bg-amber-500"
                      onClick={() => setActiveEkstra(null)}
                    >
                      <EkstrakurikulerIconGlyph iconKey="prestasi" className="size-4" />
                      Lihat prestasi siswa
                    </Link>
                    <Link
                      href="/kesiswaan"
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                      onClick={() => setActiveEkstra(null)}
                    >
                      <EkstrakurikulerIconGlyph iconKey="semua" className="size-4 opacity-70" />
                      Beranda kesiswaan
                    </Link>
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
