/**
 * `MediaLibrary` (reused from the Next.js dashboard, `src/components/dashboard/media/MediaLibrary.tsx`)
 * calls `fetch("/api/cms/media...")` with relative, unauthenticated requests — in the
 * Next.js monolith that route reads the Clerk session from same-origin cookies. The
 * Cloudflare API Worker's `/api/cms/media` instead requires a `Authorization: Bearer`
 * header (cross-origin, no cookies), and the CMS SPA is deployed on a different origin
 * (`cms.smkteknovo.sch.id`) than the Worker (`cf.smkteknovo.sch.id`). Patch
 * `window.fetch` to rewrite those specific requests to the absolute API origin and
 * attach the current Clerk session token, instead of forking the shared component.
 */
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: (options?: { template?: string }) => Promise<string | null>;
      } | null;
    };
  }
}

const apiBase = (
  (() => {
    const raw = (
      import.meta.env.VITE_API_URL || "https://cf.smkteknovo.sch.id/api"
    ).replace(/\/$/, "");
    return raw.endsWith("/api") ? raw : `${raw}/api`;
  })()
).replace(/\/$/, "");
const apiOrigin = apiBase.replace(/\/api$/, "");

const originalFetch = window.fetch.bind(window);

function isCmsMediaPath(pathname: string): boolean {
  return pathname.startsWith("/api/cms");
}

async function withClerkAuth(init: RequestInit | undefined): Promise<RequestInit> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Authorization")) {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    } catch {
      /* best-effort — request proceeds unauthenticated and the API will 401 */
    }
  }
  return { ...init, headers };
}

window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string" || input instanceof URL
      ? new URL(input, window.location.origin)
      : new URL(input.url);

  if (url.origin === window.location.origin && isCmsMediaPath(url.pathname)) {
    const rewritten = `${apiOrigin}${url.pathname}${url.search}`;
    return originalFetch(rewritten, await withClerkAuth(init));
  }

  return originalFetch(input, init);
}) as typeof window.fetch;

export {};
