import { S3Client } from "@aws-sdk/client-s3";

export type MinioConfig = {
  endpoint: string;
  useSsl: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  publicUrl: string;
  region: string;
};

const globalForS3 = globalThis as unknown as {
  __teknovoS3?: S3Client;
  __teknovoMinioConfig?: MinioConfig;
};

export function loadMinioConfig(
  env: NodeJS.ProcessEnv = process.env,
): MinioConfig {
  const endpoint = (env.MINIO_ENDPOINT || "127.0.0.1:9010").replace(
    /^https?:\/\//,
    "",
  );
  const useSsl = (env.MINIO_USE_SSL || "false").toLowerCase() === "true";
  const accessKey = env.MINIO_ACCESS_KEY || "minioadmin";
  const secretKey = env.MINIO_SECRET_KEY || "minioadmin";
  const bucket = env.MINIO_BUCKET || "teknovo-web";
  const publicUrl = (
    env.MINIO_PUBLIC_URL || `http://${endpoint}/${bucket}`
  ).replace(/\/$/, "");
  const region = env.MINIO_REGION || "auto";

  return {
    endpoint,
    useSsl,
    accessKey,
    secretKey,
    bucket,
    publicUrl,
    region,
  };
}

/** S3-compatible client singleton for MinIO. */
export function getS3Client(config?: MinioConfig): S3Client {
  const cfg = config ?? loadMinioConfig();
  if (
    globalForS3.__teknovoS3 &&
    globalForS3.__teknovoMinioConfig &&
    globalForS3.__teknovoMinioConfig.endpoint === cfg.endpoint &&
    globalForS3.__teknovoMinioConfig.accessKey === cfg.accessKey
  ) {
    return globalForS3.__teknovoS3;
  }

  const protocol = cfg.useSsl ? "https" : "http";
  const client = new S3Client({
    region: cfg.region,
    endpoint: `${protocol}://${cfg.endpoint}`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: cfg.accessKey,
      secretAccessKey: cfg.secretKey,
    },
  });

  globalForS3.__teknovoS3 = client;
  globalForS3.__teknovoMinioConfig = cfg;
  return client;
}

export function getMinioConfig(): MinioConfig {
  return globalForS3.__teknovoMinioConfig ?? loadMinioConfig();
}

export async function destroyS3Client(): Promise<void> {
  if (globalForS3.__teknovoS3) {
    globalForS3.__teknovoS3.destroy();
    globalForS3.__teknovoS3 = undefined;
    globalForS3.__teknovoMinioConfig = undefined;
  }
}
