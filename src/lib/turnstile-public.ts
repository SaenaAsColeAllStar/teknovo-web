/**
 * Public Turnstile config (sitekey + siteverify Worker URL).
 * Secret never leaves the managed siteverify Worker.
 */

const SITEKEY_FALLBACK = "0x4AAAAAADCl51LGpTI82u1_";
const SITEVERIFY_FALLBACK =
  "https://turnstile-siteverify-teknovo-web.fajarnugrahayusman-06.workers.dev";

type EnvBag = Record<string, string | undefined>;

function readEnv(key: string): string | undefined {
  try {
    const meta = (import.meta as { env?: EnvBag }).env;
    const fromMeta = meta?.[key];
    if (typeof fromMeta === "string" && fromMeta.trim() !== "") {
      return fromMeta.trim();
    }
  } catch {
    /* ignore — non-Vite/Astro bundlers */
  }
  if (typeof process !== "undefined" && process.env) {
    const v = process.env[key];
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return undefined;
}

function firstEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = readEnv(key);
    if (v && !v.startsWith("GANTI_")) return v;
  }
  return undefined;
}

/** Widget sitekey (public). */
export function getTurnstileSitekey(): string {
  return (
    firstEnv(
      "PUBLIC_TURNSTILE_SITEKEY",
      "VITE_TURNSTILE_SITEKEY",
      "NEXT_PUBLIC_TURNSTILE_SITEKEY",
    ) ?? SITEKEY_FALLBACK
  );
}

/** Managed Spin siteverify Worker base URL (no trailing slash). */
export function getTurnstileSiteverifyUrl(): string {
  const raw =
    firstEnv(
      "PUBLIC_TURNSTILE_SITEVERIFY_URL",
      "VITE_TURNSTILE_SITEVERIFY_URL",
      "NEXT_PUBLIC_TURNSTILE_SITEVERIFY_URL",
    ) ?? SITEVERIFY_FALLBACK;
  return raw.replace(/\/$/, "");
}

export type TurnstileVerifyResult = {
  success: boolean;
  "error-codes"?: string[];
};

/**
 * POST token to the managed siteverify Worker.
 * Never call challenges.cloudflare.com/siteverify from the browser.
 */
export async function verifyTurnstileToken(
  token: string,
): Promise<TurnstileVerifyResult> {
  if (!token.trim()) {
    return { success: false, "error-codes": ["missing-input-response"] };
  }
  const res = await fetch(`${getTurnstileSiteverifyUrl()}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  try {
    return (await res.json()) as TurnstileVerifyResult;
  } catch {
    return { success: false, "error-codes": ["internal-error"] };
  }
}
