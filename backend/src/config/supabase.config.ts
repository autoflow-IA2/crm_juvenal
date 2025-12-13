import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

/**
 * Inicializa o cliente Supabase
 * Usa Service Role Key para bypass de RLS (acesso admin)
 */
export const initSupabase = (): void => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios no .env');
  }

  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('✅ Supabase client inicializado');
};

/**
 * Retorna o cliente Supabase
 * Lança erro se não foi inicializado
 */
export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    throw new Error('Supabase não foi inicializado. Chame initSupabase() primeiro.');
  }
  return supabase;
};
