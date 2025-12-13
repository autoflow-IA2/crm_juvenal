-- ========================================
-- USUÁRIO PADRÃO PARA TESTES
-- ========================================
--
-- MÉTODO RECOMENDADO: Usar a aplicação para criar o usuário
--
-- Acesse: http://localhost:5173/register
-- Email: admin@juvenalcrm.com
-- Senha: admin123
--
-- ========================================
-- OU use o Supabase Dashboard:
-- ========================================
--
-- 1. Vá em Authentication > Users
-- 2. Clique em "Add user" > "Create new user"
-- 3. Preencha:
--    - Email: admin@juvenalcrm.com
--    - Password: admin123
--    - Auto Confirm User: YES (marque esta opção!)
-- 4. Clique em "Create user"
--
-- Isso irá criar automaticamente:
-- - O usuário na tabela auth.users
-- - As configurações em user_settings (via trigger)
-- - Os horários de trabalho padrão em working_hours (via trigger)
--
-- ========================================

-- Se você REALMENTE precisa criar via SQL, use a função do Supabase:
-- (Mas não é recomendado - melhor usar os métodos acima)

-- Descomentar as linhas abaixo apenas se necessário:
/*
SELECT extensions.create_user(
  'admin@juvenalcrm.com',
  'admin123',
  '{"email_confirmed_at": "' || now()::text || '"}'::jsonb
);
*/
