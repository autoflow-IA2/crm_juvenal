import { Request, Response, NextFunction } from 'express';
import { ApiKeysService } from '../services/apiKeys.service';
import { validateApiKeyFormat } from '../utils/apiKey';
import { sendError, ErrorCodes } from '../utils/response';

/**
 * Estende o tipo Request do Express para incluir dados do usuário autenticado
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      apiKeyId?: string;
      apiKeyScopes?: string[];
    }
  }
}

/**
 * Middleware de autenticação via API Key
 * Extrai a API key do header X-API-Key e valida
 */
export async function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extrair API key do header
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      sendError(
        res,
        ErrorCodes.MISSING_API_KEY,
        'API key não fornecida. Use o header X-API-Key',
        401
      );
      return;
    }

    // Validar formato da key
    if (!validateApiKeyFormat(apiKey)) {
      sendError(
        res,
        ErrorCodes.INVALID_API_KEY,
        'Formato de API key inválido',
        401
      );
      return;
    }

    // Validar API key no banco de dados
    const apiKeyData = await ApiKeysService.validateKey(apiKey);

    if (!apiKeyData) {
      sendError(
        res,
        ErrorCodes.INVALID_API_KEY,
        'API key inválida, expirada ou desativada',
        401
      );
      return;
    }

    // Adicionar informações do usuário ao request
    req.userId = apiKeyData.user_id;
    req.apiKeyId = apiKeyData.id;
    req.apiKeyScopes = apiKeyData.scopes;

    next();
  } catch (error) {
    console.error('[API Key Auth] Error:', error);
    sendError(
      res,
      ErrorCodes.INTERNAL_ERROR,
      'Erro ao validar API key',
      500
    );
  }
}

/**
 * Middleware para verificar se a API key tem um scope específico
 * Deve ser usado APÓS o middleware apiKeyAuth
 */
export function requireScope(...requiredScopes: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userScopes = req.apiKeyScopes || [];

    const hasRequiredScope = requiredScopes.some(scope =>
      userScopes.includes(scope)
    );

    if (!hasRequiredScope) {
      sendError(
        res,
        ErrorCodes.INSUFFICIENT_PERMISSIONS,
        `API key não possui permissão necessária. Scopes requeridos: ${requiredScopes.join(', ')}`,
        403
      );
      return;
    }

    next();
  };
}

/**
 * Middleware de autenticação opcional
 * Se houver API key, valida. Se não houver, continua sem autenticação
 * Útil para endpoints que podem ser públicos ou autenticados
 */
export async function optionalApiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    next();
    return;
  }

  // Se houver API key, valida normalmente
  await apiKeyAuth(req, res, next);
}
