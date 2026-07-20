import { describe, expect, it } from "vitest";
import { hasMinio, hasPrisma, publicObjectUrl } from "./runtime";
import type { NodeBindings } from "./http";

describe("runtime switch", () => {
  const nodeLike = {
    prisma: {} as NodeBindings["prisma"],
    s3: {} as NodeBindings["s3"],
    MINIO_BUCKET: "teknovo-web",
    MINIO_PUBLIC_URL: "http://127.0.0.1:9010/teknovo-web",
    CMS_ORIGIN: "http://localhost:5173",
    WEB_ORIGIN: "http://localhost:4321",
    CLERK_SECRET_KEY: "test",
  } satisfies NodeBindings;

  const workerLike = {
    DB: {} as D1Database,
    CMS_BUCKET: {} as R2Bucket,
    R2_PUBLIC_URL: "https://r2.example.test",
    CMS_ORIGIN: "http://localhost:5173",
    WEB_ORIGIN: "http://localhost:4321",
    CLERK_SECRET_KEY: "test",
  } satisfies Env;

  it("detects prisma/minio on Node bindings", () => {
    expect(hasPrisma(nodeLike)).toBe(true);
    expect(hasMinio(nodeLike)).toBe(true);
    expect(hasPrisma(workerLike)).toBe(false);
    expect(hasMinio(workerLike)).toBe(false);
  });

  it("builds public URLs per runtime", () => {
    expect(publicObjectUrl(nodeLike, "cms/uploads/a.png")).toBe(
      "http://127.0.0.1:9010/teknovo-web/cms/uploads/a.png",
    );
    expect(publicObjectUrl(workerLike, "cms/uploads/a.png")).toBe(
      "https://r2.example.test/cms/uploads/a.png",
    );
  });
});
