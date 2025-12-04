import { supabaseAdmin } from '../config/supabase';
import { createApiKeyData, hashApiKey } from '../utils/apiKey';
import { AppError } from '../middleware/errorHandler';
import { ErrorCodes } from '../utils/response';
import type { CreateApiKeyInput, UpdateApiKeyInput } from '../validators/apiKeys.validator';

/**
 * Interface para API Key (sem o hash)
 */
export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para API Key com a key completa (apenas na criação)
 */
export interface ApiKeyWithSecret extends ApiKey {
  key: string;
}

/**
 * Service para gerenciar API Keys
 */
export class ApiKeysService {
  constructor(private userId: string) {}

  /**
   * Criar uma nova API key
   * ⚠️ A key completa é retornada apenas UMA vez
   */
  async create(input: CreateApiKeyInput): Promise<ApiKeyWithSecret> {
    // Gerar nova API key
    const { key, hash, prefix } = createApiKeyData(false);

    // Inserir no banco
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert({
        user_id: this.userId,
        name: input.name,
        key_hash: hash,
        key_prefix: prefix,
        scopes: input.scopes || ['read', 'write', 'delete'],
        expires_at: input.expires_at || null
      })
      .select()
      .single();

    if (error) {
      throw new AppError(
        'Erro ao criar API key',
        500,
        ErrorCodes.DATABASE_ERROR
      );
    }

    // Retornar API key com a key completa (única vez!)
    return {
      ...data,
      key // ⚠️ Key completa - mostrar apenas uma vez ao usuário
    };
  }

  /**
   * Listar todas as API keys do usuário
   * Não retorna a key completa, apenas o prefixo
   */
  async list(): Promise<ApiKey[]> {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(
        'Erro ao listar API keys',
        500,
        ErrorCodes.DATABASE_ERROR
      );
    }

    return data || [];
  }

  /**
   * Buscar uma API key específica pelo ID
   */
  async getById(id: string): Promise<ApiKey> {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user_id', this.userId)
      .single();

    if (error || !data) {
      throw new AppError(
        'API key não encontrada',
        404,
        ErrorCodes.NOT_FOUND
      );
    }

    return data;
  }

  /**
   * Atualizar uma API key
   * Não permite atualizar o hash da key
   */
  async update(id: string, input: UpdateApiKeyInput): Promise<ApiKey> {
    // Verificar se a key existe e pertence ao usuário
    await this.getById(id);

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update(input)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();

    if (error) {
      throw new AppError(
        'Erro ao atualizar API key',
        500,
        ErrorCodes.DATABASE_ERROR
      );
    }

    return data;
  }

  /**
   * Deletar (revogar) uma API key
   */
  async delete(id: string): Promise<void> {
    // Verificar se a key existe e pertence ao usuário
    await this.getById(id);

    const { error } = await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);

    if (error) {
      throw new AppError(
        'Erro ao deletar API key',
        500,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  /**
   * Desativar uma API key (soft delete)
   */
  async deactivate(id: string): Promise<ApiKey> {
    return this.update(id, { is_active: false });
  }

  /**
   * Reativar uma API key
   */
  async activate(id: string): Promise<ApiKey> {
    return this.update(id, { is_active: true });
  }

  /**
   * Atualizar o timestamp de último uso
   */
  async updateLastUsed(id: string): Promise<void> {
    await supabaseAdmin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', id);
  }

  /**
   * Validar uma API key e retornar informações do usuário
   * Usado pelo middleware de autenticação
   */
  static async validateKey(apiKey: string): Promise<ApiKey | null> {
    console.log('🔍 validateKey: Validando key:', apiKey.substring(0, 20) + '...')

    // Try to find by key field first (new approach)
    let data, error;

    const result = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    data = result.data;
    error = result.error;

    console.log('🔍 validateKey: Resultado busca por key:', error ? `❌ ${error.message}` : '✅ Encontrada')

    // Fallback to key_hash if key field doesn't match (old approach)
    if (error || !data) {
      const keyHash = hashApiKey(apiKey);

      const hashResult = await supabaseAdmin
        .from('api_keys')
        .select('*')
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .single();

      data = hashResult.data;
      error = hashResult.error;
    }

    if (error || !data) {
      return null;
    }

    // Verificar se expirou
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    // Atualizar último uso (fire and forget)
    supabaseAdmin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
      .then(() => {})
      .catch(() => {});

    return data;
  }
}
