import { Response } from 'express';

/**
 * Interface para resposta de sucesso padronizada
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  pagination?: PaginationMeta;
}

/**
 * Interface para metadados de paginação
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * Interface para resposta de erro padronizada
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field?: string;
      message: string;
    }>;
  };
}

/**
 * Envia uma resposta de sucesso padronizada
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  pagination?: PaginationMeta,
  statusCode: number = 200
): void {
  const response: SuccessResponse<T> = {
    success: true,
    data
  };

  if (pagination) {
    response.pagination = pagination;
  }

  res.status(statusCode).json(response);
}

/**
 * Envia uma resposta de erro padronizada
 */
export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: Array<{ field?: string; message: string }>
): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  };

  res.status(statusCode).json(response);
}

/**
 * Códigos de erro comuns
 */
export const ErrorCodes = {
  // 400 Bad Request
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',

  // 401 Unauthorized
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  MISSING_API_KEY: 'MISSING_API_KEY',
  EXPIRED_API_KEY: 'EXPIRED_API_KEY',

  // 403 Forbidden
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_SCOPE: 'INVALID_SCOPE',

  // 404 Not Found
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

  // 409 Conflict
  CONFLICT: 'CONFLICT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // 429 Too Many Requests
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // 500 Internal Server Error
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;
