-- Migration: Adicionar colunas para compatibilidade com a API REST
-- Data: 2025-12-10
-- Descrição: Adiciona colunas necessárias para a API de agendamentos funcionar corretamente

-- ====================================
-- 1. Atualizar tabela de clientes
-- ====================================

-- Renomear coluna 'name' para 'full_name' para consistência com a API
ALTER TABLE clients RENAME COLUMN name TO full_name;

-- ====================================
-- 2. Adicionar novos enums
-- ====================================

-- Enum para status de pagamento detalhado
CREATE TYPE payment_status AS ENUM ('pendente', 'pago', 'parcial', 'cancelado', 'reembolsado');

-- Enum para métodos de pagamento em português
CREATE TYPE payment_method_pt AS ENUM (
  'dinheiro',
  'pix',
  'cartao_credito',
  'cartao_debito',
  'transferencia',
  'boleto'
);

-- Enum para tipos de sessão em português
CREATE TYPE session_type_pt AS ENUM (
  'sessao_individual',
  'sessao_casal',
  'sessao_familia',
  'sessao_grupo',
  'primeira_consulta',
  'retorno'
);

-- Enum para status de agendamento em português
CREATE TYPE appointment_status_pt AS ENUM (
  'agendado',
  'confirmado',
  'em_andamento',
  'concluido',
  'cancelado',
  'nao_compareceu'
);

-- ====================================
-- 3. Atualizar tabela de agendamentos
-- ====================================

-- Adicionar colunas de horário
ALTER TABLE appointments ADD COLUMN start_time TIME;
ALTER TABLE appointments ADD COLUMN end_time TIME;

-- Adicionar colunas de pagamento detalhadas
ALTER TABLE appointments ADD COLUMN payment_status payment_status DEFAULT 'pendente';
ALTER TABLE appointments ADD COLUMN payment_method payment_method_pt;

-- Adicionar novos tipos em português
ALTER TABLE appointments ADD COLUMN session_type session_type_pt;
ALTER TABLE appointments ADD COLUMN appointment_status appointment_status_pt DEFAULT 'agendado';

-- Adicionar observações privadas
ALTER TABLE appointments ADD COLUMN private_notes TEXT;

-- Adicionar nome do cliente (denormalizado para facilitar consultas)
ALTER TABLE appointments ADD COLUMN client_name TEXT;
ALTER TABLE appointments ADD COLUMN client_phone TEXT;
ALTER TABLE appointments ADD COLUMN client_email TEXT;

-- ====================================
-- 4. Migrar dados existentes
-- ====================================

-- Extrair horários de início e fim da coluna date
UPDATE appointments
SET
  start_time = date::TIME,
  end_time = (date + (duration || ' minutes')::INTERVAL)::TIME;

-- Migrar payment_status baseado em is_paid
UPDATE appointments
SET payment_status = CASE
  WHEN is_paid = true THEN 'pago'::payment_status
  ELSE 'pendente'::payment_status
END;

-- Mapear tipos de sessão do inglês para português
UPDATE appointments
SET session_type = CASE type
  WHEN 'individual_therapy' THEN 'sessao_individual'::session_type_pt
  WHEN 'coaching' THEN 'sessao_individual'::session_type_pt
  WHEN 'couples_therapy' THEN 'sessao_casal'::session_type_pt
  WHEN 'group_session' THEN 'sessao_grupo'::session_type_pt
  WHEN 'first_consultation' THEN 'primeira_consulta'::session_type_pt
  WHEN 'follow_up' THEN 'retorno'::session_type_pt
  ELSE 'sessao_individual'::session_type_pt
END;

-- Mapear status de agendamento do inglês para português
UPDATE appointments
SET appointment_status = CASE status
  WHEN 'scheduled' THEN 'agendado'::appointment_status_pt
  WHEN 'confirmed' THEN 'confirmado'::appointment_status_pt
  WHEN 'in_progress' THEN 'em_andamento'::appointment_status_pt
  WHEN 'completed' THEN 'concluido'::appointment_status_pt
  WHEN 'cancelled' THEN 'cancelado'::appointment_status_pt
  WHEN 'no_show' THEN 'nao_compareceu'::appointment_status_pt
  ELSE 'agendado'::appointment_status_pt
END;

-- Copiar dados do cliente para campos denormalizados
UPDATE appointments a
SET
  client_name = c.full_name,
  client_phone = c.phone,
  client_email = c.email
FROM clients c
WHERE a.client_id = c.id;

-- ====================================
-- 5. Criar triggers para manter dados sincronizados
-- ====================================

-- Função para atualizar dados do cliente no agendamento
CREATE OR REPLACE FUNCTION sync_client_data_to_appointment()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando criar um novo agendamento, copiar dados do cliente
  IF TG_OP = 'INSERT' THEN
    SELECT full_name, phone, email
    INTO NEW.client_name, NEW.client_phone, NEW.client_email
    FROM clients
    WHERE id = NEW.client_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para sincronizar dados ao inserir agendamento
DROP TRIGGER IF EXISTS sync_client_data_on_insert ON appointments;
CREATE TRIGGER sync_client_data_on_insert
  BEFORE INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION sync_client_data_to_appointment();

-- Função para calcular end_time baseado em start_time e duration
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

-- Trigger para calcular end_time automaticamente
DROP TRIGGER IF EXISTS calculate_end_time_trigger ON appointments;
CREATE TRIGGER calculate_end_time_trigger
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_end_time();

-- ====================================
-- 6. Criar índices para performance
-- ====================================

CREATE INDEX IF NOT EXISTS appointments_start_time_idx ON appointments(start_time);
CREATE INDEX IF NOT EXISTS appointments_payment_status_idx ON appointments(payment_status);
CREATE INDEX IF NOT EXISTS appointments_session_type_idx ON appointments(session_type);
CREATE INDEX IF NOT EXISTS appointments_appointment_status_idx ON appointments(appointment_status);
CREATE INDEX IF NOT EXISTS clients_full_name_idx ON clients(full_name);

-- ====================================
-- 7. Adicionar constraints
-- ====================================

-- Garantir que end_time é sempre depois de start_time
ALTER TABLE appointments
ADD CONSTRAINT check_time_order
CHECK (end_time > start_time OR end_time IS NULL OR start_time IS NULL);

-- ====================================
-- 8. Comentários nas colunas
-- ====================================

COMMENT ON COLUMN appointments.start_time IS 'Horário de início da sessão';
COMMENT ON COLUMN appointments.end_time IS 'Horário de término da sessão (calculado automaticamente)';
COMMENT ON COLUMN appointments.payment_status IS 'Status detalhado do pagamento';
COMMENT ON COLUMN appointments.payment_method IS 'Método de pagamento utilizado';
COMMENT ON COLUMN appointments.session_type IS 'Tipo de sessão em português';
COMMENT ON COLUMN appointments.appointment_status IS 'Status do agendamento em português';
COMMENT ON COLUMN appointments.client_name IS 'Nome do cliente (denormalizado para performance)';
COMMENT ON COLUMN appointments.client_phone IS 'Telefone do cliente (denormalizado)';
COMMENT ON COLUMN appointments.client_email IS 'Email do cliente (denormalizado)';

-- ====================================
-- 9. Mensagem de conclusão
-- ====================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 005 concluída com sucesso!';
  RAISE NOTICE 'Colunas adicionadas: start_time, end_time, payment_status, payment_method, session_type, appointment_status';
  RAISE NOTICE 'Triggers criados para sincronização automática';
  RAISE NOTICE 'Índices criados para melhor performance';
END $$;
