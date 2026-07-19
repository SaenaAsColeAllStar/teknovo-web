"use client";

import { ImageIcon } from "lucide-react";
import { useState, type ReactElement } from "react";

import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import { cn } from "@/lib/utils";

type BeritaCoverMediaProps = {
  src?: string | null;
  alt: string;
  className?: string;
  /** Passed to next/image / shim when a real cover loads. */
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  imgClassName?: string;
};

function CoverPlaceholder({ className }: { className?: string }): ReactElement {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center bg-[#1313BA]/10 text-[#1313BA]",
        className,
      )}
      aria-hidden
    >
      <ImageIcon className="size-12 stroke-[1.25] sm:size-14" />
    </div>
  );
}

/**
 * Berita cover: real image when URL works; soft placeholder when missing or 404.
 * Does not invent stock “mock” photos for CMS posts without a cover.
 */
export function BeritaCoverMedia({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 640px",
  priority,
  fill = true,
  imgClassName = "object-cover",
}: BeritaCoverMediaProps): ReactElement {
  const trimmed = src?.trim() ?? "";
  const [failed, setFailed] = useState(false);
  const showImage = trimmed.length > 0 && !failed;

  if (!showImage) {
    return <CoverPlaceholder className={cn("aspect-[16/9]", className)} />;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        fill && "aspect-[16/9] w-full",
        publicOptimizedImageContainerClassName,
        className,
      )}
    >
      <PublicOptimizedImage
        src={trimmed}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={imgClassName}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
