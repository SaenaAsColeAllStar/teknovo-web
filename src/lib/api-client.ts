import { z } from "zod";

import type { ApiListResponse, ApiOk } from "@/types/api";
import type { Berita, BeritaListItem, BeritaStatus } from "@/types/berita";
import type { Kategori } from "@/types/kategori";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  process.env.API_URL?.replace(/\/$/, "") ||
  "";

export function getApiBaseUrl(): string {
  return API_URL;
}

export function isApiConfigured(): boolean {
  return Boolean(API_URL);
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function apiErrorMessage(status: number, body: unknown): string {
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    body.error &&
    typeof body.error === "object" &&
    "message" in body.error &&
    typeof (body.error as { message: unknown }).message === "string"
  ) {
    return (body.error as { message: string }).message;
  }
  if (status === 503) return "API_URL belum dikonfigurasi atau API tidak tersedia.";
  if (status === 401 || status === 403) return "Sesi tidak valid. Masuk ulang lalu coba lagi.";
  if (status === 404) return "Data tidak ditemukan.";
  return `Permintaan API gagal (${status}).`;
}

async function request<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  if (!API_URL) {
    throw new ApiClientError("API_URL belum dikonfigurasi", 503);
  }

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiClientError("Tidak dapat terhubung ke API homelab", 503);
  }

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = undefined;
    }
    throw new ApiClientError(apiErrorMessage(res.status, body), res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export type BeritaListParams = {
  page?: number;
  limit?: number;
  kategori?: string;
  status?: BeritaStatus;
};

/** Public berita list — falls back to empty when API is offline (marketing SSR). */
export async function fetchBeritaList(
  params?: BeritaListParams,
): Promise<BeritaListItem[]> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.kategori) qs.set("kategori", params.kategori);
  qs.set("status", params?.status ?? "PUBLISHED");
  const q = qs.toString();

  try {
    const data = await request<ApiListResponse<BeritaListItem>>(
      `/v1/berita${q ? `?${q}` : ""}`,
      { next: { revalidate: 60, tags: ["berita"] } },
    );
    return data.data;
  } catch {
    return [];
  }
}

/**
 * Like `fetchBeritaList`, but returns `null` when the API is unreachable /
 * unconfigured so callers can fall back to static content.
 */
export async function fetchBeritaListOrNull(
  params?: BeritaListParams,
): Promise<BeritaListItem[] | null> {
  if (!API_URL) return null;
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.kategori) qs.set("kategori", params.kategori);
  qs.set("status", params?.status ?? "PUBLISHED");
  const q = qs.toString();

  try {
    const data = await request<ApiListResponse<BeritaListItem>>(
      `/v1/berita?${q}`,
      { next: { revalidate: 60, tags: ["berita"] } },
    );
    return data.data;
  } catch {
    return null;
  }
}

export async function fetchBeritaBySlug(
  slug: string,
): Promise<Berita | null> {
  try {
    const data = await request<ApiOk<Berita>>(`/v1/berita/${slug}`, {
      next: { revalidate: 60, tags: [`berita:${slug}`] },
    });
    return data.data;
  } catch {
    return null;
  }
}

/** Returns null when API is offline (distinct from 404). */
export async function fetchBeritaBySlugOrNull(
  slug: string,
): Promise<Berita | null | undefined> {
  if (!API_URL) return undefined;
  try {
    const data = await request<ApiOk<Berita>>(`/v1/berita/${slug}`, {
      next: { revalidate: 60, tags: [`berita:${slug}`] },
    });
    return data.data;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) return null;
    return undefined;
  }
}

export async function fetchKategoriList(): Promise<Kategori[]> {
  try {
    const data = await request<ApiListResponse<Kategori>>("/v1/kategori", {
      next: { revalidate: 300, tags: ["kategori"] },
    });
    return data.data;
  } catch {
    return [];
  }
}

/** CMS: list berita (all statuses unless filtered). Requires Clerk Bearer token. */
export async function fetchBeritaListCms(
  token: string,
  params?: BeritaListParams,
): Promise<ApiListResponse<BeritaListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.kategori) qs.set("kategori", params.kategori);
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString();
  return request<ApiListResponse<BeritaListItem>>(
    `/v1/berita${q ? `?${q}` : ""}`,
    { token, cache: "no-store" },
  );
}

export async function fetchBeritaById(
  id: string,
  token: string,
): Promise<Berita> {
  const data = await request<ApiOk<Berita>>(`/v1/berita/id/${id}`, {
    token,
    cache: "no-store",
  });
  return data.data;
}

export async function createBerita(
  values: BeritaFormValues,
  token: string,
): Promise<Berita> {
  const body = normalizeBeritaPayload(values);
  const data = await request<ApiOk<Berita>>("/v1/berita", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
  return data.data;
}

export async function updateBerita(
  id: string,
  values: BeritaFormValues,
  token: string,
): Promise<Berita> {
  const body = normalizeBeritaPayload(values);
  const data = await request<ApiOk<Berita>>(`/v1/berita/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
  return data.data;
}

export async function deleteBerita(id: string, token: string): Promise<void> {
  await request<void>(`/v1/berita/${id}`, {
    method: "DELETE",
    token,
  });
}

function normalizeBeritaPayload(values: BeritaFormValues) {
  return {
    judul: values.judul,
    slug: values.slug,
    ringkasan: values.ringkasan?.trim() || undefined,
    konten: values.konten,
    kategoriId: values.kategoriId?.trim() || undefined,
    status: values.status,
    coverUrl: values.coverUrl?.trim() || undefined,
  };
}

export const beritaFormSchema = z.object({
  judul: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ringkasan: z.string().max(500).optional(),
  konten: z.string().min(1),
  kategoriId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export type BeritaFormValues = z.infer<typeof beritaFormSchema>;

export function slugifyJudul(judul: string): string {
  return judul
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}
