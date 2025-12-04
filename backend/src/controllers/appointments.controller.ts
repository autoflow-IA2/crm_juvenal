import { Request, Response } from 'express';
import { AppointmentsService } from '../services/appointments.service';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  listAppointmentsQuerySchema,
  updateStatusSchema,
  updatePaymentSchema
} from '../validators/appointments.validator';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export const listAppointments = asyncHandler(async (req: Request, res: Response) => {
  const query = listAppointmentsQuerySchema.parse(req.query);
  const service = new AppointmentsService(req.userId!);
  const result = await service.list(query);
  sendSuccess(res, result.data, result.pagination);
});

export const getAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = new AppointmentsService(req.userId!);
  const appointment = await service.getById(id);
  sendSuccess(res, appointment);
});

export const getUpcomingAppointments = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const service = new AppointmentsService(req.userId!);
  const appointments = await service.getUpcoming(limit);
  sendSuccess(res, appointments);
});

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const input = createAppointmentSchema.parse(req.body);
  const service = new AppointmentsService(req.userId!);
  const appointment = await service.create(input);
  sendSuccess(res, appointment, undefined, 201);
});

export const updateAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = updateAppointmentSchema.parse(req.body);
  const service = new AppointmentsService(req.userId!);
  const appointment = await service.update(id, input);
  sendSuccess(res, appointment);
});

export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, session_notes } = updateStatusSchema.parse(req.body);
  const service = new AppointmentsService(req.userId!);
  const appointment = await service.updateStatus(id, status, session_notes);
  sendSuccess(res, appointment);
});

export const updateAppointmentPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_paid } = updatePaymentSchema.parse(req.body);
  const service = new AppointmentsService(req.userId!);
  const appointment = await service.updatePayment(id, is_paid);
  sendSuccess(res, appointment);
});

export const deleteAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = new AppointmentsService(req.userId!);
  await service.delete(id);
  sendSuccess(res, { message: 'Agendamento deletado com sucesso', id });
});

export const getAppointmentsStats = asyncHandler(async (req: Request, res: Response) => {
  const service = new AppointmentsService(req.userId!);
  const stats = await service.getStats();
  sendSuccess(res, stats);
});
