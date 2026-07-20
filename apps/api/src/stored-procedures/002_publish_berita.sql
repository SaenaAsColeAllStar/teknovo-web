-- Publish a DRAFT berita: set PUBLISHED + published_at + sort_at.
-- F-16: sp_publish_berita(p_id)

DROP FUNCTION IF EXISTS sp_publish_berita(uuid);

CREATE OR REPLACE FUNCTION sp_publish_berita(p_id uuid)
RETURNS TABLE (
  id                uuid,
  judul             text,
  slug              text,
  ringkasan         text,
  konten            text,
  cover_url         text,
  status            "BeritaStatus",
  kategori_id       uuid,
  meta_title        text,
  meta_description  text,
  og_image_url      text,
  canonical_url     text,
  meta_keywords     text,
  penulis_id        text,
  penulis_nama      text,
  published_at      timestamp(3),
  sort_at           timestamp(3),
  created_at        timestamp(3),
  updated_at        timestamp(3)
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
DECLARE
  v_status "BeritaStatus";
  v_now    timestamp(3) := NOW()::timestamp(3);
BEGIN
  SELECT b.status INTO v_status FROM berita b WHERE b.id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'berita not found: %', p_id USING ERRCODE = 'P0002';
  END IF;

  IF v_status = 'ARCHIVED'::"BeritaStatus" THEN
    RAISE EXCEPTION 'cannot publish ARCHIVED berita: %', p_id USING ERRCODE = 'P0001';
  END IF;

  -- Already published: return current row (idempotent).
  IF v_status = 'PUBLISHED'::"BeritaStatus" THEN
    RETURN QUERY
    SELECT
      b.id, b.judul, b.slug, b.ringkasan, b.konten, b.cover_url, b.status,
      b.kategori_id, b.meta_title, b.meta_description, b.og_image_url,
      b.canonical_url, b.meta_keywords, b.penulis_id, b.penulis_nama,
      b.published_at, b.sort_at, b.created_at, b.updated_at
    FROM berita b
    WHERE b.id = p_id;
    RETURN;
  END IF;

  -- DRAFT → PUBLISHED
  RETURN QUERY
  UPDATE berita AS b
  SET
    status       = 'PUBLISHED'::"BeritaStatus",
    published_at = COALESCE(b.published_at, v_now),
    sort_at      = COALESCE(b.published_at, v_now),
    updated_at   = v_now
  WHERE b.id = p_id
  RETURNING
    b.id, b.judul, b.slug, b.ringkasan, b.konten, b.cover_url, b.status,
    b.kategori_id, b.meta_title, b.meta_description, b.og_image_url,
    b.canonical_url, b.meta_keywords, b.penulis_id, b.penulis_nama,
    b.published_at, b.sort_at, b.created_at, b.updated_at;
END;
$$;
