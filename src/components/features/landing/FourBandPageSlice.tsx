import type { ReactElement, ReactNode } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { MotionInView } from "@/components/motion/MotionInView";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type FourBandNavLink = {
  href: string;
  label: string;
};

export type FourBandCta = {
  href: string;
  label: string;
};

export type FourBandImage = {
  src: string;
  alt: string;
  priority?: boolean;
};

export type FourBandFeature = {
  icon: ReactNode;
  title: string;
  body: string;
};

export type FourBandPageSliceProps = {
  navLinks: readonly FourBandNavLink[];
  cta: FourBandCta;
  /** Multi-line headline; `\n` becomes line breaks. */
  headline: string;
  support: string;
  image: FourBandImage;
  /** Exactly two feature columns. */
  features: readonly [FourBandFeature, FourBandFeature];
  className?: string;
};

/**
 * Vertical stack of four bands inside a bounded `public-site-container`:
 * top bar → intro split → showcase image → two-column feature row.
 */
export function FourBandPageSlice({
  navLinks,
  cta,
  headline,
  support,
  image,
  features,
  className,
}: FourBandPageSliceProps): ReactElement {
  const headlineLines = headline.split("\n").filter(Boolean);

  return (
    <div className={cn("flex flex-col gap-10 sm:gap-12 lg:gap-14", className)}>
      {/* Band 1 — Top bar */}
      <MotionInView
        as="div"
        className="flex flex-col gap-3 border-b border-border-default pb-4 sm:pb-5"
        delay={0.02}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <BrandLogo layout="compact" className="min-w-0 shrink-0" shine={false} />

          <nav
            aria-label="Navigasi bagian"
            className="hidden min-w-0 flex-1 items-center justify-center gap-5 md:flex lg:gap-7"
          >
            {navLinks.map((link) => (
              <PublicSiteLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-body transition hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {link.label}
              </PublicSiteLink>
            ))}
          </nav>

          <PublicSiteLink
            href={cta.href}
            className="ml-auto inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-brand px-3.5 text-xs font-semibold text-white transition hover:bg-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:h-10 sm:px-4 sm:text-sm"
          >
            {cta.label}
          </PublicSiteLink>
        </div>

        <nav
          aria-label="Navigasi bagian (seluler)"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:hidden"
        >
          {navLinks.map((link) => (
            <PublicSiteLink
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-body transition hover:text-heading"
            >
              {link.label}
            </PublicSiteLink>
          ))}
        </nav>
      </MotionInView>

      {/* Band 2 — Intro split */}
      <MotionInView
        as="header"
        className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10"
        delay={0.04}
      >
        <h1 className="text-balance text-4xl font-bold tracking-tight text-heading sm:text-5xl lg:col-span-7 lg:text-6xl lg:leading-[1.05]">
          {headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          className={cn(
            "text-base leading-relaxed text-body sm:text-lg lg:col-span-5 lg:pb-1",
            publicFormalBodyClassName,
          )}
        >
          {support}
        </p>
      </MotionInView>

      {/* Band 3 — Showcase image */}
      <MotionInView as="div" delay={0.06}>
        <div
          className={cn(
            "relative aspect-[16/9] w-full overflow-hidden border border-border-default sm:aspect-[21/9]",
            publicOptimizedImageContainerClassName,
          )}
        >
          <PublicOptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            priority={image.priority ?? true}
            quality={72}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      </MotionInView>

      {/* Band 4 — Feature row */}
      <MotionInView
        as="div"
        className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-0"
        delay={0.08}
      >
        <FeatureColumn feature={features[0]} />
        <div
          className="h-px w-full bg-border-default lg:mx-10 lg:h-auto lg:min-h-[7rem] lg:w-px lg:self-stretch"
          aria-hidden
        />
        <FeatureColumn feature={features[1]} />
      </MotionInView>
    </div>
  );
}

function FeatureColumn({ feature }: { feature: FourBandFeature }): ReactElement {
  return (
    <article className="flex flex-col gap-3 lg:px-1">
      <div className="flex size-11 items-center justify-center rounded-lg border border-border-default bg-neutral-soft text-brand">
        {feature.icon}
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-heading sm:text-xl">{feature.title}</h2>
      <p className={cn("text-sm leading-relaxed text-body sm:text-[0.9375rem]", publicFormalBodyClassName)}>
        {feature.body}
      </p>
    </article>
  );
}
