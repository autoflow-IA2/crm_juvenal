import { supabase } from '@/lib/supabase'
import type { ClientStatus } from '@/types/database.types'

export const clientsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(client: any) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('clients')
      // @ts-ignore - Supabase type issue with dynamic updates
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getByStatus(status: ClientStatus) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', status)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getStats() {
    const { data, error } = await supabase
      .from('clients')
      .select('status')

    if (error) throw error

    const stats = {
      total: data.length,
      active: data.filter((c: any) => c.status === 'active').length,
      inactive: data.filter((c: any) => c.status === 'inactive').length,
      archived: data.filter((c: any) => c.status === 'archived').length,
    }

    return stats
  },
}
