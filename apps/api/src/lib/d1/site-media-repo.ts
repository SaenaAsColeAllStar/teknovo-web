import { nowIso } from "../ids";
import type { SiteMediaItem } from "@teknovo/shared";

type SiteMediaRow = {
  media_key: string;
  label: string;
  category: string;
  url: string;
  updated_at: string;
  updated_by: string | null;
};

function mapRow(row: SiteMediaRow): SiteMediaItem {
  return {
    mediaKey: row.media_key,
    label: row.label,
    category: row.category,
    url: row.url,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

/** Known public site media keys (object path under R2/MinIO / logical override key). */
export type SiteMediaCatalogEntry = {
  mediaKey: string;
  label: string;
  category: string;
  /** Relative object key — resolve via `publicObjectUrl` (R2) or `catalogDefaultUrl` (MinIO). */
  defaultPath: string;
};

export const SITE_MEDIA_CATALOG: ReadonlyArray<SiteMediaCatalogEntry> = [
  { mediaKey: "landing.hero.bg01", label: "Hero beranda 1", category: "hero", defaultPath: "media/landing/hero/bg-01.webp" },
  { mediaKey: "landing.hero.bg02", label: "Hero beranda 2", category: "hero", defaultPath: "media/landing/hero/bg-02.webp" },
  { mediaKey: "landing.hero.bg03", label: "Hero beranda 3", category: "hero", defaultPath: "media/landing/hero/bg-03.webp" },
  { mediaKey: "landing.fasilitas.absensi", label: "Fasilitas absensi", category: "fasilitas", defaultPath: "media/landing/fasilitas/absensi-digital.webp" },
  { mediaKey: "landing.fasilitas.laboratorium", label: "Fasilitas lab", category: "fasilitas", defaultPath: "media/landing/fasilitas/laboratorium.webp" },
  { mediaKey: "landing.fasilitas.perpustakaan", label: "Fasilitas perpustakaan", category: "fasilitas", defaultPath: "media/landing/fasilitas/perpustakaan.webp" },
  { mediaKey: "landing.fasilitas.lms", label: "Fasilitas LMS", category: "fasilitas", defaultPath: "media/landing/fasilitas/lms.webp" },
  { mediaKey: "landing.kegiatan.osis", label: "Kegiatan OSIS", category: "kegiatan", defaultPath: "media/landing/kegiatan/ekstra-osis.webp" },
  { mediaKey: "landing.kegiatan.futsal", label: "Kegiatan futsal", category: "kegiatan", defaultPath: "media/landing/kegiatan/ekstra-futsal.webp" },
  { mediaKey: "landing.kegiatan.blogger", label: "Kegiatan blogger", category: "kegiatan", defaultPath: "media/landing/kegiatan/ekstra-blogger-club.webp" },
  { mediaKey: "landing.kegiatan.coding", label: "Kegiatan coding", category: "kegiatan", defaultPath: "media/landing/kegiatan/ekstra-coding-club.webp" },
  { mediaKey: "landing.kegiatan.paskibra", label: "Kegiatan paskibra", category: "kegiatan", defaultPath: "media/landing/kegiatan/ekstra-paskibraka.webp" },
  { mediaKey: "landing.kegiatan.pencaksilat", label: "Kegiatan pencak silat", category: "kegiatan", defaultPath: "media/landing/kegiatan/ekstra-pencak-silat.webp" },
  { mediaKey: "brand.logo", label: "Logo sekolah", category: "brand", defaultPath: "brand/logo.webp" },
  { mediaKey: "brand.kepala-sekolah", label: "Kepala sekolah", category: "brand", defaultPath: "brand/kepala-sekolah.webp" },
];

export async function d1ListSiteMedia(
  db: D1Database,
): Promise<SiteMediaItem[]> {
  const { results } = await db
    .prepare(`SELECT * FROM site_media ORDER BY category ASC, label ASC`)
    .all<SiteMediaRow>();
  return (results ?? []).map(mapRow);
}

export async function d1GetSiteMedia(
  db: D1Database,
  mediaKey: string,
): Promise<SiteMediaItem | null> {
  const row = await db
    .prepare(`SELECT * FROM site_media WHERE media_key = ?`)
    .bind(mediaKey)
    .first<SiteMediaRow>();
  return row ? mapRow(row) : null;
}

export async function d1UpsertSiteMedia(
  db: D1Database,
  input: {
    mediaKey: string;
    label: string;
    category: string;
    url: string;
    updatedBy?: string | null;
  },
): Promise<SiteMediaItem> {
  const ts = nowIso();
  await db
    .prepare(
      `INSERT INTO site_media (media_key, label, category, url, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(media_key) DO UPDATE SET
         label = excluded.label,
         category = excluded.category,
         url = excluded.url,
         updated_at = excluded.updated_at,
         updated_by = excluded.updated_by`,
    )
    .bind(
      input.mediaKey,
      input.label,
      input.category,
      input.url,
      ts,
      input.updatedBy ?? null,
    )
    .run();
  const row = await d1GetSiteMedia(db, input.mediaKey);
  if (!row) throw new Error("Gagal menyimpan site media.");
  return row;
}

export async function d1DeleteSiteMedia(
  db: D1Database,
  mediaKey: string,
): Promise<void> {
  await db
    .prepare(`DELETE FROM site_media WHERE media_key = ?`)
    .bind(mediaKey)
    .run();
}
