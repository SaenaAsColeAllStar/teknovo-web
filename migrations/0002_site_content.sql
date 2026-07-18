-- Site content CMS: fasilitas, ekstrakurikuler, prestasi, site_media
-- Binding: DB

CREATE TABLE IF NOT EXISTS fasilitas (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  nav_label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  highlights_json TEXT NOT NULL DEFAULT '[]',
  paragraphs_json TEXT NOT NULL DEFAULT '[]',
  extras_json TEXT NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  show_in_nav INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fasilitas_status ON fasilitas(status);
CREATE INDEX IF NOT EXISTS idx_fasilitas_sort ON fasilitas(sort_order);

CREATE TABLE IF NOT EXISTS ekstrakurikuler (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  kategori TEXT NOT NULL
    CHECK (kategori IN ('TEKNOLOGI', 'OLAHRAGA', 'AKADEMIK', 'SENI')),
  preview_url TEXT,
  related_achievements_json TEXT NOT NULL DEFAULT '[]',
  jadwal_ringkas TEXT,
  lokasi_latihan TEXT,
  pembina_nama TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_status ON ekstrakurikuler(status);
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_sort ON ekstrakurikuler(sort_order);

CREATE TABLE IF NOT EXISTS prestasi (
  id TEXT PRIMARY KEY NOT NULL,
  judul TEXT NOT NULL,
  penyelenggara TEXT NOT NULL DEFAULT '',
  tanggal_iso TEXT NOT NULL,
  siswa_label TEXT NOT NULL DEFAULT '',
  ringkasan TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prestasi_status ON prestasi(status);
CREATE INDEX IF NOT EXISTS idx_prestasi_sort ON prestasi(sort_order);
CREATE INDEX IF NOT EXISTS idx_prestasi_tanggal ON prestasi(tanggal_iso);

CREATE TABLE IF NOT EXISTS site_media (
  media_key TEXT PRIMARY KEY NOT NULL,
  label TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'landing',
  url TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_site_media_category ON site_media(category);
