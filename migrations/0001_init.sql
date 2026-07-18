-- CMS schema for teknovo-article (D1)
-- Binding: DB

CREATE TABLE IF NOT EXISTS kategori (
  id TEXT PRIMARY KEY NOT NULL,
  nama TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS berita (
  id TEXT PRIMARY KEY NOT NULL,
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ringkasan TEXT,
  konten TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  kategori_id TEXT REFERENCES kategori(id) ON DELETE SET NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  penulis_id TEXT,
  penulis_nama TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status);
CREATE INDEX IF NOT EXISTS idx_berita_published_at ON berita(published_at);

CREATE TABLE IF NOT EXISTS artikel_siswa (
  id TEXT PRIMARY KEY NOT NULL,
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ringkasan TEXT,
  konten TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
  kategori_id TEXT REFERENCES kategori(id) ON DELETE SET NULL,
  penulis_id TEXT NOT NULL,
  penulis_nama TEXT,
  penulis_kelas TEXT,
  rejected_reason TEXT,
  submitted_at TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_artikel_status ON artikel_siswa(status);
CREATE INDEX IF NOT EXISTS idx_artikel_penulis ON artikel_siswa(penulis_id);

CREATE TABLE IF NOT EXISTS pengaturan (
  id TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
