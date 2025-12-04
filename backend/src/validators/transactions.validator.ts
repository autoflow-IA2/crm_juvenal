import { z } from 'zod';

const transactionTypes = ['income', 'expense'] as const;
const transactionCategories = ['session', 'package', 'product', 'rent', 'utilities', 'marketing', 'software', 'equipment', 'other'] as const;
const paymentMethods = ['cash', 'pix', 'credit_card', 'debit_card', 'bank_transfer', 'health_insurance'] as const;
const transactionStatuses = ['pending', 'paid', 'overdue', 'cancelled'] as const;

export const createTransactionSchema = z.object({
  client_id: z.string().uuid().optional().nullable(),
  appointment_id: z.string().uuid().optional().nullable(),
  type: z.enum(transactionTypes),
  category: z.enum(transactionCategories),
  description: z.string().min(1, 'Descrição é obrigatória').max(500).trim(),
  amount: z.number().positive('Valor deve ser positivo'),
  date: z.string().datetime('Data inválida'),
  payment_method: z.enum(paymentMethods).optional().nullable(),
  status: z.enum(transactionStatuses).default('pending').optional(),
  due_date: z.string().datetime().optional().nullable(),
  paid_at: z.string().datetime().optional().nullable()
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(transactionStatuses)
});

export const payTransactionSchema = z.object({
  payment_method: z.enum(paymentMethods),
  paid_at: z.string().datetime().optional()
});

export const listTransactionsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 50),
  type: z.enum(transactionTypes).optional(),
  category: z.enum(transactionCategories).optional(),
  status: z.enum(transactionStatuses).optional(),
  payment_method: z.enum(paymentMethods).optional(),
  client_id: z.string().uuid().optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  sort: z.enum(['date', 'amount', 'created_at']).default('date').optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional()
});

export const dashboardQuerySchema = z.object({
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional()
});

export const monthlyReportQuerySchema = z.object({
  year: z.string().transform(val => parseInt(val, 10)),
  month: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 1 && val <= 12, 'Mês deve estar entre 1 e 12')
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type PayTransactionInput = z.infer<typeof payTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
export type MonthlyReportQuery = z.infer<typeof monthlyReportQuerySchema>;
