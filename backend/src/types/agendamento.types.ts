/**
 * Tipos de sessão disponíveis
 */
export type TipoSessao =
  | 'sessao_individual'
  | 'sessao_casal'
  | 'sessao_familia'
  | 'sessao_grupo'
  | 'primeira_consulta'
  | 'retorno';

/**
 * Status de pagamento
 */
export type StatusPagamento =
  | 'pendente'
  | 'pago'
  | 'parcial'
  | 'cancelado'
  | 'reembolsado';

/**
 * Status do agendamento
 */
export type StatusAgendamento =
  | 'agendado'
  | 'confirmado'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado'
  | 'nao_compareceu';

/**
 * Métodos de pagamento
 */
export type MetodoPagamento =
  | 'dinheiro'
  | 'pix'
  | 'cartao_credito'
  | 'cartao_debito'
  | 'transferencia'
  | 'boleto';

/**
 * Interface principal do Agendamento
 */
export interface Agendamento {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;

  // Dados do Cliente
  client_id: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;

  // Dados da Sessão
  session_type: TipoSessao;
  date: string;
  start_time: string;
  end_time: string;
  duration: number; // em minutos

  // Financeiro
  price?: number;
  payment_status: StatusPagamento;
  payment_method?: MetodoPagamento;

  // Status e Observações
  status: StatusAgendamento;
  notes?: string;
  private_notes?: string;

  // Relacionamentos (quando carregados via join)
  client?: {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
  };
}

/**
 * DTO para criar agendamento
 */
export interface CreateAgendamentoDTO {
  // Cliente (obrigatório)
  client_id: string;

  // Dados da Sessão (obrigatórios)
  session_type: TipoSessao;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;

  // Financeiro (opcionais)
  price?: number;
  payment_status?: StatusPagamento;
  payment_method?: MetodoPagamento;

  // Status e Observações
  status?: StatusAgendamento;
  notes?: string;
  private_notes?: string;

  // User ID (adicionado pelo backend)
  user_id?: string;
}

/**
 * DTO para atualizar agendamento (todos campos opcionais)
 */
export interface UpdateAgendamentoDTO extends Partial<CreateAgendamentoDTO> {
  id?: string;
}

/**
 * Filtros para listagem de agendamentos
 */
export interface AgendamentoFilters {
  date?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: StatusAgendamento;
  paymentStatus?: StatusPagamento;
  sessionType?: TipoSessao;
  clientId?: string;
  clientName?: string;
}

/**
 * Interface para verificação de disponibilidade
 */
export interface VerificarDisponibilidadeDTO {
  date: string;
  startTime: string;
  endTime: string;
  excludeId?: string;
}

/**
 * Interface para resposta de verificação de disponibilidade
 */
export interface DisponibilidadeResponse {
  disponivel: boolean;
  conflitos: Array<{
    id: string;
    client_name?: string;
    date: string;
    start_time: string;
    end_time: string;
    session_type: TipoSessao;
  }>;
}

/**
 * Interface para estatísticas de agendamentos
 */
export interface AgendamentoStats {
  total: number;
  hoje: number;
  semana: number;
  mes: number;
  porStatus: Record<StatusAgendamento, number>;
  porTipo: Record<TipoSessao, number>;
  receitaMes: number;
  receitaPendente: number;
}
