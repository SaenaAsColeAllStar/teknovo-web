import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
  type PengaturanSitusPublikData,
} from "@/lib/pengaturan-situs-publik-defaults";
import type { PengaturanSitusPublikPatchInput } from "@/lib/validations/pengaturan-situs-publik";
import { getDb } from "@/lib/d1";
import { d1GetPengaturan } from "@/lib/d1/pengaturan-repo";

function defaultsToData(): PengaturanSitusPublikData {
  return {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
    updatedAt: null,
  };
}

/** Server: baca dari D1; fallback defaults. */
export async function getPengaturanSitusPublikRaw(): Promise<PengaturanSitusPublikData> {
  try {
    const db = await getDb();
    return await d1GetPengaturan(db);
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
    "Gunakan updatePengaturanCms / PATCH /api/v1/pengaturan (admin + D1).",
  );
}

export const update = updatePengaturanSitusPublik;
