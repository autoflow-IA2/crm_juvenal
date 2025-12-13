import { getSupabase } from '../config/supabase.config';
import type {
  Cliente,
  CreateClienteDTO,
  ClienteFilters,
  ClienteStats,
  ClienteResponse,
} from '../types/cliente.types';

/**
 * Transforma cliente do banco para formato de resposta (campos em português)
 */
const toClienteResponse = (cliente: Cliente): ClienteResponse => ({
  id: cliente.id,
  nome: cliente.full_name,
  email: cliente.email,
  telefone: cliente.phone,
  data_nascimento: cliente.birth_date,
  cpf: cliente.cpf,
  endereco: cliente.address,
  cidade: cliente.city,
  estado: cliente.state,
  cep: cliente.zip_code,
  contato_emergencia: cliente.emergency_contact,
  telefone_emergencia: cliente.emergency_phone,
  status: cliente.status,
  observacoes: cliente.notes,
  criado_em: cliente.created_at,
  atualizado_em: cliente.updated_at,
});

/**
 * Service de Clientes
 * Contém toda a lógica de negócio relacionada a clientes
 */
export const clientesService = {
  /**
   * Listar todos os clientes com filtros opcionais
   */
  async getAll(filters?: ClienteFilters, userId?: string): Promise<ClienteResponse[]> {
    const supabase = getSupabase();
    let query = supabase.from('clients').select('*');

    // Filtro por user_id (para multi-tenancy)
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Filtros opcionais
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters?.state) {
      query = query.eq('state', filters.state.toUpperCase());
    }

    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      );
    }

    // Ordenar por nome
    query = query.order('full_name', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return (data as Cliente[]).map(toClienteResponse);
  },

  /**
   * Buscar cliente por ID
   */
  async getById(id: string, userId?: string): Promise<ClienteResponse | null> {
    const supabase = getSupabase();
    let query = supabase.from('clients').select('*').eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return toClienteResponse(data as Cliente);
  },

  /**
   * Buscar clientes por termo (nome, email ou telefone)
   */
  async search(term: string, userId?: string): Promise<ClienteResponse[]> {
    const supabase = getSupabase();
    let query = supabase
      .from('clients')
      .select('*')
      .or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`)
      .order('full_name', { ascending: true })
      .limit(20);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data as Cliente[]).map(toClienteResponse);
  },

  /**
   * Criar novo cliente
   */
  async create(cliente: CreateClienteDTO): Promise<ClienteResponse> {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('clients')
      .insert(cliente)
      .select()
      .single();

    if (error) throw error;
    return toClienteResponse(data as Cliente);
  },

  /**
   * Atualizar cliente
   */
  async update(id: string, updateData: Partial<Cliente>, userId?: string): Promise<ClienteResponse> {
    const supabase = getSupabase();

    let query = supabase
      .from('clients')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    return toClienteResponse(data as Cliente);
  },

  /**
   * Atualizar apenas o status do cliente
   */
  async updateStatus(id: string, status: string, userId?: string): Promise<ClienteResponse> {
    const supabase = getSupabase();

    let query = supabase
      .from('clients')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    return toClienteResponse(data as Cliente);
  },

  /**
   * Deletar cliente
   */
  async delete(id: string, userId?: string): Promise<void> {
    const supabase = getSupabase();

    let query = supabase.from('clients').delete().eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;

    if (error) throw error;
  },

  /**
   * Verificar se email já existe
   */
  async emailExists(email: string, excludeId?: string, userId?: string): Promise<boolean> {
    const supabase = getSupabase();

    let query = supabase
      .from('clients')
      .select('id')
      .eq('email', email);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data?.length || 0) > 0;
  },

  /**
   * Verificar se CPF já existe
   */
  async cpfExists(cpf: string, excludeId?: string, userId?: string): Promise<boolean> {
    const supabase = getSupabase();

    // Normalizar CPF (remover pontos e traços)
    const normalizedCpf = cpf.replace(/[.\-]/g, '');

    let query = supabase
      .from('clients')
      .select('id, cpf');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Verificar se algum CPF normalizado coincide
    return (data || []).some((c: { id: string; cpf: string | null }) => {
      if (!c.cpf) return false;
      return c.cpf.replace(/[.\-]/g, '') === normalizedCpf;
    });
  },

  /**
   * Obter estatísticas de clientes
   */
  async getStats(userId?: string): Promise<ClienteStats> {
    const supabase = getSupabase();

    let query = supabase.from('clients').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: allClients, error } = await query;

    if (error) throw error;

    const clients = allClients as Cliente[];

    // Calcular início do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Calcular estatísticas
    const stats: ClienteStats = {
      total: clients.length,
      ativos: clients.filter((c) => c.status === 'active').length,
      inativos: clients.filter((c) => c.status === 'inactive').length,
      arquivados: clients.filter((c) => c.status === 'archived').length,
      novosEsteMes: clients.filter((c) => c.created_at >= startOfMonth).length,
      porCidade: {},
    };

    // Contar por cidade
    clients.forEach((c) => {
      if (c.city) {
        const cidade = c.city.toLowerCase().trim();
        stats.porCidade[cidade] = (stats.porCidade[cidade] || 0) + 1;
      }
    });

    return stats;
  },

  /**
   * Obter clientes ativos (para uso em dropdowns, etc.)
   */
  async getActive(userId?: string): Promise<ClienteResponse[]> {
    return this.getAll({ status: 'active' }, userId);
  },

  /**
   * Contar total de agendamentos do cliente
   */
  async getAppointmentCount(clientId: string): Promise<number> {
    const supabase = getSupabase();

    const { count, error } = await supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', clientId);

    if (error) throw error;
    return count || 0;
  },
};
