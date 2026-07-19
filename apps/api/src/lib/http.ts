import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { CmsAuthError } from "../auth/cms-auth";

export type AppEnv = {
  Bindings: Env;
  Variables: {
    requestId: string;
  };
};

export function okJson<T>(c: Context<AppEnv>, data: T, status: ContentfulStatusCode = 200) {
  return c.json({ ok: true as const, data }, status);
}

export function okListJson<T>(
  c: Context<AppEnv>,
  data: T[],
  meta: { page: number; limit: number; total: number },
) {
  return c.json({ ok: true as const, data, meta });
}

export function errJson(
  c: Context<AppEnv>,
  code: string,
  message: string,
  status: ContentfulStatusCode,
) {
  return c.json({ ok: false as const, error: { code, message } }, status);
}

export function handleApiError(c: Context<AppEnv>, err: unknown) {
  if (err instanceof CmsAuthError) {
    return errJson(c, "FORBIDDEN", err.message, err.status);
  }
  const message = err instanceof Error ? err.message : String(err);
  const isUnavailable =
    message.includes("D1") ||
    message.includes("DB") ||
    message.includes("CMS_BUCKET");
  return errJson(
    c,
    isUnavailable ? "UNAVAILABLE" : "INTERNAL",
    message || "Terjadi kesalahan server.",
    isUnavailable ? 503 : 500,
  );
}
