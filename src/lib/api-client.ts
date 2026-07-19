import { z } from "zod";

import type { PengaturanSitusPublikData } from "@/lib/pengaturan-situs-publik-defaults";
import type { PengaturanSitusPublikPatchInput } from "@/lib/validations/pengaturan-situs-publik";
import type { ApiListResponse, ApiOk } from "@/types/api";
import type { CmsAnalyticsOverview } from "@/types/analytics";
import type {
  ArtikelSiswa,
  ArtikelSiswaListItem,
  ArtikelSiswaStatus,
} from "@/types/artikel-siswa";
import type { Berita, BeritaListItem, BeritaStatus } from "@/types/berita";
import type { Kategori } from "@/types/kategori";

/**
 * Worker mounts at `/api/v1/...`. Accept either
 * `https://cf…` or `https://cf…/api` from env so CMS Pages misconfig
 * (`VITE_API_URL` without `/api`) does not 404 with "Route tidak ditemukan."
 */
function normalizeExternalApiBase(raw: string): string {
  const trimmed = raw.replace(/\/$/, "");
  if (!trimmed) return "";
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
}

const EXTERNAL_API_URL = normalizeExternalApiBase(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "",
);

/**
 * Base URL for CMS content API.
 * - If `API_URL` / `NEXT_PUBLIC_API_URL` set → external Worker (`…/api`)
 * - Else → same-origin D1 routes under `/api/v1/...`
 */
export function getApiBaseUrl(): string {
  if (EXTERNAL_API_URL) return EXTERNAL_API_URL;
  if (typeof window !== "undefined") return "";
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:3000"
  );
}

/** D1 same-origin is always “configured”; binding may still 503 on plain `next dev`. */
export function isApiConfigured(): boolean {
  return true;
}

export function isExternalApi(): boolean {
  return Boolean(EXTERNAL_API_URL);
}

function resolveRequestUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  if (EXTERNAL_API_URL) {
    return `${EXTERNAL_API_URL}${normalized}`;
  }
  // D1-backed Next.js route handlers
  return `${base}/api${normalized}`;
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
  if (status === 503) return "D1/API tidak tersedia. Deploy Workers + jalankan migrasi D1.";
  if (status === 401 || status === 403) return "Sesi tidak valid. Masuk ulang lalu coba lagi.";
  if (status === 404) {
    // Prefer Worker body ("Route tidak ditemukan.") so mis-prefixed URLs are obvious.
    return "Data atau endpoint tidak ditemukan. Periksa VITE_API_URL / PUBLIC_API_URL (CMS: …/api).";
  }
  return `Permintaan API gagal (${status}).`;
}

