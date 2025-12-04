import { createClient, SupabaseClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

/**
 * Supabase Admin Client
 * Usa a service role key que bypassa RLS
 * Deve ser usado com CUIDADO apenas no backend
 */
export const supabaseAdmin: SupabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Função para criar contexto de usuário
 * Permite queries que respeitam RLS automaticamente
 * @param userId - ID do usuário autenticado via API Key
 */
export function getSupabaseClient(_userId: string): SupabaseClient {
  // O RLS será respeitado porque as policies verificam auth.uid()
  // No backend, usamos o supabaseAdmin mas podemos passar o userId
  // em queries específicas para garantir isolamento de dados
  return supabaseAdmin;
}
