import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { ErrorCodes } from '../utils/response';
import { normalizePagination, calculateOffset, createPaginationMeta } from '../utils/pagination';
import type { Database } from '../types/database.types';
import type { CreateTransactionInput, UpdateTransactionInput, ListTransactionsQuery } from '../validators/transactions.validator';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export class TransactionsService {
  constructor(private userId: string) {}

  async list(query: ListTransactionsQuery) {
    const { page, limit } = normalizePagination({ page: query.page, limit: query.limit });
    const offset = calculateOffset(page, limit);

    let queryBuilder = supabaseAdmin
      .from('transactions')
      .select(`
        *,
        client:clients!client_id (id, name),
        appointment:appointments!appointment_id (id, date, type)
      `, { count: 'exact' })
      .eq('user_id', this.userId);

    if (query.type) queryBuilder = queryBuilder.eq('type', query.type);
    if (query.category) queryBuilder = queryBuilder.eq('category', query.category);
    if (query.status) queryBuilder = queryBuilder.eq('status', query.status);
    if (query.payment_method) queryBuilder = queryBuilder.eq('payment_method', query.payment_method);
    if (query.client_id) queryBuilder = queryBuilder.eq('client_id', query.client_id);
    if (query.date_from) queryBuilder = queryBuilder.gte('date', query.date_from);
    if (query.date_to) queryBuilder = queryBuilder.lte('date', query.date_to);

    const sortField = query.sort || 'date';
    const sortOrder = query.order === 'desc';
    queryBuilder = queryBuilder.order(sortField, { ascending: !sortOrder }).range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) throw new AppError('Erro ao listar transações', 500, ErrorCodes.DATABASE_ERROR);

    const meta = createPaginationMeta(page, limit, count || 0);
    return { data: data || [], pagination: meta };
  }

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        *,
        client:clients!client_id (id, name, email, phone),
        appointment:appointments!appointment_id (id, date, type)
      `)
      .eq('id', id)
      .eq('user_id', this.userId)
      .single();

    if (error || !data) throw new AppError('Transação não encontrada', 404, ErrorCodes.NOT_FOUND);
    return data;
  }

  async getPending() {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select(`*,client:clients!client_id (id, name)`)
      .eq('user_id', this.userId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) throw new AppError('Erro ao buscar transações pendentes', 500, ErrorCodes.DATABASE_ERROR);
    return data || [];
  }

  async getOverdue() {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select(`*,client:clients!client_id (id, name, email, phone)`)
      .eq('user_id', this.userId)
      .eq('status', 'pending')
      .not('due_date', 'is', null)
      .lt('due_date', now)
      .order('due_date', { ascending: true });

    if (error) throw new AppError('Erro ao buscar transações vencidas', 500, ErrorCodes.DATABASE_ERROR);
    return data || [];
  }

  async create(input: CreateTransactionInput) {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        ...input,
        user_id: this.userId
      })
      .select(`*,client:clients!client_id (id, name)`)
      .single();

    if (error) throw new AppError('Erro ao criar transação', 500, ErrorCodes.DATABASE_ERROR);
    return data;
  }

  async update(id: string, input: UpdateTransactionInput) {
    await this.getById(id);

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .update(input)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select(`*,client:clients!client_id (id, name)`)
      .single();

    if (error) throw new AppError('Erro ao atualizar transação', 500, ErrorCodes.DATABASE_ERROR);
    return data;
  }

  async updateStatus(id: string, status: string) {
    return this.update(id, { status });
  }

  async markAsPaid(id: string, paymentMethod: string, paidAt?: string) {
    return this.update(id, {
      status: 'paid',
      payment_method: paymentMethod,
      paid_at: paidAt || new Date().toISOString()
    });
  }

  async delete(id: string) {
    await this.getById(id);

    const { error } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);

    if (error) throw new AppError('Erro ao deletar transação', 500, ErrorCodes.DATABASE_ERROR);
  }

  async getDashboard(dateFrom?: string, dateTo?: string) {
    let query = supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', this.userId)
      .neq('status', 'cancelled');

    if (dateFrom) query = query.gte('date', dateFrom);
    if (dateTo) query = query.lte('date', dateTo);

    const { data, error } = await query;

    if (error) throw new AppError('Erro ao obter dashboard', 500, ErrorCodes.DATABASE_ERROR);

    const incomes = data.filter(t => t.type === 'income');
    const expenses = data.filter(t => t.type === 'expense');

    const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    const paidIncome = incomes.filter(t => t.status === 'paid').reduce((sum, t) => sum + Number(t.amount), 0);
    const pendingIncome = incomes.filter(t => t.status === 'pending').reduce((sum, t) => sum + Number(t.amount), 0);
    const overdueIncome = incomes.filter(t => t.status === 'overdue').reduce((sum, t) => sum + Number(t.amount), 0);

    const incomeByCategory: Record<string, number> = {};
    incomes.forEach(t => {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + Number(t.amount);
    });

    const expensesByCategory: Record<string, number> = {};
    expenses.forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Number(t.amount);
    });

    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      balance: totalIncome - totalExpenses,
      paid_income: paidIncome,
      pending_income: pendingIncome,
      overdue_income: overdueIncome,
      income_by_category: incomeByCategory,
      expenses_by_category: expensesByCategory,
      transactions_count: data.length
    };
  }

  async getMonthlyReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    return this.getDashboard(startDate, endDate);
  }
}
