import { describe, expect, it } from "vitest";
import {
  deriveClerkUsername,
  withClerkUsernameSuffix,
  CLERK_USERNAME_MIN,
  CLERK_USERNAME_MAX,
} from "./clerk-username";

describe("deriveClerkUsername", () => {
  it("uses email local-part, lowercased", () => {
    expect(deriveClerkUsername("Budi.Sari@sekolah.id")).toBe("budi_sari");
  });

  it("pads short local-parts to min length", () => {
    const u = deriveClerkUsername("ab@x.id");
    expect(u.length).toBeGreaterThanOrEqual(CLERK_USERNAME_MIN);
    expect(u).toMatch(/^[a-z0-9_]+$/);
  });

  it("prefixes all-numeric local-parts", () => {
    expect(deriveClerkUsername("12345@sekolah.id")).toMatch(/^u_12345/);
  });

  it("prefers explicit handle when validatable", () => {
    expect(deriveClerkUsername("x@y.id", "Guru IPA")).toBe("guru_ipa");
  });

  it("avoids reserved words", () => {
    expect(deriveClerkUsername("admin@sekolah.id")).toBe("admin_cms");
  });

  it("caps at max length", () => {
    const long = `${"a".repeat(80)}@sekolah.id`;
    expect(deriveClerkUsername(long).length).toBeLessThanOrEqual(
      CLERK_USERNAME_MAX,
    );
  });
});

describe("withClerkUsernameSuffix", () => {
  it("keeps result within max length", () => {
    const base = "a".repeat(60);
    const next = withClerkUsernameSuffix(base, 0);
    expect(next.length).toBeLessThanOrEqual(CLERK_USERNAME_MAX);
    expect(next).toMatch(/_\d/);
  });
});
