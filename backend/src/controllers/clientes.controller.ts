import { Request, Response, NextFunction } from 'express';
import { clientesService } from '../services/clientes.service';
import { ResponseUtils } from '../utils/response.utils';
import { ApiError } from '../middlewares/errorHandler.middleware';
import type { CreateClienteDTO, ClienteFilters } from '../types/cliente.types';

/**
 * Controller de Clientes
 * Gerencia todas as requisições HTTP relacionadas a clientes
 */
export class ClientesController {
  /**
   * GET /api/clientes
   * Lista clientes com filtros opcionais
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: ClienteFilters = req.query;
      const clientes = await clientesService.getAll(filters);

      ResponseUtils.success(res, clientes, 'Clientes listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/clientes/stats
   * Retorna estatísticas de clientes
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await clientesService.getStats();

      ResponseUtils.success(res, stats, 'Estatísticas obtidas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/clientes/ativos
   * Lista apenas clientes ativos (para dropdowns)
   */
  static async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const clientes = await clientesService.getActive();

      ResponseUtils.success(res, clientes, 'Clientes ativos listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/clientes/search
   * Busca clientes por termo
   */
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Parâmetro de busca "q" é obrigatório');
      }

      const clientes = await clientesService.search(q);

      ResponseUtils.success(
        res,
        clientes,
        clientes.length > 0
          ? `${clientes.length} cliente(s) encontrado(s)`
          : 'Nenhum cliente encontrado'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/clientes/filter
   * Busca clientes com filtros exatos (nome OU telefone)
   * Para uso em integrações externas (N8N, webhooks, etc.)
   */
  static async filter(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, status } = req.query;

      // Montar objeto de filtros
      const filters: { name?: string; phone?: string; status?: string } = {};

      if (name && typeof name === 'string') {
        filters.name = name;
      }

      if (phone && typeof phone === 'string') {
        filters.phone = phone;
      }

      if (status && typeof status === 'string') {
        filters.status = status;
      }

      const clientes = await clientesService.getFiltered(filters);

      ResponseUtils.success(
        res,
        clientes,
        clientes.length > 0
          ? `${clientes.length} cliente(s) encontrado(s)`
          : 'Nenhum cliente encontrado'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/clientes/:id
   * Busca cliente por ID
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cliente = await clientesService.getById(id);

      if (!cliente) {
        throw new ApiError(404, 'NOT_FOUND', 'Cliente não encontrado');
      }

      ResponseUtils.success(res, cliente, 'Cliente encontrado');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/clientes
   * Cria novo cliente
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const clienteData: CreateClienteDTO = req.body;

      // Verificar se email já existe (se fornecido)
      if (clienteData.email) {
        const emailExists = await clientesService.emailExists(clienteData.email);
        if (emailExists) {
          throw new ApiError(409, 'CONFLICT', 'Já existe um cliente com este email');
        }
      }

      // Verificar se CPF já existe (se fornecido)
      if (clienteData.cpf) {
        const cpfExists = await clientesService.cpfExists(clienteData.cpf);
        if (cpfExists) {
          throw new ApiError(409, 'CONFLICT', 'Já existe um cliente com este CPF');
        }
      }

      // Criar o cliente
      const novoCliente = await clientesService.create(clienteData);

      ResponseUtils.created(res, novoCliente, 'Cliente criado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/clientes/:id
   * Atualiza cliente
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Verificar se existe
      const exists = await clientesService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Cliente não encontrado');
      }

      // Verificar se email já existe (se fornecido e diferente do atual)
      if (updateData.email && updateData.email !== exists.email) {
        const emailExists = await clientesService.emailExists(updateData.email, id);
        if (emailExists) {
          throw new ApiError(409, 'CONFLICT', 'Já existe um cliente com este email');
        }
      }

      // Verificar se CPF já existe (se fornecido e diferente do atual)
      if (updateData.cpf && updateData.cpf !== exists.cpf) {
        const cpfExists = await clientesService.cpfExists(updateData.cpf, id);
        if (cpfExists) {
          throw new ApiError(409, 'CONFLICT', 'Já existe um cliente com este CPF');
        }
      }

      // Atualizar
      const clienteAtualizado = await clientesService.update(id, updateData);

      ResponseUtils.success(res, clienteAtualizado, 'Cliente atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/clientes/:id/status
   * Atualiza status do cliente
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Verificar se existe
      const exists = await clientesService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Cliente não encontrado');
      }

      // Atualizar status
      const clienteAtualizado = await clientesService.updateStatus(id, status);

      ResponseUtils.success(res, clienteAtualizado, 'Status atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/clientes/:id
   * Deleta cliente
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Verificar se existe
      const exists = await clientesService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Cliente não encontrado');
      }

      // Verificar se tem agendamentos
      const appointmentCount = await clientesService.getAppointmentCount(id);
      if (appointmentCount > 0) {
        throw new ApiError(
          409,
          'CONFLICT',
          `Não é possível excluir cliente com ${appointmentCount} agendamento(s). Arquive-o em vez de excluir.`
        );
      }

      // Deletar
      await clientesService.delete(id);

      ResponseUtils.success(res, { id }, 'Cliente deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
