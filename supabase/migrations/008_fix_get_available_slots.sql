-- Migration: Corrigir função get_available_slots
-- Data: 2025-12-14
-- Descrição: Atualiza a função para usar as novas colunas appointment_status e start_time/end_time

-- Recriar a função com as colunas corretas
CREATE OR REPLACE FUNCTION get_available_slots(
  p_user_id uuid,
  p_date date,
  p_duration integer default 60
)
RETURNS TABLE (
  slot_start time,
  slot_end time
) AS $$
DECLARE
  v_day_of_week integer;
  v_working_start time;
  v_working_end time;
  v_slot time;
BEGIN
  v_day_of_week := extract(dow from p_date)::integer;

  -- Buscar horário de trabalho do dia
  SELECT wh.start_time, wh.end_time INTO v_working_start, v_working_end
  FROM working_hours wh
  WHERE wh.user_id = p_user_id
    AND wh.day_of_week = v_day_of_week
    AND wh.is_active = true;

  IF v_working_start IS NULL THEN
    RETURN;
  END IF;

  -- Gerar slots e filtrar ocupados/bloqueados
  v_slot := v_working_start;
  WHILE v_slot + (p_duration || ' minutes')::interval <= v_working_end LOOP
    -- Verificar se não há agendamento conflitante
    IF NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.user_id = p_user_id
        AND a.date::date = p_date
        AND a.appointment_status NOT IN ('cancelado', 'nao_compareceu')
        AND (
          (a.start_time, a.end_time)
          OVERLAPS
          (v_slot, v_slot + (p_duration || ' minutes')::interval)
        )
    )
    -- Verificar se não está bloqueado
    AND NOT EXISTS (
      SELECT 1 FROM blocked_slots bs
      WHERE bs.user_id = p_user_id
        AND bs.date = p_date
        AND (bs.start_time, bs.end_time) OVERLAPS (v_slot, v_slot + (p_duration || ' minutes')::interval)
    )
    THEN
      slot_start := v_slot;
      slot_end := v_slot + (p_duration || ' minutes')::interval;
      RETURN NEXT;
    END IF;

    v_slot := v_slot + '30 minutes'::interval;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário na função
COMMENT ON FUNCTION get_available_slots(uuid, date, integer) IS 'Retorna os slots de horário disponíveis para agendamento em uma data específica';

DO $$
BEGIN
  RAISE NOTICE 'Migration 008 concluída: Função get_available_slots atualizada para usar appointment_status e start_time/end_time';
END $$;
