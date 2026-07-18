export function getR2PublicUrl(env: Env): string {
  return (env.R2_PUBLIC_URL || "https://r2.ctos.web.id").replace(/\/$/, "");
}

export function r2ObjectUrl(env: Env, key: string): string {
  return `${getR2PublicUrl(env)}/${key.replace(/^\//, "")}`;
}

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

export function isCmsUploadKey(key: string): boolean {
  const normalized = key.replace(/^\//, "");
  return (
    normalized.startsWith(CMS_UPLOAD_PREFIX) &&
    !normalized.includes("..") &&
    !normalized.includes("//")
  );
}

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

export function buildUploadKey(filename: string): string {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const safe = sanitizeUploadFilename(filename);
  return `${CMS_UPLOAD_PREFIX}${yyyy}/${mm}/${crypto.randomUUID()}-${safe}`;
}

export async function listCmsUploads(
  env: Env,
  opts?: { cursor?: string; limit?: number },
) {
  const listed = await env.CMS_BUCKET.list({
    prefix: CMS_UPLOAD_PREFIX,
    limit: Math.min(Math.max(opts?.limit ?? 100, 1), 200),
    cursor: opts?.cursor,
  });

  const objects: CmsMediaObject[] = (listed.objects ?? []).map((obj) => ({
    key: obj.key,
    url: r2ObjectUrl(env, obj.key),
    size: obj.size,
    uploaded: obj.uploaded?.toISOString() ?? null,
    httpEtag: obj.etag ?? null,
  }));

  return {
    objects,
    truncated: Boolean(listed.truncated),
    cursor: listed.truncated ? listed.cursor : undefined,
  };
}

export async function putCmsUpload(
  env: Env,
  file: File | Blob,
  filename: string,
  contentType: string,
): Promise<CmsMediaObject> {
  const key = buildUploadKey(filename);
  const put = await env.CMS_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType },
  });
  return {
    key,
    url: r2ObjectUrl(env, key),
    size: file.size,
    uploaded: new Date().toISOString(),
    httpEtag: put?.etag ?? null,
  };
}

export async function deleteCmsUpload(env: Env, key: string): Promise<void> {
  if (!isCmsUploadKey(key)) {
    throw new Error(
      "Hanya objek di bawah cms/uploads/ yang boleh dihapus dari CMS.",
    );
  }
  await env.CMS_BUCKET.delete(key);
}
