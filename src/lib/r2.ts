import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Public base URL for objects served via the R2 custom domain (no trailing slash). */
export function getR2PublicUrl(): string {
  return (
    process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ||
    "https://r2.ctos.web.id"
  );
}

/** Absolute public URL for an object key in the CMS bucket. */
export function r2ObjectUrl(key: string): string {
  const normalized = key.replace(/^\//, "");
  return `${getR2PublicUrl()}/${normalized}`;
}

/**
 * Resolve a site asset path (`/media/...`, `/brand/...`) to the R2 public URL.
 * Absolute http(s) URLs are returned unchanged.
 */
export function publicAssetUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return r2ObjectUrl(trimmed.replace(/^\//, ""));
}

/** R2 bucket bound as `CMS_BUCKET` in wrangler.toml. */
export async function getCmsBucket() {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = env.CMS_BUCKET;
  if (!bucket) {
    throw new Error(
      "CMS_BUCKET binding tidak tersedia. Pastikan [[r2_buckets]] di wrangler.toml dan jalankan via next dev (OpenNext) atau deploy Workers.",
    );
  }
  return bucket;
}
