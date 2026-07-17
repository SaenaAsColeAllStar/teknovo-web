import type { ReactElement } from "react";

import { BlueprintFramedHero } from "@/components/features/landing/blueprint/BlueprintFramedHero";
import { BlueprintPlusMark } from "@/components/features/landing/blueprint/BlueprintPlusMark";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { MotionInView } from "@/components/motion/MotionInView";
import { BRAND_SHORT } from "@/lib/branding";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { PROFIL_SUB_NAV_ITEMS } from "@/lib/profil-landing-content";
import { publicFormalBodyClassName, publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import {
  SEJARAH_MAP_LINK,
  SEJARAH_MILESTONES,
  SEJARAH_MOTTO,
  SEJARAH_MOTTO_ATTRIBUTION,
  SEJARAH_NARRATIVE_PARAGRAPHS,
  SEJARAH_PAGE_LEDE,
  SEJARAH_PAGE_TITLE,
  SEJARAH_QUICK_FACTS,
  SEJARAH_TIMELINE_INTRO,
} from "@/lib/sejarah-content";
import { cn } from "@/lib/utils";

/** Short labels for blueprint plate nav (full names remain on site mega-nav). */
const SEJARAH_BLUEPRINT_NAV = PROFIL_SUB_NAV_ITEMS.map((item) => {
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

export function SejarahContent(): ReactElement {
  return (
    <>
      <BlueprintFramedHero
        id="sejarah-hero"
        titleLines={["Perjalanan sejarah", `${BRAND_SHORT} di Rancasari`]}
        lede={SEJARAH_PAGE_LEDE}
        primaryCta={{ label: "Baca sejarah", href: "#perjalanan-teknovo" }}
        secondaryCta={{ label: "Visi & Misi", href: "/profil/visi-misi" }}
        navLinks={SEJARAH_BLUEPRINT_NAV}
        activeHref="/profil/sejarah"
      />

      <section
        id="perjalanan-teknovo"
        className={cn(publicPageSectionWhiteClassName, "scroll-mt-24")}
        aria-labelledby="perjalanan-teknovo-heading"
      >
        <div className="public-site-container">
          <MotionInView as="article" className={frameShellClass} delay={0.06}>
            <FramePlusMarks />
            <div className="grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]">
              <figure className="border-b border-border-default p-6 md:border-b-0 md:border-r">
                <div
                  className={cn(
                    "relative aspect-[4/5] w-full overflow-hidden border border-border-default",
                    publicOptimizedImageContainerClassName,
                  )}
                >
                  <PublicOptimizedImage
                    src={LANDING_MEDIA.profil.sejarahSekolahWebp}
                    alt={`Ilustrasi ${SEJARAH_PAGE_TITLE} ${BRAND_SHORT}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover"
                    quality={70}
                  />
                </div>
              </figure>
              <div className="space-y-4 p-6 sm:p-8">
                <h2
                  id="perjalanan-teknovo-heading"
                  className="text-2xl font-semibold tracking-tight text-heading sm:text-3xl"
                >
                  Perjalanan {BRAND_SHORT}
                </h2>
                <p
                  className={cn(
                    "text-sm leading-relaxed text-body",
                    publicFormalBodyClassName,
                  )}
                >
                  {BRAND_SHORT} didirikan sebagai jawaban atas kebutuhan pendidikan menengah kejuruan yang
                  mengintegrasikan karakter, akademik, dan penguasaan teknologi. Dari awal berdiri, sekolah
                  membangun budaya disiplin digital — menghubungkan kelas dengan sistem informasi dan portal
                  komunikasi bagi siswa serta orang tua. Perjalanan ini membentuk komunitas belajar yang adaptif
                  terhadap perubahan zaman tanpa melupakan nilai luhur kebangsaan.
                </p>
              </div>
            </div>
          </MotionInView>

          <MotionInView
            as="section"
            className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]"
            delay={0.1}
            aria-labelledby="tonggak-heading"
          >
            <div className="space-y-4">
              <h2 id="tonggak-heading" className="text-2xl font-bold tracking-tight text-heading">
                Tonggak perjalanan
              </h2>
              <p className={cn("text-sm leading-relaxed text-body", publicFormalBodyClassName)}>
                {SEJARAH_TIMELINE_INTRO}
              </p>
            </div>
            <ol className="relative space-y-8 border-l border-border-default pl-6">
              {SEJARAH_MILESTONES.map((item) => (
                <li key={item.title} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[1.8125rem] top-1.5 size-3 border border-brand bg-brand ring-4 ring-surface"
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                    {item.year}
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

          <MotionInView as="article" className={cn(frameShellClass, "mt-14")} delay={0.12}>
            <FramePlusMarks />
            <div className="grid md:grid-cols-[minmax(0,15rem)_1fr]">
              <div className="flex flex-col justify-between gap-6 border-b border-border-default bg-brand p-6 text-white md:border-b-0 md:border-r sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Narasi sejarah</h2>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                  Jejak komunitas
                </p>
              </div>
              <div className="space-y-4 p-6 sm:p-8">
                {SEJARAH_NARRATIVE_PARAGRAPHS.map((paragraph) => (
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

          <MotionInView as="section" className="mt-14" delay={0.14} aria-labelledby="fakta-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="fakta-heading" className="text-2xl font-bold tracking-tight text-heading">
                Fakta singkat
              </h2>
              <div className="hidden h-px flex-1 bg-border-default sm:ml-6 sm:block" />
            </div>
            <ul className="mt-8 grid gap-0 border border-border-default sm:grid-cols-2 lg:grid-cols-3">
              {SEJARAH_QUICK_FACTS.map((fact, idx) => (
                <MotionInView
                  as="li"
                  key={fact.id}
                  className={cn(
                    "flex h-full flex-col gap-3 bg-surface p-6 sm:p-8",
                    idx > 0 && "border-t border-border-default sm:border-t-0",
                    idx % 2 === 1 && "sm:border-l sm:border-border-default",
                    idx >= 2 && "sm:border-t sm:border-border-default",
                    idx > 0 && "lg:border-t-0 lg:border-l lg:border-border-default",
                    idx >= 3 && "lg:border-t lg:border-border-default",
                  )}
                  delay={0.16 + idx * 0.03}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                    {fact.label}
                  </p>
                  {fact.id === "peta" ? (
                    <a
                      href={SEJARAH_MAP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "text-sm leading-relaxed text-body underline decoration-border-default underline-offset-4 transition-colors hover:text-brand hover:decoration-brand",
                        publicFormalBodyClassName,
                      )}
                    >
                      {fact.value}
                    </a>
                  ) : (
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-body",
                        publicFormalBodyClassName,
                      )}
                    >
                      {fact.value}
                    </p>
                  )}
                </MotionInView>
              ))}
            </ul>
          </MotionInView>

          <MotionInView
            as="article"
            className={cn(frameShellClass, "relative mt-14")}
            delay={0.18}
          >
            <FramePlusMarks />
            <div className="relative space-y-4 p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Motto</p>
              <p
                className={cn(
                  "border-l-2 border-brand pl-6 text-base italic leading-relaxed text-body sm:text-lg",
                  publicFormalBodyClassName,
                )}
              >
                {SEJARAH_MOTTO}
              </p>
              <div className="border-t border-border-default pt-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-body-subtle">
                  {SEJARAH_MOTTO_ATTRIBUTION}
                </p>
              </div>
            </div>
          </MotionInView>
        </div>
      </section>
    </>
  );
}
