import { newId, nowIso } from "../ids";
import type {
  ArtikelSiswa,
  ArtikelSiswaListItem,
  ArtikelSiswaStatus,
} from "@teknovo/shared";

type ArtikelRow = {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string;
  cover_url: string | null;
  status: ArtikelSiswaStatus;
  kategori_id: string | null;
  kategori_nama: string | null;
  kategori_slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  penulis_id: string;
  penulis_nama: string | null;
  penulis_kelas: string | null;
  rejected_reason: string | null;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const SELECT_JOIN = `
  SELECT a.id, a.judul, a.slug, a.ringkasan, a.konten, a.cover_url, a.status,
         a.kategori_id, k.nama AS kategori_nama, k.slug AS kategori_slug,
         a.meta_title, a.meta_description, a.meta_keywords, a.og_image_url,
         a.canonical_url,
         a.penulis_id, a.penulis_nama, a.penulis_kelas, a.rejected_reason,
         a.submitted_at, a.published_at, a.created_at, a.updated_at
  FROM artikel_siswa a
  LEFT JOIN kategori k ON k.id = a.kategori_id
`;

function mapList(row: ArtikelRow): ArtikelSiswaListItem {
  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    ringkasan: row.ringkasan,
    coverUrl: row.cover_url,
    status: row.status,
    publishedAt: row.published_at,
    submittedAt: row.submitted_at,
    rejectedReason: row.rejected_reason,
    penulis: {
      id: row.penulis_id,
      nama: row.penulis_nama ?? "Siswa",
      kelas: row.penulis_kelas,
    },
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

function mapFull(row: ArtikelRow): ArtikelSiswa {
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
  };
}

export type ArtikelWriteInput = {
  judul: string;
  slug: string;
  ringkasan?: string;
  konten: string;
  kategoriId?: string;
  status: ArtikelSiswaStatus;
  coverUrl?: string;
  penulisKelas?: string;
  penulisId: string;
  penulisNama?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
};

export async function d1ListArtikel(
  db: D1Database,
  opts: {
    status?: ArtikelSiswaStatus;
    mineUserId?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<{
  items: ArtikelSiswaListItem[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const offset = (page - 1) * limit;

  const clauses: string[] = [];
  const binds: unknown[] = [];
  if (opts.status) {
    clauses.push(`a.status = ?`);
    binds.push(opts.status);
  }
  if (opts.mineUserId) {
    clauses.push(`a.penulis_id = ?`);
    binds.push(opts.mineUserId);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const countRow = await db
    .prepare(`SELECT COUNT(*) AS c FROM artikel_siswa a ${where}`)
    .bind(...binds)
    .first<{ c: number }>();
  const total = Number(countRow?.c ?? 0);

  const { results } = await db
    .prepare(
      `${SELECT_JOIN} ${where}
       ORDER BY COALESCE(a.submitted_at, a.updated_at) DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<ArtikelRow>();

  return {
    items: (results ?? []).map(mapList),
    total,
    page,
    limit,
  };
}

export async function d1GetArtikelById(
  db: D1Database,
  id: string,
): Promise<ArtikelSiswa | null> {
  const row = await db
    .prepare(`${SELECT_JOIN} WHERE a.id = ?`)
    .bind(id)
    .first<ArtikelRow>();
  return row ? mapFull(row) : null;
}

export async function d1GetArtikelBySlug(
  db: D1Database,
  slug: string,
  publishedOnly = false,
): Promise<ArtikelSiswa | null> {
  const sql = publishedOnly
    ? `${SELECT_JOIN} WHERE a.slug = ? AND a.status = 'PUBLISHED'`
    : `${SELECT_JOIN} WHERE a.slug = ?`;
  const row = await db.prepare(sql).bind(slug).first<ArtikelRow>();
  return row ? mapFull(row) : null;
}

export async function d1CreateArtikel(
  db: D1Database,
  input: ArtikelWriteInput,
): Promise<ArtikelSiswa> {
  const id = newId();
  const ts = nowIso();
  const submittedAt = input.status === "REVIEW" ? ts : null;
  const publishedAt = input.status === "PUBLISHED" ? ts : null;
  await db
    .prepare(
      `INSERT INTO artikel_siswa (
         id, judul, slug, ringkasan, konten, cover_url, status, kategori_id,
         penulis_id, penulis_nama, penulis_kelas, rejected_reason,
         submitted_at, published_at, created_at, updated_at,
         meta_title, meta_description, meta_keywords, og_image_url, canonical_url
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      input.penulisId,
      input.penulisNama ?? null,
      input.penulisKelas ?? null,
      submittedAt,
      publishedAt,
      ts,
      ts,
      input.metaTitle ?? null,
      input.metaDescription ?? null,
      input.metaKeywords ?? null,
      input.ogImageUrl ?? null,
      input.canonicalUrl ?? null,
    )
    .run();
  const created = await d1GetArtikelById(db, id);
  if (!created) throw new Error("Gagal membaca artikel setelah insert.");
  return created;
}

export async function d1UpdateArtikel(
  db: D1Database,
  id: string,
  input: ArtikelWriteInput,
): Promise<ArtikelSiswa | null> {
  const existing = await d1GetArtikelById(db, id);
  if (!existing) return null;
  const ts = nowIso();
  let submittedAt = existing.submittedAt ?? null;
  let publishedAt = existing.publishedAt ?? null;
  if (input.status === "REVIEW" && existing.status !== "REVIEW") {
    submittedAt = ts;
  }
  if (input.status === "PUBLISHED" && !publishedAt) publishedAt = ts;
  await db
    .prepare(
      `UPDATE artikel_siswa SET
         judul = ?, slug = ?, ringkasan = ?, konten = ?, cover_url = ?, status = ?,
         kategori_id = ?, penulis_kelas = ?, submitted_at = ?, published_at = ?,
         updated_at = ?, meta_title = ?, meta_description = ?, meta_keywords = ?,
         og_image_url = ?, canonical_url = ?,
         rejected_reason = CASE WHEN ? != 'ARCHIVED' THEN rejected_reason ELSE rejected_reason END
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
      input.penulisKelas ?? null,
      submittedAt,
      publishedAt,
      ts,
      input.metaTitle ?? null,
      input.metaDescription ?? null,
      input.metaKeywords ?? null,
      input.ogImageUrl ?? null,
      input.canonicalUrl ?? null,
      input.status,
      id,
    )
    .run();
  return d1GetArtikelById(db, id);
}

export async function d1DeleteArtikel(
  db: D1Database,
  id: string,
): Promise<boolean> {
  const result = await db
    .prepare(`DELETE FROM artikel_siswa WHERE id = ?`)
    .bind(id)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function d1ApproveArtikel(
  db: D1Database,
  id: string,
): Promise<ArtikelSiswa | null> {
  const existing = await d1GetArtikelById(db, id);
  if (!existing || existing.status !== "REVIEW") return null;
  const ts = nowIso();
  await db
    .prepare(
      `UPDATE artikel_siswa SET status = 'PUBLISHED', published_at = ?,
         rejected_reason = NULL, updated_at = ? WHERE id = ?`,
    )
    .bind(ts, ts, id)
    .run();
  return d1GetArtikelById(db, id);
}

export async function d1RejectArtikel(
  db: D1Database,
  id: string,
  reason?: string,
): Promise<ArtikelSiswa | null> {
  const existing = await d1GetArtikelById(db, id);
  if (!existing || existing.status !== "REVIEW") return null;
  const ts = nowIso();
  await db
    .prepare(
      `UPDATE artikel_siswa SET status = 'ARCHIVED', rejected_reason = ?,
         updated_at = ? WHERE id = ?`,
    )
    .bind(reason?.trim() || null, ts, id)
    .run();
  return d1GetArtikelById(db, id);
}
