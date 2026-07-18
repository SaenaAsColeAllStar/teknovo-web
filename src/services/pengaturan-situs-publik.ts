import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
  type PengaturanSitusPublikData,
} from "@/lib/pengaturan-situs-publik-defaults";
import type { PengaturanSitusPublikPatchInput } from "@/lib/validations/pengaturan-situs-publik";
import { getApiBaseUrl } from "@/lib/api-client";

function defaultsToData(): PengaturanSitusPublikData {
  return {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
    updatedAt: null,
  };
}

function mergeWithDefaults(
  partial: Partial<PengaturanSitusPublikData> | null | undefined,
): PengaturanSitusPublikData {
  return {
    ...defaultsToData(),
    ...partial,
    id: partial?.id ?? PENGATURAN_SITUS_PUBLIK_ID,
    landingMarquee:
      partial?.landingMarquee ?? PENGATURAN_SITUS_PUBLIK_DEFAULTS.landingMarquee,
  };
}

/** Server: coba GET publik /v1/pengaturan; fallback defaults. */
export async function getPengaturanSitusPublikRaw(): Promise<PengaturanSitusPublikData> {
  const base = getApiBaseUrl();
  if (!base) return defaultsToData();

  try {
    const res = await fetch(`${base}/v1/pengaturan`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 120, tags: ["pengaturan-situs"] },
    });
    if (!res.ok) return defaultsToData();
    const json = (await res.json()) as { ok?: boolean; data?: PengaturanSitusPublikData };
    if (!json?.ok || !json.data) return defaultsToData();
    return mergeWithDefaults(json.data);
  } catch {
    return defaultsToData();
  }
}

export async function getCachedPengaturanSitusPublikForPublic(): Promise<PengaturanSitusPublikData> {
  return getPengaturanSitusPublikRaw();
}

export const getCachedForPublic = getCachedPengaturanSitusPublikForPublic;

export async function getForAdmin(): Promise<PengaturanSitusPublikData> {
  return getPengaturanSitusPublikRaw();
}

export async function updatePengaturanSitusPublik(
  _input: PengaturanSitusPublikPatchInput,
): Promise<PengaturanSitusPublikData> {
  throw new Error(
    "Gunakan updatePengaturanCms di dashboard (Bearer Clerk) — PATCH /v1/pengaturan.",
  );
}

export const update = updatePengaturanSitusPublik;
