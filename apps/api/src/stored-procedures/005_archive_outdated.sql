-- Auto-archive published berita/artikel older than threshold (P1 / F-19).
-- F-19: sp_archive_outdated(days_threshold) — default 365 days

DROP FUNCTION IF EXISTS sp_archive_outdated(int);

CREATE OR REPLACE FUNCTION sp_archive_outdated(days_threshold int DEFAULT 365)
RETURNS TABLE (
  berita_archived  bigint,
  artikel_archived bigint
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
DECLARE
  v_days int := GREATEST(COALESCE(days_threshold, 365), 1);
  v_berita bigint;
  v_artikel bigint;
BEGIN
  WITH updated AS (
    UPDATE berita
    SET
      status     = 'ARCHIVED'::"BeritaStatus",
      updated_at = NOW()::timestamp(3)
    WHERE status = 'PUBLISHED'::"BeritaStatus"
      AND published_at IS NOT NULL
      AND published_at < ((NOW() - make_interval(days => v_days))::timestamp(3))
    RETURNING 1
  )
  SELECT COUNT(*)::bigint INTO v_berita FROM updated;

  WITH updated AS (
    UPDATE artikel_siswa
    SET
      status     = 'ARCHIVED'::"ArtikelStatus",
      updated_at = NOW()::timestamp(3)
    WHERE status = 'PUBLISHED'::"ArtikelStatus"
      AND published_at IS NOT NULL
      AND published_at < ((NOW() - make_interval(days => v_days))::timestamp(3))
    RETURNING 1
  )
  SELECT COUNT(*)::bigint INTO v_artikel FROM updated;

  RETURN QUERY SELECT v_berita, v_artikel;
END;
$$;
