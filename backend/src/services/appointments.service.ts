import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { ErrorCodes } from '../utils/response';
import { normalizePagination, calculateOffset, createPaginationMeta } from '../utils/pagination';
import type { CreateAppointmentInput, UpdateAppointmentInput, ListAppointmentsQuery } from '../validators/appointments.validator';

export class AppointmentsService {
  constructor(private userId: string) {}

  async list(query: ListAppointmentsQuery) {
    const { page, limit } = normalizePagination({ page: query.page, limit: query.limit });
    const offset = calculateOffset(page, limit);

    let queryBuilder = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        client:clients!client_id (
          id,
          name,
          email,
          phone
        )
      `, { count: 'exact' })
      .eq('user_id', this.userId);

    if (query.client_id) queryBuilder = queryBuilder.eq('client_id', query.client_id);
    if (query.status) queryBuilder = queryBuilder.eq('status', query.status);
    if (query.is_paid !== undefined) queryBuilder = queryBuilder.eq('is_paid', query.is_paid);
    if (query.date_from) queryBuilder = queryBuilder.gte('date', query.date_from);
    if (query.date_to) queryBuilder = queryBuilder.lte('date', query.date_to);

    const sortField = query.sort || 'date';
    const sortOrder = query.order === 'desc';
    queryBuilder = queryBuilder.order(sortField, { ascending: !sortOrder }).range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) throw new AppError('Erro ao listar agendamentos', 500, ErrorCodes.DATABASE_ERROR);

    const meta = createPaginationMeta(page, limit, count || 0);
    return { data: data || [], pagination: meta };
  }

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        client:clients!client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .eq('user_id', this.userId)
      .single();

    if (error || !data) throw new AppError('Agendamento não encontrado', 404, ErrorCodes.NOT_FOUND);
    return data;
  }

  async getUpcoming(limit: number = 10) {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        client:clients!client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('user_id', this.userId)
      .gte('date', now)
      .in('status', ['scheduled', 'confirmed'])
      .order('date', { ascending: true })
      .limit(limit);

    if (error) throw new AppError('Erro ao buscar próximos agendamentos', 500, ErrorCodes.DATABASE_ERROR);
    return data || [];
  }

  async create(input: CreateAppointmentInput) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        ...input,
        user_id: this.userId
      })
      .select(`
        *,
        client:clients!client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .single();

    if (error) throw new AppError('Erro ao criar agendamento', 500, ErrorCodes.DATABASE_ERROR);
    return data;
  }

  async update(id: string, input: UpdateAppointmentInput) {
    await this.getById(id);

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update(input)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select(`
        *,
        client:clients!client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .single();

    if (error) throw new AppError('Erro ao atualizar agendamento', 500, ErrorCodes.DATABASE_ERROR);
    return data;
  }

  async updateStatus(id: string, status: string, sessionNotes?: string) {
    const updateData: any = { status };
    if (sessionNotes !== undefined) updateData.session_notes = sessionNotes;

    return this.update(id, updateData);
  }

  async updatePayment(id: string, isPaid: boolean) {
    return this.update(id, { is_paid: isPaid });
  }

  async delete(id: string) {
    await this.getById(id);

    const { error } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);

    if (error) throw new AppError('Erro ao deletar agendamento', 500, ErrorCodes.DATABASE_ERROR);
  }

  async getStats() {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('status, is_paid')
      .eq('user_id', this.userId);

    if (error) throw new AppError('Erro ao obter estatísticas', 500, ErrorCodes.DATABASE_ERROR);

    const stats = {
      total: data.length,
      by_status: {
        scheduled: data.filter(a => a.status === 'scheduled').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        in_progress: data.filter(a => a.status === 'in_progress').length,
        completed: data.filter(a => a.status === 'completed').length,
        cancelled: data.filter(a => a.status === 'cancelled').length,
        no_show: data.filter(a => a.status === 'no_show').length
      },
      by_payment: {
        paid: data.filter(a => a.is_paid).length,
        unpaid: data.filter(a => !a.is_paid).length
      }
    };

    return stats;
  }
}
