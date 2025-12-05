import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError, ErrorCodes } from '../utils/response';

/**
 * Middleware global de tratamento de erros
 * Deve ser o último middleware registrado no Express
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log do erro para debugging
  console.error('[Error Handler]', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

  // Erro de validação Zod
  if (error instanceof ZodError) {
    const details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));

    sendError(
      res,
      ErrorCodes.VALIDATION_ERROR,
      'Dados inválidos',
      400,
      details
    );
    return;
  }

  // Erro do Supabase
  if (error.code && error.message && error.details) {
    let statusCode = 500;
    let errorCode: string = ErrorCodes.DATABASE_ERROR;

    // Mapear códigos específicos do PostgreSQL
    switch (error.code) {
      case '23505': // unique_violation
        statusCode = 409;
        errorCode = ErrorCodes.DUPLICATE_ENTRY;
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        errorCode = ErrorCodes.INVALID_INPUT;
        break;
      case '23502': // not_null_violation
        statusCode = 400;
        errorCode = ErrorCodes.MISSING_FIELD;
        break;
    }

    sendError(res, errorCode, error.message, statusCode);
    return;
  }

  // Erro customizado com statusCode
  if (error.statusCode) {
    sendError(
      res,
      error.code || ErrorCodes.UNKNOWN_ERROR,
      error.message || 'Erro desconhecido',
      error.statusCode
    );
    return;
  }

  // Erro genérico
  sendError(
    res,
    ErrorCodes.INTERNAL_ERROR,
    process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : error.message || 'Erro desconhecido',
    500
  );
}

/**
 * Middleware para capturar erros assíncronos
 * Wrapper para async/await em route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Classe de erro customizada para erros da aplicação
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = ErrorCodes.INTERNAL_ERROR
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
