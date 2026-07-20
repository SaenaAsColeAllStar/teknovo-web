-- Atomic upsert for site_media (Node/Postgres path only).
-- F-15: sp_upsert_site_media(p_media_key, p_label, p_category, p_url, p_updated_by)

DROP FUNCTION IF EXISTS sp_upsert_site_media(text, text, text, text, text);

CREATE OR REPLACE FUNCTION sp_upsert_site_media(
  p_media_key   text,
  p_label       text,
  p_category    text,
  p_url         text,
  p_updated_by  text DEFAULT NULL
)
RETURNS TABLE (
  media_key   text,
  label       text,
  category    text,
  url         text,
  updated_at  timestamp(3),
  updated_by  text
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  INSERT INTO site_media AS sm (media_key, label, category, url, updated_at, updated_by)
  VALUES (
    p_media_key,
    p_label,
    COALESCE(NULLIF(trim(p_category), ''), 'landing'),
    p_url,
    NOW()::timestamp(3),
    p_updated_by
  )
  ON CONFLICT (media_key) DO UPDATE SET
    label      = EXCLUDED.label,
    category   = EXCLUDED.category,
    url        = EXCLUDED.url,
    updated_at = NOW()::timestamp(3),
    updated_by = EXCLUDED.updated_by
  RETURNING
    sm.media_key,
    sm.label,
    sm.category,
    sm.url,
    sm.updated_at,
    sm.updated_by;
END;
$$;
