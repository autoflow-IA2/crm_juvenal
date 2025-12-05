import { Request, Response } from 'express';
import { ApiKeysService } from '../services/apiKeys.service';
import { createApiKeySchema, updateApiKeySchema } from '../validators/apiKeys.validator';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * POST /api/v1/api-keys
 * Criar nova API key
 */
export const createApiKey = asyncHandler(async (req: Request, res: Response) => {
  // Validar input
  const input = createApiKeySchema.parse(req.body);

  // Criar API key
  const service = new ApiKeysService(req.userId!);
  const apiKey = await service.create(input);

  // Retornar com status 201 Created
  sendSuccess(
    res,
    {
      ...apiKey,
      warning: '⚠️ A API key completa é mostrada apenas uma vez. Guarde em local seguro!'
    },
    undefined,
    201
  );
});

/**
 * GET /api/v1/api-keys
 * Listar todas as API keys do usuário
 */
export const listApiKeys = asyncHandler(async (req: Request, res: Response) => {
  const service = new ApiKeysService(req.userId!);
  const apiKeys = await service.list();

  sendSuccess(res, apiKeys);
});

/**
 * GET /api/v1/api-keys/:id
 * Buscar uma API key específica
 */
export const getApiKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = new ApiKeysService(req.userId!);
  const apiKey = await service.getById(id);

  sendSuccess(res, apiKey);
});

/**
 * PATCH /api/v1/api-keys/:id
 * Atualizar uma API key
 */
export const updateApiKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validar input
  const input = updateApiKeySchema.parse(req.body);

  const service = new ApiKeysService(req.userId!);
  const apiKey = await service.update(id, input);

  sendSuccess(res, apiKey);
});

/**
 * DELETE /api/v1/api-keys/:id
 * Deletar (revogar) uma API key
 */
export const deleteApiKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = new ApiKeysService(req.userId!);
  await service.delete(id);

  sendSuccess(res, {
    message: 'API key revogada com sucesso',
    id
  });
});

/**
 * POST /api/v1/api-keys/:id/deactivate
 * Desativar uma API key (soft delete)
 */
export const deactivateApiKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = new ApiKeysService(req.userId!);
  const apiKey = await service.deactivate(id);

  sendSuccess(res, apiKey);
});

/**
 * POST /api/v1/api-keys/:id/activate
 * Reativar uma API key
 */
export const activateApiKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = new ApiKeysService(req.userId!);
  const apiKey = await service.activate(id);

  sendSuccess(res, apiKey);
});
