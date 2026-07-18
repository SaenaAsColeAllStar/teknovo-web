import type { ReactElement } from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { AkademikIconGlyph } from "@/components/features/landing/AkademikIconGlyph";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  AKADEMIK_SUB_NAV_ITEMS,
  PENGAJAR_PILLARS,
  PENGAJAR_SECTION_INTRO,
  PENGAJAR_SECTION_TITLE,
} from "@/lib/akademik-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

const BAND_NAV = AKADEMIK_SUB_NAV_ITEMS.filter((item) => item.id !== "ringkasan").map((item) => ({
  href: item.href,
  label: item.id === "pengajar" ? "Guru" : item.label,
}));

const BAND_FEATURES = [
  {
    iconKey: "pengajar" as const,
    title: PENGAJAR_PILLARS[0].title,
    description: PENGAJAR_PILLARS[0].description,
  },
  {
    iconKey: "pathway" as const,
    title: PENGAJAR_PILLARS[1].title,
    description: PENGAJAR_PILLARS[1].description,
  },
] as const;

const SHOWCASE_SRC = LANDING_MEDIA.fasilitas.lmsWebp;
const SHOWCASE_ALT = "Komunitas pengajar dan pembinaan akademik SMK TEKNOVO";
const CTA_HREF = "/akademik/pengajar" as const;
const CTA_LABEL = "Lihat profil guru" as const;

const HEADLINE_LINES = ["Tenaga pengajar", "& pembinaan"] as const;

/**
 * Four-band page slice for `#akademik` — replaces the former featured-feed grid
 * with top bar, intro split, showcase image, and two feature columns.
 */
export function AkademikPengajarBands(): ReactElement {
  return (
    <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14" data-akademik-pengajar-bands>
      {/* Band 1 — Top bar */}
      <MotionInView as="div" className="flex flex-col gap-4" delay={0.02}>
        <div className="relative flex items-center gap-3 sm:gap-4">
          <PublicSiteLink
            href="/"
            className="relative z-10 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="Beranda SMK TEKNOVO"
          >
            <BrandLogoMark size="sm" shine={false} priority />
          </PublicSiteLink>

          <nav
            aria-label="Navigasi akademik singkat"
            className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex"
          >
            <ul className="pointer-events-auto flex items-center gap-5 lg:gap-7">
              {BAND_NAV.map((link) => (
                <li key={link.href}>
                  <PublicSiteLink
                    href={link.href}
                    className="text-sm font-medium text-body transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    {link.label}
                  </PublicSiteLink>
                </li>
              ))}
            </ul>
          </nav>

          <PublicSiteLink
            href={CTA_HREF}
            className={cn(
              "relative z-10 ml-auto inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-brand px-3.5 text-xs font-semibold text-white",
              "transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:h-10 sm:px-4 sm:text-sm",
            )}
          >
            {CTA_LABEL}
          </PublicSiteLink>
        </div>

        <nav aria-label="Navigasi akademik singkat" className="md:hidden">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {BAND_NAV.map((link) => (
              <li key={link.href}>
                <PublicSiteLink
                  href={link.href}
                  className="text-sm font-medium text-body transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  {link.label}
                </PublicSiteLink>
              </li>
            ))}
          </ul>
        </nav>
      </MotionInView>

      {/* Band 2 — Intro split */}
      <MotionInView
        as="header"
        className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12 xl:gap-16"
        delay={0.05}
      >
        <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-heading sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem]">
          <span className="block">{HEADLINE_LINES[0]}</span>
          <span className="block">{HEADLINE_LINES[1]}</span>
        </h1>
        <p
          className={cn(
            "max-w-md text-sm leading-relaxed text-body sm:text-[15px] lg:max-w-none lg:pb-1",
            publicFormalBodyClassName,
          )}
        >
          {PENGAJAR_SECTION_INTRO[0]}
        </p>
      </MotionInView>

      {/* Band 3 — Showcase image */}
      <MotionInView as="div" delay={0.08}>
        <figure
          className={cn(
            "relative aspect-[16/9] w-full overflow-hidden border border-border-default sm:aspect-[21/9]",
            publicOptimizedImageContainerClassName,
          )}
        >
          <PublicOptimizedImage
            src={SHOWCASE_SRC}
            alt={SHOWCASE_ALT}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            quality={72}
            priority
          />
          <figcaption className="sr-only">{PENGAJAR_SECTION_TITLE}</figcaption>
        </figure>
      </MotionInView>

      {/* Band 4 — Feature row */}
      <MotionInView
        as="ul"
        className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-0"
        delay={0.11}
      >
        {BAND_FEATURES.map((feature, idx) => (
          <li
            key={feature.title}
            className={cn(
              "flex flex-col gap-4",
              idx === 0 && "border-b border-border-default pb-8 sm:pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10 xl:pr-14",
              idx === 1 && "lg:pl-10 xl:pl-14",
            )}
          >
            <span
              aria-hidden
              className="inline-flex size-11 items-center justify-center rounded-md border border-border-default bg-neutral-soft text-brand"
            >
              <AkademikIconGlyph iconKey={feature.iconKey} className="size-5" />
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-heading sm:text-xl">
              {feature.title}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-body">{feature.description}</p>
          </li>
        ))}
      </MotionInView>
    </div>
  );
}
