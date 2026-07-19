import { forwardRef, type ImgHTMLAttributes, type ReactNode } from "react";

export type ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height" | "alt"
> & {
  src: string | { src: string };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
  sizes?: string;
  children?: ReactNode;
};

/** Shim next/image → img (R2 URLs already absolute). */
const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    alt,
    width,
    height,
    fill,
    priority,
    className,
    style,
    sizes,
    loading,
    ...rest
  },
  ref,
) {
  const resolved = typeof src === "string" ? src : src.src;
  const imgStyle = fill
    ? {
        ...(typeof style === "object" && style ? style : {}),
        position: "absolute" as const,
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: (style as { objectFit?: string } | undefined)?.objectFit ?? "cover",
      }
    : style;

  const { onError, ...imgRest } = rest;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={resolved}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={imgStyle}
      sizes={sizes}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding="async"
      onError={(event) => {
        // Soft-hide broken covers before/without React hydration (Astro islands).
        event.currentTarget.style.visibility = "hidden";
        onError?.(event);
      }}
      {...imgRest}
    />
  );
});

export default Image;
