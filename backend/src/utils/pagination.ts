import { PaginationMeta } from './response';

/**
 * Interface para parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Constantes de paginação
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 50,
  MAX_LIMIT: 100
} as const;

/**
 * Normaliza e valida parâmetros de paginação
 */
export function normalizePagination(params: PaginationParams): { page: number; limit: number } {
  let page = parseInt(String(params.page || PAGINATION_DEFAULTS.PAGE), 10);
  let limit = parseInt(String(params.limit || PAGINATION_DEFAULTS.LIMIT), 10);

  // Garantir valores mínimos
  if (isNaN(page) || page < 1) {
    page = PAGINATION_DEFAULTS.PAGE;
  }

  if (isNaN(limit) || limit < 1) {
    limit = PAGINATION_DEFAULTS.LIMIT;
  }

  // Limitar máximo de resultados por página
  if (limit > PAGINATION_DEFAULTS.MAX_LIMIT) {
    limit = PAGINATION_DEFAULTS.MAX_LIMIT;
  }

  return { page, limit };
}

/**
 * Calcula offset para query do banco de dados
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Cria objeto de metadados de paginação
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const total_pages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    total_pages
  };
}

/**
 * Helper completo para paginação
 * Retorna offset e metadados
 */
export function getPaginationData(params: PaginationParams, total: number) {
  const { page, limit } = normalizePagination(params);
  const offset = calculateOffset(page, limit);
  const meta = createPaginationMeta(page, limit, total);

  return { page, limit, offset, meta };
}
