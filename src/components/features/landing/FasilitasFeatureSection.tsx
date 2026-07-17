"use client";

import {
  BookMarked,
  BookOpen,
  Check,
  Fingerprint,
  GraduationCap,
  Monitor,
  PencilRuler,
  Search,
  Sparkles,
  Wifi,
} from "lucide-react";
import { useState, type ReactElement, type ReactNode } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  getFasilitasDetailPath,
  type FasilitasSlug,
} from "@/lib/fasilitas-landing-content";
import { cn } from "@/lib/utils";

export type FasilitasFeatureSectionProps = Readonly<{
  /** Gaya ringan di beranda (border atas); lebar konten tetap `public-site-container`. */
  embedded?: boolean;
}>;

type FeatureId =
  | "absensi-digital"
  | "lms-sekolah"
  | "laboratorium-komputer"
  | "perpustakaan-digital";

type FeatureCard = {
  id: FeatureId;
  slug: FasilitasSlug;
  index: string;
  navLabel: string;
  title: string;
  description: string;
  href: `/fasilitas/${FasilitasSlug}`;
  mock: ReactNode;
};

const FEATURES: readonly FeatureCard[] = [
  {
    id: "absensi-digital",
    slug: "absensi-digital",
    index: "01",
    navLabel: "Absensi",
    title: "Absensi Digital",
    description:
      "Tap masuk real-time, absensi per pertemuan, dan portal orang tua — kedisiplinan yang terhubung ke LMS.",
    href: getFasilitasDetailPath("absensi-digital"),
    mock: <AbsensiMock />,
  },
  {
    id: "lms-sekolah",
    slug: "lms-sekolah",
    index: "02",
    navLabel: "LMS",
    title: "LMS Sekolah",
    description:
      "Materi, tugas ber-deadline, dan evaluasi formatif — satu portal untuk guru, siswa, dan orang tua.",
    href: getFasilitasDetailPath("lms-sekolah"),
    mock: <LmsMock />,
  },
  {
    id: "laboratorium-komputer",
    slug: "laboratorium-komputer",
    index: "03",
    navLabel: "Lab",
    title: "Lab Komputer",
    description:
      "Workstation dual-jurusan: CAD & simulasi mesin (TM), plus software reservasi & layanan wisata (ULW).",
    href: getFasilitasDetailPath("laboratorium-komputer"),
    mock: <LabMock />,
  },
  {
    id: "perpustakaan-digital",
    slug: "perpustakaan-digital",
    index: "04",
    navLabel: "Perpus",
    title: "Perpustakaan Digital",
    description:
      "Katalog daring, e-book, dan ruang baca — literasi serta riset mandiri yang terhubung ke materi LMS.",
    href: getFasilitasDetailPath("perpustakaan-digital"),
    mock: <PerpustakaanMock />,
  },
] as const;

