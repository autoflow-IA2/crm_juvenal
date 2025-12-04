import { z } from 'zod';

const sessionTypes = ['individual_therapy', 'coaching', 'couples_therapy', 'group_session', 'first_consultation', 'follow_up'] as const;
const appointmentStatuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'] as const;

export const createAppointmentSchema = z.object({
  client_id: z.string().uuid('ID do cliente inválido'),
  date: z.string().datetime('Data inválida (use formato ISO 8601)'),
  duration: z.number().int().positive().default(60),
  type: z.enum(sessionTypes),
  status: z.enum(appointmentStatuses).default('scheduled').optional(),
  notes: z.string().trim().optional().nullable(),
  session_notes: z.string().trim().optional().nullable(),
  price: z.number().positive('Preço deve ser positivo'),
  is_paid: z.boolean().default(false).optional()
});

export const updateAppointmentSchema = createAppointmentSchema.partial().omit({ client_id: true });

export const updateStatusSchema = z.object({
  status: z.enum(appointmentStatuses),
  session_notes: z.string().trim().optional().nullable()
});

export const updatePaymentSchema = z.object({
  is_paid: z.boolean()
});

export const listAppointmentsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 50),
  client_id: z.string().uuid().optional(),
  status: z.enum(appointmentStatuses).optional(),
  is_paid: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  sort: z.enum(['date', 'created_at']).default('date').optional(),
  order: z.enum(['asc', 'desc']).default('asc').optional()
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
