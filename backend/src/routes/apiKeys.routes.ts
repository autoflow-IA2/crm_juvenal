import { Router } from 'express';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import * as apiKeysController from '../controllers/apiKeys.controller';

const router = Router();

/**
 * Todas as rotas de API keys requerem autenticação
 * Nota: API keys são gerenciadas através de autenticação JWT do Supabase
 * ou através de uma API key "master" criada manualmente no banco
 *
 * Para simplificar, vamos usar apiKeyAuth mesmo para gerenciar keys
 * O usuário pode criar uma primeira key via painel do Supabase
 * e usar essa key para criar/gerenciar outras keys via API
 */

/**
 * POST /api/v1/api-keys
 * Criar nova API key
 */
router.post('/', apiKeyAuth, apiKeysController.createApiKey);

/**
 * GET /api/v1/api-keys
 * Listar todas as API keys do usuário
 */
router.get('/', apiKeyAuth, apiKeysController.listApiKeys);

/**
 * GET /api/v1/api-keys/:id
 * Buscar uma API key específica
 */
router.get('/:id', apiKeyAuth, apiKeysController.getApiKey);

/**
 * PATCH /api/v1/api-keys/:id
 * Atualizar uma API key
 */
router.patch('/:id', apiKeyAuth, apiKeysController.updateApiKey);

/**
 * DELETE /api/v1/api-keys/:id
 * Deletar (revogar) uma API key
 */
router.delete('/:id', apiKeyAuth, apiKeysController.deleteApiKey);

/**
 * POST /api/v1/api-keys/:id/deactivate
 * Desativar uma API key
 */
router.post('/:id/deactivate', apiKeyAuth, apiKeysController.deactivateApiKey);

/**
 * POST /api/v1/api-keys/:id/activate
 * Reativar uma API key
 */
router.post('/:id/activate', apiKeyAuth, apiKeysController.activateApiKey);

export default router;
