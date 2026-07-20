-- Berita search: ILIKE + pg_trgm similarity (P1 / F-18).
-- F-18: fn_search_berita(p_query)

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_berita_judul_trgm
  ON berita USING gin (judul gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_berita_ringkasan_trgm
  ON berita USING gin (ringkasan gin_trgm_ops);

DROP FUNCTION IF EXISTS fn_search_berita(text, int);
DROP FUNCTION IF EXISTS fn_search_berita(text);

CREATE OR REPLACE FUNCTION fn_search_berita(
  p_query text,
  p_limit int DEFAULT 20
)
RETURNS TABLE (
  id           uuid,
  judul        text,
  slug         text,
  ringkasan    text,
  cover_url    text,
  status       "BeritaStatus",
  published_at timestamp(3),
  rank         real
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    b.id,
    b.judul,
    b.slug,
    b.ringkasan,
    b.cover_url,
    b.status,
    b.published_at,
    GREATEST(
      similarity(b.judul, p_query),
      similarity(COALESCE(b.ringkasan, ''), p_query)
    )::real AS rank
  FROM berita b
  WHERE
    length(trim(p_query)) > 0
    AND (
      b.judul ILIKE '%' || p_query || '%'
      OR COALESCE(b.ringkasan, '') ILIKE '%' || p_query || '%'
      OR b.judul % p_query
      OR COALESCE(b.ringkasan, '') % p_query
    )
  ORDER BY rank DESC, b.sort_at DESC NULLS LAST, b.id DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 20), 100));
$$;
