-- Script para criar uma API key de teste manualmente
-- Execute este SQL no Supabase Dashboard: https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql

-- 1. Primeiro, vamos pegar seu user_id
DO $$
DECLARE
  v_user_id uuid;
  v_key_id uuid;
BEGIN
  -- Pega o primeiro usuário (ajuste se necessário)
  SELECT id INTO v_user_id
  FROM auth.users
  LIMIT 1;

  -- Cria a API key
  INSERT INTO api_keys (
    user_id,
    name,
    key,
    key_hash,
    key_prefix,
    scopes,
    is_active
  ) VALUES (
    v_user_id,
    'Test API Key',
    'jcrm_live_k85rdvtRbkP1YXO4e3SP72jcv0ZZWq4B',
    'jcrm_live_k85rdvtRbkP1YXO4e3SP72jcv0ZZWq4B',
    'jcrm_liv',
    ARRAY['read', 'write', 'delete']::text[],
    true
  )
  RETURNING id INTO v_key_id;

  -- Mostra o resultado
  RAISE NOTICE 'API Key criada com sucesso!';
  RAISE NOTICE 'Key ID: %', v_key_id;
  RAISE NOTICE 'User ID: %', v_user_id;
  RAISE NOTICE 'Key: jcrm_live_k85rdvtRbkP1YXO4e3SP72jcv0ZZWq4B';
END $$;

-- Verificar se foi criada
SELECT id, user_id, name, key, is_active, created_at
FROM api_keys
WHERE name = 'Test API Key';
