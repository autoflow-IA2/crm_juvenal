import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type DBAPIKey = Database['public']['Tables']['api_keys']['Row']
type DBAPIKeyInsert = Database['public']['Tables']['api_keys']['Insert']
type DBAPIKeyUpdate = Database['public']['Tables']['api_keys']['Update']

export interface APIKey {
  id: string
  user_id: string
  name: string
  key: string
  scopes: string[]
  last_used_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateAPIKeyData {
  name: string
  scopes: string[]
  expires_in_days?: number
}

/**
 * List all API keys for current user
 */
export async function listAPIKeys(): Promise<APIKey[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Add masked key based on prefix (actual key is not stored/retrievable)
  return (data || []).map((item: DBAPIKey) => ({
    ...item,
    key: item.key_prefix + '••••••••••••••••••••••••••'
  }))
}

/**
 * Create new API key
 */
export async function createAPIKey(keyData: CreateAPIKeyData): Promise<APIKey> {
  try {
    console.log('🔍 createAPIKey: Iniciando...', keyData)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('❌ createAPIKey: Erro de autenticação:', authError)
      throw new Error('Erro de autenticação: ' + authError.message)
    }

    if (!user) {
      console.error('❌ createAPIKey: Usuário não autenticado')
      throw new Error('Usuário não autenticado')
    }

    console.log('✅ createAPIKey: Usuário autenticado:', user.id)

    // Generate random key
    const randomKey = generateAPIKey()
    console.log('✅ createAPIKey: Key gerada:', randomKey.substring(0, 20) + '...')

    // Calculate SHA-256 hash
    const keyHash = await hashAPIKey(randomKey)

    const insertData: DBAPIKeyInsert = {
      user_id: user.id,
      name: keyData.name,
      scopes: keyData.scopes,
      expires_at: keyData.expires_in_days
        ? new Date(Date.now() + keyData.expires_in_days * 24 * 60 * 60 * 1000).toISOString()
        : null,
      key_prefix: randomKey.substring(0, 8),
      key_hash: keyHash,
    }

    console.log('📝 createAPIKey: Dados para inserir:', {
      ...insertData,
      key_hash: 'HIDDEN'
    })

    const { data, error } = await (supabase
      .from('api_keys') as any)
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ createAPIKey: Erro do Supabase:', error)
      throw new Error(`Erro ao criar API key: ${error.message} (${error.code})`)
    }

    console.log('✅ createAPIKey: Sucesso! ID:', (data as DBAPIKey).id)

    // Return data with the generated key (only shown once)
    return {
      ...(data as DBAPIKey),
      key: randomKey
    }
  } catch (err) {
    console.error('❌ createAPIKey: Erro geral:', err)
    throw err
  }
}

/**
 * Delete API key
 */
export async function deleteAPIKey(id: string): Promise<void> {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Update API key (name, scopes, active status)
 */
export async function updateAPIKey(
  id: string,
  updates: Partial<Pick<APIKey, 'name' | 'scopes' | 'is_active'>>
): Promise<APIKey> {
  const updateData: DBAPIKeyUpdate = updates

  const { data, error } = await (supabase
    .from('api_keys') as any)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  const dbData = data as DBAPIKey

  // Add masked key (actual key is not stored/retrievable)
  return {
    ...dbData,
    key: dbData.key_prefix + '••••••••••••••••••••••••••'
  }
}

/**
 * Generate random API key
 */
function generateAPIKey(): string {
  const prefix = 'jcrm_live_'
  const length = 32
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let key = ''
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return prefix + key
}

/**
 * Hash API key using SHA-256
 */
async function hashAPIKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Mask API key for display
 */
export function maskAPIKey(key: string): string {
  if (key.length <= 12) return key
  const start = key.substring(0, 10)
  const end = key.substring(key.length - 6)
  return `${start}...${end}`
}
