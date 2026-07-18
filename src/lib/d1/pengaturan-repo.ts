import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
  type PengaturanSitusPublikData,
} from "@/lib/pengaturan-situs-publik-defaults";
import type { PengaturanSitusPublikPatchInput } from "@/lib/validations/pengaturan-situs-publik";
import { nowIso } from "@/lib/d1";

function defaults(): PengaturanSitusPublikData {
  return {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
    updatedAt: null,
  };
}

function merge(
  partial: Partial<PengaturanSitusPublikData>,
): PengaturanSitusPublikData {
  return {
    ...defaults(),
    ...partial,
    id: PENGATURAN_SITUS_PUBLIK_ID,
    landingMarquee:
      partial.landingMarquee ?? PENGATURAN_SITUS_PUBLIK_DEFAULTS.landingMarquee,
  };
}

export async function d1GetPengaturan(
  db: D1Database,
): Promise<PengaturanSitusPublikData> {
  const row = await db
    .prepare(`SELECT id, payload, updated_at FROM pengaturan WHERE id = ?`)
    .bind(PENGATURAN_SITUS_PUBLIK_ID)
    .first<{ id: string; payload: string; updated_at: string }>();
  if (!row) return defaults();
  try {
    const parsed = JSON.parse(row.payload) as Partial<PengaturanSitusPublikData>;
    return merge({ ...parsed, updatedAt: row.updated_at });
  } catch {
    return defaults();
  }
}

export async function d1UpsertPengaturan(
  db: D1Database,
  input: PengaturanSitusPublikPatchInput,
): Promise<PengaturanSitusPublikData> {
  const ts = nowIso();
  const data = merge({ ...input, updatedAt: ts });
  const payload = JSON.stringify({
    ...data,
    id: PENGATURAN_SITUS_PUBLIK_ID,
  });
  await db
    .prepare(
      `INSERT INTO pengaturan (id, payload, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
    )
    .bind(PENGATURAN_SITUS_PUBLIK_ID, payload, ts)
    .run();
  return data;
}
