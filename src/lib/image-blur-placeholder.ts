import blurManifest from "@/lib/landing-image-blur-manifest.json";

/** Neutral slate blur when no manifest entry exists (remote uploads, etc.). */
export const DEFAULT_IMAGE_BLUR_DATA_URL =
  "data:image/webp;base64,UklGRjQAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSCgAAAABbW9iaWYAAABZT1BNAQAAABQAAAAAVBMVEUAAAD/////AAAA/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

const manifest = blurManifest as Record<string, string>;

function normalizeMediaPath(src: string): string | null {
  const trimmed = src.trim();
  const noQuery = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;

  // Absolute R2 / CDN URL → extract `/media/...` path for blur manifest lookup.
  if (noQuery.startsWith("http://") || noQuery.startsWith("https://")) {
    try {
      const { pathname } = new URL(noQuery);
      if (pathname.startsWith("/media/")) return pathname;
    } catch {
      return null;
    }
    return null;
  }

  if (!noQuery.startsWith("/media/")) return null;
  return noQuery;
}

/** Resolve blurDataURL for a local `/media/...` path; undefined for remote URLs. */
export function getLandingImageBlurDataUrl(src: string): string | undefined {
  const key = normalizeMediaPath(src);
  if (!key) return undefined;
  return manifest[key] ?? DEFAULT_IMAGE_BLUR_DATA_URL;
}

/** True when blur placeholder should be applied for this src. */
export function shouldUseLandingImageBlur(src: string): boolean {
  return normalizeMediaPath(src) !== null;
}
