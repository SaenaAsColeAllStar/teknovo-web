import Image, { type ImageProps } from "next/image";
import type { ReactElement } from "react";

import {
  getLandingImageBlurDataUrl,
  shouldUseLandingImageBlur,
} from "@/lib/image-blur-placeholder";
import { nextImageRemoteProps } from "@/lib/image-remote";

export const publicOptimizedImageContainerClassName =
  "bg-slate-200/90 dark:bg-slate-800/90";

export type PublicOptimizedImageProps = Omit<ImageProps, "placeholder" | "blurDataURL" | "quality"> & {
  quality?: number;
  /** Skip auto blur even for local `/media/` paths. */
  skipBlur?: boolean;
  blurDataURL?: string;
};

/**
 * Landing/public `next/image` wrapper — blur placeholder, q=75 default, remote unoptimized.
 */
export function PublicOptimizedImage({
  src,
  quality = 75,
  skipBlur,
  blurDataURL: blurOverride,
  priority,
  loading,
  ...rest
}: PublicOptimizedImageProps): ReactElement {
  const srcStr = typeof src === "string" ? src : "";
  const remote = nextImageRemoteProps(srcStr);
  const autoBlur = !skipBlur && !remote.unoptimized && shouldUseLandingImageBlur(srcStr)
    ? getLandingImageBlurDataUrl(srcStr)
    : undefined;
  const blur = blurOverride ?? autoBlur;

  return (
    <Image
      src={src}
      quality={quality}
      placeholder={blur ? "blur" : undefined}
      blurDataURL={blur}
      priority={priority}
      loading={loading ?? (priority ? undefined : "lazy")}
      {...remote}
      {...rest}
    />
  );
}
