import type { ReactElement, ReactNode } from "react";

import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { cn } from "@/lib/utils";

export const publicSplitCardShellClassName =
  "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

const tonePanelClasses = {
  neutral: "bg-slate-50/90 dark:bg-slate-900/50",
  accent: "bg-blue-50 dark:bg-blue-950/35",
  amber: "bg-amber-50 dark:bg-amber-950/25",
  plain: "bg-white dark:bg-slate-950",
} as const;

export type PublicSplitCardTone = keyof typeof tonePanelClasses;

export type PublicSplitContentCardImage = {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  loading?: "lazy" | "eager";
};

export type PublicSplitContentCardProps = {
  children: ReactNode;
  image: PublicSplitContentCardImage;
  imagePosition?: "left" | "right";
  tone?: PublicSplitCardTone;
  /** Gambar inset rounded — halaman profil & kartu editorial. */
  insetImage?: boolean;
  columnsAt?: "md" | "lg";
  textPanelClassName?: string;
  className?: string;
};

function SplitImage({
  image,
  inset,
}: {
  image: PublicSplitContentCardImage;
  inset: boolean;
}): ReactElement {
  const img = (
    <PublicOptimizedImage
      src={image.src}
      alt={image.alt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover"
      quality={image.quality ?? 75}
      priority={image.priority}
      loading={image.loading ?? (image.priority ? undefined : "lazy")}
    />
  );

  if (inset) {
    return (
      <div
        className={cn(
          "relative min-h-[14rem] w-full overflow-hidden rounded-xl md:min-h-full",
          publicOptimizedImageContainerClassName,
        )}
      >
        {img}
        <div
          className="pointer-events-none absolute inset-0 bg-slate-900/10 dark:bg-slate-950/25 md:bg-gradient-to-r md:from-slate-50/50 md:to-transparent dark:md:from-slate-950/50"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={cn("relative min-h-[14rem] md:min-h-full", publicOptimizedImageContainerClassName)}>
      {img}
      <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/25 md:hidden" aria-hidden />
    </div>
  );
}

export function PublicSplitContentCard({
  children,
  image,
  imagePosition = "right",
  tone = "accent",
  insetImage = false,
  columnsAt = "md",
  textPanelClassName,
  className,
}: PublicSplitContentCardProps): ReactElement {
  const gridBp = columnsAt === "lg" ? "lg:grid-cols-2" : "md:grid-cols-2";
  const textFirst = imagePosition === "right";
  const orderBp = columnsAt === "lg" ? "lg" : "md";

  const textOrder = textFirst ? `order-2 ${orderBp}:order-1` : `order-2 ${orderBp}:order-2`;
  const imageOrder = textFirst ? `order-1 ${orderBp}:order-2` : `order-1 ${orderBp}:order-1`;

  return (
    <div className={cn("grid h-full", gridBp, className)}>
      <div
        className={cn(
          "flex flex-col justify-center gap-5 p-6 md:p-8",
          tonePanelClasses[tone],
          textOrder,
          insetImage && "md:pr-2",
          textPanelClassName,
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          imageOrder,
          insetImage ? "flex items-stretch p-4 md:py-4 md:pr-4 md:pl-0" : "relative",
        )}
      >
        <SplitImage image={image} inset={insetImage} />
      </div>
    </div>
  );
}

export type PublicTextContentCardProps = {
  children: ReactNode;
  tone?: PublicSplitCardTone;
  className?: string;
};

export function PublicTextContentCard({
  children,
  tone = "neutral",
  className,
}: PublicTextContentCardProps): ReactElement {
  return (
    <div className={cn(publicSplitCardShellClassName, className)}>
      <div className={cn("flex h-full flex-col justify-between gap-6 p-6 md:p-8", tonePanelClasses[tone])}>
        {children}
      </div>
    </div>
  );
}
