import {
  CMS_MEDIA_ALLOWED_TYPES,
  CMS_MEDIA_MAX_BYTES,
  CMS_UPLOAD_PREFIX,
  buildUploadKey,
  isCmsUploadKey,
  sanitizeUploadFilename,
  type CmsMediaObject,
} from "../lib/media-constants";
import { hasMinio, publicObjectUrl } from "../lib/runtime";
import type { RuntimeBindings } from "../lib/http";

export {
  CMS_MEDIA_ALLOWED_TYPES,
  CMS_MEDIA_MAX_BYTES,
  CMS_UPLOAD_PREFIX,
  buildUploadKey,
  isCmsUploadKey,
  sanitizeUploadFilename,
};
export type { CmsMediaObject };

/** @deprecated Prefer `publicObjectUrl` — kept for Worker-only call sites. */
export function getR2PublicUrl(env: Env): string {
  return (env.R2_PUBLIC_URL || "https://r2.ctos.web.id").replace(/\/$/, "");
}

/** @deprecated Prefer `publicObjectUrl`. */
export function r2ObjectUrl(env: Env, key: string): string {
  return `${getR2PublicUrl(env)}/${key.replace(/^\//, "")}`;
}

export async function listCmsUploads(
  env: RuntimeBindings,
  opts?: { cursor?: string; limit?: number },
): Promise<{
  objects: CmsMediaObject[];
  truncated: boolean;
  cursor: string | undefined;
}> {
  if (hasMinio(env)) {
    const { listObjects } = await import("../lib/minio/upload");
    const listed = await listObjects({
      prefix: CMS_UPLOAD_PREFIX,
      cursor: opts?.cursor,
      limit: opts?.limit,
      client: env.s3,
    });
    return {
      objects: listed.objects.map((o) => ({
        ...o,
        url: publicObjectUrl(env, o.key),
      })),
      truncated: listed.truncated,
      cursor: listed.cursor ?? undefined,
    };
  }

  const worker = env as Env;
  const listed = await worker.CMS_BUCKET.list({
    prefix: CMS_UPLOAD_PREFIX,
    limit: Math.min(Math.max(opts?.limit ?? 100, 1), 200),
    cursor: opts?.cursor,
  });

  const objects: CmsMediaObject[] = (listed.objects ?? []).map((obj) => ({
    key: obj.key,
    url: publicObjectUrl(env, obj.key),
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
  env: RuntimeBindings,
  file: File | Blob,
  filename: string,
  contentType: string,
): Promise<CmsMediaObject> {
  const key = buildUploadKey(filename);

  if (hasMinio(env)) {
    const { putObject } = await import("../lib/minio/upload");
    const body = new Uint8Array(await file.arrayBuffer());
    await putObject(key, body, {
      contentType,
      client: env.s3,
    });
    return {
      key,
      url: publicObjectUrl(env, key),
      size: file.size,
      uploaded: new Date().toISOString(),
      httpEtag: null,
    };
  }

  const worker = env as Env;
  const put = await worker.CMS_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType },
  });
  return {
    key,
    url: publicObjectUrl(env, key),
    size: file.size,
    uploaded: new Date().toISOString(),
    httpEtag: put?.etag ?? null,
  };
}

export async function deleteCmsUpload(
  env: RuntimeBindings,
  key: string,
): Promise<void> {
  if (!isCmsUploadKey(key)) {
    throw new Error(
      "Hanya objek di bawah cms/uploads/ yang boleh dihapus dari CMS.",
    );
  }

  if (hasMinio(env)) {
    const { deleteObject } = await import("../lib/minio/upload");
    await deleteObject(key, { client: env.s3 });
    return;
  }

  await (env as Env).CMS_BUCKET.delete(key);
}
