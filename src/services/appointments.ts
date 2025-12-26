import { supabase } from '@/lib/supabase'
import type { AppointmentStatus, SessionType } from '@/types/database.types'

export const appointmentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        clients:client_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .order('date', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        clients:client_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        clients:client_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) throw error
    return data
  },

  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async create(appointment: {
    client_id: string
    date: string
    duration: number
    type: SessionType
    price: number
    notes?: string
    status?: AppointmentStatus
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('appointments')
      // @ts-ignore - Supabase type issue with insert
      .insert({
        ...appointment,
        user_id: user.id,
        status: appointment.status || 'scheduled',
        is_paid: false,
      })
      .select(`
        *,
        clients:client_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('appointments')
      // @ts-ignore - Supabase type issue with dynamic updates
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        clients:client_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: AppointmentStatus) {
    return this.update(id, { status })
  },

  async markAsPaid(id: string) {
    return this.update(id, { is_paid: true })
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getUpcoming(limit = 10) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        clients:client_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .gte('date', now)
      .order('date', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data
  },

  async getStats() {
    const { data, error } = await supabase
      .from('appointments')
      .select('status, is_paid')

    if (error) throw error

    const stats = {
      total: data.length,
      scheduled: data.filter((a: any) => a.status === 'scheduled').length,
      confirmed: data.filter((a: any) => a.status === 'confirmed').length,
      completed: data.filter((a: any) => a.status === 'completed').length,
      cancelled: data.filter((a: any) => a.status === 'cancelled').length,
      paid: data.filter((a: any) => a.is_paid).length,
      unpaid: data.filter((a: any) => !a.is_paid).length,
    }

    return stats
  },
}
