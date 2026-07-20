import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getMinioConfig, getS3Client, type MinioConfig } from "./client";
import { objectUrl } from "./url";
import {
  CMS_MEDIA_ALLOWED_TYPES,
  CMS_MEDIA_MAX_BYTES,
  CMS_UPLOAD_PREFIX,
  buildUploadKey,
  isCmsUploadKey,
  sanitizeUploadFilename,
  type CmsMediaObject,
} from "../media-constants";

export {
  CMS_MEDIA_ALLOWED_TYPES,
  CMS_MEDIA_MAX_BYTES,
  CMS_UPLOAD_PREFIX,
  buildUploadKey,
  isCmsUploadKey,
  sanitizeUploadFilename,
};
export type { CmsMediaObject };

export const MEDIA_LANDING_PREFIX = "media/landing/";
export const BRAND_PREFIX = "brand/";

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
