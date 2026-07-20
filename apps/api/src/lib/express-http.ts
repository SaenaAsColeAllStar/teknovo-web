/**
 * Express response / request helpers for the Node production path.
 * Worker keeps Hono helpers in `./http.ts`.
 */
import type {
  NextFunction,
  Request as ExpressRequest,
  RequestHandler,
  Response,
} from "express";
import { Readable } from "node:stream";
import { CmsAuthError } from "../auth/cms-auth";
import type { NodeBindings } from "./http";
import { log } from "./logger";
import { runBackground } from "./runtime";

export type ExpressAsyncHandler = (
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export function asyncHandler(fn: ExpressAsyncHandler): RequestHandler {
  return (req, res, next) => {
    void fn(req, res, next).catch(next);
  };
}

export function getBindings(res: Response): NodeBindings {
  const bindings = res.locals.bindings;
  if (!bindings) {
    throw new Error("NodeBindings missing on res.locals — attachBindings required");
  }
  return bindings;
}

type ExpressRequestWithRaw = ExpressRequest & { rawBody?: Buffer };

/** Build a Fetch API Request for Clerk auth + Svix/multipart helpers. */
export function toWebRequest(req: ExpressRequest): globalThis.Request {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, value);
    }
  }

  const host = req.get("host") || "127.0.0.1";
  const url = `${req.protocol}://${host}${req.originalUrl}`;
  const method = req.method || "GET";
  const canHaveBody = method !== "GET" && method !== "HEAD";
  const withRaw = req as ExpressRequestWithRaw;

  let body: BodyInit | undefined;
  const init: RequestInit & { duplex?: "half" } = { method, headers };

  if (canHaveBody) {
    if (Buffer.isBuffer(withRaw.rawBody)) {
      body = new Uint8Array(withRaw.rawBody);
    } else if (Buffer.isBuffer(req.body)) {
      body = new Uint8Array(req.body);
    } else if (typeof req.body === "string") {
      body = req.body;
    } else if (req.body instanceof Uint8Array) {
      body = req.body;
    } else if (req.body !== undefined && req.body !== null) {
      body = JSON.stringify(req.body);
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }
    } else if (!req.readableEnded) {
      body = Readable.toWeb(req) as ReadableStream;
      init.duplex = "half";
    }
  }

  if (body !== undefined) init.body = body;
  return new globalThis.Request(url, init);
}

export function exOk<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ ok: true as const, data });
}

export function exOkList<T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number },
): void {
  res.status(200).json({ ok: true as const, data, meta });
}

export function exErr(
  res: Response,
  code: string,
  message: string,
  status: number,
): void {
  res.status(status).json({ ok: false as const, error: { code, message } });
}

export function exHandleError(res: Response, err: unknown): void {
  if (err instanceof CmsAuthError) {
    exErr(res, "FORBIDDEN", err.message, err.status);
    return;
  }
  const message = err instanceof Error ? err.message : String(err);
  const isUnavailable =
    message.includes("D1") ||
    message.includes("DB") ||
    message.includes("CMS_BUCKET") ||
    message.includes("Prisma") ||
    message.includes("MinIO") ||
    message.includes("S3");
  log.error("express_route", {
    requestId: res.locals.requestId,
    err: message,
  });
  exErr(
    res,
    isUnavailable ? "UNAVAILABLE" : "INTERNAL",
    message || "Terjadi kesalahan server.",
    isUnavailable ? 503 : 500,
  );
}

export function exBackground(task: Promise<unknown>): void {
  runBackground(task);
}

export function q(req: ExpressRequest, key: string): string | undefined {
  const v = req.query[key];
  if (Array.isArray(v)) return typeof v[0] === "string" ? v[0] : undefined;
  return typeof v === "string" ? v : undefined;
}

/** Express 5 params may be `string | string[]` — normalize to a single string. */
export function p(req: ExpressRequest, key: string): string {
  const v = req.params[key];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export function bearerAuth(req: ExpressRequest): boolean {
  return Boolean(req.get("Authorization")?.startsWith("Bearer "));
}

export function getRawBody(req: ExpressRequest): Buffer | undefined {
  return (req as ExpressRequestWithRaw).rawBody;
}

/** `express.json` verify callback receives IncomingMessage — attach raw buffer. */
export function setRawBody(req: { rawBody?: Buffer }, buf: Buffer): void {
  req.rawBody = buf;
}
