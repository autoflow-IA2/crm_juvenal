import rateLimit from 'express-rate-limit';
import { sendError, ErrorCodes } from '../utils/response';

/**
 * Rate limiter global para todas as rotas da API
 * 100 requests por minuto por API key
 */
export const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minuto
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // Usar API key como identificador único (se disponível)
  keyGenerator: (req) => {
    const apiKey = req.headers['x-api-key'] as string;
    return apiKey || req.ip || 'unknown';
  },

  // Handler customizado para erro de rate limit
  handler: (_req, res) => {
    sendError(
      res,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Limite de requisições excedido. Tente novamente em alguns instantes.',
      429
    );
  },

  // Skip requests que não são para a API
  skip: (req) => {
    return !req.path.startsWith('/api/');
  }
});

/**
 * Rate limiter mais restritivo para endpoints sensíveis
 * 10 requests por minuto
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 10, // 10 requests
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const apiKey = req.headers['x-api-key'] as string;
    return apiKey || req.ip || 'unknown';
  },

  handler: (_req, res) => {
    sendError(
      res,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Limite de requisições excedido para este endpoint. Tente novamente em 1 minuto.',
      429
    );
  }
});

/**
 * Rate limiter mais permissivo para endpoints públicos
 * 300 requests por minuto
 */
export const publicRateLimiter = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 300, // 300 requests
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return req.ip || 'unknown';
  },

  handler: (_req, res) => {
    sendError(
      res,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Limite de requisições excedido. Tente novamente em alguns instantes.',
      429
    );
  }
});
