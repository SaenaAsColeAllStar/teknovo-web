/**
 * Encrypt / decrypt tenant secrets for Platform DB (F-37).
 * When PLATFORM_SECRETS_KEY is unset, values are stored with a `plain:` prefix
 * (local/dev only — never use in production with real credentials).
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const PREFIX = "enc:v1:";
const PLAIN = "plain:";

function keyFromEnv(env: NodeJS.ProcessEnv = process.env): Buffer | null {
  const raw = env.PLATFORM_SECRETS_KEY?.trim();
  if (!raw || raw.startsWith("GANTI_")) return null;
  return createHash("sha256").update(raw).digest();
}

export function encryptSecret(
  value: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const key = keyFromEnv(env);
  if (!key) return `${PLAIN}${value}`;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decryptSecret(
  stored: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  if (stored.startsWith(PLAIN)) return stored.slice(PLAIN.length);
  if (!stored.startsWith(PREFIX)) return stored;
  const key = keyFromEnv(env);
  if (!key) {
    throw new Error("PLATFORM_SECRETS_KEY required to decrypt tenant secrets");
  }
  const body = stored.slice(PREFIX.length);
  const [ivB64, tagB64, dataB64] = body.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Malformed encrypted secret");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivB64, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function maskSecret(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.length <= 4) return "****";
  return `${"*".repeat(Math.min(8, value.length - 4))}${value.slice(-4)}`;
}
