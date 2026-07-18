/** Host origin only — paths already include `/api/v1/...`. Strip trailing `/api` if set. */
const API_URL = (
  import.meta.env.PUBLIC_API_URL || "https://cf.smkteknovo.sch.id"
)
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

export type ApiList<T> = {
  ok: true;
  data: T[];
  meta: { page: number; limit: number; total: number };
};

export type ApiOne<T> = { ok: true; data: T };

export async function fetchApiList<T>(
  path: string,
): Promise<{ items: T[]; total: number }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { items: [], total: 0 };
    const json = (await res.json()) as ApiList<T>;
    if (!json.ok) return { items: [], total: 0 };
    return { items: json.data, total: json.meta?.total ?? json.data.length };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function fetchApiOne<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiOne<T>;
    return json.ok ? json.data : null;
  } catch {
    return null;
  }
}

export { API_URL };
