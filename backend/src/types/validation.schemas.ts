import { z } from 'zod';

/**
 * Schemas de validação Zod para os endpoints de agendamentos
 */

// Enums
const tipoSessaoEnum = z.enum([
  'sessao_individual',
  'sessao_casal',
  'sessao_familia',
  'sessao_grupo',
  'primeira_consulta',
  'retorno',
]);

const statusPagamentoEnum = z.enum([
  'pendente',
  'pago',
  'parcial',
  'cancelado',
  'reembolsado',
]);

const statusAgendamentoEnum = z.enum([
  'agendado',
  'confirmado',
  'em_andamento',
  'concluido',
  'cancelado',
  'nao_compareceu',
]);

const metodoPagamentoEnum = z.enum([
  'dinheiro',
  'pix',
  'cartao_credito',
  'cartao_debito',
  'transferencia',
  'boleto',
]);

/**
 * Schema para criar agendamento
 */
export const createAgendamentoSchema = z.object({
  // User (obrigatório)
  user_id: z.string().uuid('ID do usuário deve ser um UUID válido'),

  // Cliente (obrigatório)
  client_id: z.string().uuid('ID do cliente deve ser um UUID válido'),

  // Dados da Sessão (obrigatórios)
  session_type: tipoSessaoEnum,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS'),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS').optional(), // Calculado automaticamente pelo trigger
  duration: z.number().int().positive('Duração deve ser um número positivo em minutos'),

  // Financeiro (opcionais)
  price: z.number().nonnegative('Preço não pode ser negativo'),
  payment_status: statusPagamentoEnum.optional(), // Default aplicado pelo banco
  payment_method: metodoPagamentoEnum.optional(),

  // Status e Observações
  appointment_status: statusAgendamentoEnum.optional(), // Default aplicado pelo banco
  notes: z.string().max(2000, 'Observações devem ter no máximo 2000 caracteres').optional(),
  private_notes: z.string().max(2000, 'Observações privadas devem ter no máximo 2000 caracteres').optional(),
});

/**
 * Schema para atualizar agendamento (parcial)
 */
export const updateAgendamentoSchema = createAgendamentoSchema.partial();

/**
 * Schema para atualizar status
 */
export const updateStatusSchema = z.object({
  status: statusAgendamentoEnum,
});

/**
 * Schema para atualizar status de pagamento
 */
export const updatePaymentStatusSchema = z.object({
  payment_status: statusPagamentoEnum,
  payment_method: metodoPagamentoEnum.optional(),
});

/**
 * Schema para verificar disponibilidade
 */
export const verificarDisponibilidadeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS'),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS'),
  excludeId: z.string().uuid().optional(),
});

/**
 * Schema para buscar horários disponíveis
 */
export const buscarHorariosDisponiveisSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  duration: z.coerce.number().int().positive().optional().default(60),
  user_id: z.string().uuid('ID do usuário deve ser um UUID válido'),
});

/**
 * Schema para query params de listagem
 */
export const listAgendamentosQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: statusAgendamentoEnum.optional(),
  paymentStatus: statusPagamentoEnum.optional(),
  sessionType: tipoSessaoEnum.optional(),
  clientId: z.string().uuid().optional(),
  clientName: z.string().optional(),
});

/**
 * Schema para validar UUID em params
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

/**
 * Tipos inferidos dos schemas de agendamentos
 */
export type CreateAgendamentoInput = z.infer<typeof createAgendamentoSchema>;
export type UpdateAgendamentoInput = z.infer<typeof updateAgendamentoSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type VerificarDisponibilidadeInput = z.infer<typeof verificarDisponibilidadeSchema>;
export type BuscarHorariosDisponiveisInput = z.infer<typeof buscarHorariosDisponiveisSchema>;
export type ListAgendamentosQuery = z.infer<typeof listAgendamentosQuerySchema>;

// ============================================
// SCHEMAS DE CLIENTES
// ============================================

/**
 * Enum de status do cliente
 */
const statusClienteEnum = z.enum(['active', 'inactive', 'archived']);

/**
 * Schema para criar cliente
 */
export const createClienteSchema = z.object({
  // User (obrigatório)
  user_id: z.string().uuid('ID do usuário deve ser um UUID válido'),

  // Dados Pessoais (obrigatórios)
  full_name: z.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  phone: z.string()
    .min(8, 'Telefone deve ter no mínimo 8 caracteres')
    .max(20, 'Telefone deve ter no máximo 20 caracteres'),

  // Dados Pessoais (opcionais)
  email: z.string().email('Email inválido').max(255).nullable().optional(),
  birth_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .nullable()
    .optional(),
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF inválido (use XXX.XXX.XXX-XX ou 11 dígitos)')
    .nullable()
    .optional(),

  // Endereço (opcionais)
  address: z.string().max(500, 'Endereço deve ter no máximo 500 caracteres').nullable().optional(),
  city: z.string().max(100, 'Cidade deve ter no máximo 100 caracteres').nullable().optional(),
  state: z.string().max(2, 'Estado deve ter 2 caracteres (UF)').nullable().optional(),
  zip_code: z.string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido (use XXXXX-XXX ou 8 dígitos)')
    .nullable()
    .optional(),

  // Contato de Emergência (opcionais)
  emergency_contact: z.string().max(255, 'Nome do contato deve ter no máximo 255 caracteres').nullable().optional(),
  emergency_phone: z.string().max(20, 'Telefone de emergência deve ter no máximo 20 caracteres').nullable().optional(),

  // Status e Observações
  status: statusClienteEnum.optional(),
  notes: z.string().max(2000, 'Observações devem ter no máximo 2000 caracteres').nullable().optional(),
});

/**
 * Schema para atualizar cliente (parcial)
 */
export const updateClienteSchema = createClienteSchema.partial().omit({ user_id: true });

/**
 * Schema para atualizar status do cliente
 */
export const updateClienteStatusSchema = z.object({
  status: statusClienteEnum,
});

/**
 * Schema para query params de listagem de clientes
 */
export const listClientesQuerySchema = z.object({
  status: statusClienteEnum.optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
});

/**
 * Schema para query params de busca
 */
export const searchClientesQuerySchema = z.object({
  q: z.string().min(1, 'Termo de busca é obrigatório'),
});

/**
 * Schema para query params de filtro exato (nome OU telefone)
 * Para uso em integrações externas (N8N, webhooks, etc.)
 */
export const filterClientesQuerySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  status: statusClienteEnum.optional(),
});

/**
 * Tipos inferidos dos schemas de clientes
 */
export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
export type UpdateClienteStatusInput = z.infer<typeof updateClienteStatusSchema>;
export type ListClientesQuery = z.infer<typeof listClientesQuerySchema>;
export type SearchClientesQuery = z.infer<typeof searchClientesQuerySchema>;
export type FilterClientesQuery = z.infer<typeof filterClientesQuerySchema>;
