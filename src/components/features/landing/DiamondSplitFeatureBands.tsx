import { Check } from "lucide-react";
import type { ReactElement } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import type { DiamondSplitBand, DiamondSplitBandPair } from "@/lib/fasilitas-diamond-bands";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type DiamondSplitFeatureBandsProps = {
  bands: DiamondSplitBandPair;
  className?: string;
  /** First band image priority (detail hero replacement). */
  priorityFirst?: boolean;
};

/**
 * Two stacked fasilitas detail bands: text|media then media|text (lg),
 * with diamond photo + dotted lattice halo. Mobile: media then text.
 */
export function DiamondSplitFeatureBands({
  bands,
  className,
  priorityFirst = true,
}: DiamondSplitFeatureBandsProps): ReactElement {
  return (
    <div className={cn("space-y-14 sm:space-y-16 lg:space-y-20", className)}>
      {bands.map((band, index) => (
        <DiamondSplitBandRow
          key={band.id}
          band={band}
          mediaFirstOnDesktop={index % 2 === 1}
          priority={priorityFirst && index === 0}
          delay={0.04 + index * 0.04}
        />
      ))}
    </div>
  );
}

function DiamondSplitBandRow({
  band,
  mediaFirstOnDesktop,
  priority,
  delay,
}: {
  band: DiamondSplitBand;
  mediaFirstOnDesktop: boolean;
  priority?: boolean;
  delay: number;
}): ReactElement {
  return (
    <MotionInView
      as="article"
      className={cn(
        "grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16",
        "py-2 sm:py-4",
      )}
      delay={delay}
    >
      <div
        className={cn(
          "order-1",
          mediaFirstOnDesktop ? "lg:order-1" : "lg:order-2",
        )}
      >
        <DiamondMediaFrame
          src={band.imageSrc}
          alt={band.imageAlt}
          priority={priority}
        />
      </div>

      <div
        className={cn(
          "order-2 flex flex-col items-start text-left",
          mediaFirstOnDesktop ? "lg:order-2" : "lg:order-1",
        )}
      >
        <DiamondBandText band={band} />
      </div>
    </MotionInView>
  );
}

function DiamondBandText({ band }: { band: DiamondSplitBand }): ReactElement {
  return (
    <>
      <h2 className="text-balance text-2xl font-bold tracking-tight text-heading sm:text-3xl lg:text-[2rem] lg:leading-tight">
        {band.title}
      </h2>
      <p
        className={cn(
          "mt-4 max-w-prose text-sm leading-relaxed text-body sm:text-[15px]",
          publicFormalBodyClassName,
        )}
      >
        {band.body}
      </p>

      <hr className="mt-6 w-full border-0 border-t border-border-default" />

      <ul className="mt-6 w-full space-y-3">
        {band.checklist.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-heading">
            <span
              aria-hidden
              className="inline-flex size-5 shrink-0 items-center justify-center border border-border-default bg-neutral-soft text-brand"
            >
              <Check className="size-3" strokeWidth={2.75} />
            </span>
            <span className="min-w-0 truncate font-medium leading-none">{item}</span>
          </li>
        ))}
      </ul>

      {band.closing ? (
        <>
          <hr className="mt-6 w-full border-0 border-t border-border-default" />
          <p
            className={cn(
              "mt-5 max-w-prose text-sm leading-relaxed text-body",
              publicFormalBodyClassName,
            )}
          >
            {band.closing}
          </p>
        </>
      ) : null}
    </>
  );
}

function DiamondMediaFrame({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}): ReactElement {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[22rem] items-center justify-center sm:max-w-[26rem] lg:max-w-none">
      {/* Soft dotted diamond / lattice halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-6%] rotate-45 rounded-[1.25rem] border border-dashed border-[#E8E8F8] opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(19, 19, 186, 0.14) 1px, transparent 1.2px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[4%] rotate-45 rounded-[1rem] border border-[#E8E8F8]/60"
      />

      <figure
        className={cn(
          "relative z-10 aspect-square w-[68%] overflow-hidden rounded-2xl border border-border-default shadow-[0_18px_40px_-28px_rgba(19,19,186,0.45)]",
          "rotate-45",
          publicOptimizedImageContainerClassName,
        )}
      >
        <div className="absolute inset-0 -rotate-45 scale-[1.42]">
          <PublicOptimizedImage
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 70vw, 28vw"
            className="object-cover"
            quality={72}
            priority={priority}
          />
        </div>
        <figcaption className="sr-only">{alt}</figcaption>
      </figure>
    </div>
  );
}