async function request<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
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
    res = await fetch(resolveRequestUrl(path), {
      ...init,
      headers,
    });
  } catch {
    throw new ApiClientError("Tidak dapat terhubung ke API CMS (D1/api-web)", 503);
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

/** CMS: kategori list with Bearer (no stale cache). */
export async function fetchKategoriListCms(
  token: string,
): Promise<ApiListResponse<Kategori>> {
  return request<ApiListResponse<Kategori>>("/v1/kategori", {
    token,
    cache: "no-store",
  });
}

export async function createKategori(
  values: KategoriFormValues,
  token: string,
): Promise<Kategori> {
  const body = normalizeKategoriPayload(values);
  const data = await request<ApiOk<Kategori>>("/v1/kategori", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
  return data.data;
}

export async function updateKategori(
  id: string,
  values: KategoriFormValues,
  token: string,
): Promise<Kategori> {
  const body = normalizeKategoriPayload(values);
  const data = await request<ApiOk<Kategori>>(`/v1/kategori/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
  return data.data;
}

export async function deleteKategori(id: string, token: string): Promise<void> {
  await request<void>(`/v1/kategori/${id}`, {
    method: "DELETE",
    token,
  });
}

function normalizeKategoriPayload(values: KategoriFormValues) {
  return {
    nama: values.nama.trim(),
    slug: values.slug.trim(),
    deskripsi: values.deskripsi?.trim() || undefined,
  };
}

export const kategoriFormSchema = z.object({
  nama: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  deskripsi: z.string().max(500).optional(),
});

export type KategoriFormValues = z.infer<typeof kategoriFormSchema>;

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
    metaTitle: values.metaTitle?.trim() || undefined,
    metaDescription: values.metaDescription?.trim() || undefined,
    metaKeywords: values.metaKeywords?.trim() || undefined,
    ogImageUrl: values.ogImageUrl?.trim() || undefined,
    canonicalUrl: values.canonicalUrl?.trim() || undefined,
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
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  metaKeywords: z.string().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
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

/* ─── Artikel siswa (ekskul channel) ─────────────────────────────── */

export type ArtikelSiswaListParams = {
  page?: number;
  limit?: number;
  status?: ArtikelSiswaStatus;
  /** CMS: filter to current user's articles (siswa "milik sendiri"). */
  mine?: boolean;
};

/** Public published artikel siswa — empty when API offline. */
export async function fetchArtikelSiswaList(
  params?: ArtikelSiswaListParams,
): Promise<ArtikelSiswaListItem[]> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  qs.set("status", params?.status ?? "PUBLISHED");
  const q = qs.toString();

  try {
    const data = await request<ApiListResponse<ArtikelSiswaListItem>>(
      `/v1/artikel-siswa${q ? `?${q}` : ""}`,
      { next: { revalidate: 60, tags: ["artikel-siswa"] } },
    );
    return data.data;
  } catch {
    return [];
  }
}

/** Returns `null` when API unreachable so callers can fall back. */
export async function fetchArtikelSiswaListOrNull(
  params?: ArtikelSiswaListParams,
): Promise<ArtikelSiswaListItem[] | null> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  qs.set("status", params?.status ?? "PUBLISHED");
  const q = qs.toString();

  try {
    const data = await request<ApiListResponse<ArtikelSiswaListItem>>(
      `/v1/artikel-siswa?${q}`,
      { next: { revalidate: 60, tags: ["artikel-siswa"] } },
    );
    return data.data;
  } catch {
    return null;
  }
}

export async function fetchArtikelSiswaBySlug(
  slug: string,
): Promise<ArtikelSiswa | null> {
  try {
    const data = await request<ApiOk<ArtikelSiswa>>(
      `/v1/artikel-siswa/${slug}`,
      { next: { revalidate: 60, tags: [`artikel-siswa:${slug}`] } },
    );
    return data.data;
  } catch {
    return null;
  }
}

/** `undefined` = API offline; `null` = 404. */
export async function fetchArtikelSiswaBySlugOrNull(
  slug: string,
): Promise<ArtikelSiswa | null | undefined> {
  try {
    const data = await request<ApiOk<ArtikelSiswa>>(
      `/v1/artikel-siswa/${slug}`,
      { next: { revalidate: 60, tags: [`artikel-siswa:${slug}`] } },
    );
    return data.data;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) return null;
    return undefined;
  }
}

/** CMS list (Bearer). Use `mine: true` for siswa own articles. */
export async function fetchArtikelSiswaListCms(
  token: string,
  params?: ArtikelSiswaListParams,
): Promise<ApiListResponse<ArtikelSiswaListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);
  if (params?.mine) qs.set("mine", "1");
  const q = qs.toString();
  return request<ApiListResponse<ArtikelSiswaListItem>>(
    `/v1/artikel-siswa${q ? `?${q}` : ""}`,
    { token, cache: "no-store" },
  );
}

export async function fetchArtikelSiswaById(
  id: string,
  token: string,
): Promise<ArtikelSiswa> {
  const data = await request<ApiOk<ArtikelSiswa>>(
    `/v1/artikel-siswa/id/${id}`,
    { token, cache: "no-store" },
  );
  return data.data;
}

export async function createArtikelSiswa(
  values: ArtikelSiswaFormValues,
  token: string,
): Promise<ArtikelSiswa> {
  const body = normalizeArtikelSiswaPayload(values);
  const data = await request<ApiOk<ArtikelSiswa>>("/v1/artikel-siswa", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
  return data.data;
}

export async function updateArtikelSiswa(
  id: string,
  values: ArtikelSiswaFormValues,
  token: string,
): Promise<ArtikelSiswa> {
  const body = normalizeArtikelSiswaPayload(values);
  const data = await request<ApiOk<ArtikelSiswa>>(`/v1/artikel-siswa/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
  return data.data;
}

export async function deleteArtikelSiswa(
  id: string,
  token: string,
): Promise<void> {
  await request<void>(`/v1/artikel-siswa/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function approveArtikelSiswa(
  id: string,
  token: string,
): Promise<ArtikelSiswa> {
  const data = await request<ApiOk<ArtikelSiswa>>(
    `/v1/artikel-siswa/${id}/approve`,
    { method: "POST", token },
  );
  return data.data;
}

export async function rejectArtikelSiswa(
  id: string,
  token: string,
  reason?: string,
): Promise<ArtikelSiswa> {
  const data = await request<ApiOk<ArtikelSiswa>>(
    `/v1/artikel-siswa/${id}/reject`,
    {
      method: "POST",
      token,
      body: JSON.stringify({
        reason: reason?.trim() || undefined,
      }),
    },
  );
  return data.data;
}

function normalizeArtikelSiswaPayload(values: ArtikelSiswaFormValues) {
  return {
    judul: values.judul,
    slug: values.slug,
    ringkasan: values.ringkasan?.trim() || undefined,
    konten: values.konten,
    kategoriId: values.kategoriId?.trim() || undefined,
    status: values.status,
    coverUrl: values.coverUrl?.trim() || undefined,
    penulisKelas: values.penulisKelas?.trim() || undefined,
    metaTitle: values.metaTitle?.trim() || undefined,
    metaDescription: values.metaDescription?.trim() || undefined,
    metaKeywords: values.metaKeywords?.trim() || undefined,
    ogImageUrl: values.ogImageUrl?.trim() || undefined,
    canonicalUrl: values.canonicalUrl?.trim() || undefined,
  };
}

export const artikelSiswaFormSchema = z.object({
  judul: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ringkasan: z.string().max(500).optional(),
  konten: z.string().min(1),
  kategoriId: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
  coverUrl: z.string().url().optional().or(z.literal("")),
  penulisKelas: z.string().max(50).optional(),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  metaKeywords: z.string().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

export type ArtikelSiswaFormValues = z.infer<typeof artikelSiswaFormSchema>;

/* ─── Pengaturan situs (admin) ───────────────────────────────────── */

export async function fetchPengaturanCms(
  token: string,
): Promise<PengaturanSitusPublikData> {
  const data = await request<ApiOk<PengaturanSitusPublikData>>(
    "/v1/pengaturan",
    { token, cache: "no-store" },
  );
  return data.data;
}

export async function updatePengaturanCms(
  values: PengaturanSitusPublikPatchInput,
  token: string,
): Promise<PengaturanSitusPublikData> {
  const data = await request<ApiOk<PengaturanSitusPublikData>>(
    "/v1/pengaturan",
    {
      method: "PATCH",
      token,
      body: JSON.stringify(values),
    },
  );
  return data.data;
}

/* ─── Users (Super Admin + Admin invite) ───────────────────────────── */

export type CmsUserListItem = {
  id: string;
  email: string | null;
  name: string | null;
  role: "admin" | "editor" | "viewer" | "siswa";
  createdAt: string;
  invited?: boolean;
};

export type CmsUserCreateInput = {
  email: string;
  nama?: string;
  role: "admin" | "editor" | "siswa" | "viewer";
  password?: string;
};

export type CmsUserPatchInput = {
  role?: "admin" | "editor" | "viewer" | "siswa";
  nama?: string;
};
export async function fetchCmsUsers(
  token: string,
  opts?: { limit?: number; offset?: number },
): Promise<ApiListResponse<CmsUserListItem>> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.offset) params.set("offset", String(opts.offset));
  const qs = params.toString();
  return request<ApiListResponse<CmsUserListItem>>(
    `/v1/users${qs ? `?${qs}` : ""}`,
    { token, cache: "no-store" },
  );
}

export async function createCmsUser(
  values: CmsUserCreateInput,
  token: string,
): Promise<CmsUserListItem> {
  const data = await request<ApiOk<CmsUserListItem>>("/v1/users", {
    method: "POST",
    token,
    body: JSON.stringify(values),
  });
  return data.data;
}

export async function updateCmsUser(
  id: string,
  values: CmsUserPatchInput,
  token: string,
): Promise<CmsUserListItem> {
  const data = await request<ApiOk<CmsUserListItem>>(`/v1/users/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(values),
  });
  return data.data;
}

export async function deleteCmsUser(
  id: string,
  token: string,
): Promise<void> {
  await request<ApiOk<{ deleted: boolean }>>(`/v1/users/${id}`, {
    method: "DELETE",
    token,
  });
}

/** Prefer dedicated analytics endpoint; fall back to aggregating list queries. */
export async function fetchCmsAnalytics(
  token: string,
): Promise<CmsAnalyticsOverview> {
  try {
    const data = await request<ApiOk<CmsAnalyticsOverview>>(
      "/v1/analytics/overview",
      { token, cache: "no-store" },
    );
    return { ...data.data, source: "api" };
  } catch {
    /* aggregate below */
  }

  try {
    const [beritaAll, artikelAll, kategoriAll] = await Promise.all([
      fetchBeritaListCms(token, { limit: 100 }),
      fetchArtikelSiswaListCms(token, { limit: 100 }),
      fetchKategoriListCms(token),
    ]);

    const berita = beritaAll.data;
    const artikel = artikelAll.data;
    const kategori = kategoriAll.data;

    return {
      beritaTotal: beritaAll.meta?.total ?? berita.length,
      beritaPublished: berita.filter((b) => b.status === "PUBLISHED").length,
      beritaDraft: berita.filter((b) => b.status === "DRAFT").length,
      beritaArchived: berita.filter((b) => b.status === "ARCHIVED").length,
      artikelTotal: artikelAll.meta?.total ?? artikel.length,
      artikelReview: artikel.filter((a) => a.status === "REVIEW").length,
      artikelPublished: artikel.filter((a) => a.status === "PUBLISHED").length,
      kategoriTotal: kategoriAll.meta?.total ?? kategori.length,
      source: "aggregate",
    };
  } catch {
    return emptyAnalytics("unavailable");
  }
}

function emptyAnalytics(
  source: CmsAnalyticsOverview["source"],
): CmsAnalyticsOverview {
  return {
    beritaTotal: 0,
    beritaPublished: 0,
    beritaDraft: 0,
    beritaArchived: 0,
    artikelTotal: 0,
    artikelReview: 0,
    artikelPublished: 0,
    kategoriTotal: 0,
    source,
  };
}

/* ─── Site content: fasilitas / ekstrakurikuler / prestasi / site-media ─ */

export type {
  Fasilitas,
  FasilitasListItem,
  FasilitasFormValues,
  Ekstrakurikuler,
  EkstrakurikulerListItem,
  EkstrakurikulerFormValues,
  Prestasi,
  PrestasiListItem,
  PrestasiFormValues,
  SiteMediaItem,
  SiteMediaPatchValues,
} from "@teknovo/shared";

export {
  fasilitasFormSchema,
  ekstrakurikulerFormSchema,
  prestasiFormSchema,
  siteMediaPatchSchema,
} from "@teknovo/shared";

import type {
  Fasilitas,
  FasilitasListItem,
  FasilitasFormValues,
  Ekstrakurikuler,
  EkstrakurikulerListItem,
  EkstrakurikulerFormValues,
  Prestasi,
  PrestasiListItem,
  PrestasiFormValues,
  SiteMediaPatchValues,
} from "@teknovo/shared";

export type SiteMediaCatalogItem = {
  mediaKey: string;
  label: string;
  category: string;
  url: string;
  defaultPath: string;
  isOverride: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

export async function fetchFasilitasListOrNull(params?: {
  status?: string;
  limit?: number;
}): Promise<FasilitasListItem[] | null> {
  const qs = new URLSearchParams();
  qs.set("status", params?.status ?? "PUBLISHED");
  if (params?.limit) qs.set("limit", String(params.limit));
  try {
    const data = await request<ApiListResponse<FasilitasListItem>>(
      `/v1/fasilitas?${qs}`,
      { next: { revalidate: 60, tags: ["fasilitas"] } },
    );
    return data.data;
  } catch {
    return null;
  }
}

export async function fetchFasilitasBySlugOrNull(
  slug: string,
): Promise<Fasilitas | null | undefined> {
  try {
    const data = await request<ApiOk<Fasilitas>>(`/v1/fasilitas/${slug}`, {
      next: { revalidate: 60, tags: [`fasilitas:${slug}`] },
    });
    return data.data;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) return null;
    return undefined;
  }
}

export async function fetchFasilitasListCms(
  token: string,
  params?: { page?: number; limit?: number; status?: string },
): Promise<ApiListResponse<FasilitasListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString();
  return request<ApiListResponse<FasilitasListItem>>(
    `/v1/fasilitas${q ? `?${q}` : ""}`,
    { token, cache: "no-store" },
  );
}

export async function fetchFasilitasById(
  id: string,
  token: string,
): Promise<Fasilitas> {
  const data = await request<ApiOk<Fasilitas>>(`/v1/fasilitas/id/${id}`, {
    token,
    cache: "no-store",
  });
  return data.data;
}

export async function createFasilitas(
  values: FasilitasFormValues,
  token: string,
): Promise<Fasilitas> {
  const data = await request<ApiOk<Fasilitas>>("/v1/fasilitas", {
    method: "POST",
    token,
    body: JSON.stringify(values),
  });
  return data.data;
}

export async function updateFasilitas(
  id: string,
  values: FasilitasFormValues,
  token: string,
): Promise<Fasilitas> {
  const data = await request<ApiOk<Fasilitas>>(`/v1/fasilitas/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(values),
  });
  return data.data;
}

export async function deleteFasilitas(
  id: string,
  token: string,
): Promise<void> {
  await request<void>(`/v1/fasilitas/${id}`, { method: "DELETE", token });
}

export async function fetchEkstrakurikulerFullOrNull(): Promise<
  Ekstrakurikuler[] | null
> {
  try {
    const data = await request<ApiListResponse<Ekstrakurikuler>>(
      "/v1/ekstrakurikuler?status=PUBLISHED&full=1",
      { next: { revalidate: 60, tags: ["ekstrakurikuler"] } },
    );
    return data.data;
  } catch {
    return null;
  }
}

export async function fetchEkstrakurikulerListCms(
  token: string,
  params?: { page?: number; limit?: number; status?: string },
): Promise<ApiListResponse<EkstrakurikulerListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString();
  return request<ApiListResponse<EkstrakurikulerListItem>>(
    `/v1/ekstrakurikuler${q ? `?${q}` : ""}`,
    { token, cache: "no-store" },
  );
}

export async function fetchEkstrakurikulerById(
  id: string,
  token: string,
): Promise<Ekstrakurikuler> {
  const data = await request<ApiOk<Ekstrakurikuler>>(
    `/v1/ekstrakurikuler/id/${id}`,
    { token, cache: "no-store" },
  );
  return data.data;
}

export async function createEkstrakurikuler(
  values: EkstrakurikulerFormValues,
  token: string,
): Promise<Ekstrakurikuler> {
  const data = await request<ApiOk<Ekstrakurikuler>>("/v1/ekstrakurikuler", {
    method: "POST",
    token,
    body: JSON.stringify(values),
  });
  return data.data;
}

export async function updateEkstrakurikuler(
  id: string,
  values: EkstrakurikulerFormValues,
  token: string,
): Promise<Ekstrakurikuler> {
  const data = await request<ApiOk<Ekstrakurikuler>>(
    `/v1/ekstrakurikuler/${id}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(values),
    },
  );
  return data.data;
}

