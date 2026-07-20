/**
 * Ensure MinIO bucket exists with public-read policy for media/* and brand/*.
 * Usage: pnpm --filter @teknovo/api minio:ensure-bucket
 */
import "dotenv/config";
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import {
  destroyS3Client,
  getS3Client,
  loadMinioConfig,
} from "../src/lib/minio/client";

async function main() {
  const config = loadMinioConfig();
  const s3 = getS3Client(config);

  try {
    await s3.send(new HeadBucketCommand({ Bucket: config.bucket }));
    console.log(`Bucket exists: ${config.bucket}`);
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: config.bucket }));
    console.log(`Created bucket: ${config.bucket}`);
  }

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadMediaBrand",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [
          `arn:aws:s3:::${config.bucket}/media/*`,
          `arn:aws:s3:::${config.bucket}/brand/*`,
        ],
      },
    ],
  };

  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: config.bucket,
      Policy: JSON.stringify(policy),
    }),
  );
  console.log("Applied public-read policy for media/* and brand/*");
  console.log(`Public URL base: ${config.publicUrl}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await destroyS3Client();
  });
