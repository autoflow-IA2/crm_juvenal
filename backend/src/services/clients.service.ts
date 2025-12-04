import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { ErrorCodes } from '../utils/response';
import { normalizePagination, calculateOffset, createPaginationMeta } from '../utils/pagination';
import type { Database } from '../types/database.types';
import type { CreateClientInput, UpdateClientInput, ListClientsQuery } from '../validators/clients.validator';

type Client = Database['public']['Tables']['clients']['Row'];

export class ClientsService {
  constructor(private userId: string) {}

  /**
   * Listar todos os clientes com paginação e filtros
   */
  async list(query: ListClientsQuery) {
    const { page, limit } = normalizePagination({ page: query.page, limit: query.limit });
    const offset = calculateOffset(page, limit);

    // Query base
    let queryBuilder = supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact' })
      .eq('user_id', this.userId);

    // Filtro por status
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    // Ordenação
    const sortField = query.sort || 'name';
    const sortOrder = query.order === 'desc';
    queryBuilder = queryBuilder.order(sortField, { ascending: !sortOrder });

    // Paginação
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw new AppError('Erro ao listar clientes', 500, ErrorCodes.DATABASE_ERROR);
    }

    const meta = createPaginationMeta(page, limit, count || 0);

    return { data: data || [], pagination: meta };
  }

  /**
   * Buscar cliente por ID
   */
  async getById(id: string): Promise<Client> {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', this.userId)
      .single();

    if (error || !data) {
      throw new AppError('Cliente não encontrado', 404, ErrorCodes.NOT_FOUND);
    }

    return data;
  }

  /**
   * Buscar clientes por nome, email ou telefone
   */
  async search(searchQuery: string, page: number = 1, limit: number = 50) {
    const { page: normalizedPage, limit: normalizedLimit } = normalizePagination({ page, limit });
    const offset = calculateOffset(normalizedPage, normalizedLimit);

    const searchTerm = `%${searchQuery}%`;

    const { data, error, count } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact' })
      .eq('user_id', this.userId)
      .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`)
      .order('name', { ascending: true })
      .range(offset, offset + normalizedLimit - 1);

    if (error) {
      throw new AppError('Erro ao buscar clientes', 500, ErrorCodes.DATABASE_ERROR);
    }

    const meta = createPaginationMeta(normalizedPage, normalizedLimit, count || 0);

    return { data: data || [], pagination: meta };
  }

  /**
   * Criar novo cliente
   */
  async create(input: CreateClientInput): Promise<Client> {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert({
        ...input,
        user_id: this.userId
      })
      .select()
      .single();

    if (error) {
      throw new AppError('Erro ao criar cliente', 500, ErrorCodes.DATABASE_ERROR);
    }

    return data;
  }

  /**
   * Atualizar cliente
   */
  async update(id: string, input: UpdateClientInput): Promise<Client> {
    // Verificar se existe
    await this.getById(id);

    const { data, error } = await supabaseAdmin
      .from('clients')
      .update(input)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();

    if (error) {
      throw new AppError('Erro ao atualizar cliente', 500, ErrorCodes.DATABASE_ERROR);
    }

    return data;
  }

  /**
   * Deletar cliente
   */
  async delete(id: string): Promise<void> {
    // Verificar se existe
    await this.getById(id);

    const { error } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);

    if (error) {
      throw new AppError('Erro ao deletar cliente', 500, ErrorCodes.DATABASE_ERROR);
    }
  }

  /**
   * Estatísticas de clientes
   */
  async getStats() {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('status')
      .eq('user_id', this.userId);

    if (error) {
      throw new AppError('Erro ao obter estatísticas', 500, ErrorCodes.DATABASE_ERROR);
    }

    const stats = {
      total: data.length,
      active: data.filter(c => c.status === 'active').length,
      inactive: data.filter(c => c.status === 'inactive').length,
      archived: data.filter(c => c.status === 'archived').length
    };

    return stats;
  }
}
