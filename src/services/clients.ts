import { supabase } from '@/lib/supabase'
import type { ClientStatus } from '@/types/database.types'

export interface ClientFilters {
  name?: string
  phone?: string
  status?: ClientStatus
}

export const clientsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('full_name', { ascending: true })

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

    // Transformar 'name' para 'full_name' se necessário
    const clientData = { ...client }
    if (clientData.name && !clientData.full_name) {
      clientData.full_name = clientData.name
      delete clientData.name
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...clientData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Record<string, any>) {
    // Transformar 'name' para 'full_name' se necessário
    const updateData = { ...updates }
    if (updateData.name && !updateData.full_name) {
      updateData.full_name = updateData.name
      delete updateData.name
    }

    const { data, error } = await supabase
      .from('clients')
      // @ts-ignore - Supabase type issue with dynamic updates
      .update(updateData)
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
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('full_name', { ascending: true })

    if (error) throw error
    return data
  },

  async getFiltered(filters: ClientFilters) {
    let query = supabase
      .from('clients')
      .select('*')

    // Aplicar filtros de nome e telefone com lógica OR
    const nameFilter = filters.name
    const phoneFilter = filters.phone

    if (nameFilter && phoneFilter) {
      // Ambos fornecidos: busca por nome OU telefone
      query = query.or(`full_name.eq.${nameFilter},phone.eq.${phoneFilter}`)
    } else if (nameFilter) {
      // Só nome fornecido
      query = query.eq('full_name', nameFilter)
    } else if (phoneFilter) {
      // Só telefone fornecido
      query = query.eq('phone', phoneFilter)
    }

    // Aplicar filtro de status se fornecido
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    // Ordenar por nome
    query = query.order('full_name', { ascending: true })

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getByStatus(status: ClientStatus) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', status)
      .order('full_name', { ascending: true })

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