export async function deleteEkstrakurikuler(
  id: string,
  token: string,
): Promise<void> {
  await request<void>(`/v1/ekstrakurikuler/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function fetchPrestasiListOrNull(params?: {
  status?: string;
  limit?: number;
}): Promise<PrestasiListItem[] | null> {
  const qs = new URLSearchParams();
  qs.set("status", params?.status ?? "PUBLISHED");
  if (params?.limit) qs.set("limit", String(params.limit));
  try {
    const data = await request<ApiListResponse<PrestasiListItem>>(
      `/v1/prestasi?${qs}`,
      { next: { revalidate: 60, tags: ["prestasi"] } },
    );
    return data.data;
  } catch {
    return null;
  }
}

export async function fetchPrestasiListCms(
  token: string,
  params?: { page?: number; limit?: number; status?: string },
): Promise<ApiListResponse<PrestasiListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString();
  return request<ApiListResponse<PrestasiListItem>>(
    `/v1/prestasi${q ? `?${q}` : ""}`,
    { token, cache: "no-store" },
  );
}

export async function fetchPrestasiById(
  id: string,
  token: string,
): Promise<Prestasi> {
  const data = await request<ApiOk<Prestasi>>(`/v1/prestasi/${id}`, {
    token,
    cache: "no-store",
  });
  return data.data;
}

export async function createPrestasi(
  values: PrestasiFormValues,
  token: string,
): Promise<Prestasi> {
  const data = await request<ApiOk<Prestasi>>("/v1/prestasi", {
    method: "POST",
    token,
    body: JSON.stringify(values),
  });
  return data.data;
}

export async function updatePrestasi(
  id: string,
  values: PrestasiFormValues,
  token: string,
): Promise<Prestasi> {
  const data = await request<ApiOk<Prestasi>>(`/v1/prestasi/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(values),
  });
  return data.data;
}

