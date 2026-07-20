import { describe, expect, it } from "vitest";
import { isUuid } from "./ids";

describe("isUuid", () => {
  it("accepts RFC-like UUIDs", () => {
    expect(isUuid("86a3a10f-9bd0-4e37-8a6d-072ba96220b8")).toBe(true);
  });

  it("rejects slugs so Prisma findUnique is skipped", () => {
    expect(isUuid("test")).toBe(false);
    expect(isUuid("berita-sekolah")).toBe(false);
    expect(isUuid("")).toBe(false);
  });
});
