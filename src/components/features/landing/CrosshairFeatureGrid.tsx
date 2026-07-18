import type { ReactElement, ReactNode } from "react";

import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type CrosshairMediaCell = {
  kind: "media";
  src: string;
  alt: string;
  priority?: boolean;
  /** Optional decorative overlay (e.g. isometric SVG) centered over the photo. */
  overlay?: ReactNode;
};

export type CrosshairTextCell = {
  kind: "text";
  badgeIcon: ReactNode;
  badgeLabel: string;
  /** Large multi-line heading — pass JSX for selective emphasis. */
  title: ReactNode;
  body: string;
};

export type CrosshairCell = CrosshairMediaCell | CrosshairTextCell;

export type CrosshairFeatureGridProps = {
  /** DOM order = mobile reading order: TL → TR → BL → BR. */
  topLeft: CrosshairCell;
  topRight: CrosshairCell;
  bottomLeft: CrosshairCell;
  bottomRight: CrosshairCell;
  className?: string;
  "aria-label"?: string;
};

function CrosshairNode({ className }: { className?: string }): ReactElement {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-20 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
        "bg-brand ring-[3px] ring-surface",
        className,
      )}
    />
  );
}

function CrosshairGuides(): ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden>
      {/* Horizontal + vertical rules meeting at center */}
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border-default" />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border-default" />

      {/* Six nodes: center + four outer ends */}
      <CrosshairNode className="left-1/2 top-1/2" />
      <CrosshairNode className="left-1/2 top-0" />
      <CrosshairNode className="left-1/2 top-full" />
      <CrosshairNode className="left-0 top-1/2" />
      <CrosshairNode className="left-full top-1/2" />
    </div>
  );
}

const quadrantMinClass =
  "min-h-[14rem] sm:min-h-[16rem] lg:min-h-0 lg:h-full";

function MediaQuadrant({ cell }: { cell: CrosshairMediaCell }): ReactElement {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        quadrantMinClass,
        publicOptimizedImageContainerClassName,
      )}
    >
      <PublicOptimizedImage
        src={cell.src}
        alt={cell.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 640px"
        className="object-cover"
        priority={cell.priority}
        quality={70}
      />
      {cell.overlay ? (
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-surface/50 p-8 text-brand backdrop-blur-[1px]">
          {cell.overlay}
        </div>
      ) : null}
    </div>
  );
}

function TextQuadrant({ cell }: { cell: CrosshairTextCell }): ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-4 bg-surface px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12",
        quadrantMinClass,
      )}
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border-default bg-neutral-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
        <span className="inline-flex size-3.5 items-center justify-center text-brand" aria-hidden>
          {cell.badgeIcon}
        </span>
        {cell.badgeLabel}
      </span>
      <h3 className="text-balance text-2xl font-bold leading-[1.15] tracking-tight text-heading sm:text-3xl lg:text-[1.85rem] xl:text-[2.05rem]">
        {cell.title}
      </h3>
      <p
        className={cn(
          "max-w-md text-sm leading-relaxed text-body sm:text-[15px]",
          publicFormalBodyClassName,
        )}
      >
        {cell.body}
      </p>
    </div>
  );
}

function Quadrant({ cell }: { cell: CrosshairCell }): ReactElement {
  return cell.kind === "media" ? <MediaQuadrant cell={cell} /> : <TextQuadrant cell={cell} />;
}

/**
 * 2×2 feature grid with Atlas crosshair dividers + circular nodes on large
 * breakpoints. Mobile stacks in DOM order (TL → TR → BL → BR) without guides.
 */
export function CrosshairFeatureGrid({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className,
  "aria-label": ariaLabel = "Fitur dalam empat kuadran",
}: CrosshairFeatureGridProps): ReactElement {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "relative overflow-visible border border-border-default bg-surface",
        className,
      )}
    >
      <CrosshairGuides />
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 lg:min-h-[36rem] xl:min-h-[40rem]">
        <Quadrant cell={topLeft} />
        <Quadrant cell={topRight} />
        <Quadrant cell={bottomLeft} />
        <Quadrant cell={bottomRight} />
      </div>
    </div>
  );
}
