import { Request, Response, NextFunction } from 'express';
import { agendamentosService } from '../services/agendamentos.service';
import { ResponseUtils } from '../utils/response.utils';
import { ApiError } from '../middlewares/errorHandler.middleware';
import type {
  CreateAgendamentoDTO,
  AgendamentoFilters,
  VerificarDisponibilidadeDTO,
  DisponibilidadeResponse,
  BuscarHorariosDisponiveisDTO,
} from '../types/agendamento.types';

/**
 * Controller de Agendamentos
 * Gerencia todas as requisições HTTP relacionadas a agendamentos
 */
export class AgendamentosController {
  /**
   * GET /api/agendamentos
   * Lista agendamentos com filtros opcionais
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AgendamentoFilters = req.query;
      const agendamentos = await agendamentosService.getAll(filters);

      ResponseUtils.success(res, agendamentos, 'Agendamentos listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agendamentos/hoje
   * Lista agendamentos de hoje
   */
  static async getToday(req: Request, res: Response, next: NextFunction) {
    try {
      const agendamentos = await agendamentosService.getToday();

      ResponseUtils.success(res, agendamentos, 'Agendamentos de hoje listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agendamentos/proximos
   * Lista próximos agendamentos
   */
  static async getUpcoming(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const agendamentos = await agendamentosService.getUpcoming(limit);

      ResponseUtils.success(res, agendamentos, 'Próximos agendamentos listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agendamentos/stats
   * Retorna estatísticas de agendamentos
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await agendamentosService.getStats();

      ResponseUtils.success(res, stats, 'Estatísticas obtidas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agendamentos/:id
   * Busca agendamento por ID
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const agendamento = await agendamentosService.getById(id);

      if (!agendamento) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      ResponseUtils.success(res, agendamento, 'Agendamento encontrado');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agendamentos
   * Cria novo agendamento
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const agendamentoData: CreateAgendamentoDTO = req.body;

      // Verificar conflitos de horário
      const conflitos = await agendamentosService.checkConflicts(
        agendamentoData.date,
        agendamentoData.start_time,
        agendamentoData.end_time
      );

      // Criar o agendamento
      const novoAgendamento = await agendamentosService.create(agendamentoData);

      // Retornar com avisos se houver conflitos
      if (conflitos.length > 0) {
        ResponseUtils.created(res, {
          agendamento: novoAgendamento,
          avisos: {
            conflitos_horario: conflitos,
            mensagem: `Atenção: Existem ${conflitos.length} agendamento(s) conflitante(s) no mesmo horário.`,
          },
        }, 'Agendamento criado com sucesso, mas existem conflitos de horário');
      } else {
        ResponseUtils.created(res, novoAgendamento, 'Agendamento criado com sucesso');
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/agendamentos/:id
   * Atualiza agendamento
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Verificar se existe
      const exists = await agendamentosService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      // Verificar conflitos se data/hora foram alterados
      if (updateData.date || updateData.start_time || updateData.end_time) {
        const date = updateData.date || exists.date;
        const startTime = updateData.start_time || exists.start_time;
        const endTime = updateData.end_time || exists.end_time;

        const conflitos = await agendamentosService.checkConflicts(date, startTime, endTime, id);

        if (conflitos.length > 0) {
          // Atualiza mas avisa sobre conflitos
          const agendamentoAtualizado = await agendamentosService.update(id, updateData);
          ResponseUtils.success(res, {
            agendamento: agendamentoAtualizado,
            avisos: {
              conflitos_horario: conflitos,
              mensagem: `Atenção: Existem ${conflitos.length} agendamento(s) conflitante(s) no mesmo horário.`,
            },
          }, 'Agendamento atualizado com sucesso, mas existem conflitos de horário');
          return;
        }
      }

      // Atualizar
      const agendamentoAtualizado = await agendamentosService.update(id, updateData);

      ResponseUtils.success(res, agendamentoAtualizado, 'Agendamento atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/agendamentos/:id/status
   * Atualiza status do agendamento
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Verificar se existe
      const exists = await agendamentosService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      // Atualizar status
      const agendamentoAtualizado = await agendamentosService.updateStatus(id, status);

      ResponseUtils.success(res, agendamentoAtualizado, 'Status atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/agendamentos/:id/payment
   * Atualiza status de pagamento do agendamento
   */
  static async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { payment_status, payment_method } = req.body;

      // Verificar se existe
      const exists = await agendamentosService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      // Atualizar pagamento
      const agendamentoAtualizado = await agendamentosService.updatePaymentStatus(
        id,
        payment_status,
        payment_method
      );

      ResponseUtils.success(res, agendamentoAtualizado, 'Status de pagamento atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/agendamentos/:id
   * Deleta agendamento
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Verificar se existe
      const exists = await agendamentosService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      // Deletar
      await agendamentosService.delete(id);

      ResponseUtils.success(res, { id }, 'Agendamento deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agendamentos/verificar-disponibilidade
   * Verifica conflitos de horário
   */
  static async verificarDisponibilidade(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, startTime, endTime, excludeId }: VerificarDisponibilidadeDTO = req.body;

      const conflitos = await agendamentosService.checkConflicts(date, startTime, endTime, excludeId);

      const response: DisponibilidadeResponse = {
        disponivel: conflitos.length === 0,
        conflitos: conflitos.map((c) => ({
          id: c.id,
          client_name: c.client_name,
          date: c.date,
          start_time: c.start_time,
          end_time: c.end_time,
          session_type: c.session_type,
        })),
      };

      ResponseUtils.success(
        res,
        response,
        conflitos.length === 0 ? 'Horário disponível' : `${conflitos.length} conflito(s) encontrado(s)`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agendamentos/finalizar-passados
   * Finaliza automaticamente agendamentos que já passaram
   * (para uso com cron jobs)
   */
  static async finalizarPassados(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await agendamentosService.finalizarAgendamentosPassados();

      ResponseUtils.success(res, resultado, `${resultado.finalizados} agendamento(s) finalizado(s)`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agendamentos/horarios-disponiveis
   * Retorna horários disponíveis para uma data
   */
  static async getHorariosDisponiveis(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, duration, user_id } = req.query as unknown as BuscarHorariosDisponiveisDTO;

      const horarios = await agendamentosService.getHorariosDisponiveis(
        date,
        duration || 60,
        user_id
      );

      ResponseUtils.success(res, horarios, 'Horários disponíveis obtidos com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
