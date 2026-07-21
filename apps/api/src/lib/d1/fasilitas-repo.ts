import { newId, nowIso } from "../ids";
import type {
  Fasilitas,
  FasilitasExtras,
  FasilitasListItem,
  SiteContentLayoutConfig,
  SiteContentStatus,
} from "@teknovo/shared";
import { DEFAULT_SITE_CONTENT_LAYOUT_CONFIG } from "@teknovo/shared";

type FasilitasRow = {
  id: string;
  slug: string;
  title: string;
  nav_label: string;
  description: string;
  cover_url: string | null;
  highlights_json: string;
  paragraphs_json: string;
  extras_json: string;
  sort_order: number;
  show_in_nav: number;
  status: SiteContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function parseExtras(raw: string): FasilitasExtras {
  try {
    const v = JSON.parse(raw) as FasilitasExtras;
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

function mapList(row: FasilitasRow): FasilitasListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    navLabel: row.nav_label,
    description: row.description,
    coverUrl: row.cover_url,
    sortOrder: row.sort_order,
    showInNav: row.show_in_nav === 1,
    status: row.status,
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
    publishedAt: row.published_at,
  };
}

function mapFull(row: FasilitasRow): Fasilitas {
  return {
    ...mapList(row),
    highlights: parseJsonArray(row.highlights_json),
    paragraphs: parseJsonArray(row.paragraphs_json),
    extras: parseExtras(row.extras_json),
    layoutConfig: { ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type FasilitasWriteInput = {
  title: string;
  slug: string;
  navLabel: string;
  description: string;
  coverUrl?: string;
  highlights?: string[];
  paragraphs?: string[];
  extras?: FasilitasExtras;
  layoutConfig?: SiteContentLayoutConfig;
  sortOrder?: number;
  showInNav?: boolean;
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

export async function d1ListFasilitas(
  db: D1Database,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: FasilitasListItem[];
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
      .prepare(`SELECT COUNT(*) AS c FROM fasilitas ${where}`)
      .bind(...binds)
      .first<{ c: number }>();
    total = Number(countRow?.c ?? 0);
  }

  const { results } = await db
    .prepare(
      `SELECT * FROM fasilitas ${where}
       ORDER BY sort_order ASC, title ASC
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<FasilitasRow>();

  return {
    items: (results ?? []).map(mapList),
    total,
    page,
    limit,
  };
}

export async function d1GetFasilitasById(
  db: D1Database,
  id: string,
): Promise<Fasilitas | null> {
  const row = await db
    .prepare(`SELECT * FROM fasilitas WHERE id = ?`)
    .bind(id)
    .first<FasilitasRow>();
  return row ? mapFull(row) : null;
}

export async function d1GetFasilitasBySlug(
  db: D1Database,
  slug: string,
  publishedOnly: boolean,
): Promise<Fasilitas | null> {
  const row = await db
    .prepare(
      publishedOnly
        ? `SELECT * FROM fasilitas WHERE slug = ? AND status = 'PUBLISHED'`
        : `SELECT * FROM fasilitas WHERE slug = ?`,
    )
    .bind(slug)
    .first<FasilitasRow>();
  return row ? mapFull(row) : null;
}

export async function d1CreateFasilitas(
  db: D1Database,
  input: FasilitasWriteInput,
): Promise<Fasilitas> {
  const id = newId();
  const ts = nowIso();
  const publishedAt = publishedAtFor(input.status, null);
  await db
    .prepare(
      `INSERT INTO fasilitas (
        id, slug, title, nav_label, description, cover_url,
        highlights_json, paragraphs_json, extras_json,
        sort_order, show_in_nav, status, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.slug,
      input.title,
      input.navLabel,
      input.description,
      input.coverUrl || null,
      JSON.stringify(input.highlights ?? []),
      JSON.stringify(input.paragraphs ?? []),
      JSON.stringify(input.extras ?? {}),
      input.sortOrder ?? 0,
      input.showInNav === false ? 0 : 1,
      input.status,
      publishedAt,
      ts,
      ts,
    )
    .run();
  const created = await d1GetFasilitasById(db, id);
  if (!created) throw new Error("Gagal membuat fasilitas.");
  return created;
}

export async function d1UpdateFasilitas(
  db: D1Database,
  id: string,
  input: FasilitasWriteInput,
): Promise<Fasilitas | null> {
  const existing = await d1GetFasilitasById(db, id);
  if (!existing) return null;
  const ts = nowIso();
  const publishedAt = publishedAtFor(input.status, existing.publishedAt);
  await db
    .prepare(
      `UPDATE fasilitas SET
        slug = ?, title = ?, nav_label = ?, description = ?, cover_url = ?,
        highlights_json = ?, paragraphs_json = ?, extras_json = ?,
        sort_order = ?, show_in_nav = ?, status = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      input.slug,
      input.title,
      input.navLabel,
      input.description,
      input.coverUrl || null,
      JSON.stringify(input.highlights ?? []),
      JSON.stringify(input.paragraphs ?? []),
      JSON.stringify(input.extras ?? {}),
      input.sortOrder ?? 0,
      input.showInNav === false ? 0 : 1,
      input.status,
      publishedAt,
      ts,
      id,
    )
    .run();
  return d1GetFasilitasById(db, id);
}

export async function d1DeleteFasilitas(
  db: D1Database,
  id: string,
): Promise<void> {
  await db.prepare(`DELETE FROM fasilitas WHERE id = ?`).bind(id).run();
}
