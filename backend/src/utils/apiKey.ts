import crypto from 'crypto';

/**
 * Prefixos para API keys
 */
const API_KEY_PREFIX = 'jcrm';
const ENVIRONMENT = {
  LIVE: 'live',
  TEST: 'test'
} as const;

/**
 * Tamanho da key (em bytes, será convertido para base64url)
 */
const KEY_LENGTH = 32; // 32 bytes = 256 bits

/**
 * Gera uma nova API key única
 * Formato: jcrm_live_abc123def456...
 *
 * @param isTest - Se true, gera key de teste (jcrm_test_), senão gera live (jcrm_live_)
 * @returns API key completa
 */
export function generateApiKey(isTest: boolean = false): string {
  const environment = isTest ? ENVIRONMENT.TEST : ENVIRONMENT.LIVE;
  const randomBytes = crypto.randomBytes(KEY_LENGTH);
  const randomString = randomBytes.toString('base64url'); // base64url é URL-safe

  return `${API_KEY_PREFIX}_${environment}_${randomString}`;
}

/**
 * Cria hash SHA-256 de uma API key
 * Este hash é armazenado no banco de dados
 *
 * @param apiKey - API key completa
 * @returns Hash SHA-256 em hexadecimal
 */
export function hashApiKey(apiKey: string): string {
  const secret = process.env.API_KEY_SECRET || 'default-secret-change-me';
  return crypto
    .createHmac('sha256', secret)
    .update(apiKey)
    .digest('hex');
}

/**
 * Extrai o prefixo da API key (primeiros 8 caracteres)
 * Usado para identificação visual sem expor a key completa
 *
 * @param apiKey - API key completa
 * @returns Prefixo da key (ex: "jcrm_liv")
 */
export function getApiKeyPrefix(apiKey: string): string {
  return apiKey.substring(0, 8);
}

/**
 * Valida o formato de uma API key
 * Formato esperado: jcrm_(live|test)_[base64url string]
 *
 * @param apiKey - API key para validar
 * @returns true se o formato é válido
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  const pattern = /^jcrm_(live|test)_[A-Za-z0-9_-]+$/;
  return pattern.test(apiKey);
}

/**
 * Verifica se uma API key corresponde ao hash armazenado
 *
 * @param apiKey - API key fornecida
 * @param storedHash - Hash armazenado no banco
 * @returns true se a key corresponde ao hash
 */
export function verifyApiKey(apiKey: string, storedHash: string): boolean {
  const computedHash = hashApiKey(apiKey);
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(storedHash)
  );
}

/**
 * Gera informações completas para uma nova API key
 * Inclui a key completa, hash e prefixo
 *
 * @param isTest - Se é uma key de teste
 * @returns Objeto com key, hash e prefix
 */
export function createApiKeyData(isTest: boolean = false) {
  const key = generateApiKey(isTest);
  const hash = hashApiKey(key);
  const prefix = getApiKeyPrefix(key);

  return {
    key,        // ⚠️ Mostrar apenas UMA vez ao usuário
    hash,       // Armazenar no banco
    prefix      // Armazenar no banco para identificação
  };
}

/**
 * Máscara uma API key para exibição segura
 * Mostra apenas os primeiros 8 e últimos 4 caracteres
 *
 * @param apiKey - API key completa
 * @returns API key mascarada (ex: "jcrm_liv...xyz4")
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length < 12) return '***';

  const start = apiKey.substring(0, 8);
  const end = apiKey.substring(apiKey.length - 4);

  return `${start}...${end}`;
}
