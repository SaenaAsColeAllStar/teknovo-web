import { newId, nowIso } from "../ids";
import type {
  EkskulKategori,
  Ekstrakurikuler,
  EkstrakurikulerListItem,
  SiteContentStatus,
} from "@teknovo/shared";

type EkstraRow = {
  id: string;
  slug: string;
  name: string;
  detail: string;
  full_description: string;
  kategori: EkskulKategori;
  preview_url: string | null;
  related_achievements_json: string;
  jadwal_ringkas: string | null;
  lokasi_latihan: string | null;
  pembina_nama: string | null;
  sort_order: number;
  status: SiteContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function parseAchievements(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function mapList(row: EkstraRow): EkstrakurikulerListItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    detail: row.detail,
    kategori: row.kategori,
    previewUrl: row.preview_url,
    sortOrder: row.sort_order,
    status: row.status,
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
    publishedAt: row.published_at,
  };
}

function mapFull(row: EkstraRow): Ekstrakurikuler {
  return {
    ...mapList(row),
    fullDescription: row.full_description,
    relatedAchievements: parseAchievements(row.related_achievements_json),
    jadwalRingkas: row.jadwal_ringkas,
    lokasiLatihan: row.lokasi_latihan,
    pembinaNama: row.pembina_nama,
    layoutConfig: {
      showHero: true,
      showFeatures: true,
      showHours: true,
      showStats: false,
      layoutTemplate: "default",
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type EkstrakurikulerWriteInput = {
  name: string;
  slug: string;
  detail: string;
  fullDescription: string;
  kategori: EkskulKategori;
  previewUrl?: string;
  relatedAchievements?: string[];
  jadwalRingkas?: string;
  lokasiLatihan?: string;
  pembinaNama?: string;
  layoutConfig?: import("@teknovo/shared").SiteContentLayoutConfig;
  sortOrder?: number;
  status: SiteContentStatus;
};

function publishedAtFor(
  status: SiteContentStatus,
  previous: string | null,
): string | null {
  if (status === "PUBLISHED") return previous ?? nowIso();
  if (
    status === "DRAFT" ||
    status === "PENDING_REVIEW" ||
    status === "REJECTED"
  ) {
    return null;
  }
  return previous;
}

export async function d1ListEkstrakurikuler(
  db: D1Database,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: EkstrakurikulerListItem[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 50));
  const offset = (page - 1) * limit;
  const includeTotal = opts.includeTotal !== false;
  const where = opts.status ? `WHERE status = ?` : "";
  const binds: unknown[] = opts.status ? [opts.status] : [];

  let total = -1;
  if (includeTotal) {
    const countRow = await db
      .prepare(`SELECT COUNT(*) AS c FROM ekstrakurikuler ${where}`)
      .bind(...binds)
      .first<{ c: number }>();
    total = Number(countRow?.c ?? 0);
  }

  const { results } = await db
    .prepare(
      `SELECT * FROM ekstrakurikuler ${where}
       ORDER BY sort_order ASC, name ASC
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<EkstraRow>();

  return {
    items: (results ?? []).map(mapList),
    total,
    page,
    limit,
  };
}

export async function d1GetEkstrakurikulerById(
  db: D1Database,
  id: string,
): Promise<Ekstrakurikuler | null> {
  const row = await db
    .prepare(`SELECT * FROM ekstrakurikuler WHERE id = ?`)
    .bind(id)
    .first<EkstraRow>();
  return row ? mapFull(row) : null;
}

export async function d1GetEkstrakurikulerBySlug(
  db: D1Database,
  slug: string,
  publishedOnly: boolean,
): Promise<Ekstrakurikuler | null> {
  const row = await db
    .prepare(
      publishedOnly
        ? `SELECT * FROM ekstrakurikuler WHERE slug = ? AND status = 'PUBLISHED'`
        : `SELECT * FROM ekstrakurikuler WHERE slug = ?`,
    )
    .bind(slug)
    .first<EkstraRow>();
  return row ? mapFull(row) : null;
}

export async function d1ListEkstrakurikulerFull(
  db: D1Database,
  status: SiteContentStatus = "PUBLISHED",
): Promise<Ekstrakurikuler[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM ekstrakurikuler WHERE status = ?
       ORDER BY sort_order ASC, name ASC`,
    )
    .bind(status)
    .all<EkstraRow>();
  return (results ?? []).map(mapFull);
}

export async function d1CreateEkstrakurikuler(
  db: D1Database,
  input: EkstrakurikulerWriteInput,
): Promise<Ekstrakurikuler> {
  const id = newId();
  const ts = nowIso();
  const publishedAt = publishedAtFor(input.status, null);
  await db
    .prepare(
      `INSERT INTO ekstrakurikuler (
        id, slug, name, detail, full_description, kategori, preview_url,
        related_achievements_json, jadwal_ringkas, lokasi_latihan, pembina_nama,
        sort_order, status, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.slug,
      input.name,
      input.detail,
      input.fullDescription,
      input.kategori,
      input.previewUrl || null,
      JSON.stringify(input.relatedAchievements ?? []),
      input.jadwalRingkas || null,
      input.lokasiLatihan || null,
      input.pembinaNama || null,
      input.sortOrder ?? 0,
      input.status,
      publishedAt,
      ts,
      ts,
    )
    .run();
  const created = await d1GetEkstrakurikulerById(db, id);
  if (!created) throw new Error("Gagal membuat ekstrakurikuler.");
  return created;
}

export async function d1UpdateEkstrakurikuler(
  db: D1Database,
  id: string,
  input: EkstrakurikulerWriteInput,
): Promise<Ekstrakurikuler | null> {
  const existing = await d1GetEkstrakurikulerById(db, id);
  if (!existing) return null;
  const ts = nowIso();
  const publishedAt = publishedAtFor(input.status, existing.publishedAt);
  await db
    .prepare(
      `UPDATE ekstrakurikuler SET
        slug = ?, name = ?, detail = ?, full_description = ?, kategori = ?,
        preview_url = ?, related_achievements_json = ?, jadwal_ringkas = ?,
        lokasi_latihan = ?, pembina_nama = ?, sort_order = ?, status = ?,
        published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      input.slug,
      input.name,
      input.detail,
      input.fullDescription,
      input.kategori,
      input.previewUrl || null,
      JSON.stringify(input.relatedAchievements ?? []),
      input.jadwalRingkas || null,
      input.lokasiLatihan || null,
      input.pembinaNama || null,
      input.sortOrder ?? 0,
      input.status,
      publishedAt,
      ts,
      id,
    )
    .run();
  return d1GetEkstrakurikulerById(db, id);
}

export async function d1DeleteEkstrakurikuler(
  db: D1Database,
  id: string,
): Promise<void> {
  await db.prepare(`DELETE FROM ekstrakurikuler WHERE id = ?`).bind(id).run();
}
