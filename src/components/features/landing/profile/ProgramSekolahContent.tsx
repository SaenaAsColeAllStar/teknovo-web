import type { ReactElement } from "react";

import { BlueprintFramedHero } from "@/components/features/landing/blueprint/BlueprintFramedHero";
import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { MotionInView } from "@/components/motion/MotionInView";
import { BRAND_SHORT } from "@/lib/branding";
import { PROFIL_SUB_NAV_ITEMS } from "@/lib/profil-landing-content";
import {
  PROGRAM_SEKOLAH_PAGE_LEDE,
  PROGRAM_SEKOLAH_PAGE_TITLE,
  PROGRAM_SEKOLAH_PEMBINAAN_SECTION_INTRO,
  PROGRAM_SEKOLAH_PEMBINAAN_SECTION_TITLE,
} from "@/lib/program-sekolah-content";
import { publicFormalBodyClassName, publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

import { SCHOOL_PROGRAMS } from "./school-programs";

/** Short labels for blueprint plate nav (full names remain on site mega-nav). */
const PROGRAM_BLUEPRINT_NAV = PROFIL_SUB_NAV_ITEMS.map((item) => {
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

export function ProgramSekolahContent(): ReactElement {
  return (
    <>
      <BlueprintFramedHero
        id="program-sekolah-hero"
        titleLines={["Program pembinaan", `${BRAND_SHORT} yang terukur`]}
        lede={PROGRAM_SEKOLAH_PAGE_LEDE}
        primaryCta={{ label: "Lihat jurusan", href: "/akademik/jurusan" }}
        secondaryCta={{ label: "Baca program", href: "#program-pembinaan" }}
        navLinks={PROGRAM_BLUEPRINT_NAV}
        activeHref="/profil/program-sekolah"
      />

      <section
        id="program-pembinaan"
        className={cn(publicPageSectionWhiteClassName, "scroll-mt-24")}
        aria-labelledby="program-pembinaan-heading"
      >
        <div className="public-site-container">
          <MotionInView as="header" className="mx-auto max-w-2xl text-center" delay={0.03}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              {PROGRAM_SEKOLAH_PAGE_TITLE}
            </p>
            <h2
              id="program-pembinaan-heading"
              className="mt-3 text-2xl font-bold tracking-tight text-heading sm:text-3xl"
            >
              {PROGRAM_SEKOLAH_PEMBINAAN_SECTION_TITLE}
            </h2>
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed text-body",
                publicFormalBodyClassName,
              )}
            >
              {PROGRAM_SEKOLAH_PEMBINAAN_SECTION_INTRO}
            </p>
          </MotionInView>

          <ul className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {SCHOOL_PROGRAMS.map((program, idx) => (
              <MotionInView
                as="li"
                key={program.title}
                className={frameShellClass}
                delay={0.06 + idx * 0.03}
              >
                <FramePlusMarks />
                <article className="grid h-full gap-0 sm:grid-cols-[minmax(0,11rem)_1fr] lg:grid-cols-[minmax(0,12rem)_1fr]">
                  <figure className="border-b border-border-default sm:border-b-0 sm:border-r">
                    <div
                      className={cn(
                        "relative aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:min-h-[14rem] sm:h-full",
                        publicOptimizedImageContainerClassName,
                      )}
                    >
                      <PublicOptimizedImage
                        src={program.coverSrc}
                        alt={program.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 200px"
                        className="object-cover"
                        quality={65}
                      />
                    </div>
                  </figure>
                  <div className="flex flex-col justify-center space-y-4 p-6 sm:p-8">
                    <h3 className="text-xl font-semibold tracking-tight text-heading sm:text-2xl">
                      {program.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-body",
                        publicFormalBodyClassName,
                      )}
                    >
                      {program.description}
                    </p>
                  </div>
                </article>
              </MotionInView>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
