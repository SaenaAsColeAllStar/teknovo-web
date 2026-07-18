const API_URL = (
  import.meta.env.VITE_API_URL || "https://cf.smkteknovo.sch.id"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOpts = {
  method?: string;
  token?: string | null;
  body?: unknown;
  formData?: FormData;
};

export async function apiRequest<T>(
  path: string,
  opts: RequestOpts = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    method: opts.method ?? (opts.body || opts.formData ? "POST" : "GET"),
    headers,
    body: opts.formData
      ? opts.formData
      : opts.body !== undefined
        ? JSON.stringify(opts.body)
        : undefined,
  });

  const json = (await res.json().catch(() => null)) as
    | { ok: true; data: T; meta?: unknown }
    | { ok: false; error?: { message?: string } }
    | null;

  if (!res.ok || !json || json.ok === false) {
    const msg =
      json && "error" in json
        ? json.error?.message || `HTTP ${res.status}`
        : `HTTP ${res.status}`;
    throw new ApiError(msg, res.status);
  }

  return json.data as T;
}

export async function apiList<T>(
  path: string,
  token?: string | null,
): Promise<{ data: T[]; meta: { page: number; limit: number; total: number } }> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { headers });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new ApiError(json?.error?.message || `HTTP ${res.status}`, res.status);
  }
  return { data: json.data, meta: json.meta };
}

export { API_URL };
