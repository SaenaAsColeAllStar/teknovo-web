import type { ReactElement } from "react";

import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { ProfilPageShell } from "@/components/features/landing/profile/ProfilPageShell";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  BRAND_KEPALA_FOTO_SRC,
  BRAND_KEPALA_JABATAN,
  BRAND_KEPALA_NAMA,
  BRAND_SHORT,
} from "@/lib/branding";
import { publicFormalBodyClassName, publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import {
  SAMBUTAN_COMMUNITY_MESSAGE_PARAGRAPHS,
  SAMBUTAN_COMMUNITY_SIGNATURE,
  SAMBUTAN_HERO_EYEBROW,
  SAMBUTAN_INITIATIVES,
  SAMBUTAN_LEADERSHIP_CREDENTIAL,
  SAMBUTAN_LEADERSHIP_EYEBROW,
  SAMBUTAN_PAGE_INTRO,
  SAMBUTAN_PAGE_LEDE,
  SAMBUTAN_PAGE_TITLE,
  SAMBUTAN_SERVICE_BADGE,
  SAMBUTAN_TIMELINE_INTRO,
  SAMBUTAN_TIMELINE_ITEMS,
  SAMBUTAN_VISION_PILLARS,
} from "@/lib/sambutan-landing-content";
import { cn } from "@/lib/utils";

const cardShellClass =
  "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

const initiativeCardClass =
  "flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8";

const initiativeEmphasisCardClass =
  "flex h-full flex-col justify-between gap-4 rounded-2xl border border-blue-600 bg-blue-600 p-6 text-white shadow-sm sm:p-8 dark:border-blue-500 dark:bg-blue-600";

function IcoSambutanPenAccent({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path
        d="M4 20 8 10l10-4-6 14-8 6z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export type SambutanKepalaSectionProps = {
  /** Halaman penuh menambah padding bawah; beranda lebih ringkas. */
  variant?: "home" | "page";
};

function SambutanHomeTeaser(): ReactElement {
  return (
    <MotionInView
      as="section"
      id="sambutan-kepala-sekolah"
      className={cn(publicPageSectionWhiteClassName, "py-10 sm:py-12")}
    >
      <div className="public-site-container">
        <MotionInView as="header" className="mx-auto max-w-2xl text-center" delay={0.03}>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Sambutan Kepala Sekolah
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{SAMBUTAN_PAGE_INTRO}</p>
        </MotionInView>

        <MotionInView as="article" className={cn(cardShellClass, "mt-10")} delay={0.06}>
          <div className="grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]">
            <figure className="border-b border-slate-200 p-6 dark:border-slate-800 md:border-b-0 md:border-r">
              <div
                className={cn(
                  "relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl",
                  publicOptimizedImageContainerClassName,
                )}
              >
                <PublicOptimizedImage
                  src={BRAND_KEPALA_FOTO_SRC}
                  alt={`Foto resmi ${BRAND_KEPALA_JABATAN.toLowerCase()}, ${BRAND_SHORT}`}
                  fill
                  sizes="240px"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-4 text-center md:text-left">
                <p className="font-semibold text-slate-900 dark:text-white">{BRAND_KEPALA_NAMA}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  {BRAND_KEPALA_JABATAN}
                </p>
              </figcaption>
            </figure>
            <div className="space-y-4 p-6 sm:p-8">
              {SAMBUTAN_COMMUNITY_MESSAGE_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </MotionInView>
      </div>
    </MotionInView>
  );
}

function SambutanPageContent(): ReactElement {
  return (
    <ProfilPageShell eyebrow={SAMBUTAN_HERO_EYEBROW} title={SAMBUTAN_PAGE_TITLE} lede={SAMBUTAN_PAGE_LEDE}>
      <div id="sambutan-kepala-sekolah">
        <MotionInView as="article" className={cn(cardShellClass, "mt-10")} delay={0.05}>
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                {SAMBUTAN_LEADERSHIP_EYEBROW}
              </p>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {BRAND_KEPALA_NAMA}
                </h2>
                <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                  {BRAND_KEPALA_JABATAN} {BRAND_SHORT}
                </p>
                <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                  {SAMBUTAN_LEADERSHIP_CREDENTIAL}
                </p>
              </div>
              <span className="inline-flex rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white dark:bg-slate-100 dark:text-slate-900">
                {SAMBUTAN_SERVICE_BADGE}
              </span>
            </div>

            <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-blue-600/90 dark:bg-blue-500/80"
              />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
                <div className={cn("relative aspect-[4/5] w-full", publicOptimizedImageContainerClassName)}>
                  <PublicOptimizedImage
                    src={BRAND_KEPALA_FOTO_SRC}
                    alt={`Foto resmi ${BRAND_KEPALA_JABATAN.toLowerCase()}, ${BRAND_SHORT}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </figure>
          </div>
        </MotionInView>

        <MotionInView as="article" className={cn(cardShellClass, "mt-8")} delay={0.08}>
          <div className="grid md:grid-cols-[minmax(0,15rem)_1fr]">
            <div className="flex flex-col justify-between gap-6 bg-slate-900 p-6 text-white dark:bg-slate-950 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Visi kepemimpinan</h2>
              <AkademikIconGlyph iconKey="jurusan" className="size-8 text-blue-400" />
            </div>
            <ul className="grid md:grid-cols-2">
              {SAMBUTAN_VISION_PILLARS.map((pillar) => (
                <li
                  key={pillar.title}
                  className="border-t border-slate-200 bg-blue-50 p-6 dark:border-slate-800 dark:bg-blue-950/35 sm:p-8 md:border-t-0 md:border-l"
                >
                  <h3 className="text-base font-semibold text-blue-700 dark:text-blue-300">{pillar.title}</h3>
                  <p className={cn("mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                    {pillar.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </MotionInView>

        <MotionInView as="section" className="mt-14" delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Inisiatif prioritas</h2>
            <div className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 sm:ml-6 sm:block" />
          </div>
          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {SAMBUTAN_INITIATIVES.map((item, idx) => (
              <MotionInView as="li" key={item.id} delay={0.12 + idx * 0.03}>
                <article className={item.emphasis ? initiativeEmphasisCardClass : initiativeCardClass}>
                  <div className="space-y-3">
                    <p
                      className={cn(
                        "text-xs font-semibold uppercase tracking-[0.16em]",
                        item.emphasis ? "text-blue-100" : "text-slate-500 dark:text-slate-400",
                      )}
                    >
                      {item.label}
                    </p>
                    <h3 className={cn("text-lg font-semibold", item.emphasis ? "text-white" : "text-slate-900 dark:text-white")}>
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        item.emphasis ? "text-blue-50" : "text-slate-600 dark:text-slate-300",
                        publicFormalBodyClassName,
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </article>
              </MotionInView>
            ))}
          </ul>
        </MotionInView>

        <MotionInView as="section" className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]" delay={0.14}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Riwayat pendidikan & karier</h2>
            <p className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
              {SAMBUTAN_TIMELINE_INTRO}
            </p>
          </div>
          <ol className="relative space-y-8 border-l border-slate-200 pl-6 dark:border-slate-800">
            {SAMBUTAN_TIMELINE_ITEMS.map((item) => (
              <li key={item.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[1.8125rem] top-1.5 size-3 rounded-sm bg-blue-600 ring-4 ring-white dark:ring-slate-950"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">{item.period}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className={cn("mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicFormalBodyClassName)}>
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </MotionInView>

        <MotionInView as="article" className={cn(cardShellClass, "relative mt-14")} delay={0.16}>
          <IcoSambutanPenAccent className="pointer-events-none absolute right-6 top-6 size-24 text-slate-100 dark:text-slate-800 sm:right-10 sm:top-10 sm:size-32" />
          <div className="relative space-y-6 p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Pesan untuk komunitas</h2>
            <div className="space-y-4 border-l-4 border-blue-600 pl-6 dark:border-blue-500">
              {SAMBUTAN_COMMUNITY_MESSAGE_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn(
                    "text-base italic leading-relaxed text-slate-700 dark:text-slate-200",
                    publicFormalBodyClassName,
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="pt-2">
              <p className="font-semibold text-slate-900 dark:text-white">{SAMBUTAN_COMMUNITY_SIGNATURE.name}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {SAMBUTAN_COMMUNITY_SIGNATURE.role}
              </p>
            </div>
          </div>
        </MotionInView>
      </div>
    </ProfilPageShell>
  );
}

export function SambutanKepalaSection({ variant = "page" }: SambutanKepalaSectionProps): ReactElement {
  if (variant === "home") {
    return <SambutanHomeTeaser />;
  }

  return <SambutanPageContent />;
}
