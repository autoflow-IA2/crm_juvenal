/**
 * Tipos e interfaces para o módulo de Clientes
 */

/**
 * Status do cliente
 */
export type StatusCliente = 'active' | 'inactive' | 'archived';

/**
 * Interface principal do Cliente (campos do banco de dados)
 */
export interface Cliente {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;

  // Dados Pessoais
  full_name: string;
  email: string | null;
  phone: string;
  birth_date: string | null;
  cpf: string | null;

  // Endereço
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;

  // Contato de Emergência
  emergency_contact: string | null;
  emergency_phone: string | null;

  // Status e Observações
  status: StatusCliente;
  notes: string | null;
}

/**
 * DTO para criar cliente
 */
export interface CreateClienteDTO {
  user_id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  birth_date?: string | null;
  cpf?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
  status?: StatusCliente;
  notes?: string | null;
}

/**
 * DTO para atualizar cliente (todos campos opcionais exceto user_id)
 */
export interface UpdateClienteDTO extends Partial<Omit<CreateClienteDTO, 'user_id'>> {}

/**
 * Filtros para listagem de clientes
 */
export interface ClienteFilters {
  status?: StatusCliente;
  search?: string;
  city?: string;
  state?: string;
}

/**
 * Interface para estatísticas de clientes
 */
export interface ClienteStats {
  total: number;
  ativos: number;
  inativos: number;
  arquivados: number;
  novosEsteMes: number;
  porCidade: Record<string, number>;
}

/**
 * Resposta de cliente formatada (campos em português para API)
 */
export interface ClienteResponse {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  data_nascimento: string | null;
  cpf: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  contato_emergencia: string | null;
  telefone_emergencia: string | null;
  status: StatusCliente;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
}
