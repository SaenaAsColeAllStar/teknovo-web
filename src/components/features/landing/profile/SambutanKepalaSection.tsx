import type { ReactElement } from "react";

import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import { BlueprintFramedHero } from "@/components/features/landing/blueprint/BlueprintFramedHero";
import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  BRAND_KEPALA_FOTO_SRC,
  BRAND_KEPALA_JABATAN,
  BRAND_KEPALA_NAMA,
  BRAND_SHORT,
} from "@/lib/branding";
import { PROFIL_SUB_NAV_ITEMS } from "@/lib/profil-landing-content";
import { publicFormalBodyClassName, publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import {
  SAMBUTAN_COMMUNITY_MESSAGE_PARAGRAPHS,
  SAMBUTAN_COMMUNITY_SIGNATURE,
  SAMBUTAN_INITIATIVES,
  SAMBUTAN_LEADERSHIP_CREDENTIAL,
  SAMBUTAN_LEADERSHIP_EYEBROW,
  SAMBUTAN_PAGE_INTRO,
  SAMBUTAN_PAGE_LEDE,
  SAMBUTAN_SERVICE_BADGE,
  SAMBUTAN_TIMELINE_INTRO,
  SAMBUTAN_TIMELINE_ITEMS,
  SAMBUTAN_VISION_PILLARS,
} from "@/lib/sambutan-landing-content";
import { cn } from "@/lib/utils";

/** Short labels for blueprint plate nav (full names remain on site mega-nav). */
const SAMBUTAN_BLUEPRINT_NAV = PROFIL_SUB_NAV_ITEMS.map((item) => {
  const shortByHref: Record<string, string> = {
    "/profil/sambutan": "Sambutan",
    "/profil/visi-misi": "Visi & Misi",
    "/profil/sejarah": "Sejarah",
    "/profil/program-sekolah": "Program",
  };
  return {
    href: item.href,
    label: shortByHref[item.href] ?? item.label,
  };
});

/** Atlas / blueprint plate: square corners, flat border, no shadow. */
const frameShellClass = "relative border border-border-default bg-surface";

const initiativeFrameClass =
  "flex h-full flex-col justify-between gap-4 bg-surface p-6 sm:p-8";

const initiativeEmphasisFrameClass =
  "flex h-full flex-col justify-between gap-4 bg-brand p-6 text-white sm:p-8";
function FramePlusMarks(): ReactElement {
  return (
    <>
      <BlueprintPlusMark className="left-0 top-0" />
      <BlueprintPlusMark className="left-full top-0" />
      <BlueprintPlusMark className="bottom-0 left-0 translate-y-1/2" />
      <BlueprintPlusMark className="bottom-0 left-full translate-y-1/2" />
    </>
  );
}

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
          <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
            Sambutan Kepala Sekolah
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-body">{SAMBUTAN_PAGE_INTRO}</p>
        </MotionInView>

        <MotionInView as="article" className={cn(frameShellClass, "mt-10")} delay={0.06}>
          <FramePlusMarks />
          <div className="grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]">
            <figure className="border-b border-border-default p-6 md:border-b-0 md:border-r">
              <div
                className={cn(
                  "relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden border border-border-default",
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
                <p className="font-semibold text-heading">{BRAND_KEPALA_NAMA}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-body-subtle">
                  {BRAND_KEPALA_JABATAN}
                </p>
              </figcaption>
            </figure>
            <div className="space-y-4 p-6 sm:p-8">
              {SAMBUTAN_COMMUNITY_MESSAGE_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}
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
    <>
      <BlueprintFramedHero
        id="sambutan-hero"
        titleLines={["Pesan kepala sekolah,", `kepemimpinan ${BRAND_SHORT}`]}
        lede={SAMBUTAN_PAGE_LEDE}
        primaryCta={{ label: "Baca sambutan", href: "#pesan-sambutan" }}
        secondaryCta={{ label: "Visi & Misi", href: "/profil/visi-misi" }}
        navLinks={SAMBUTAN_BLUEPRINT_NAV}
        activeHref="/profil/sambutan"
      />

      <section
        id="sambutan-kepala-sekolah"
        className={cn(publicPageSectionWhiteClassName, "scroll-mt-24")}
        aria-labelledby="sambutan-leadership-heading"
      >
        <div className="public-site-container">
          <MotionInView as="article" className={frameShellClass} delay={0.05}>
            <FramePlusMarks />
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  {SAMBUTAN_LEADERSHIP_EYEBROW}
                </p>
                <div className="space-y-3">
                  <h2
                    id="sambutan-leadership-heading"
                    className="text-3xl font-bold tracking-tight text-heading sm:text-4xl"
                  >
                    {BRAND_KEPALA_NAMA}
                  </h2>
                  <p className="text-base font-medium text-body">
                    {BRAND_KEPALA_JABATAN} {BRAND_SHORT}
                  </p>
                  <p className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}>
                    {SAMBUTAN_LEADERSHIP_CREDENTIAL}
                  </p>
                </div>
                <span className="inline-flex border border-brand bg-brand px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  {SAMBUTAN_SERVICE_BADGE}
                </span>
              </div>

              <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div
                  aria-hidden
                  className="absolute -bottom-3 -right-3 h-full w-full bg-brand"
                />
                <div className="relative overflow-hidden border border-border-default bg-surface">
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

          <MotionInView as="article" className={cn(frameShellClass, "mt-8")} delay={0.08}>
            <FramePlusMarks />
            <div className="grid md:grid-cols-[minmax(0,15rem)_1fr]">
              <div className="flex flex-col justify-between gap-6 border-b border-border-default bg-brand p-6 text-white md:border-b-0 md:border-r sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Visi kepemimpinan</h2>
                <AkademikIconGlyph iconKey="jurusan" className="size-8 text-white/70" />
              </div>
              <ul className="grid md:grid-cols-2">
                {SAMBUTAN_VISION_PILLARS.map((pillar, idx) => (
                  <li
                    key={pillar.title}
                    className={cn(
                      "border-t border-border-default bg-neutral-soft p-6 sm:p-8 md:border-t-0",
                      idx > 0 && "md:border-l md:border-border-default",
                    )}
                  >
                    <h3 className="text-base font-semibold text-heading">{pillar.title}</h3>
                    <p
                      className={cn(
                        "mt-3 text-sm leading-relaxed text-body",
                        publicFormalBodyClassName,
                      )}
                    >
                      {pillar.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </MotionInView>

          <MotionInView as="section" className="mt-14" delay={0.1}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-heading">Inisiatif prioritas</h2>
              <div className="hidden h-px flex-1 bg-border-default sm:ml-6 sm:block" />
            </div>
            <ul className="mt-8 grid gap-0 border border-border-default lg:grid-cols-3">
              {SAMBUTAN_INITIATIVES.map((item, idx) => (
                <MotionInView
                  as="li"
                  key={item.id}
                  className={cn(
                    idx > 0 && "border-t border-border-default lg:border-t-0 lg:border-l",
                  )}
                  delay={0.12 + idx * 0.03}
                >
                  <article className={item.emphasis ? initiativeEmphasisFrameClass : initiativeFrameClass}>
                    <div className="space-y-3">
                      <p
                        className={cn(
                          "text-xs font-semibold uppercase tracking-[0.16em]",
                          item.emphasis ? "text-white/75" : "text-body-subtle",
                        )}
                      >
                        {item.label}
                      </p>
                      <h3
                        className={cn(
                          "text-lg font-semibold",
                          item.emphasis ? "text-white" : "text-heading",
                        )}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          item.emphasis ? "text-white/90" : "text-body",
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
              <h2 className="text-2xl font-bold tracking-tight text-heading">
                Riwayat pendidikan & karier
              </h2>
              <p className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}>
                {SAMBUTAN_TIMELINE_INTRO}
              </p>
            </div>
            <ol className="relative space-y-8 border-l border-border-default pl-6">
              {SAMBUTAN_TIMELINE_ITEMS.map((item) => (
                <li key={item.title} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[1.8125rem] top-1.5 size-3 border border-brand bg-brand ring-4 ring-surface"
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                    {item.period}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-heading">{item.title}</h3>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed text-body",
                      publicFormalBodyClassName,
                    )}
                  >
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </MotionInView>

          <MotionInView
            as="article"
            id="pesan-sambutan"
            className={cn(frameShellClass, "relative mt-14 scroll-mt-24")}
            delay={0.16}
          >
            <FramePlusMarks />
            <IcoSambutanPenAccent className="pointer-events-none absolute right-6 top-6 size-24 text-border-default sm:right-10 sm:top-10 sm:size-32" />
            <div className="relative space-y-6 p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-heading">
                Pesan untuk komunitas
              </h2>
              <div className="space-y-4 border-l-2 border-brand pl-6">
                {SAMBUTAN_COMMUNITY_MESSAGE_PARAGRAPHS.map((paragraph) => (
                  <p
                    key={paragraph}
                    className={cn(
                      "text-base italic leading-relaxed text-body",
                      publicFormalBodyClassName,
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="border-t border-border-default pt-4">
                <p className="font-semibold text-heading">{SAMBUTAN_COMMUNITY_SIGNATURE.name}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-body-subtle">
                  {SAMBUTAN_COMMUNITY_SIGNATURE.role}
                </p>
              </div>
            </div>
          </MotionInView>
        </div>
      </section>
    </>
  );
}

export function SambutanKepalaSection({ variant = "page" }: SambutanKepalaSectionProps): ReactElement {
  if (variant === "home") {
    return <SambutanHomeTeaser />;
  }

  return <SambutanPageContent />;
}
