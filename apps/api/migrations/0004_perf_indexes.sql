-- D1 performance: composite indexes + application-maintained sort_at
-- (avoids ORDER BY COALESCE(...) which cannot use indexes)

-- berita: denormalized sort key = COALESCE(published_at, created_at)
ALTER TABLE berita ADD COLUMN sort_at TEXT;
UPDATE berita SET sort_at = COALESCE(published_at, created_at);
CREATE INDEX IF NOT EXISTS idx_berita_status_sort_at ON berita(status, sort_at DESC);
CREATE INDEX IF NOT EXISTS idx_berita_kategori_id ON berita(kategori_id);

-- artikel_siswa: denormalized sort key = COALESCE(submitted_at, updated_at)
ALTER TABLE artikel_siswa ADD COLUMN sort_at TEXT;
UPDATE artikel_siswa SET sort_at = COALESCE(submitted_at, updated_at);
CREATE INDEX IF NOT EXISTS idx_artikel_status_sort_at ON artikel_siswa(status, sort_at DESC);
CREATE INDEX IF NOT EXISTS idx_artikel_penulis_status ON artikel_siswa(penulis_id, status);
CREATE INDEX IF NOT EXISTS idx_artikel_kategori_id ON artikel_siswa(kategori_id);

-- Site content: status + sort_order (matches WHERE status + ORDER BY sort_order)
CREATE INDEX IF NOT EXISTS idx_fasilitas_status_sort ON fasilitas(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_status_sort ON ekstrakurikuler(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_prestasi_status_sort_tanggal ON prestasi(status, sort_order, tanggal_iso DESC);

-- Note: slug columns already UNIQUE (implicit indexes). kategori.slug UNIQUE.
-- Single-column status/sort indexes from 0001/0002 left in place (harmless).
