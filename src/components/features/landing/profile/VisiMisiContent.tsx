import type { ReactElement } from "react";

import { BlueprintFramedHero } from "@/components/features/landing/blueprint/BlueprintFramedHero";
import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";
import { MotionInView } from "@/components/motion/MotionInView";
import { BRAND_SHORT } from "@/lib/branding";
import { PROFIL_SUB_NAV_ITEMS } from "@/lib/profil-landing-content";
import { publicFormalBodyClassName, publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import {
  VISI_MISI_HERO_EYEBROW,
  VISI_MISI_HERO_INTRO,
  VISI_MISI_MISI_ITEMS,
  VISI_MISI_MOTTO,
  VISI_MISI_NILAI_CARDS,
  VISI_MISI_PAGE_LEDE,
  VISI_MISI_PAGE_TITLE,
  VISI_MISI_TUJUAN_ITEMS,
  VISI_MISI_VISI_TEXT,
} from "@/lib/visi-misi-content";
import { cn } from "@/lib/utils";

/** Short labels for blueprint plate nav (full names remain on site mega-nav). */
const VISI_MISI_BLUEPRINT_NAV = PROFIL_SUB_NAV_ITEMS.map((item) => {
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

export function VisiMisiContent(): ReactElement {
  return (
    <>
      <BlueprintFramedHero
        id="visi-misi-hero"
        titleLines={["Visi, misi, tujuan,", `dan nilai ${BRAND_SHORT}`]}
        lede={VISI_MISI_PAGE_LEDE}
        primaryCta={{ label: "Baca visi & misi", href: "#visi-misi" }}
        secondaryCta={{ label: "Program Sekolah", href: "/profil/program-sekolah" }}
        navLinks={VISI_MISI_BLUEPRINT_NAV}
        activeHref="/profil/visi-misi"
      />

      <section
        id="visi-misi"
        className={cn(publicPageSectionWhiteClassName, "scroll-mt-24")}
        aria-labelledby="visi-misi-heading"
      >
        <div className="public-site-container">
          <MotionInView as="header" className="max-w-2xl" delay={0.03}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              {VISI_MISI_HERO_EYEBROW}
            </p>
            <h2
              id="visi-misi-heading"
              className="mt-3 text-2xl font-bold tracking-tight text-heading sm:text-3xl"
            >
              {VISI_MISI_PAGE_TITLE}
            </h2>
            <div className="mt-4 space-y-3">
              {VISI_MISI_HERO_INTRO.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </MotionInView>

          <MotionInView as="article" className={cn(frameShellClass, "mt-10")} delay={0.06}>
            <FramePlusMarks />
            <div className="grid md:grid-cols-[minmax(0,14rem)_1fr]">
              <div className="flex flex-col justify-between gap-6 border-b border-border-default bg-brand p-6 text-white md:border-b-0 md:border-r sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">Visi</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                  Arah sekolah
                </p>
              </div>
              <div className="space-y-5 p-6 sm:p-8">
                <p
                  className={cn(
                    "text-base leading-relaxed text-heading sm:text-lg",
                    publicFormalBodyClassName,
                  )}
                >
                  {VISI_MISI_VISI_TEXT}
                </p>
                <p
                  className={cn(
                    "border-l-2 border-brand pl-4 text-sm italic leading-relaxed text-body",
                    publicFormalBodyClassName,
                  )}
                >
                  {VISI_MISI_MOTTO}
                </p>
              </div>
            </div>
          </MotionInView>

          <MotionInView as="section" className="mt-14" delay={0.08}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-2xl font-bold tracking-tight text-heading">Misi</h3>
              <div className="hidden h-px flex-1 bg-border-default sm:ml-6 sm:block" />
            </div>
            <ul className="mt-8 grid gap-0 border border-border-default lg:grid-cols-2">
              {VISI_MISI_MISI_ITEMS.map((item, idx) => (
                <MotionInView
                  as="li"
                  key={item.title}
                  className={cn(
                    "border-border-default bg-surface p-6 sm:p-8",
                    idx > 0 && "border-t lg:border-t-0",
                    idx % 2 === 1 && "lg:border-l",
                    idx >= 2 && "lg:border-t",
                  )}
                  delay={0.1 + idx * 0.03}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-body-subtle">
                    {String(idx + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-3 text-base font-semibold text-heading">{item.title}</h4>
                  <p
                    className={cn(
                      "mt-3 text-sm leading-relaxed text-body",
                      publicFormalBodyClassName,
                    )}
                  >
                    {item.description}
                  </p>
                </MotionInView>
              ))}
            </ul>
          </MotionInView>

          <MotionInView
            as="section"
            className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,16rem)_1fr]"
            delay={0.12}
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight text-heading">Tujuan</h3>
              <p className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}>
                Capaian operasional yang menjadi acuan penyelenggaraan pendidikan di {BRAND_SHORT}.
              </p>
            </div>
            <ol className="relative space-y-8 border-l border-border-default pl-6">
              {VISI_MISI_TUJUAN_ITEMS.map((item, idx) => (
                <li key={item} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[1.8125rem] top-1.5 size-3 border border-brand bg-brand ring-4 ring-surface"
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                    Tujuan {String(idx + 1).padStart(2, "0")}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed text-body",
                      publicFormalBodyClassName,
                    )}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </MotionInView>

          <MotionInView as="section" className="mt-14" delay={0.14}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-2xl font-bold tracking-tight text-heading">Nilai unggulan</h3>
              <div className="hidden h-px flex-1 bg-border-default sm:ml-6 sm:block" />
            </div>
            <ul className="mt-8 grid gap-0 border border-border-default sm:grid-cols-2 lg:grid-cols-4">
              {VISI_MISI_NILAI_CARDS.map((card, idx) => (
                <MotionInView
                  as="li"
                  key={card.id}
                  className={cn(
                    "flex h-full flex-col gap-3 bg-surface p-6 sm:p-8",
                    idx > 0 && "border-t border-border-default sm:border-t-0",
                    idx % 2 === 1 && "sm:border-l sm:border-border-default",
                    idx >= 2 && "sm:border-t sm:border-border-default",
                    idx > 0 && "lg:border-t-0 lg:border-l lg:border-border-default",
                  )}
                  delay={0.16 + idx * 0.03}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                    {card.title}
                  </p>
                  <p
                    className={cn(
                      "text-sm leading-relaxed text-body",
                      publicFormalBodyClassName,
                    )}
                  >
                    {card.description}
                  </p>
                </MotionInView>
              ))}
            </ul>
          </MotionInView>
        </div>
      </section>
    </>
  );
}
