/** Shared CMS media constants — no Node/MinIO imports (safe for Worker typecheck). */

export const CMS_UPLOAD_PREFIX = "cms/uploads/";
export const CMS_MEDIA_MAX_BYTES = 8 * 1024 * 1024;

export const CMS_MEDIA_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export type CmsMediaObject = {
  key: string;
  url: string;
  size: number;
  uploaded: string | null;
  httpEtag: string | null;
};

export function sanitizeUploadFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() || "file";
  return (
    base
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "file"
  );
}

/** `cms/uploads/{YYYY}/{MM}/{uuid}-{file}` */
export function buildUploadKey(filename: string): string {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const safe = sanitizeUploadFilename(filename);
  return `${CMS_UPLOAD_PREFIX}${yyyy}/${mm}/${crypto.randomUUID()}-${safe}`;
}

export function isCmsUploadKey(key: string): boolean {
  const normalized = key.replace(/^\//, "");
  return (
    normalized.startsWith(CMS_UPLOAD_PREFIX) &&
    !normalized.includes("..") &&
    !normalized.includes("//")
  );
}
