-- Dashboard content aggregates (single round-trip).
-- F-17: fn_get_analytics_overview()

DROP FUNCTION IF EXISTS fn_get_analytics_overview();

CREATE OR REPLACE FUNCTION fn_get_analytics_overview()
RETURNS TABLE (
  berita_total       bigint,
  berita_published   bigint,
  berita_draft       bigint,
  berita_archived    bigint,
  artikel_total      bigint,
  artikel_review     bigint,
  artikel_published  bigint,
  kategori_total     bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    (SELECT COUNT(*)::bigint FROM berita),
    (SELECT COUNT(*)::bigint FROM berita WHERE status = 'PUBLISHED'),
    (SELECT COUNT(*)::bigint FROM berita WHERE status = 'DRAFT'),
    (SELECT COUNT(*)::bigint FROM berita WHERE status = 'ARCHIVED'),
    (SELECT COUNT(*)::bigint FROM artikel_siswa),
    (SELECT COUNT(*)::bigint FROM artikel_siswa WHERE status = 'REVIEW'),
    (SELECT COUNT(*)::bigint FROM artikel_siswa WHERE status = 'PUBLISHED'),
    (SELECT COUNT(*)::bigint FROM kategori);
$$;
