/**
 * Legacy Express → Hono fetch bridge (pre Express-native routers).
 * Node production uses `express-routes/*` + `mountExpressApiRoutes` instead.
 * Kept for reference only — not imported by `server.ts`.
 */
import type { RequestHandler } from "express";
import type { Hono } from "hono";
import type { AppEnv, NodeBindings } from "./http";

function buildRequestUrl(req: {
  protocol: string;
  originalUrl: string;
  get: (name: string) => string | undefined;
}): string {
  const host = req.get("host") || "127.0.0.1";
  return `${req.protocol}://${host}${req.originalUrl}`;
}

/** Rebuild a Fetch Request after Express body parsers have consumed the stream. */
export function expressToWebRequest(
  req: Parameters<RequestHandler>[0],
): Request {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, value);
    }
  }

  const method = req.method || "GET";
  const canHaveBody = method !== "GET" && method !== "HEAD";
  let body: BodyInit | undefined;

  if (canHaveBody && req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) {
      body = new Uint8Array(req.body);
    } else if (typeof req.body === "string") {
      body = req.body;
    } else if (req.body instanceof Uint8Array) {
      body = req.body;
    } else {
      body = JSON.stringify(req.body);
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }
    }
  }

  const init: RequestInit & { duplex?: "half" } = {
    method,
    headers,
  };
  if (body !== undefined) {
    init.body = body;
    init.duplex = "half";
  }

  return new Request(buildRequestUrl(req), init);
}

export async function sendWebResponse(
  res: Parameters<RequestHandler>[1],
  webRes: Response,
): Promise<void> {
  res.status(webRes.status);
  webRes.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "transfer-encoding" || lower === "content-encoding") return;
    res.setHeader(key, value);
  });
  const buf = Buffer.from(await webRes.arrayBuffer());
  res.end(buf);
}

/** Mount a Hono app (shared routes) as Express middleware with NodeBindings env. */
export function honoFetchMiddleware(
  app: Hono<AppEnv>,
  bindings: NodeBindings,
): RequestHandler {
  return (req, res, next) => {
    void (async () => {
      try {
        const request = expressToWebRequest(req);
        const response = await app.fetch(request, bindings);
        await sendWebResponse(res, response);
      } catch (err) {
        next(err);
      }
    })();
  };
}
