import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret } from "./crypto";

describe("platform crypto", () => {
  it("round-trips with PLATFORM_SECRETS_KEY", () => {
    const env = { PLATFORM_SECRETS_KEY: "test-key-for-unit" };
    const enc = encryptSecret("s3cret-value", env);
    expect(enc.startsWith("enc:v1:")).toBe(true);
    expect(decryptSecret(enc, env)).toBe("s3cret-value");
  });

  it("stores plain prefix without key", () => {
    const env = {};
    const enc = encryptSecret("local-dev", env);
    expect(enc).toBe("plain:local-dev");
    expect(decryptSecret(enc, env)).toBe("local-dev");
  });
});