function AbsensiMock(): ReactElement {
  return (
    <div className="relative h-[11.5rem] w-full sm:h-[12.5rem]" aria-hidden>
      <div className="absolute -left-1 top-1 z-10 w-[60%] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-body-subtle">
            Hari ini
          </span>
          <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
            Hadir
          </span>
        </div>
        <p className="mt-2 text-lg font-bold tabular-nums tracking-tight text-heading">07:42</p>
        <p className="text-[11px] text-body">Tap gerbang utama</p>
        <div className="mt-2.5 flex gap-1.5">
          {["Sen", "Sel", "Rab", "Kam", "Jum"].map((d, i) => (
            <span
              key={d}
              className={cn(
                "flex size-6 items-center justify-center rounded-md text-[9px] font-semibold",
                i < 4 ? "bg-brand/10 text-brand" : "bg-[#F4F4FB] text-body-subtle",
              )}
            >
              {i < 4 ? <Check className="size-3" strokeWidth={2.5} /> : d[0]}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 z-20 w-[50%] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
            <Fingerprint className="size-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-heading">Verifikasi</p>
            <p className="text-[10px] text-body">ID siswa aktif</p>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F4F4FB]">
          <div className="h-full w-[78%] rounded-full bg-brand" />
        </div>
      </div>
      <div className="absolute right-2 top-2 z-0 rounded-lg border border-border-default bg-white px-2.5 py-1.5 text-[10px] font-medium text-body shadow-sm">
        Ortu · live
      </div>
    </div>
  );
}

function LmsMock(): ReactElement {
  return (
    <div className="relative h-[11.5rem] w-full sm:h-[12.5rem]" aria-hidden>
      <div className="absolute -left-1 top-0 z-10 w-[64%] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <BookOpen className="size-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-heading">Modul · Gambar Teknik</p>
            <p className="text-[10px] text-body">4 tugas · 2 selesai</p>
          </div>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {[
            { label: "Latihan proyeksi", done: true },
            { label: "Kuis PKK", done: true },
            { label: "Proyek tour guide", done: false },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-2 rounded-lg bg-[#F8F8FC] px-2 py-1"
            >
              <span className="text-[10px] font-medium text-heading">{row.label}</span>
              <span
                className={cn(
                  "inline-flex size-4 items-center justify-center rounded-full border",
                  row.done
                    ? "border-brand bg-brand text-white"
                    : "border-border-default bg-white",
                )}
              >
                {row.done ? <Check className="size-2.5" strokeWidth={3} /> : null}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 z-20 w-[48%] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-body-subtle">Nilai</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-heading">86</p>
        <div className="mt-2 flex items-end gap-1">
          {[40, 70, 55, 85, 62].map((h, i) => (
            <span
              key={i}
              className="w-full rounded-sm bg-brand/15"
              style={{ height: `${Math.max(8, h / 5)}px` }}
            />
          ))}
        </div>
      </div>
      <div className="absolute right-2 top-3 z-0 flex items-center gap-1 rounded-lg border border-border-default bg-white px-2 py-1 text-[10px] font-medium text-body shadow-sm">
        <GraduationCap className="size-3 text-brand" />
        Guru
      </div>
    </div>
  );
}

function LabMock(): ReactElement {
  return (
    <div className="relative h-[11.5rem] w-full sm:h-[12.5rem]" aria-hidden>
      <div className="absolute -left-1 top-0 z-10 w-[66%] overflow-hidden rounded-xl border border-border-default bg-[#F4F4FB] p-2.5 shadow-sm">
        <div className="mb-2 flex gap-1">
          <span className="size-1.5 rounded-full bg-border-default" />
          <span className="size-1.5 rounded-full bg-border-default" />
          <span className="size-1.5 rounded-full bg-brand/40" />
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-body-subtle">
          Sesi praktik
        </p>
        <div className="mt-1.5 space-y-1">
          <div className="rounded-md bg-white/80 px-2 py-1">
            <p className="text-[9px] font-semibold text-brand">TM</p>
            <p className="text-[10px] font-medium text-heading">CAD · CNC · Ukuran</p>
          </div>
          <div className="rounded-md bg-white/80 px-2 py-1">
            <p className="text-[9px] font-semibold text-brand">ULW</p>
            <p className="text-[10px] font-medium text-heading">Reservasi · Ticketing</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 z-20 w-[52%] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Monitor className="size-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-heading">Stasiun 08</p>
            <p className="flex items-center gap-1 text-[10px] text-success">
              <Wifi className="size-3" />
              Online
            </p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {["CAD", "CNC", "Hotel"].map((label) => (
            <span
              key={label}
              className="rounded-md bg-[#F8F8FC] py-1 text-center text-[9px] font-semibold text-body"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute right-1 top-2 z-0 flex items-center gap-1 rounded-lg border border-border-default bg-white px-2 py-1 text-[10px] font-medium text-heading shadow-sm">
        <PencilRuler className="size-3 text-brand" />
        TM · ULW
      </div>
    </div>
  );
}

function PerpustakaanMock(): ReactElement {
  return (
    <div className="relative h-[11.5rem] w-full sm:h-[12.5rem]" aria-hidden>
      <div className="absolute -left-1 top-1 z-10 w-[64%] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2 rounded-lg bg-[#F8F8FC] px-2 py-1.5">
          <Search className="size-3.5 shrink-0 text-body-subtle" />
          <span className="truncate text-[10px] text-body">Cari judul / penulis…</span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {[
            { title: "Dasar Pemesinan", meta: "Cetak · tersedia" },
            { title: "Pariwisata Digital", meta: "E-book · pinjam" },
            { title: "Literasi Media", meta: "E-book · tersedia" },
          ].map((row) => (
            <div
              key={row.title}
              className="flex items-start justify-between gap-2 rounded-lg border border-border-default/80 px-2 py-1.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-heading">{row.title}</p>
                <p className="text-[9px] text-body">{row.meta}</p>
              </div>
              <BookMarked className="mt-0.5 size-3 shrink-0 text-brand" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 z-20 w-[46%] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <BookOpen className="size-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-heading">Pinjaman</p>
            <p className="text-[10px] text-body">2 aktif</p>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F4F4FB]">
          <div className="h-full w-[55%] rounded-full bg-brand" />
        </div>
        <p className="mt-1.5 text-[9px] text-body-subtle">Kuota 2 / 4 judul</p>
      </div>
      <div className="absolute right-2 top-2 z-0 rounded-lg border border-border-default bg-white px-2.5 py-1.5 text-[10px] font-medium text-body shadow-sm">
        Katalog · live
      </div>
    </div>
  );
}

/**
 * Beranda — section `#fasilitas` gaya feature cards + segmented nav.
 */
export function FasilitasFeatureSection({
  embedded = false,
}: FasilitasFeatureSectionProps = {}): ReactElement {
  const [activeId, setActiveId] = useState<FeatureId>("absensi-digital");

  return (
    <MotionInView
      as="section"
      id="fasilitas"
      className={cn(
        "scroll-mt-20",
        embedded
          ? "col-span-full w-full border-t border-border-default pt-10 sm:pt-14"
          : "border-b border-border-default bg-surface py-16 sm:py-20",
      )}
    >
      <div className="public-site-container">
        <MotionInView as="header" className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-[#F8F8FC] px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles className="size-3.5 shrink-0" aria-hidden />
            Fasilitas digital
          </p>

          <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Sarana sekolah yang siap dipakai
            <br className="hidden sm:block" />
            {" "}untuk belajar terukur
          </h2>
        </MotionInView>

        <div className="mt-8 flex justify-center sm:mt-10" role="tablist" aria-label="Pilih fasilitas">
          <div className="inline-flex max-w-full flex-wrap justify-center gap-0.5 rounded-full border border-border-default bg-[#F8F8FC] p-1">
            {FEATURES.map((feature) => {
              const isActive = feature.id === activeId;
              return (
                <button
                  key={feature.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`fasilitas-card-${feature.id}`}
                  id={`fasilitas-tab-${feature.id}`}
                  onClick={() => setActiveId(feature.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 sm:px-4",
                    isActive
                      ? "bg-brand text-white"
                      : "bg-transparent text-body hover:text-heading",
                  )}
                >
                  {feature.navLabel}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 xl:gap-6">
          {FEATURES.map((feature, idx) => {
            const isActive = feature.id === activeId;
            return (
              <MotionInView
                as="li"
                key={feature.id}
                id={feature.slug}
                delay={0.05 * idx}
                className="scroll-mt-24"
              >
                <article
                  id={`fasilitas-card-${feature.id}`}
                  role="tabpanel"
                  aria-labelledby={`fasilitas-tab-${feature.id}`}
                  className={cn(
                    "flex h-full flex-col overflow-hidden rounded-2xl border bg-surface transition-[border-color,box-shadow,opacity,transform] duration-300",
                    isActive
                      ? "border-brand/35 shadow-[0_12px_40px_-18px_rgba(19,19,186,0.35)] xl:scale-[1.02]"
                      : "border-border-default opacity-75 hover:opacity-100",
                  )}
                >
                  <button
                    type="button"
                    className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/30"
                    onClick={() => setActiveId(feature.id)}
                    aria-pressed={isActive}
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-sm font-semibold tabular-nums text-body-subtle">
                          {feature.index}
                        </span>
                        <h3 className="text-lg font-bold tracking-tight text-heading sm:text-xl">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-body">
                        {feature.description}
                      </p>
                    </div>

                    <div className="relative mt-auto overflow-hidden border-t border-border-default bg-[#F8F8FC] px-3 pb-2 pt-4">
                      {feature.mock}
                    </div>
                  </button>

                  <div className="border-t border-border-default px-5 py-3.5 sm:px-6">
                    <PublicSiteLink
                      href={feature.href}
                      className="text-sm font-semibold text-brand transition-colors hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                    >
                      Lihat detail →
                    </PublicSiteLink>
                  </div>
                </article>
              </MotionInView>
            );
          })}
        </ul>
      </div>
    </MotionInView>
  );
}
