import { Response } from 'express';

/**
 * Interface para resposta de sucesso
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Interface para resposta de erro
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Utilitários para respostas HTTP padronizadas
 */
export class ResponseUtils {
  /**
   * Resposta de sucesso genérica
   */
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): void {
    const response: SuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    res.status(statusCode).json(response);
  }

  /**
   * Resposta de criação bem-sucedida (201)
   */
  static created<T>(res: Response, data: T, message?: string): void {
    this.success(res, data, message || 'Recurso criado com sucesso', 201);
  }

  /**
   * Resposta de erro genérica
   */
  static error(
    res: Response,
    code: string,
    message: string,
    statusCode: number = 400,
    details?: any
  ): void {
    const response: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
      },
    };

    if (details) {
      response.error.details = details;
    }

    res.status(statusCode).json(response);
  }

  /**
   * Resposta de não encontrado (404)
   */
  static notFound(res: Response, message: string = 'Recurso não encontrado'): void {
    this.error(res, 'NOT_FOUND', message, 404);
  }

  /**
   * Resposta de validação inválida (400)
   */
  static validationError(res: Response, details: any): void {
    this.error(res, 'VALIDATION_ERROR', 'Dados inválidos', 400, details);
  }

  /**
   * Resposta de conflito (409)
   */
  static conflict(res: Response, message: string, details?: any): void {
    this.error(res, 'CONFLICT', message, 409, details);
  }

  /**
   * Resposta de não autorizado (401)
   */
  static unauthorized(res: Response, message: string = 'Não autorizado'): void {
    this.error(res, 'UNAUTHORIZED', message, 401);
  }

  /**
   * Resposta de proibido (403)
   */
  static forbidden(res: Response, message: string = 'Acesso negado'): void {
    this.error(res, 'FORBIDDEN', message, 403);
  }
}
