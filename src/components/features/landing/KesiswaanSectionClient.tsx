"use client";

import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import type { ReactElement } from "react";

import {
  IcoKsLaurelFacet,
  IcoReceipt,
  IcoUsers,
  IcoX,
} from "@/components/icons/inline-glyphs";
import { useEffect, useId, useMemo, useState } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import { resolveOsisCoverSrc } from "@/lib/ekstrakurikuler-media";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import type { EkskulPublikCard, PrestasiPublikCard } from "@/services/kesiswaan-publik";
import { cn, formatDateId } from "@/lib/utils";

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
  ekskulAktifCount,
}: KesiswaanSectionClientProps): ReactElement {
  const ekskulCountLabel = ekskulAktifCount ?? ekskulItems.length;
  const modalTitleId = useId();
  const [activeEkstra, setActiveEkstra] = useState<EkskulPublikCard | null>(null);

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
      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <MotionInView
                as="article"
                id="ekstrakurikuler"
                className={cn(
                  "scroll-mt-24 group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",
                  "transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md",
                  "dark:border-slate-800 dark:bg-slate-950",
                )}
                delay={0.05}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/12 via-blue-500/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-600/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                        <IcoKsLaurelFacet className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          Program
                        </p>
                        <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                          Ekstrakurikuler
                        </h3>
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                      {ekskulCountLabel} kegiatan
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
                      publicFormalBodyClassName,
                    )}
                  >
                    Daftar unit di bawah disinkronkan dari data sekolah. Penambahan atau perubahan dilakukan
                    melalui administrasi kesiswaan.
                  </p>

                  {ekskulItems.length === 0 ? (
                    <p className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                      Belum ada unit ekstrakurikuler aktif untuk ditampilkan.
                    </p>
                  ) : (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {ekskulItems.map((e, idx) => (
                        <MotionInView
                          as="li"
                          key={e.slug}
                          id={`ekstra-${e.slug}`}
                          className={cn(
                            "scroll-mt-28 group/item relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4",
                            "transition hover:border-amber-200 hover:bg-white",
                            "dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/60",
                          )}
                          delay={0.06 + idx * 0.02}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
                            aria-hidden
                          />
                          <button
                            type="button"
                            className="relative w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                            onClick={() => setActiveEkstra(e)}
                            aria-haspopup="dialog"
                          >
                            <div
                              className={cn(
                                "relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800",
                                publicOptimizedImageContainerClassName,
                              )}
                            >
                              <PublicOptimizedImage
                                src={e.previewSrc}
                                alt={`Kegiatan ${e.name}`}
                                fill
                                sizes="(max-width: 640px) 100vw, 260px"
                                className="object-cover transition-transform duration-500 ease-out group-hover/item:scale-[1.04]"
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                            </div>
                            <p className="font-semibold text-slate-900 dark:text-white">{e.name}</p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                              {e.detail}
                            </p>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700/80 dark:text-amber-300/80">
                              Lihat detail
                            </p>
                          </button>
                        </MotionInView>
                      ))}
                    </ul>
                  )}
                </div>
              </MotionInView>

              <MotionInView
                as="article"
                id="osis"
                className={cn(
                  "scroll-mt-24 group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",
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
      </div>

      <MotionInView as="article" id="prestasi" className="scroll-mt-24 mt-14 w-full min-w-0" delay={0.1}>
              <div className="flex items-center gap-2">
                <IcoKsLaurelFacet className="size-6 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Prestasi siswa</h3>
              </div>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
                  publicFormalBodyClassName,
                )}
              >
                Berikut bukti prestasi yang telah <strong>terverifikasi</strong> oleh admin kesiswaan. Daftar
                diperbarui otomatis dari sistem. Untuk pengajuan prestasi baru, siswa dapat mengunggah bukti
                melalui portal; informasi tambahan juga diumumkan lewat berita sekolah.
              </p>

              {prestasiItems.length > 0 ? (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {prestasiItems.map((p) => {
                    const isPdf = p.fileUrl.toLowerCase().endsWith(".pdf");
                    return (
                      <li
                        key={p.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
                      >
                        <div
                          className={cn(
                            "relative aspect-[16/10] w-full",
                            !isPdf && publicOptimizedImageContainerClassName,
                          )}
                        >
                          {isPdf ? (
                            <div className="flex size-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                              <IcoReceipt className="size-12 opacity-80" aria-hidden />
                              <span className="text-xs font-medium">Bukti PDF</span>
                            </div>
                          ) : (
                            <PublicOptimizedImage
                              src={p.fileUrl}
                              alt={`Ilustrasi prestasi: ${p.judul}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                            {formatDateId(new Date(p.tanggalIso))}
                          </p>
                          <h4 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{p.judul}</h4>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.penyelenggara}</p>
                          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{p.siswaLabel}</p>
                          {p.ringkasan ? (
                            <p
                              className={cn(
                                "mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400",
                                publicFormalBodyClassName,
                              )}
                            >
                              {p.ringkasan}
                            </p>
                          ) : null}
                          <a
                            href={p.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                          >
                            {isPdf ? "Buka dokumen PDF" : "Lihat bukti (gambar)"}
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                  Belum ada prestasi terverifikasi untuk ditampilkan. Setelah admin menyetujui unggahan siswa,
                  entri akan muncul di sini.
                </p>
              )}

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <Link
                  href="/berita/berita-terbaru"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                >
                  Buka berita &amp; pengumuman
                </Link>
              </div>
      </MotionInView>

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
