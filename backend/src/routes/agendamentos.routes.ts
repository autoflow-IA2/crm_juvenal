import { Router } from 'express';
import { AgendamentosController } from '../controllers/agendamentos.controller';
import { validateRequest, validateParams, validateQuery } from '../middlewares/validation.middleware';
import {
  createAgendamentoSchema,
  updateAgendamentoSchema,
  updateStatusSchema,
  updatePaymentStatusSchema,
  verificarDisponibilidadeSchema,
  listAgendamentosQuerySchema,
  uuidParamSchema,
} from '../types/validation.schemas';

const router = Router();

/**
 * GET /api/agendamentos/hoje
 * Lista agendamentos de hoje
 * Nota: Rotas específicas devem vir ANTES de /:id
 */
router.get('/hoje', AgendamentosController.getToday);

/**
 * GET /api/agendamentos/proximos
 * Lista próximos agendamentos
 */
router.get('/proximos', AgendamentosController.getUpcoming);

/**
 * GET /api/agendamentos/stats
 * Retorna estatísticas de agendamentos
 */
router.get('/stats', AgendamentosController.getStats);

/**
 * GET /api/agendamentos
 * Lista agendamentos com filtros opcionais
 * Query params: date, dateStart, dateEnd, status, paymentStatus, sessionType, clientId, clientName
 */
router.get(
  '/',
  validateQuery(listAgendamentosQuerySchema),
  AgendamentosController.list
);

/**
 * GET /api/agendamentos/:id
 * Busca agendamento específico por ID
 */
router.get(
  '/:id',
  validateParams(uuidParamSchema),
  AgendamentosController.getById
);

/**
 * POST /api/agendamentos
 * Cria novo agendamento
 * Verifica conflitos automaticamente e retorna avisos se houver
 */
router.post(
  '/',
  validateRequest(createAgendamentoSchema),
  AgendamentosController.create
);

/**
 * POST /api/agendamentos/verificar-disponibilidade
 * Verifica se há conflitos de horário
 */
router.post(
  '/verificar-disponibilidade',
  validateRequest(verificarDisponibilidadeSchema),
  AgendamentosController.verificarDisponibilidade
);

/**
 * POST /api/agendamentos/finalizar-passados
 * Finaliza automaticamente agendamentos que já passaram
 * (para uso com cron jobs)
 */
router.post('/finalizar-passados', AgendamentosController.finalizarPassados);

/**
 * PATCH /api/agendamentos/:id
 * Atualiza agendamento existente
 */
router.patch(
  '/:id',
  validateParams(uuidParamSchema),
  validateRequest(updateAgendamentoSchema),
  AgendamentosController.update
);

/**
 * PATCH /api/agendamentos/:id/status
 * Atualiza apenas o status do agendamento
 */
router.patch(
  '/:id/status',
  validateParams(uuidParamSchema),
  validateRequest(updateStatusSchema),
  AgendamentosController.updateStatus
);

/**
 * PATCH /api/agendamentos/:id/payment
 * Atualiza apenas o status de pagamento
 */
router.patch(
  '/:id/payment',
  validateParams(uuidParamSchema),
  validateRequest(updatePaymentStatusSchema),
  AgendamentosController.updatePaymentStatus
);

/**
 * DELETE /api/agendamentos/:id
 * Deleta agendamento
 */
router.delete(
  '/:id',
  validateParams(uuidParamSchema),
  AgendamentosController.delete
);

export default router;
