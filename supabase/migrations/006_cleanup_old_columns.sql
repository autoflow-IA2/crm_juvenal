-- Migration: Remover colunas antigas e usar apenas campos em português
-- Data: 2025-12-10
-- Descrição: Remove colunas duplicadas em inglês, mantendo apenas as versões em português

-- ====================================
-- 1. Remover constraints que dependem das colunas antigas
-- ====================================

-- Remover constraint de check_time_order se existir (para recriar depois)
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS check_time_order;

-- ====================================
-- 2. Garantir que dados estão migrados
-- ====================================

-- Verificar se há dados não migrados e migrar
UPDATE appointments
SET
  start_time = COALESCE(start_time, date::TIME),
  end_time = COALESCE(end_time, (date + (duration || ' minutes')::INTERVAL)::TIME),
  payment_status = COALESCE(payment_status, CASE WHEN is_paid = true THEN 'pago'::payment_status ELSE 'pendente'::payment_status END),
  session_type = COALESCE(session_type,
    CASE type
      WHEN 'individual_therapy' THEN 'sessao_individual'::session_type_pt
      WHEN 'coaching' THEN 'sessao_individual'::session_type_pt
      WHEN 'couples_therapy' THEN 'sessao_casal'::session_type_pt
      WHEN 'group_session' THEN 'sessao_grupo'::session_type_pt
      WHEN 'first_consultation' THEN 'primeira_consulta'::session_type_pt
      WHEN 'follow_up' THEN 'retorno'::session_type_pt
      ELSE 'sessao_individual'::session_type_pt
    END
  ),
  appointment_status = COALESCE(appointment_status,
    CASE status
      WHEN 'scheduled' THEN 'agendado'::appointment_status_pt
      WHEN 'confirmed' THEN 'confirmado'::appointment_status_pt
      WHEN 'in_progress' THEN 'em_andamento'::appointment_status_pt
      WHEN 'completed' THEN 'concluido'::appointment_status_pt
      WHEN 'cancelled' THEN 'cancelado'::appointment_status_pt
      WHEN 'no_show' THEN 'nao_compareceu'::appointment_status_pt
      ELSE 'agendado'::appointment_status_pt
    END
  )
WHERE start_time IS NULL
   OR end_time IS NULL
   OR payment_status IS NULL
   OR session_type IS NULL
   OR appointment_status IS NULL;

-- ====================================
-- 3. Tornar novas colunas NOT NULL
-- ====================================

ALTER TABLE appointments ALTER COLUMN start_time SET NOT NULL;
ALTER TABLE appointments ALTER COLUMN end_time SET NOT NULL;
ALTER TABLE appointments ALTER COLUMN payment_status SET NOT NULL;
ALTER TABLE appointments ALTER COLUMN session_type SET NOT NULL;
ALTER TABLE appointments ALTER COLUMN appointment_status SET NOT NULL;

-- ====================================
-- 4. Adicionar defaults nas novas colunas
-- ====================================

ALTER TABLE appointments ALTER COLUMN payment_status SET DEFAULT 'pendente'::payment_status;
ALTER TABLE appointments ALTER COLUMN appointment_status SET DEFAULT 'agendado'::appointment_status_pt;

-- ====================================
-- 5. Dropar views que dependem das colunas antigas
-- ====================================

-- Dropar view appointment_stats se existir (será recriada depois se necessário)
DROP VIEW IF EXISTS appointment_stats CASCADE;

-- ====================================
-- 6. Remover colunas antigas
-- ====================================

-- Remover colunas antigas em inglês
ALTER TABLE appointments DROP COLUMN IF EXISTS type;
ALTER TABLE appointments DROP COLUMN IF EXISTS status;
ALTER TABLE appointments DROP COLUMN IF EXISTS is_paid;

-- ====================================
-- 7. Recriar constraints
-- ====================================

-- Garantir que end_time é sempre depois de start_time
ALTER TABLE appointments
ADD CONSTRAINT check_time_order
CHECK (end_time > start_time);

-- ====================================
-- 8. Atualizar triggers
-- ====================================

-- Atualizar trigger de cálculo de end_time para garantir que funciona corretamente
CREATE OR REPLACE FUNCTION calculate_end_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Se start_time e duration estão definidos, calcular end_time
  IF NEW.start_time IS NOT NULL AND NEW.duration IS NOT NULL THEN
    NEW.end_time = (NEW.start_time::TIME + (NEW.duration || ' minutes')::INTERVAL)::TIME;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 9. Dropar enums antigos não utilizados
-- ====================================

-- Dropar os enums antigos em inglês (agora não usados)
DROP TYPE IF EXISTS session_type CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;

-- ====================================
-- 10. Comentários nas mudanças
-- ====================================

COMMENT ON COLUMN appointments.session_type IS 'Tipo de sessão (valores em português)';
COMMENT ON COLUMN appointments.appointment_status IS 'Status do agendamento (valores em português)';
COMMENT ON COLUMN appointments.payment_status IS 'Status do pagamento (valores em português)';

-- ====================================
-- 11. Mensagem de conclusão
-- ====================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 006 concluída com sucesso!';
  RAISE NOTICE 'Colunas antigas removidas: type, status, is_paid';
  RAISE NOTICE 'Enums antigos removidos: session_type, appointment_status';
  RAISE NOTICE 'Schema agora usa apenas campos em português!';
END $$;
