import { z } from 'zod';

/**
 * Schema para criar uma nova API key
 */
export const createApiKeySchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  scopes: z.array(z.enum(['read', 'write', 'delete']))
    .default(['read', 'write', 'delete'])
    .optional(),

  expires_at: z.string()
    .datetime({ message: 'Data de expiração inválida (use formato ISO 8601)' })
    .transform(str => new Date(str))
    .optional()
});

/**
 * Schema para atualizar uma API key
 */
export const updateApiKeySchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  scopes: z.array(z.enum(['read', 'write', 'delete']))
    .optional(),

  is_active: z.boolean().optional(),

  expires_at: z.string()
    .datetime({ message: 'Data de expiração inválida (use formato ISO 8601)' })
    .transform(str => new Date(str))
    .nullable()
    .optional()
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;
