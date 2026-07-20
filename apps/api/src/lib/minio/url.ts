import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getMinioConfig, getS3Client, type MinioConfig } from "./client";

/** Public object URL under `MINIO_PUBLIC_URL`. */
export function objectUrl(key: string, config?: MinioConfig): string {
  const cfg = config ?? getMinioConfig();
  const normalized = key.replace(/^\//, "");
  return `${cfg.publicUrl.replace(/\/$/, "")}/${normalized}`;
}

/** Optional: CMS direct-to-MinIO upload (PRP F-25, P2). */
export async function presignedPutUrl(
  key: string,
  opts?: {
    contentType?: string;
    expiresIn?: number;
    config?: MinioConfig;
  },
): Promise<string> {
  const config = opts?.config ?? getMinioConfig();
  const client = getS3Client(config);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key.replace(/^\//, ""),
    ContentType: opts?.contentType,
  });
  return getSignedUrl(client, command, {
    expiresIn: opts?.expiresIn ?? 900,
  });
}

export async function presignedGetUrl(
  key: string,
  opts?: { expiresIn?: number; config?: MinioConfig },
): Promise<string> {
  const config = opts?.config ?? getMinioConfig();
  const client = getS3Client(config);
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key.replace(/^\//, ""),
  });
  return getSignedUrl(client, command, {
    expiresIn: opts?.expiresIn ?? 900,
  });
}
