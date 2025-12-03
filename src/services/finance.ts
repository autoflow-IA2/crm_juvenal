import { supabase } from '@/lib/supabase'
import type {
  TransactionType,
  TransactionCategory,
  TransactionStatus,
  PaymentMethod
} from '@/types/database.types'

export interface CreateTransactionInput {
  type: TransactionType
  category: TransactionCategory
  description: string
  amount: number
  date: string
  client_id?: string | null
  appointment_id?: string | null
  payment_method?: PaymentMethod | null
  status?: TransactionStatus
  due_date?: string | null
}

export interface UpdateTransactionInput {
  type?: TransactionType
  category?: TransactionCategory
  description?: string
  amount?: number
  date?: string
  client_id?: string | null
  appointment_id?: string | null
  payment_method?: PaymentMethod | null
  status?: TransactionStatus
  due_date?: string | null
  paid_at?: string | null
}

export interface TransactionFilters {
  type?: TransactionType
  category?: TransactionCategory
  status?: TransactionStatus
  client_id?: string
  startDate?: string
  endDate?: string
}

export const financeService = {
  // Transações
  async getAll(filters?: TransactionFilters) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        ),
        appointments:appointment_id (
          id,
          date,
          type
        )
      `)
      .order('date', { ascending: false })

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.client_id) {
      query = query.eq('client_id', filters.client_id)
    }
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate)
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        ),
        appointments:appointment_id (
          id,
          date,
          type
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async create(transaction: CreateTransactionInput) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('transactions')
      // @ts-ignore - Supabase type issue with insert
      .insert({
        ...transaction,
        user_id: user.id,
        status: transaction.status || 'pending',
      })
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        ),
        appointments:appointment_id (
          id,
          date,
          type
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: UpdateTransactionInput) {
    const { data, error } = await supabase
      .from('transactions')
      // @ts-ignore - Supabase type issue with dynamic updates
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        ),
        appointments:appointment_id (
          id,
          date,
          type
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: TransactionStatus) {
    const updates: UpdateTransactionInput = { status }

    // Se marcando como pago, adiciona timestamp
    if (status === 'paid') {
      updates.paid_at = new Date().toISOString()
    }

    return this.update(id, updates)
  },

  async markAsPaid(id: string) {
    return this.updateStatus(id, 'paid')
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Estatísticas e Dashboard
  async getDashboardStats(startDate?: string, endDate?: string) {
    let query = supabase
      .from('transactions')
      .select('type, amount, status, date, category')

    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) throw error
    if (!data) return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      paidIncome: 0,
      pendingIncome: 0,
      overdueIncome: 0,
      incomeByCategory: {},
      expensesByCategory: {},
      transactionsCount: 0,
    }

    // Calcular estatísticas
    const transactions = data as any[]
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const paidIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const pendingIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const overdueIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'overdue')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    // Receitas por categoria
    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
        return acc
      }, {} as Record<string, number>)

    // Despesas por categoria
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
        return acc
      }, {} as Record<string, number>)

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      paidIncome,
      pendingIncome,
      overdueIncome,
      incomeByCategory,
      expensesByCategory,
      transactionsCount: transactions.length,
    }
  },

  async getRecentTransactions(limit = 10) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        clients:client_id (
          id,
          name
        )
      `)
      .order('date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  async getOverdue() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          phone,
          email
        )
      `)
      .eq('status', 'overdue')
      .eq('type', 'income')
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  },

  async getPending() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          phone,
          email
        )
      `)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  },

  // Relatórios mensais
  async getMonthlyReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

    return this.getDashboardStats(startDate, endDate)
  },
}
