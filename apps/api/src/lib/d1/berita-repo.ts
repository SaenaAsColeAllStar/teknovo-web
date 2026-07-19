import { newId, nowIso } from "../ids";
import type { Berita, BeritaListItem, BeritaStatus } from "@teknovo/shared";

type BeritaRow = {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string;
  cover_url: string | null;
  status: BeritaStatus;
  kategori_id: string | null;
  kategori_nama: string | null;
  kategori_slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  penulis_id: string | null;
  penulis_nama: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const SELECT_JOIN = `
  SELECT b.id, b.judul, b.slug, b.ringkasan, b.konten, b.cover_url, b.status,
         b.kategori_id, k.nama AS kategori_nama, k.slug AS kategori_slug,
         b.meta_title, b.meta_description, b.meta_keywords, b.og_image_url, b.canonical_url,
         b.penulis_id, b.penulis_nama, b.published_at, b.created_at, b.updated_at
  FROM berita b
  LEFT JOIN kategori k ON k.id = b.kategori_id
`;

function mapList(row: BeritaRow): BeritaListItem {
  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    ringkasan: row.ringkasan,
    coverUrl: row.cover_url,
    status: row.status,
    publishedAt: row.published_at,
    kategori:
      row.kategori_id && row.kategori_nama && row.kategori_slug
        ? {
            id: row.kategori_id,
            nama: row.kategori_nama,
            slug: row.kategori_slug,
          }
        : null,
  };
}

function mapFull(row: BeritaRow): Berita {
  return {
    ...mapList(row),
    konten: row.konten,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    metaKeywords: row.meta_keywords,
    ogImageUrl: row.og_image_url,
    canonicalUrl: row.canonical_url,
    penulis: row.penulis_id
      ? { id: row.penulis_id, nama: row.penulis_nama ?? "Editor" }
      : null,
  };
}

export type BeritaWriteInput = {
  judul: string;
  slug: string;
  ringkasan?: string;
  konten: string;
  kategoriId?: string;
  status: BeritaStatus;
  coverUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  penulisId?: string;
  penulisNama?: string;
};

export async function d1ListBerita(
  db: D1Database,
  opts: {
    status?: BeritaStatus;
    page?: number;
    limit?: number;
    /** When false, skip COUNT(*) (meta.total = -1). Default true. */
    includeTotal?: boolean;
  } = {},
): Promise<{ items: BeritaListItem[]; total: number; page: number; limit: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const offset = (page - 1) * limit;
  const includeTotal = opts.includeTotal !== false;

  const where = opts.status ? `WHERE b.status = ?` : "";
  const binds: unknown[] = opts.status ? [opts.status] : [];

  let total = -1;
  if (includeTotal) {
    const countRow = await db
      .prepare(`SELECT COUNT(*) AS c FROM berita b ${where}`)
      .bind(...binds)
      .first<{ c: number }>();
    total = Number(countRow?.c ?? 0);
  }

  const { results } = await db
    .prepare(
      `${SELECT_JOIN} ${where}
       ORDER BY b.sort_at DESC, b.id DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<BeritaRow>();

  return {
    items: (results ?? []).map(mapList),
    total,
    page,
    limit,
  };
}

export async function d1GetBeritaById(
  db: D1Database,
  id: string,
): Promise<Berita | null> {
  const row = await db
    .prepare(`${SELECT_JOIN} WHERE b.id = ?`)
    .bind(id)
    .first<BeritaRow>();
  return row ? mapFull(row) : null;
}

export async function d1GetBeritaBySlug(
  db: D1Database,
  slug: string,
  publishedOnly = false,
): Promise<Berita | null> {
  const sql = publishedOnly
    ? `${SELECT_JOIN} WHERE b.slug = ? AND b.status = 'PUBLISHED'`
    : `${SELECT_JOIN} WHERE b.slug = ?`;
  const row = await db.prepare(sql).bind(slug).first<BeritaRow>();
  return row ? mapFull(row) : null;
}

export async function d1CreateBerita(
  db: D1Database,
  input: BeritaWriteInput,
): Promise<Berita> {
  const id = newId();
  const ts = nowIso();
  const publishedAt =
    input.status === "PUBLISHED" ? ts : null;
  const sortAt = publishedAt ?? ts;
  await db
    .prepare(
      `INSERT INTO berita (
         id, judul, slug, ringkasan, konten, cover_url, status, kategori_id,
         meta_title, meta_description, meta_keywords, og_image_url, canonical_url,
         penulis_id, penulis_nama, published_at, created_at, updated_at, sort_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.judul,
      input.slug,
      input.ringkasan ?? null,
      input.konten,
      input.coverUrl ?? null,
      input.status,
      input.kategoriId ?? null,
      input.metaTitle ?? null,
      input.metaDescription ?? null,
      input.metaKeywords ?? null,
      input.ogImageUrl ?? null,
      input.canonicalUrl ?? null,
      input.penulisId ?? null,
      input.penulisNama ?? null,
      publishedAt,
      ts,
      ts,
      sortAt,
    )
    .run();
  const created = await d1GetBeritaById(db, id);
  if (!created) throw new Error("Gagal membaca berita setelah insert.");
  return created;
}

export async function d1UpdateBerita(
  db: D1Database,
  id: string,
  input: BeritaWriteInput,
): Promise<Berita | null> {
  const existing = await d1GetBeritaById(db, id);
  if (!existing) return null;
  const ts = nowIso();
  let publishedAt = existing.publishedAt;
  if (input.status === "PUBLISHED" && !publishedAt) publishedAt = ts;
  if (input.status !== "PUBLISHED") {
    /* keep historical published_at if archived */
  }
  const sortAt = publishedAt ?? existing.createdAt;
  await db
    .prepare(
      `UPDATE berita SET
         judul = ?, slug = ?, ringkasan = ?, konten = ?, cover_url = ?, status = ?,
         kategori_id = ?, meta_title = ?, meta_description = ?, meta_keywords = ?,
         og_image_url = ?, canonical_url = ?, published_at = ?, updated_at = ?,
         sort_at = ?
       WHERE id = ?`,
    )
    .bind(
      input.judul,
      input.slug,
      input.ringkasan ?? null,
      input.konten,
      input.coverUrl ?? null,
      input.status,
      input.kategoriId ?? null,
      input.metaTitle ?? null,
      input.metaDescription ?? null,
      input.metaKeywords ?? null,
      input.ogImageUrl ?? null,
      input.canonicalUrl ?? null,
      publishedAt,
      ts,
      sortAt,
      id,
    )
    .run();
  return d1GetBeritaById(db, id);
}

export async function d1DeleteBerita(
  db: D1Database,
  id: string,
): Promise<boolean> {
  const result = await db.prepare(`DELETE FROM berita WHERE id = ?`).bind(id).run();
  return (result.meta.changes ?? 0) > 0;
}
