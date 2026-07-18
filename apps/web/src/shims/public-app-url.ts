export function getPublicAppBaseUrl(): string {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL) ||
    (typeof import.meta !== "undefined" &&
      (import.meta as ImportMeta & { env?: { PUBLIC_SITE_URL?: string } }).env
        ?.PUBLIC_SITE_URL) ||
    "https://smkteknovo.sch.id";
  return String(raw).replace(/\/$/, "");
}
