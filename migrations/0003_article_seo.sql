-- SEO metadata for artikel siswa (+ optional keywords on berita).
-- Berita already had meta_title / meta_description / og_image_url / canonical_url.
-- Mirror of apps/api/migrations/0003_article_seo.sql

ALTER TABLE artikel_siswa ADD COLUMN meta_title TEXT;
ALTER TABLE artikel_siswa ADD COLUMN meta_description TEXT;
ALTER TABLE artikel_siswa ADD COLUMN og_image_url TEXT;
ALTER TABLE artikel_siswa ADD COLUMN canonical_url TEXT;
ALTER TABLE artikel_siswa ADD COLUMN meta_keywords TEXT;

ALTER TABLE berita ADD COLUMN meta_keywords TEXT;
