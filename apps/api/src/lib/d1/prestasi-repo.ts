import { newId, nowIso } from "../ids";
import type {
  Prestasi,
  PrestasiListItem,
  SiteContentStatus,
} from "@teknovo/shared";

type PrestasiRow = {
  id: string;
  judul: string;
  penyelenggara: string;
  tanggal_iso: string;
  siswa_label: string;
  ringkasan: string;
  file_url: string;
  sort_order: number;
  status: SiteContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapList(row: PrestasiRow): PrestasiListItem {
  return {
    id: row.id,
    judul: row.judul,
    penyelenggara: row.penyelenggara,
    tanggalIso: row.tanggal_iso,
    siswaLabel: row.siswa_label,
    ringkasan: row.ringkasan,
    fileUrl: row.file_url,
    sortOrder: row.sort_order,
    status: row.status,
    publishedAt: row.published_at,
  };
}

function mapFull(row: PrestasiRow): Prestasi {
  return {
    ...mapList(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type PrestasiWriteInput = {
  judul: string;
  penyelenggara: string;
  tanggalIso: string;
  siswaLabel: string;
  ringkasan: string;
  fileUrl: string;
  sortOrder?: number;
  status: SiteContentStatus;
};

function publishedAtFor(
  status: SiteContentStatus,
  previous: string | null,
): string | null {
  if (status === "PUBLISHED") return previous ?? nowIso();
  if (status === "DRAFT") return null;
  return previous;
}

export async function d1ListPrestasi(
  db: D1Database,
  opts: {
    status?: SiteContentStatus;
    page?: number;
    limit?: number;
    includeTotal?: boolean;
  } = {},
): Promise<{
  items: PrestasiListItem[];
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
      .prepare(`SELECT COUNT(*) AS c FROM prestasi ${where}`)
      .bind(...binds)
      .first<{ c: number }>();
    total = Number(countRow?.c ?? 0);
  }

  const { results } = await db
    .prepare(
      `SELECT * FROM prestasi ${where}
       ORDER BY sort_order ASC, tanggal_iso DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<PrestasiRow>();

  return {
    items: (results ?? []).map(mapList),
    total,
    page,
    limit,
  };
}

export async function d1GetPrestasiById(
  db: D1Database,
  id: string,
): Promise<Prestasi | null> {
  const row = await db
    .prepare(`SELECT * FROM prestasi WHERE id = ?`)
    .bind(id)
    .first<PrestasiRow>();
  return row ? mapFull(row) : null;
}

export async function d1CreatePrestasi(
  db: D1Database,
  input: PrestasiWriteInput,
): Promise<Prestasi> {
  const id = newId();
  const ts = nowIso();
  const publishedAt = publishedAtFor(input.status, null);
  await db
    .prepare(
      `INSERT INTO prestasi (
        id, judul, penyelenggara, tanggal_iso, siswa_label, ringkasan,
        file_url, sort_order, status, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.judul,
      input.penyelenggara,
      input.tanggalIso,
      input.siswaLabel,
      input.ringkasan,
      input.fileUrl,
      input.sortOrder ?? 0,
      input.status,
      publishedAt,
      ts,
      ts,
    )
    .run();
  const created = await d1GetPrestasiById(db, id);
  if (!created) throw new Error("Gagal membuat prestasi.");
  return created;
}

export async function d1UpdatePrestasi(
  db: D1Database,
  id: string,
  input: PrestasiWriteInput,
): Promise<Prestasi | null> {
  const existing = await d1GetPrestasiById(db, id);
  if (!existing) return null;
  const ts = nowIso();
  const publishedAt = publishedAtFor(input.status, existing.publishedAt);
  await db
    .prepare(
      `UPDATE prestasi SET
        judul = ?, penyelenggara = ?, tanggal_iso = ?, siswa_label = ?,
        ringkasan = ?, file_url = ?, sort_order = ?, status = ?,
        published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      input.judul,
      input.penyelenggara,
      input.tanggalIso,
      input.siswaLabel,
      input.ringkasan,
      input.fileUrl,
      input.sortOrder ?? 0,
      input.status,
      publishedAt,
      ts,
      id,
    )
    .run();
  return d1GetPrestasiById(db, id);
}

export async function d1DeletePrestasi(
  db: D1Database,
  id: string,
): Promise<void> {
  await db.prepare(`DELETE FROM prestasi WHERE id = ?`).bind(id).run();
}
