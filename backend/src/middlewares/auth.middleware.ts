import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de autenticação via API Key simples
 * Verifica se o header X-API-Key corresponde à chave configurada no .env
 */
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  // Verificar se a API key foi fornecida
  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API Key não fornecida. Inclua o header X-API-Key na requisição.',
      },
    });
    return;
  }

  // Verificar se a API key está configurada no servidor
  if (!validApiKey) {
    console.error('❌ API_KEY não configurada no .env');
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Servidor não configurado corretamente.',
      },
    });
    return;
  }

  // Verificar se a API key é válida
  if (apiKey !== validApiKey) {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'API Key inválida.',
      },
    });
    return;
  }

  // API Key válida, continuar
  next();
};
