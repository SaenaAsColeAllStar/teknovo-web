import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
  type PengaturanSitusPublikData,
} from "@/lib/pengaturan-situs-publik-defaults";
import type { PengaturanSitusPublikPatchInput } from "@/lib/validations/pengaturan-situs-publik";

function defaultsToData(): PengaturanSitusPublikData {
  return {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
    updatedAt: null,
  };
}

export async function getPengaturanSitusPublikRaw(): Promise<PengaturanSitusPublikData> {
  return defaultsToData();
}

export async function getCachedPengaturanSitusPublikForPublic(): Promise<PengaturanSitusPublikData> {
  return defaultsToData();
}

export const getCachedForPublic = getCachedPengaturanSitusPublikForPublic;

export async function getForAdmin(): Promise<PengaturanSitusPublikData> {
  return defaultsToData();
}

export async function updatePengaturanSitusPublik(
  _input: PengaturanSitusPublikPatchInput,
): Promise<PengaturanSitusPublikData> {
  throw new Error("Pengaturan situs publik diedit via homelab API — belum tersedia di Cloudflare split.");
}

export const update = updatePengaturanSitusPublik;
