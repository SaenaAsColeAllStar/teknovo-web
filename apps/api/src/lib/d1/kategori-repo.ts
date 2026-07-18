import { newId, nowIso } from "../ids";
import type { Kategori } from "@teknovo/shared";

type KategoriRow = {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
};

function mapKategori(row: KategoriRow): Kategori {
  return {
    id: row.id,
    nama: row.nama,
    slug: row.slug,
    deskripsi: row.deskripsi,
  };
}

export async function d1ListKategori(db: D1Database): Promise<Kategori[]> {
  const { results } = await db
    .prepare(
      `SELECT id, nama, slug, deskripsi, created_at, updated_at
       FROM kategori ORDER BY nama COLLATE NOCASE ASC`,
    )
    .all<KategoriRow>();
  return (results ?? []).map(mapKategori);
}

export async function d1GetKategori(
  db: D1Database,
  id: string,
): Promise<Kategori | null> {
  const row = await db
    .prepare(
      `SELECT id, nama, slug, deskripsi, created_at, updated_at
       FROM kategori WHERE id = ?`,
    )
    .bind(id)
    .first<KategoriRow>();
  return row ? mapKategori(row) : null;
}

export async function d1CreateKategori(
  db: D1Database,
  input: { nama: string; slug: string; deskripsi?: string },
): Promise<Kategori> {
  const id = newId();
  const ts = nowIso();
  await db
    .prepare(
      `INSERT INTO kategori (id, nama, slug, deskripsi, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, input.nama, input.slug, input.deskripsi ?? null, ts, ts)
    .run();
  return { id, nama: input.nama, slug: input.slug, deskripsi: input.deskripsi ?? null };
}

export async function d1UpdateKategori(
  db: D1Database,
  id: string,
  input: { nama: string; slug: string; deskripsi?: string },
): Promise<Kategori | null> {
  const existing = await d1GetKategori(db, id);
  if (!existing) return null;
  const ts = nowIso();
  await db
    .prepare(
      `UPDATE kategori SET nama = ?, slug = ?, deskripsi = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(input.nama, input.slug, input.deskripsi ?? null, ts, id)
    .run();
  return {
    id,
    nama: input.nama,
    slug: input.slug,
    deskripsi: input.deskripsi ?? null,
  };
}

export async function d1DeleteKategori(
  db: D1Database,
  id: string,
): Promise<boolean> {
  const result = await db
    .prepare(`DELETE FROM kategori WHERE id = ?`)
    .bind(id)
    .run();
  return (result.meta.changes ?? 0) > 0;
}
