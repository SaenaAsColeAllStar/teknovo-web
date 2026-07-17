"use client";

import Image from "next/image";
import type { ReactElement } from "react";

import { WhiteLightSweep } from "@/components/motion/WhiteLightSweep";
import { BRAND_LOGO_SRC, BRAND_SHORT } from "@/lib/branding";
import { cn } from "@/lib/utils";

export type BrandLogoMarkSize = "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<BrandLogoMarkSize, number> = {
  sm: 36,
  md: 40,
  lg: 48,
  xl: 56,
};

export type BrandLogoMarkProps = {
  className?: string;
  size?: BrandLogoMarkSize;
  /** Ukuran kustom (px); mengabaikan `size` bila diset. */
  pixelSize?: number;
  /** Efek sapuan cahaya pada lambang (default: aktif). */
  shine?: boolean;
  priority?: boolean;
  roundedClassName?: string;
};

/**
 * Lambang SMK Teknovo saja — R2 `brand/logo.webp` + opsi light sweep.
 */
export function BrandLogoMark({
  className,
  size = "md",
  pixelSize,
  shine = true,
  priority = false,
  roundedClassName = "rounded-md",
}: BrandLogoMarkProps): ReactElement {
  const px = pixelSize ?? SIZE_PX[size];

  const image = (
    <Image
      src={BRAND_LOGO_SRC}
      alt={`Lambang ${BRAND_SHORT}`}
      width={px}
      height={px}
      unoptimized
      className={cn("relative z-10 shrink-0 bg-transparent object-contain", className)}
      style={{ width: px, height: px }}
      priority={priority}
    />
  );

  if (!shine) {
    return image;
  }

  return (
    <span
      className={cn(
        "relative isolate inline-flex shrink-0 overflow-hidden bg-transparent",
        roundedClassName,
      )}
    >
      {image}
      <WhiteLightSweep roundedClassName={roundedClassName} placement="overlay" />
    </span>
  );
}
