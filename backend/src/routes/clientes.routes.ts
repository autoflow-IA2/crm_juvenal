import { Router } from 'express';
import { ClientesController } from '../controllers/clientes.controller';
import { validateRequest, validateParams, validateQuery } from '../middlewares/validation.middleware';
import {
  createClienteSchema,
  updateClienteSchema,
  updateClienteStatusSchema,
  listClientesQuerySchema,
  searchClientesQuerySchema,
  uuidParamSchema,
} from '../types/validation.schemas';

const router = Router();

/**
 * GET /api/clientes/stats
 * Retorna estatísticas de clientes
 * Nota: Rotas específicas devem vir ANTES de /:id
 */
router.get('/stats', ClientesController.getStats);

/**
 * GET /api/clientes/ativos
 * Lista apenas clientes ativos (para dropdowns)
 */
router.get('/ativos', ClientesController.getActive);

/**
 * GET /api/clientes/search
 * Busca clientes por termo
 * Query params: q (termo de busca)
 */
router.get(
  '/search',
  validateQuery(searchClientesQuerySchema),
  ClientesController.search
);

/**
 * GET /api/clientes
 * Lista clientes com filtros opcionais
 * Query params: status, search, city, state
 */
router.get(
  '/',
  validateQuery(listClientesQuerySchema),
  ClientesController.list
);

/**
 * GET /api/clientes/:id
 * Busca cliente específico por ID
 */
router.get(
  '/:id',
  validateParams(uuidParamSchema),
  ClientesController.getById
);

/**
 * POST /api/clientes
 * Cria novo cliente
 */
router.post(
  '/',
  validateRequest(createClienteSchema),
  ClientesController.create
);

/**
 * PATCH /api/clientes/:id
 * Atualiza cliente existente
 */
router.patch(
  '/:id',
  validateParams(uuidParamSchema),
  validateRequest(updateClienteSchema),
  ClientesController.update
);

/**
 * PATCH /api/clientes/:id/status
 * Atualiza apenas o status do cliente
 */
router.patch(
  '/:id/status',
  validateParams(uuidParamSchema),
  validateRequest(updateClienteStatusSchema),
  ClientesController.updateStatus
);

/**
 * DELETE /api/clientes/:id
 * Deleta cliente
 */
router.delete(
  '/:id',
  validateParams(uuidParamSchema),
  ClientesController.delete
);

export default router;
