import { z } from 'zod';

/**
 * Schema para criar um novo cliente
 */
export const createClientSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),

  email: z.string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .trim()
    .optional()
    .nullable(),

  phone: z.string()
    .min(1, 'Telefone é obrigatório')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .trim(),

  birth_date: z.string()
    .date('Data de nascimento inválida (use formato YYYY-MM-DD)')
    .optional()
    .nullable(),

  cpf: z.string()
    .max(14, 'CPF deve ter no máximo 14 caracteres')
    .trim()
    .optional()
    .nullable(),

  address: z.string()
    .max(500, 'Endereço deve ter no máximo 500 caracteres')
    .trim()
    .optional()
    .nullable(),

  city: z.string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .trim()
    .optional()
    .nullable(),

  state: z.string()
    .max(2, 'Estado deve ter 2 caracteres')
    .trim()
    .optional()
    .nullable(),

  zip_code: z.string()
    .max(10, 'CEP deve ter no máximo 10 caracteres')
    .trim()
    .optional()
    .nullable(),

  emergency_contact: z.string()
    .max(200, 'Contato de emergência deve ter no máximo 200 caracteres')
    .trim()
    .optional()
    .nullable(),

  emergency_phone: z.string()
    .max(20, 'Telefone de emergência deve ter no máximo 20 caracteres')
    .trim()
    .optional()
    .nullable(),

  notes: z.string()
    .trim()
    .optional()
    .nullable(),

  status: z.enum(['active', 'inactive', 'archived'])
    .default('active')
    .optional()
});

/**
 * Schema para atualizar um cliente (todos os campos opcionais)
 */
export const updateClientSchema = createClientSchema.partial();

/**
 * Schema para query params de listagem
 */
export const listClientsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 50),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  sort: z.enum(['name', 'created_at', 'updated_at']).default('name').optional(),
  order: z.enum(['asc', 'desc']).default('asc').optional()
});

/**
 * Schema para query de busca
 */
export const searchClientsQuerySchema = z.object({
  q: z.string()
    .min(1, 'Query de busca é obrigatória')
    .trim(),
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 50)
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;
export type SearchClientsQuery = z.infer<typeof searchClientsQuerySchema>;
