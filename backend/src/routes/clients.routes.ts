import { Router } from 'express';
import { apiKeyAuth, requireScope } from '../middleware/apiKeyAuth';
import * as clientsController from '../controllers/clients.controller';

const router = Router();

/**
 * Todas as rotas requerem autenticação via API Key
 */

/**
 * GET /api/v1/clients/stats
 * Estatísticas de clientes
 * Nota: Esta rota deve vir ANTES de /clients/:id para evitar conflito
 */
router.get('/stats', apiKeyAuth, requireScope('read'), clientsController.getClientsStats);

/**
 * GET /api/v1/clients/search?q=query
 * Buscar clientes
 */
router.get('/search', apiKeyAuth, requireScope('read'), clientsController.searchClients);

/**
 * GET /api/v1/clients
 * Listar todos os clientes
 */
router.get('/', apiKeyAuth, requireScope('read'), clientsController.listClients);

/**
 * GET /api/v1/clients/:id
 * Buscar cliente específico
 */
router.get('/:id', apiKeyAuth, requireScope('read'), clientsController.getClient);

/**
 * POST /api/v1/clients
 * Criar novo cliente
 */
router.post('/', apiKeyAuth, requireScope('write'), clientsController.createClient);

/**
 * PUT /api/v1/clients/:id
 * Atualizar cliente completo
 */
router.put('/:id', apiKeyAuth, requireScope('write'), clientsController.updateClient);

/**
 * PATCH /api/v1/clients/:id
 * Atualizar cliente parcial
 */
router.patch('/:id', apiKeyAuth, requireScope('write'), clientsController.patchClient);

/**
 * DELETE /api/v1/clients/:id
 * Deletar cliente
 */
router.delete('/:id', apiKeyAuth, requireScope('delete'), clientsController.deleteClient);

export default router;
