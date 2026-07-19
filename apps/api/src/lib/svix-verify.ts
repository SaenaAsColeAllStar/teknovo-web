/**
 * Verify Clerk/Svix webhook signatures with Web Crypto (Workers-safe).
 * @see https://docs.svix.com/receiving/verifying-payloads/how
 */

const SVIX_TOLERANCE_SEC = 5 * 60;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

function parseSecret(secret: string): Uint8Array {
  const raw = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const binary = atob(raw);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < view.length; i++) s += String.fromCharCode(view[i]!);
  return btoa(s);
}

/**
 * Returns true when the Svix signature headers match the payload.
 */
export async function verifySvixSignature(opts: {
  secret: string;
  payload: string;
  svixId: string | null;
  svixTimestamp: string | null;
  svixSignature: string | null;
  nowSec?: number;
}): Promise<boolean> {
  const { secret, payload, svixId, svixTimestamp, svixSignature } = opts;
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const ts = Number(svixTimestamp);
  if (!Number.isFinite(ts)) return false;
  const now = opts.nowSec ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > SVIX_TOLERANCE_SEC) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    parseSecret(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const toSign = new TextEncoder().encode(`${svixId}.${svixTimestamp}.${payload}`);
  const mac = await crypto.subtle.sign("HMAC", key, toSign);
  const expected = bytesToBase64(mac);

  const versions = svixSignature.split(" ");
  for (const part of versions) {
    const [version, sig] = part.split(",", 2);
    if (version === "v1" && sig && timingSafeEqual(sig, expected)) {
      return true;
    }
  }
  return false;
}
