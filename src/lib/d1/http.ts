import { NextResponse } from "next/server";

import { d1UnavailableMessage } from "@/lib/d1";
import { CmsAuthError, cmsAuthErrorResponse } from "@/lib/cms-auth";

export function okJson<T>(data: T, init?: { status?: number }) {
  return NextResponse.json({ ok: true, data }, { status: init?.status ?? 200 });
}

export function okListJson<T>(
  data: T[],
  meta: { page: number; limit: number; total: number },
) {
  return NextResponse.json({ ok: true, data, meta });
}

export function errJson(
  code: string,
  message: string,
  status: number,
) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status },
  );
}

export function handleCmsApiError(err: unknown): NextResponse {
  if (err instanceof CmsAuthError) return cmsAuthErrorResponse(err);
  const message = d1UnavailableMessage(err);
  const isUnavailable =
    message.includes("D1") ||
    message.includes("DB") ||
    message.includes("OpenNext");
  return errJson(
    isUnavailable ? "D1_UNAVAILABLE" : "INTERNAL",
    message,
    isUnavailable ? 503 : 500,
  );
}
