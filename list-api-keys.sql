-- Listar todas as API keys (bypassa RLS)
SELECT
  id,
  user_id,
  name,
  key,
  key_prefix,
  scopes,
  is_active,
  last_used_at,
  expires_at,
  created_at
FROM api_keys
ORDER BY created_at DESC;