export async function deletePrestasi(id: string, token: string): Promise<void> {
  await request<void>(`/v1/prestasi/${id}`, { method: "DELETE", token });
}

export async function fetchSiteMediaCatalog(
  token?: string,
): Promise<SiteMediaCatalogItem[]> {
  const data = await request<ApiOk<{ items: SiteMediaCatalogItem[] }>>(
    "/v1/site-media",
    token ? { token, cache: "no-store" } : { next: { revalidate: 120, tags: ["site-media"] } },
  );
  return data.data.items;
}

export async function fetchSiteMediaCatalogOrNull(): Promise<
  SiteMediaCatalogItem[] | null
> {
  try {
    return await fetchSiteMediaCatalog();
  } catch {
    return null;
  }
}

export async function updateSiteMedia(
  mediaKey: string,
  values: SiteMediaPatchValues,
  token: string,
): Promise<SiteMediaCatalogItem> {
  const data = await request<ApiOk<SiteMediaCatalogItem>>(
    `/v1/site-media/${encodeURIComponent(mediaKey)}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(values),
    },
  );
  return data.data;
}

export async function resetSiteMedia(
  mediaKey: string,
  token: string,
): Promise<void> {
  await request<void>(`/v1/site-media/${encodeURIComponent(mediaKey)}`, {
    method: "DELETE",
    token,
  });
}

