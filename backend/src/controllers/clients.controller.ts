import { Request, Response } from 'express';
import { ClientsService } from '../services/clients.service';
import {
  createClientSchema,
  updateClientSchema,
  listClientsQuerySchema,
  searchClientsQuerySchema
} from '../validators/clients.validator';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * GET /api/v1/clients
 * Listar todos os clientes com paginação
 */
export const listClients = asyncHandler(async (req: Request, res: Response) => {
  const query = listClientsQuerySchema.parse(req.query);

  const service = new ClientsService(req.userId!);
  const result = await service.list(query);

  sendSuccess(res, result.data, result.pagination);
});

/**
 * GET /api/v1/clients/:id
 * Buscar cliente específico
 */
export const getClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = new ClientsService(req.userId!);
  const client = await service.getById(id);

  sendSuccess(res, client);
});

/**
 * GET /api/v1/clients/search?q=query
 * Buscar clientes por nome, email ou telefone
 */
export const searchClients = asyncHandler(async (req: Request, res: Response) => {
  const query = searchClientsQuerySchema.parse(req.query);

  const service = new ClientsService(req.userId!);
  const result = await service.search(query.q, query.page, query.limit);

  sendSuccess(res, result.data, result.pagination);
});

/**
 * POST /api/v1/clients
 * Criar novo cliente
 */
export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const input = createClientSchema.parse(req.body);

  const service = new ClientsService(req.userId!);
  const client = await service.create(input);

  sendSuccess(res, client, undefined, 201);
});

/**
 * PUT /api/v1/clients/:id
 * Atualizar cliente completo
 */
export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = updateClientSchema.parse(req.body);

  const service = new ClientsService(req.userId!);
  const client = await service.update(id, input);

  sendSuccess(res, client);
});

/**
 * PATCH /api/v1/clients/:id
 * Atualizar cliente parcial
 */
export const patchClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = updateClientSchema.parse(req.body);

  const service = new ClientsService(req.userId!);
  const client = await service.update(id, input);

  sendSuccess(res, client);
});

/**
 * DELETE /api/v1/clients/:id
 * Deletar cliente
 */
export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = new ClientsService(req.userId!);
  await service.delete(id);

  sendSuccess(res, {
    message: 'Cliente deletado com sucesso',
    id
  });
});

/**
 * GET /api/v1/clients/stats
 * Estatísticas de clientes
 */
export const getClientsStats = asyncHandler(async (req: Request, res: Response) => {
  const service = new ClientsService(req.userId!);
  const stats = await service.getStats();

  sendSuccess(res, stats);
});
