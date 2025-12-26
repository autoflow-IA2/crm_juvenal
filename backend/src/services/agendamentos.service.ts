import { getSupabase } from '../config/supabase.config';
import type {
  Agendamento,
  CreateAgendamentoDTO,
  AgendamentoFilters,
  AgendamentoStats,
  HorarioDisponivelResponse,
} from '../types/agendamento.types';

/**
 * Service de Agendamentos
 * Contém toda a lógica de negócio relacionada a agendamentos
 */
export const agendamentosService = {
  /**
   * Listar todos os agendamentos com filtros opcionais
   */
  async getAll(filters?: AgendamentoFilters, userId?: string): Promise<Agendamento[]> {
    const supabase = getSupabase();
    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:clients(id, full_name, email, phone)
      `);

    // Filtro por user_id (RLS)
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Filtros opcionais
    if (filters?.status) {
      query = query.eq('appointment_status', filters.status);
    }

    if (filters?.paymentStatus) {
      query = query.eq('payment_status', filters.paymentStatus);
    }

    if (filters?.sessionType) {
      query = query.eq('session_type', filters.sessionType);
    }

    if (filters?.date) {
      query = query.eq('date', filters.date);
    }

    if (filters?.dateStart) {
      query = query.gte('date', filters.dateStart);
    }

    if (filters?.dateEnd) {
      query = query.lte('date', filters.dateEnd);
    }

    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters?.clientName) {
      query = query.ilike('client_name', `%${filters.clientName}%`);
    }

    // Ordenar por data e hora
    query = query.order('date', { ascending: true }).order('start_time', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return data as Agendamento[];
  },

  /**
   * Buscar agendamento por ID
   */
  async getById(id: string, userId?: string): Promise<Agendamento | null> {
    const supabase = getSupabase();
    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:clients(id, full_name, email, phone)
      `)
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as Agendamento;
  },

  /**
   * Criar novo agendamento
   */
  async create(agendamento: CreateAgendamentoDTO): Promise<Agendamento> {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('appointments')
      .insert(agendamento)
      .select(`
        *,
        client:clients(id, full_name, email, phone)
      `)
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  /**
   * Atualizar agendamento
   */
  async update(id: string, updateData: Partial<Agendamento>, userId?: string): Promise<Agendamento> {
    const supabase = getSupabase();

    let query = supabase
      .from('appointments')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .select(`
        *,
        client:clients(id, full_name, email, phone)
      `)
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  /**
   * Atualizar apenas o status do agendamento
   */
  async updateStatus(id: string, status: string, userId?: string): Promise<Agendamento> {
    const supabase = getSupabase();

    let query = supabase
      .from('appointments')
      .update({ appointment_status: status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .select(`
        *,
        client:clients(id, full_name, email, phone)
      `)
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  /**
   * Atualizar status de pagamento
   */
  async updatePaymentStatus(
    id: string,
    paymentStatus: string,
    paymentMethod?: string,
    userId?: string
  ): Promise<Agendamento> {
    const supabase = getSupabase();

    const updateData: any = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    };

    if (paymentMethod) {
      updateData.payment_method = paymentMethod;
    }

    let query = supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .select(`
        *,
        client:clients(id, full_name, email, phone)
      `)
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  /**
   * Deletar agendamento
   */
  async delete(id: string, userId?: string): Promise<void> {
    const supabase = getSupabase();

    let query = supabase.from('appointments').delete().eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;

    if (error) throw error;
  },

  /**
   * Verificar conflitos de horário
   */
  async checkConflicts(
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string,
    userId?: string
  ): Promise<Agendamento[]> {
    const supabase = getSupabase();

    let query = supabase
      .from('appointments')
      .select('id, client_id, date, start_time, end_time, session_type, appointment_status')
      .eq('date', date)
      .not('appointment_status', 'in', '("cancelado","nao_compareceu")');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Filtrar manualmente para verificar sobreposição de horários
    const conflitos = (data as unknown as Agendamento[]).filter((agendamento) => {
      const inicioNovo = startTime;
      const fimNovo = endTime;
      const inicioExistente = agendamento.start_time;
      const fimExistente = agendamento.end_time;

      // Verifica se há sobreposição
      return inicioNovo < fimExistente && fimNovo > inicioExistente;
    });

    return conflitos;
  },

  /**
   * Buscar agendamentos do dia
   */
  async getToday(userId?: string): Promise<Agendamento[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll({ date: today }, userId);
  },

  /**
   * Buscar próximos agendamentos
   */
  async getUpcoming(limit: number = 10, userId?: string): Promise<Agendamento[]> {
    const supabase = getSupabase();
    const today = new Date().toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:clients(id, full_name, email, phone)
      `)
      .gte('date', today)
      .not('appointment_status', 'in', '("cancelado","nao_compareceu","concluido")')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Agendamento[];
  },

  /**
   * Obter estatísticas de agendamentos
   */
  async getStats(userId?: string): Promise<AgendamentoStats> {
    const supabase = getSupabase();
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayStr = today.toISOString().split('T')[0];
    const weekStartStr = startOfWeek.toISOString().split('T')[0];
    const monthStartStr = startOfMonth.toISOString().split('T')[0];

    let baseQuery = supabase.from('appointments').select('*');

    if (userId) {
      baseQuery = baseQuery.eq('user_id', userId);
    }

    const { data: allAppointments, error } = await baseQuery;

    if (error) throw error;

    const appointments = allAppointments as Agendamento[];

    // Calcular estatísticas
    const stats: AgendamentoStats = {
      total: appointments.length,
      hoje: appointments.filter((a) => a.date === todayStr).length,
      semana: appointments.filter((a) => a.date >= weekStartStr && a.date <= todayStr).length,
      mes: appointments.filter((a) => a.date >= monthStartStr).length,
      porStatus: {
        agendado: 0,
        confirmado: 0,
        em_andamento: 0,
        concluido: 0,
        cancelado: 0,
        nao_compareceu: 0,
      },
      porTipo: {
        sessao_individual: 0,
        sessao_casal: 0,
        sessao_familia: 0,
        sessao_grupo: 0,
        primeira_consulta: 0,
        retorno: 0,
      },
      receitaMes: 0,
      receitaPendente: 0,
    };

    // Contar por status e tipo
    appointments.forEach((a) => {
      if (stats.porStatus[a.appointment_status] !== undefined) {
        stats.porStatus[a.appointment_status]++;
      }
      if (stats.porTipo[a.session_type] !== undefined) {
        stats.porTipo[a.session_type]++;
      }

      // Calcular receita do mês
      if (a.date >= monthStartStr && a.payment_status === 'pago' && a.price) {
        stats.receitaMes += a.price;
      }

      // Calcular receita pendente
      if (a.payment_status === 'pendente' && a.price) {
        stats.receitaPendente += a.price;
      }
    });

    return stats;
  },

  /**
   * Finalizar agendamentos passados automaticamente
   * (para uso em cron jobs)
   */
  async finalizarAgendamentosPassados(userId?: string): Promise<{ finalizados: number; ids: string[] }> {
    const supabase = getSupabase();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Buscar agendamentos confirmados/em_andamento que já passaram
    let selectQuery = supabase
      .from('appointments')
      .select('id')
      .in('appointment_status', ['agendado', 'confirmado', 'em_andamento'])
      .lt('date', yesterdayStr);

    if (userId) {
      selectQuery = selectQuery.eq('user_id', userId);
    }

    const { data: appointments, error: selectError } = await selectQuery;

    if (selectError) throw selectError;

    if (!appointments || appointments.length === 0) {
      return { finalizados: 0, ids: [] };
    }

    const ids = appointments.map((a) => a.id);

    // Atualizar status para concluído
    let updateQuery = supabase
      .from('appointments')
      .update({ appointment_status: 'concluido', updated_at: new Date().toISOString() })
      .in('id', ids);

    if (userId) {
      updateQuery = updateQuery.eq('user_id', userId);
    }

    const { error: updateError } = await updateQuery;

    if (updateError) throw updateError;

    return { finalizados: ids.length, ids };
  },

  /**
   * Buscar horários disponíveis para uma data
   * Utiliza a função PostgreSQL get_available_slots
   */
  async getHorariosDisponiveis(
    date: string,
    duration: number = 60,
    userId: string
  ): Promise<HorarioDisponivelResponse> {
    const supabase = getSupabase();

    // Chamar função PostgreSQL get_available_slots via RPC
    const { data: slots, error: slotsError } = await supabase.rpc('get_available_slots', {
      p_user_id: userId,
      p_date: date,
      p_duration: duration,
    });

    if (slotsError) throw slotsError;

    // Buscar working_hours do dia
    const dayOfWeek = new Date(date + 'T00:00:00').getDay();
    const { data: workingHours, error: whError } = await supabase
      .from('working_hours')
      .select('start_time, end_time')
      .eq('user_id', userId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .single();

    // Ignorar erro de "not found" para working_hours
    if (whError && whError.code !== 'PGRST116') throw whError;

    return {
      date,
      duration,
      working_hours: workingHours
        ? {
            start: workingHours.start_time,
            end: workingHours.end_time,
          }
        : null,
      slots: slots || [],
    };
  },
};
