import type { ReactElement, ReactNode } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

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
  /** Multi-line headline; `\n` becomes line breaks. */
  headline: string;
  support: string;
  image: FourBandImage;
  /** Exactly two feature columns. */
  features: readonly [FourBandFeature, FourBandFeature];
  className?: string;
};

/**
 * Vertical stack of three bands inside a bounded `public-site-container`:
 * intro split → showcase image → two-column feature row.
 */
export function FourBandPageSlice({
  headline,
  support,
  image,
  features,
  className,
}: FourBandPageSliceProps): ReactElement {
  const headlineLines = headline.split("\n").filter(Boolean);

  return (
    <div className={cn("flex flex-col gap-10 sm:gap-12 lg:gap-14", className)}>
      {/* Band 1 — Intro split */}
      <MotionInView
        as="header"
        className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10"
        delay={0.02}
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

      {/* Band 2 — Showcase image */}
      <MotionInView as="div" delay={0.04}>
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

      {/* Band 3 — Feature row */}
      <MotionInView
        as="div"
        className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-0"
        delay={0.06}
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
