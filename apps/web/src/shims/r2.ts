/** Astro/build-time R2 helpers — no Workers bindings. */

export function getR2PublicUrl(): string {
  const fromEnv =
    (typeof process !== "undefined" && process.env.R2_PUBLIC_URL) ||
    (typeof import.meta !== "undefined" &&
      (import.meta as ImportMeta & { env?: { PUBLIC_R2_URL?: string } }).env
        ?.PUBLIC_R2_URL) ||
    "https://r2.ctos.web.id";
  return String(fromEnv).replace(/\/$/, "");
}

export function r2ObjectUrl(key: string): string {
  return `${getR2PublicUrl()}/${key.replace(/^\//, "")}`;
}

export function publicAssetUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return r2ObjectUrl(trimmed.replace(/^\//, ""));
}

export async function getCmsBucket(): Promise<never> {
  throw new Error("CMS_BUCKET tidak tersedia di Astro static build.");
}
