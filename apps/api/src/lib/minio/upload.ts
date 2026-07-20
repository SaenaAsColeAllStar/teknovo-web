import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getMinioConfig, getS3Client, type MinioConfig } from "./client";
import { objectUrl } from "./url";

export const CMS_UPLOAD_PREFIX = "cms/uploads/";
export const MEDIA_LANDING_PREFIX = "media/landing/";
export const BRAND_PREFIX = "brand/";

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

export async function putObject(
  key: string,
  body: Buffer | Uint8Array | string,
  opts?: {
    contentType?: string;
    client?: S3Client;
    config?: MinioConfig;
  },
): Promise<{ key: string; url: string }> {
  const config = opts?.config ?? getMinioConfig();
  const client = opts?.client ?? getS3Client(config);
  const normalized = key.replace(/^\//, "");

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: normalized,
      Body: body,
      ContentType: opts?.contentType,
    }),
  );

  return { key: normalized, url: objectUrl(normalized, config) };
}

export async function getObject(
  key: string,
  opts?: { client?: S3Client; config?: MinioConfig },
) {
  const config = opts?.config ?? getMinioConfig();
  const client = opts?.client ?? getS3Client(config);
  const normalized = key.replace(/^\//, "");

  return client.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: normalized,
    }),
  );
}

export async function deleteObject(
  key: string,
  opts?: { client?: S3Client; config?: MinioConfig },
): Promise<void> {
  const config = opts?.config ?? getMinioConfig();
  const client = opts?.client ?? getS3Client(config);
  const normalized = key.replace(/^\//, "");

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: normalized,
    }),
  );
}

export async function listObjects(
  opts?: {
    prefix?: string;
    cursor?: string;
    limit?: number;
    client?: S3Client;
    config?: MinioConfig;
  },
): Promise<{
  objects: CmsMediaObject[];
  truncated: boolean;
  cursor: string | null;
}> {
  const config = opts?.config ?? getMinioConfig();
  const client = opts?.client ?? getS3Client(config);
  const prefix = opts?.prefix ?? CMS_UPLOAD_PREFIX;
  const limit = Math.min(Math.max(opts?.limit ?? 100, 1), 200);

  const listed = await client.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: prefix,
      MaxKeys: limit,
      ContinuationToken: opts?.cursor || undefined,
    }),
  );

  const objects: CmsMediaObject[] = (listed.Contents ?? []).map((obj) => ({
    key: obj.Key ?? "",
    url: objectUrl(obj.Key ?? "", config),
    size: obj.Size ?? 0,
    uploaded: obj.LastModified?.toISOString() ?? null,
    httpEtag: obj.ETag ?? null,
  }));

  return {
    objects,
    truncated: Boolean(listed.IsTruncated),
    cursor: listed.NextContinuationToken ?? null,
  };
}
