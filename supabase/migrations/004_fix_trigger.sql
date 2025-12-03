-- Fix para o erro "Database error saving new user"
-- Execute este arquivo no SQL Editor do Supabase

-- Primeiro, vamos remover o trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recriar a função com tratamento de erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar configurações padrão
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Criar horários de trabalho padrão (seg-sex, 9h-18h)
  INSERT INTO public.working_hours (user_id, day_of_week, start_time, end_time)
  VALUES
    (new.id, 1, '09:00', '18:00'),
    (new.id, 2, '09:00', '18:00'),
    (new.id, 3, '09:00', '18:00'),
    (new.id, 4, '09:00', '18:00'),
    (new.id, 5, '09:00', '18:00')
  ON CONFLICT (user_id, day_of_week) DO NOTHING;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Se houver qualquer erro, apenas loga mas não impede a criação do usuário
    RAISE WARNING 'Erro ao criar configurações para usuário %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Confirmar
SELECT 'Trigger atualizado com sucesso!' as status;
