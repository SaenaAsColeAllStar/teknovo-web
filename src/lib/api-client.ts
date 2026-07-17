import { z } from "zod";

import type { ApiListResponse, ApiOk } from "@/types/api";
import type { Berita, BeritaListItem } from "@/types/berita";
import type { Kategori } from "@/types/kategori";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  process.env.API_URL?.replace(/\/$/, "") ||
  "";

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

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = undefined;
    }
    throw new ApiClientError(`API ${res.status}`, res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

/** Public berita list — falls back to empty when API is offline (marketing SSR). */
export async function fetchBeritaList(params?: {
  page?: number;
  limit?: number;
  kategori?: string;
}): Promise<BeritaListItem[]> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.kategori) qs.set("kategori", params.kategori);
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
